<template>
  <v-app class="v-app">
    <app-sidebar
      v-if="isAuth"
      :sidebar="sidebar"
      @toggle-sidebar="() => toggleSidebar()"
    />

    <app-header
      v-if="isAuth"
      @toggle-sidebar="() => toggleSidebar()"
    />
    
    <v-main id="main">
      <Nuxt/>
    </v-main>

    <app-footer
      v-if="isAuth"
    />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DefaultLayout',

  data() {
    return {
      sidebar: false,
    }
  },
  
  computed: {
    ...mapState(['isAuth']),
  },

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar
    }
  }
}
</script>

<style scoped>
/* .v-app {
  background-color: #E6E6EB;
} */
</style>