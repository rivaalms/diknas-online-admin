<template>
  <v-app class="v-app">
    <app-sidebar
      v-if="isAuth"
    />

    <app-header
      v-if="isAuth"
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

  computed: {
    ...mapState(['isAuth']),
  },
}
</script>

<style scoped>
/* .v-app {
  background-color: #E6E6EB;
} */
</style>