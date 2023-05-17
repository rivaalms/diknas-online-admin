<template>
<v-navigation-drawer
   clipped
   app
>
   <v-list dense nav>
      <v-list-item-group active-class="primary--text">
         <template v-for="(item, i) in routes">
            <template v-if="item.child">
               <v-list-group
                  :key="item.title"
                  :append-icon="submenuIcon"
               >
                  <template #activator>
                     <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                     </v-list-item-icon>
                     <v-list-item-content>
                        <v-list-item-title>
                           {{ item.title }}
                        </v-list-item-title>
                     </v-list-item-content>
                  </template>
                  <template v-for="(child, j) in item.child">
                     <v-list-item :key="j" :to="child.to" router exact>
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-content>
                           <v-list-item-title>{{ child.title }}</v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                  </template>
               </v-list-group>
            </template>

            <template v-else>
               <v-list-item
                  :key="i"
                  :to="item.to"
                  router exact
               >
                  <v-list-item-icon>
                     <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                     <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
               </v-list-item>
            </template>
         </template>
      </v-list-item-group>
   </v-list>
</v-navigation-drawer>
</template>

<script>
export default {
   data() {
      return {
         routes: [
            {
               icon: 'mdi-view-dashboard',
               title: 'Dashboard',
               to: '/',
               child: null,
            },
            {
               icon: 'mdi-bookshelf',
               title: 'Kategori',
               to: 'category',
               child: []
            },
            {
               icon: 'mdi-account',
               title: 'Pengguna',
               to: '',
               child: [
                  {
                  icon: 'mdi-town-hall',
                  title: 'Sekolah',
                  to: '/schools',
                  child: null
                  },
                  {
                  icon: 'mdi-account-supervisor',
                  title: 'Pengawas',
                  to: '/supervisors',
                  child: null
                  },
                  {
                  icon: 'mdi-office-building',
                  title: 'Diknas',
                  to: '/diknas',
                  child: null,
                  }
               ]
            },
            {
               icon: 'mdi-account-wrench',
               title: 'Manajemen Admin',
               to: '/admin',
               child: null
            }
         ],
         categories: [],
         submenuIcon: 'mdi-chevron-down'
      }
   },

   mounted() {
      this.fetchCategories()
   },

   methods: {
      async fetchCategories() {
         await this.$axios.get('/getCategories').then((response) => {
         const categories = []
         response.data.data.forEach(function(item) {
            categories.push({
               title: item.name,
               to: '/category/' + item.slug
            })
         })

         this.routes.forEach(function(item) {
            if (item.title === "Kategori") {
               item.child = categories
            }
         })
         })
      }
   }
}
</script>