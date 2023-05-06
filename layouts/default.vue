<template>
  <v-app class="v-app">
    <v-navigation-drawer
      v-if="isAuth"
      clipped
      app
    >
      <v-list dense nav>
        <v-list-item-group active-class="primary--text">
          <template v-for="(item, i) in items">
            <template v-if="item.child">
                <v-list-group
                  :key="item.title"
                  :append-icon="submenuIcon"
                >
                  <template #activator>
                    <!-- <v-list-item> -->
                      <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.title }}
                          </v-list-item-title>
                        </v-list-item-content>
                    <!-- </v-list-item> -->
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

    <v-app-bar
      v-if="isAuth"
      app
      outlined
      flat
      dark
      clipped-left
      class="app-bar"
    >
      <v-toolbar-title class="text-h6">{{ project_name }}</v-toolbar-title>
      <v-spacer/>
      <v-menu offset-y>
        <template #activator="{on, attrs}">
          <v-list nav dense class="pa-0" color="transparent">
            <v-list-item
              v-bind="attrs"
              class="d-flex flex-basis-0 flex-shrink-1 flex-grow-0"
              v-on="on"
            >
              <v-list-item-avatar>
                  <v-img
                    src="https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Alex"
                  ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $auth.user.name ?? '' }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
        <v-list>
          <v-list-item
            to="/profile"
            router exact
          >
            <v-list-item-title>
              Profil
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            @click.stop="logout"
          >
            <v-list-item-title class="red--text">Keluar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    
    <v-main id="main">
      <Nuxt/>
    </v-main>

    <v-footer
      v-if="isAuth"
      app
      inset
      absolute
      color="#ffffff"
      class="d-flex justify-end"
    >
      <span class="text-caption">diknas-online © 2023</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'DefaultLayout',
  
  data() {
    return {
      user: {name: ''},

      project_name: process.env.PROJECT_NAME,
      
      items: [
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

  computed: {
    ...mapState(['isAuth']),

  },

  watch: {
    isAuth() {
      if (this.isAuth) {
        this.fetchCategories()
        this.user = this.$auth.user
      }
    }
  },
  
  mounted() {
    if (this.isAuth) {
      this.fetchCategories()
      this.user = this.$auth.user
    }
  }, 

  methods: {
    ...mapMutations(['SET_IS_AUTH']),

    async logout() {
        await this.$auth.logout()
        this.SET_IS_AUTH(false)
        this.$router.push('/login')
    },
    
    async fetchCategories() {
      await this.$axios.get('/getCategories').then((response) => {
        const categories = []
        response.data.data.forEach(function(item) {
          categories.push({
            title: item.name,
            to: '/category/' + item.slug
          })
        })
  
        this.items.forEach(function(item) {
          if (item.title === "Kategori") {
            item.child = categories
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.v-app {
  background-color: #f5f5f5;
}

.flex-basis-0 {
  flex-basis: 0%;
}

.app-bar {
  background-color: #424242!important;
}
</style>