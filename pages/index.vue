<template>
<v-container fluid>
<div>
   <div class="d-flex justify-space-between align-center mt-5 mb-8">
      <p class="text-h6 mb-0">Dashboard</p>
      <app-breadcrumb/>
   </div>
   <v-row dense>
      <v-col cols="12" md="4">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Jumlah Sekolah
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">
               {{ totalSchool }}
               <div class="d-flex justify-end">
                  <v-btn text color="primary" to="/schools" exact>
                     Lihat detail
                  </v-btn>
               </div>
            </v-card-text>
         </v-card>
      </v-col>
      <v-col cols="12" md="4">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Jumlah Pengawas
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">
               {{ totalSupervisor }}
               <div class="d-flex justify-end">
                  <v-btn text color="primary" to="/supervisors" exact>
                     Lihat detail
                  </v-btn>
               </div>
            </v-card-text>
         </v-card>
      </v-col>
      <v-col cols="12" md="4">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Jumlah Diknas
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">
               {{ totalDiknas }}
               <div class="d-flex justify-end">
                  <v-btn text color="primary" to="/diknas" exact>
                     Lihat detail
                  </v-btn>
               </div>
            </v-card-text>
         </v-card>
      </v-col>
      <v-col cols="12">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Semua Data
            </v-card-title>
            <v-card-text>
               <data-table
                  :items="data.data"
                  :total-page="data.last_page"
                  :current-page="data.current_page"
                  :loading="loading"
                  :from="data.from"
                  :to="data.to"
                  :total="data.total"
                  @data-handler="(current, status_id, school_id, year) => dataHandler(current, status_id, school_id, year)"
               ></data-table>
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
         data: [],
         loading: true,

         totalSchool: 0,
         totalSupervisor: 0,
         totalDiknas: 0,
      }
   },

   head: {
      title: 'Dashboard'
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dasboard', disabled: true, href: '/' }
      ])
   },
   
   async mounted() {
      await this.$axios.get(`/getData`).then((resp) => {
         this.data = resp.data.data
         this.loading = false
      })

      await this.$axios.get(`/admin/countUsers`).then((resp) => {
         this.totalSchool = resp.data.data.total_school
         this.totalSupervisor = resp.data.data.total_supervisor
         this.totalDiknas = resp.data.data.total_diknas
      })
   },

   methods: {
      dataHandler(current, statusId, schoolId, year) {
         this.loading = true
         this.$axios.get(`/getData`, {
            params: {
               page: current,
               status: statusId,
               school: schoolId,
               year,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },
   },
}
</script>