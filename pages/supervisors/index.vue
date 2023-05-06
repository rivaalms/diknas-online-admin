<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Pengawas</p>
         <v-breadcrumbs
         :items="breadcrumb"
         class="px-0 py-2"
      >
         <template #item="{item}">
            <v-breadcrumbs-item
               exact
               :to="item.href"
               :disabled="item.disabled"
            >{{ item.text }}</v-breadcrumbs-item>
         </template>
      </v-breadcrumbs>
      </div>
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Jumlah Pengawas
               </v-card-title>
               <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">{{ countSupervisor }}</v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Tabel Pengawas
               </v-card-title>
               <v-card-text>
                  <supervisor-table
                     :headers="tableHeaders"
                     :items="supervisors.data"
                     :total-page="supervisors.last_page"
                     :current-page="supervisors.current_page"
                     :loading="loading"
                     :from="supervisors.from"
                     :to="supervisors.to"
                     :total="supervisors.total"
                     @data-handler="(search) => dataHandler(search)"
                  />
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div>
</v-container>
</template>

<script>
import supervisorTable from '@/pages/components/supervisorTable'
export default {
   components: {
      supervisorTable
   },

   data() {
      return {
         supervisors: [],
         countSupervisor: 0,
         loading: true,
         tableHeaders: [
            {
               text: 'ID',
               value: 'id'
            },
            {
               text: 'Nama Pengawas',
               value: 'name'
            },
            {
               text: 'NIP',
               value: 'nip'
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
         ]
      }
   },

   computed: {
      breadcrumb() {
         return [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Pengawas', disabled: true, href: '/supervisor'}
         ]
      }
   },

   async mounted() {
      await this.$axios.get('/supervisor').then((resp) => {
            this.supervisors = resp.data.data
            this.countSupervisor = resp.data.count
            this.loading = false
         })
   },

   methods: {
      async dataHandler(search) {
         this.loading = true
         await this.$axios.get(`/supervisor`, {
            params: {
               search,
            }
         }).then((resp) => {
            this.supervisors = resp.data.data
            this.countSupervisor = resp.data.count
            this.loading = false
         })
      },
   }
}
</script>