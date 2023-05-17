<template>
<v-container fluid>
   <div>
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Sekolah</p>
         <app-breadcrumb/>
      </div>
   </div>
   <v-row dense>
      <v-col cols="12" md="4">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Jumlah Sekolah
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">{{ schoolCount.total }}</v-card-text>
         </v-card>
      </v-col>
      <v-col cols="12" md="4">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Jumlah SMP
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">{{ schoolCount.smp }}</v-card-text>
         </v-card>
      </v-col>
      <v-col cols="12" md="4">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Jumlah SD
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">{{ schoolCount.sd }}</v-card-text>
         </v-card>
      </v-col>
      <v-col cols="12">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Tabel Sekolah
            </v-card-title>
            <v-card-text>
               <school-table
                  :headers="tableHeaders"
                  :items="schools.data"
                  :total-page="schools.last_page"
                  :current-page="schools.current_page"
                  :loading="loading"
                  :from="schools.from"
                  :to="schools.to"
                  :total="schools.total"
                  @data-handler="(current, school_type_id, school_name) => dataHandler(current, school_type_id, school_name)"
                  @submit="getSchoolCount"
               />
            </v-card-text>
         </v-card>
      </v-col>
   </v-row>
</v-container>
</template>

<script>
export default {
   data() {
      return {
         schoolCount: [],
         schools: [],
         loading: true,
         tableHeaders: [
            {
               text: 'ID',
               value: 'id'
            },
            {
               text: 'Nama Sekolah',
               value: 'name'
            },
            {
               text: 'Email',
               value: 'email'
            },
            {
               text: 'Kepala Sekolah',
               value: 'principal'
            },
            {
               text: 'Pengawas',
               value: 'supervisor.name'
            },
            {
               text: 'Terakhir diperbarui',
               value: 'date'
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions'
            }
         ]
      }
   },

   head: {
      title: 'Sekolah'
   },

   computed: {
      breadcrumb() {
         return [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Sekolah', disabled: true, href: '/schools'}
         ]
      }
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dasboard', disabled: false, href: '/' },
         { text: 'Sekolah', disabled: true, href: '/schools' }
      ])
   },

   async mounted() {
      await this.getSchoolCount()
      await this.getSchools()
   },

   methods: {
      dataHandler(current, schoolTypeId, schoolName) {
         this.loading = true
         this.$axios.get('/school', { params: {
            page: current,
            school_type: schoolTypeId,
            name: schoolName,
         }}).then((resp) => {
            this.schools = resp.data.data
            this.loading = false
         })
      },

      async getSchoolCount() {
         await this.$axios.get(`admin/countSchoolByType`).then((resp) => {
            this.schoolCount = resp.data.data
         })
      },

      async getSchools() {
         await this.$axios.get(`/school`).then((resp) => {
            this.schools = resp.data.data
            this.loading = false
         })
      }
   }
}
</script>