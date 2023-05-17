<template>
<v-card-text>
   <v-form
      id="newForm"
      ref="newForm"
      enctype="multipart/form-data"
      @submit.prevent="submit(dialog.type)"
   >
      <v-row>
         <v-col cols="12" md="6">
            <v-autocomplete
               v-model="targetItem.school_id"
               :items="schools"
               :loading="schoolLoading"
               :search-input.sync="schoolSync"
               item-text="name"
               item-value="id"
               label="Sekolah"
               placeholder="Ketik untuk mencari"
               :rules="formSelectRules"
            ></v-autocomplete>
         </v-col>
         <v-col cols="12" md="6">
            <v-select
               v-model="targetItem.data_status_id"
               :items="dialog ? dialog.status : []"
               item-text="name"
               item-value="id"
               label="Status"
               :rules="formSelectRules"
            ></v-select>
         </v-col>
         <v-col cols="12" md="6">
            <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  label="Kategori"
                  :rules="formSelectRules"
                  @input="getDataTypes(selectedCategory)"
               ></v-select>
         </v-col>
         <v-col cols="12" md="6">
            <v-select
               v-model="targetItem.data_type_id"
               :items="dataTypes"
               item-text="name"
               item-value="id"
               :rules="formSelectRules"
               label="Tipe Data"
            ></v-select>
         </v-col>
         <v-col cols="12" md="6">
            <v-file-input
               v-model="targetItem.file"
               accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
               label="Upload File"
               truncate-length="30"
               :rules="formFileRules"
            ></v-file-input>
         </v-col>
         <v-col cols="12" md="6">
            <v-select
               v-model="targetItem.year"
               :items="yearList"
               :rules="formSelectRules"
               label="Tahun Ajaran"
            ></v-select>
         </v-col>
         <v-col cols="12" class="d-flex justify-end">
            <v-btn
               text
               class="me-2"
               @click="closeDialog"
            >Batal</v-btn>

            <v-btn
               type="submit"
               depressed
               color="primary"
            >Simpan</v-btn>
         </v-col>
      </v-row>
   </v-form>
</v-card-text>
</template>

<script>
import crypto from 'crypto'
import { mapState } from 'vuex'
export default {
   data() {
      return {
         targetItem: {
            school_id: null,
            data_type_id: null,
            data_status_id: null,
            year: null,
            path: null,
            file: null,
         },
         schools: null,
         schoolLoading: false,
         schoolSync: null,
         selectedCategory: null,
         categories: [],
         dataTypes: [],
         yearList: [],
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),

      formTextRules() {
         const data = [val => (val || '').length > 0 || 'Wajib diisi']
         return data
      },

      formSelectRules() {
         const data = [v => !!v || 'Wajib diisi']
         return data
      },
      
      formFileRules() {
         const data = [value => !!value || 'Wajib diisi']
         return data
      },
   },

   mounted() {
      this.categories = this.dialog.categories
      this.schools = this.dialog.schools
      this.yearList = this.getYearList()
   },

   methods: {
      async submit() {
         if (this.$refs.newForm.validate()) {
            const filePath = this.generateRandomString(40)
            const fileExtension = this.getFileExtension(this.targetItem.file.name)

            this.targetItem.file = this.renameFile(this.targetItem.file, filePath, fileExtension, { type: this.targetItem.file.type })
            this.targetItem.path = this.targetItem.file.name

            const formData = new FormData()
            for (const item in this.targetItem) {
               formData.append(`${item}`, this.targetItem[item])
            }

            await this.$axios.post('/data/create', formData).then((resp) => {
               this.$store.dispatch('setAlert', {
                  type: 'success',
                  color: 'green darken-1',
                  icon: 'mdi-check',
                  message: `Data baru berhasil dibuat. ID data: <code>${resp.data.data.id}</code>`
               })
            }).catch((e) => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  color: 'red darken-2',
                  icon: 'mdi-information-outline',
                  message: e
               })
            }).finally(() => {
               this.$emit('submit')
               this.closeDialog()
            })
         }
      },

      closeDialog() {
         this.targetItem = {
            school_id: null,
            data_type_id: null,
            data_status_id: null,
            year: null,
            path: null,
            file: null,
         }
         this.selectedCategory = null
         this.$refs.newForm.resetValidation()
         this.$emit('close')
      },

      async getDataTypes(id) {
         let selectedCategory = null
         this.categories.forEach((item) => {
            if (item.id === id) {
               selectedCategory = item
            }
         })

         await this.$axios.get('/getDataTypes', {
            params: {
               slug: selectedCategory.slug
            }
         }).then((resp) => {
            this.dataTypes = resp.data.data
         })
         this.targetItem.data_type_id = 0
         this.selectedCategory = selectedCategory
      },

      getYearList() {
         const today = new Date()
         const years = []
         
         if (today.getMonth()+1 < 5) {
            let i = -3
            while (i < 1) {
               years.push((new Date().getFullYear() + i) + '-' + (new Date().getFullYear() + ++i))
            }
         } else {
            let i = -2
            while (i < 2) {
               years.push((new Date().getFullYear() + i) + '-' + (new Date().getFullYear() + ++i))
            }
         }
         return years.reverse()
      },

      generateRandomString(length) {
         return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length)
      },

      getFileExtension(name) {
         const fileName = name
         const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
         return extension
      },

      renameFile(file, name, extension, options) {
         try {
            return new File([file], new Date().valueOf() + '_' + name + extension, options)
         } catch (e) {
            const blobData = new Blob(file)
            blobData.lastModified = new Date()
            blobData.name = name
            return blobData
         }
      },
   }
}
</script>