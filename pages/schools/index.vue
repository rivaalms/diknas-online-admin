<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Sekolah</p>
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
               />
            </v-card-text>
         </v-card>
      </v-col>
   </v-row>
</v-container>
</template>

<script>
import schoolTable from '@/pages/components/schoolTable'

export default {
   components: { schoolTable },

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

   async mounted() {
      await this.$axios.get(`admin/countSchoolByType`).then((resp) => {
         this.schoolCount = resp.data.data
      })
      
      await this.$axios.get(`/school`).then((resp) => {
         this.schools = resp.data.data
         this.loading = false
      })
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
      }
   }
}
</script>