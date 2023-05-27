<template>
<v-container fluid>
   <div>
      <page-header
         title="Sekolah"
      />
   </div>
   <v-row dense>
      <v-col
         v-for="(item, key) in schoolCount"
         :key="key"
         :cols="(key === 'total') ? 12 : 6"
         md="4"
      >
         <v-card flat>
            <v-card-title class="text-subtitle-1" :class="key !== 'total' ? 'text-uppercase' : ''">
               {{ (key === 'total') ? 'Jumlah Sekolah' : key }}
            </v-card-title>
            <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">{{ item }}</v-card-text>
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
                  @data-handler="(current, school_type_id, school_name, year) => dataHandler(current, school_type_id, school_name, year)"
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
         currentYear: (new Date().getMonth() < 5) ? ((new Date().getFullYear()-1) + '-' + new Date().getFullYear()) : (new Date().getFullYear() + '-' + (new Date().getFullYear()+1)),
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
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Sekolah', disabled: true, href: '/schools' }
      ])
   },

   async mounted() {
      await this.getSchoolCount()
      await this.dataHandler()
   },

   methods: {
      dataHandler(current, schoolTypeId, schoolName, year) {
         this.loading = true
         this.$axios.get('/school', { params: {
            page: current,
            school_type: schoolTypeId,
            name: schoolName,
            year: year ?? this.currentYear,
         }}).then((resp) => {
            this.schools = resp.data.data
            this.loading = false
         })
      },

      async getSchoolCount() {
         await this.$axios.get(`/countSchool`).then((resp) => {
            this.schoolCount = resp.data.data
         })
      },
   }
}
</script>