<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Diknas</p>
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
                  Jumlah Diknas
               </v-card-title>
               <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">{{ diknasCount }}</v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Tabel Diknas
               </v-card-title>
               <v-card-text>
                  <diknas-table
                     :headers="tableHeaders"
                     :items="diknas.data"
                     :total-page="diknas.last_page"
                     :current-page="diknas.current_page"
                     :loading="loading"
                     :from="diknas.from"
                     :to="diknas.to"
                     :total="diknas.total"
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
import diknasTable from '@/pages/components/diknasTable'
export default {
   components: { diknasTable },
   data() {
      return {
         diknasCount: 0,
         diknas: [],
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
      title: 'Diknas'
   },

   computed: {
      breadcrumb() {
         return [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Diknas', disabled: true, href: '/diknas'}
         ]
      }
   },

   async mounted() {
      await this.$axios.get('/diknas').then((resp) => {
         this.diknas = resp.data.data
         this.diknasCount = resp.data.count
         this.loading = false
      })
   },

   methods: {
      async dataHandler(search) {
         this.loading = true
         await this.$axios.get('/diknas', {
            params: {
               search,
            }
         }).then(resp => {
            this.diknas = resp.data.data
            this.diknasCount = resp.data.count
            this.loading = false
         })
      }
   }
}
</script>