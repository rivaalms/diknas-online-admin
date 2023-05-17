<!-- eslint-disable vue/no-mutating-props -->
<template>
   <div>
      <app-alert/>
   
      <!-- //SECTION - Filter & New Data Btn -->
      <div class="d-flex justify-space-between align-center">
         <div class="d-flex align-center flex-grow-1">
            <span class="me-2 text-subtitle-2">Filter: </span>
            <v-col cols="3">
               <v-autocomplete
                  v-model="schoolId"
                  :items="school"
                  :loading="schoolFilterLoading"
                  :search-input.sync="schoolInputSync"
                  hide-no-data
                  hide-selected
                  item-text="name"
                  item-value="id"
                  label="Sekolah"
                  placeholder="Ketik untuk mencari"
                  clearable
                  hide-details="auto"
                  class="pt-0 mt-0"
                  @input="dataHandler()"
               ></v-autocomplete>
            </v-col>
            <v-col cols="3">
               <v-select
                  v-model="statusId"
                  :items="status"
                  item-text="name"
                  item-value="id"
                  label="Status"
                  clearable
                  hide-details="auto"
                  class="pt-0 mt-0"
                  @input="dataHandler()"
               ></v-select>
            </v-col>
            <v-col cols="3">
               <v-text-field
                  v-model="year"
                  label="Tahun ajaran"
                  clearable
                  append-icon="mdi-magnify"
                  hide-details="auto"
                  class="pt-0 mt-0"
                  placeholder="Enter untuk mencari"
                  @keydown.enter="dataHandler()"
                  @click:clear="emptyYearDataHandler()"
                  @click:append="dataHandler()"
               ></v-text-field>
            </v-col>
         </div>
         <v-btn
            depressed
            color="primary"
            @click.stop="dialog('new')"
         >
            Input Data
         </v-btn>
      </div>
      <!-- //!SECTION -->
   
      <!-- //SECTION - Data table -->
      <v-data-table
         :headers="tableHeader"
         :items="items"
         :page.sync="current"
         :loading="loading"
         hide-default-footer
         class="mb-3"
      >
         <!-- //SECTION - Status Chips -->
         <!-- eslint-disable-next-line vue/valid-v-slot -->
         <template #item.data_status.name="{item}">
            <v-chip
               class="font-weight-medium"
               :class="getColor(item.data_status_id)"
               pill
            >
               {{ item.data_status.name }}
            </v-chip>
         </template>
         <!-- //!SECTION -->
   
         <!-- //SECTION - Action Buttons -->
         <!-- eslint-disable-next-line vue/valid-v-slot -->
         <template #item.actions="{ item }">
            <v-tooltip top color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                     v-bind="attrs"
                     icon
                     class="me-2"
                     color="primary"
                     v-on="on"
                     @click="downloadFile(item)"
                  >
                     <v-icon>mdi-file-download</v-icon>
                  </v-btn>
               </template>
               <span>Download</span>
            </v-tooltip>
   
            <v-tooltip top color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                  v-bind="attrs"
                     icon
                     class="me-2"
                     color="warning"
                     v-on="on"
                     @click="dialog('edit', item)"
                  >
                     <v-icon>mdi-file-document-edit</v-icon>
                  </v-btn>
               </template>
               <span>Revisi</span>
            </v-tooltip>
   
            <v-tooltip top color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                  v-bind="attrs"
                     icon
                     class="me-2"
                     color="error"
                     v-on="on"
                     @click="dialog('delete', item)"
                  >
                     <v-icon>mdi-delete</v-icon>
                  </v-btn>
               </template>
               <span>Hapus</span>
            </v-tooltip>
         </template>
         <!-- //!SECTION -->
      </v-data-table>
      <!-- //!SECTION -->
   
      <!-- //SECTION - Table footer & Pagination -->
      <div v-if="items" class="d-flex justify-space-between align-center">
         <p class="text-caption mb-0">
            {{ from }}-{{ to }} dari {{ total }} data
         </p>
         <v-pagination
            v-model="current"
            :length="totalPage"
            total-visible="7"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            @input="dataHandler()"
         ></v-pagination>
      </div>
      <!-- //!SECTION -->
   
      <lazy-app-dialog
         @submit="dataHandler()"
      />
   
      <app-snackbar/>
   </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
   // SECTION - Props
   props: {
      items: {
         type: Array,
         default: () => {}
      },
      totalPage: {
         type: Number,
         default: 0
      },
      currentPage: {
         type: Number,
         default: 0
      },
      loading: {
         type: Boolean,
         default: false
      },
      from: {
         type: Number,
         default: 0
      },
      to: {
         type: Number,
         default: 0
      },
      total: {
         type: Number,
         default: 0
      },
   },
   // !SECTION
   
   // SECTION - Data
   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         schoolId: '',
         school: [],
         schoolFilterLoading: false,
         schoolInputSync: null,
         
         statusId: null,
         status: [],
         year: null,

         formSchools: null,

         formCategories: null,
         selectedCategory: null,
      }
   },
   // !SECTION
   
   computed: {
      ...mapState(['tableHeader']),         
   },

   // SECTION - Watch
   watch: {
      schoolInputSync(val) {
         if (this.school.length > 0) return
         if (this.schoolFilterLoading) return
         this.schoolFilterLoading = true
         this.$axios.get('/searchSchoolFilter').then((resp) => {
            this.school = resp.data.data
         }).catch((e) => {
            console.log(e)
         }).finally(() => {
            this.schoolFilterLoading = false
         })
      },
   },
   // !SECTION
   
   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })
   },

   methods: {
      dataHandler() {
         this.$emit('data-handler', this.current, this.statusId, this.schoolId, this.year)
      },

      emptyYearDataHandler() {
         this.year = null
         this.dataHandler()
      },

      getColor(status) {
         if (status === 1) return "secondary"
         if (status === 2) return "success"
         if (status === 3) return "warning"
         if (status === 4) return "info white--text"
      },

      async downloadFile(item) {
         const fileExtension = this.getFileExtension(item.path)
         const filename = item.school.name + '_' + item.category + '_' + item.data_type.name + '_' + item.year + fileExtension

         try {
            await this.$axios({
               url: `/downloadFile`,
               method: "POST",
               responseType: 'blob',
               data: {
                  path: item.path
               }
            })
            .then((resp) => {
               const url = window.URL.createObjectURL(new Blob([resp.data]))
               const link = document.createElement('a')
               link.href = url
               link.setAttribute('download', filename)
               document.body.appendChild(link)
               link.click()
               document.body.removeChild(link)

               this.$store.dispatch('setSnackbar', {
                  text: 'File berhasil diunduh',
                  color: 'green darken-3'
               })
            })
         } catch (e) {
            this.$store.dispatch('setSnackbar', {
               text: 'File tidak ditemukan',
               color: 'red darken-2'
            })
         } finally {
            this.$store.dispatch('showSnackbar')
         }
      },

      async dialog(type, item) {
         if (type !== 'delete') {
            if (!this.formCategories) {
               await this.$axios.get('/getCategories').then((resp) => {
                  this.formCategories = resp.data.data
               })
            }
            if (!this.formSchools) {
               await this.searchSchoolFilter()
            }
         }

         if (type === 'edit') {
            const dataTypeCategory = item.data_type.data_category_id
            let selectedCategory = []

            this.formCategories.forEach((item) => {
               if (item.id === dataTypeCategory) {
                  selectedCategory = item
               }
            })
            
            this.$store.dispatch('setDialog', {
               type,
               title: 'Sunting Data',
               item,
               categories: this.formCategories,
               selectedCategory,
               // data_types: dataTypes,
               status: this.status,
               schools: this.formSchools
            })
         } else if (type === 'new') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Input data',
               categories: this.formCategories,
               status: this.status,
               schools: this.formSchools
            })
         } else if (type === 'delete') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Hapus data?',
               item,
            })
         }
         this.$store.dispatch('showDialog')
      },

      getFileExtension(name) {
         const fileName = name
         const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
         return extension
      },

      async searchSchoolFilter() {
         await this.$axios.get(`/searchSchoolFilter`).then((resp) => {
            this.formSchools = resp.data.data
         })
      }
   }
}
</script>

<style>
.v-pagination__navigation {
   transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.v-pagination__navigation, .v-pagination__item {
   box-shadow: none!important;
}

.v-pagination__navigation:hover, .v-pagination__item:hover:not(.v-pagination__item--active) {
   background-color: #eeeeee!important;
}
   </style>
   