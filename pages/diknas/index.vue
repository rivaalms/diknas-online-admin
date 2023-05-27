<template>
<v-container fluid>
   <div>
      <page-header
         title="Diknas"
      />
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Jumlah Diknas
               </v-card-title>
               <v-card-text class="text-h4 font-weight-medium grey--text text--darken-3">{{ diknasCount }}</v-card-text>
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
export default {
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

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Diknas', disabled: true, href: '/diknas'}
      ])
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