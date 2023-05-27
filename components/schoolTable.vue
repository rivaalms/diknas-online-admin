<template>
<div>
   <app-alert/>
   
   <div class="d-flex flex-column-reverse flex-md-row justify-md-space-between align-center">
      <div class="d-flex flex-column flex-md-row align-self-stretch align-md-center flex-grow-1">
         <span class="me-2 text-subtitle-2">Filter: </span>
         <v-col cols="12" md="3">
            <v-text-field
               v-model="schoolName"
               label="Nama sekolah"
               clearable
               hide-details="auto"
               class="pt-0 mt-0"
               :loading="loading"
               placeholder="Enter untuk mencari"
               append-icon="mdi-magnify"
               @click:append="dataHandler()"
               @click:clear="nullNamedataHandler()"
               @keydown.enter="dataHandler()"
            ></v-text-field>
         </v-col>
         <v-col cols="12" md="3">
            <v-select
               v-model="schoolTypeId"
               :items="schoolType"
               item-text="name"
               item-value="id"
               label="Tipe sekolah"
               clearable
               hide-details="auto"
               class="pt-0 mt-0"
               @input="dataHandler()"
            ></v-select>
         </v-col>
      </div>
      <v-btn
         depressed
         color="primary"
         class="align-self-end align-self-md-baseline"
         @click.stop="dialog('school-new')"
      >Input Sekolah</v-btn>
   </div>
   <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="current"
      :loading="loading"
      hide-default-footer
      class="mb-3"
   >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="blue"
                  v-on="on"
                  @click.stop="dialog('school-detail', item)"
               >
                  <v-icon>mdi-eye-outline</v-icon>
               </v-btn>
            </template>
            <span>Lihat detail</span>
         </v-tooltip>

         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="orange darken-2"
                  v-on="on"
                  @click="dialog('school-edit', item)"
               >
                  <v-icon>mdi-account-edit</v-icon>
               </v-btn>
            </template>
            <span>Sunting</span>
         </v-tooltip>

         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="red darken-1"
                  v-on="on"
                  @click="dialog('school-delete', item)"
               >
                  <v-icon>mdi-delete</v-icon>
               </v-btn>
            </template>
            <span>Hapus</span>
         </v-tooltip>
      </template>
   </v-data-table>
   <div v-if="items" class="d-flex flex-column flex-md-row justify-space-between align-center">
      <p class="text-caption mb-0">
         {{ from }}-{{ to }} dari {{ total }} data
      </p>
      <v-pagination
         v-model="current"
         elevation="0"
         :length="totalPage"
         total-visible="7"
         prev-icon="mdi-menu-left"
         next-icon="mdi-menu-right"
         @input="dataHandler()"
      ></v-pagination>
   </div>

   <lazy-app-dialog
      @submit="dataHandler()"
   />
</div>
</template>

<script>
export default {
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
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

   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         schoolTypeId: null,
         schoolType: [],
         schoolName: null,

         formSupervisor: null,

         studentHeaders: [
            {
               text: 'Kelas',
               value: 'grade'
            },
            {
               text: 'Islam',
               value: 'islam',
            },
            {
               text: 'Katolik',
               value: 'catholic'
            },
            {
               text: 'Protestan',
               value: 'protestant'
            },
            {
               text: 'Hindu',
               value: 'hindu'
            },
            {
               text: 'Buddha',
               value: 'buddha'
            },
            {
               text: 'Konghucu',
               value: 'konghucu'
            }
         ],
      }
   },

   async mounted() {
      await this.getSchoolType()
   },

   methods: {
      dataHandler() {
         this.$emit('data-handler', this.current, this.schoolTypeId, this.schoolName)
         this.$emit('submit')
      },

      async dialog(type, item) {
         if (type === 'school-new' || type === 'school-edit') {
            if (!this.formSupervisor) {
               await this.$axios.get('/supervisor/getAll').then((resp) => {
                  this.formSupervisor = resp.data.data
               })
            }
         }
         
         if (type === 'school-detail') {
            this.$store.dispatch('setDialog', {
               type,
               item,
               tableHeader: this.studentHeaders,
               title: 'Detail Sekolah',
               closeBtn: true
            })
         } else if (type === 'school-edit') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Sunting Sekolah',
               item,
               supervisors: this.formSupervisor,
               school_type: this.schoolType,
            })
         } else if (type === 'school-new') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Input Sekolah Baru',
               supervisors: this.formSupervisor,
               school_type: this.schoolType,
            })
         } else if (type === 'school-delete') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Hapus sekolah?',
               item,
            })
         }

         this.$store.dispatch('showDialog')
      },

      // submit() {
        
      // },

      nullNamedataHandler() {
         this.schoolName = null
         this.dataHandler()
      },

      async getSchoolType() {
         await this.$axios.get(`/getSchoolType`).then((resp) => {
            this.schoolType = resp.data.data
         })
      },
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