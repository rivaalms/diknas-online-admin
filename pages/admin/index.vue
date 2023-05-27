<template>
<v-container fluid>
   <div>
      <page-header
         title="Manajemen Admin"
      />
   </div>
   <v-row dense>
      <v-col cols="12">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Tabel Admin
            </v-card-title>
            <v-card-text>
               
               <app-alert/>

               <div class="d-flex flex-column-reverse flex-md-row justify-md-space-between align-center">
                  <div class="d-flex flex-column flex-md-row align-self-stretch align-md-center flex-grow-1">
                     <span class="me-2 text-subtitle-2">Filter: </span>
                     <v-col cols="12" md="3">
                        <v-text-field
                           v-model="searchValue"
                           label="Nama"
                           hide-details="auto"
                           class="pt-0 mt-0"
                           append-icon="mdi-magnify"
                           :loading="loading"
                           clearable
                           placeholder="Enter untuk mencari"
                           @keydown.enter="dataHandler(searchValue)"
                           @click:append="dataHandler(searchValue)"
                           @click:clear="dataHandler()"
                        ></v-text-field>
                     </v-col>
                  </div>
                  <v-btn
                     depressed
                     color="primary"
                     class="align-self-end align-self-md-baseline"
                     @click.stop="dialog('admin-new')"
                  >Input Admin</v-btn>
               </div>
               <v-data-table
                  :headers="tableHeaders"
                  :items="admin.data"
                  :page.sync="admin.current"
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
                              color="orange darken-2"
                              v-on="on"
                              @click="dialog('admin-edit', item)"
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
                              :disabled="item.id === $auth.user.id ? true : false"
                              v-on="on"
                              @click="dialog('admin-delete', item)"
                           >
                              <v-icon>mdi-delete</v-icon>
                           </v-btn>
                        </template>
                        <span>Hapus</span>
                     </v-tooltip>
                  </template>
               </v-data-table>
               <div v-if="admin" class="d-flex flex-column flex-md-row justify-space-between align-center">
                  <p class="text-caption mb-0">
                     {{ admin.from }}-{{ admin.to }} dari {{ admin.total }} data
                  </p>
                  <v-pagination
                     v-model="admin.current_page"
                     elevation="0"
                     :length="admin.last_page"
                     total-visible="7"
                     prev-icon="mdi-menu-left"
                     next-icon="mdi-menu-right"
                     @input="dataHandler()"
                  ></v-pagination>
               </div>
            </v-card-text>
         </v-card>
      </v-col>
   </v-row>
   
   <app-dialog
      @submit="dataHandler()"
   />
</v-container>
</template>

<script>
export default{
   data() {
      return {
         admin: [],
         loading: true,
         tableHeaders: [
         {
               text: 'ID',
               value: 'id'
            },
            {
               text: 'Nama',
               value: 'name'
            },
            {
               text: 'Email',
               value: 'email'
            },
            {
               text: 'Terakhir diperbarui',
               value: 'date'
            },
            {
               text: 'Aksi',
               value: 'actions'
            }
         ],
         searchValue: null,
      }
   },

   head() {
      return {
         title: 'Manajemen Admin'
      }
   },

   watch: {
      searchValue(val) {
         if (this.loading === true) return
         if (val < 1) return this.dataHandler()
      },
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Manajemen Admin', disabled: true, href: '/admin' }
      ])
   },

   async mounted() {
      await this.$axios.get('/admin').then((resp) => {
         this.admin = resp.data.data
         this.loading = false
      })
   },

   methods: {
      async dataHandler(search) {
         this.loading = true
         await this.$axios.get('/admin', {
            params: {
               search,
            }
         }).then(resp => {
            this.admin = resp.data.data
            this.loading = false
         })
      },

      dialog(type, item) {
         this.dialogTrigger = true
         if (type === 'admin-edit') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Sunting Admin',
               item,
            })
         } else if (type === 'admin-new') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Sunting Admin',
            })
         } else if (type === 'admin-delete') {
            this.$store.dispatch('setDialog', {
               type,
               title: 'Hapus Admin?',
               item,
            })
         }
         this.$store.dispatch('showDialog')
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