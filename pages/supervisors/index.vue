<template>
<v-container fluid>
   <div>
      <page-header
         title="Pengawas"
      />
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Jumlah Pengawas
               </v-card-title>
               <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">{{ countSupervisor }}</v-card-text>
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
export default {
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

   head: {
      title: 'Pengawas'
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Pengawas', disabled: true, href: '/supervisors'}
      ])
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