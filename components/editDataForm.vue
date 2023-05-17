<template>
<v-card-text>
   <v-row>
      <v-col>
         <p id="revisionText" class="text-subtitle-2">Catatan Revisi</p>
         <div id="scrollerContainer" class="overflow-x-hidden overflow-y-auto">
            <v-row v-if="revisions && revisions.length > 0" dense>
               <v-col
                  v-for="note in revisions"
                  :key="note.id"
                  cols="12"
               >
                  <v-card flat outlined>
                     <v-card-title class="text-caption font-weight-medium">
                        {{ note.date }}
                     </v-card-title>
                     <v-card-text>
                        {{ note.note }}
                     </v-card-text>
                  </v-card>
               </v-col>
            </v-row>
            <v-alert v-else text outlined color="orange" class="d-flex justify-center">
               Tidak ada data
            </v-alert>
         </div>
      </v-col>
      <v-col>
         <v-form
            id="editForm"
            ref="editForm"
            enctype="multipart/form-data"
            @submit.prevent="submit"
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
                     hint="Jika kosong, tetap menggunakan file lama"
                     persistent-hint
                     truncate-length="30"
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
      </v-col>
   </v-row>
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
            old_path: null,
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
         revisions: null,
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

   async mounted() {
      this.categories = this.dialog.categories
      this.selectedCategory = this.dialog.selectedCategory
      this.schools = this.dialog.schools
      this.yearList = this.getYearList()
      await this.getDataTypes(this.dialog.selectedCategory.id)
      await this.getRevisionData(this.dialog.item.id)
      this.getRevisionScrollerHeight()

      this.targetItem = {
         id: this.dialog.item.id,
         school_id: this.dialog.item.school_id,
         data_type_id: this.dialog.item.data_type_id,
         data_status_id: this.dialog.item.data_status_id,
         year: this.dialog.item.year,
         old_path: this.dialog.item.path,
         path: null,
         file: null,
      }
   },

   methods: {
      async submit() {
         if (this.$refs.editForm.validate()) {
            if (this.targetItem.file) {
               const filePath = this.generateRandomString(40)
               const fileExtension = this.getFileExtension(this.targetItem.file.name)
   
               this.targetItem.file = this.renameFile(this.targetItem.file, filePath, fileExtension, { type: this.targetItem.file.type })
               this.targetItem.path = this.targetItem.file.name
            }
            
            const formData = new FormData()
            for (const item in this.targetItem) {
               formData.append(`${item}`, this.targetItem[item])
               formData.append('_method', 'PUT')
            }

            await this.$axios.post( `/admin/data/${this.targetItem.id}/update`, formData).then((resp) => {
               this.$store.dispatch('setAlert', {
                  type: 'info',
                  icon: 'mdi-information-outline',
                  message: `Data <code>${this.targetItem.id}</code> berhasil disunting`
               })
            }).catch((e) => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
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
            old_path: null,
            path: null,
            file: null,
         }
         this.selectedCategory = null
         this.$refs.editForm.resetValidation()
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

      async getRevisionData(id) {
         await this.$axios.get(`/school/getRevisionData/${id}`).then((resp) => {
            this.revisions = resp.data.data
         })
      },

      getRevisionScrollerHeight() {
         const formHeight = document.getElementById('editForm').offsetHeight
         const textHeight = document.getElementById('revisionText').offsetHeight
         this.scrollerHeight = formHeight - textHeight - 24 /* col padding */ - 16 /* text margin */
         document.getElementById('scrollerContainer').setAttribute('style', `max-height: ${this.scrollerHeight}px!important`)
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