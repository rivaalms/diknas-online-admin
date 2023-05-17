<template>
   <v-snackbar
      v-model="snackbarTrigger"
      :color="snackbar.color"
      text
      timeout="-1"
   >
      {{ snackbar.text }}
   
      <template #action="{ attrs }">
         <v-btn
            :color="snackbar.color"
            text
            v-bind="attrs"
            @click="clearSnackbar()"
         >
            Tutup
         </v-btn>
      </template>
   </v-snackbar>
   </template>
   
   <script>
   import { mapState } from 'vuex'
   export default {
      computed: {
         ...mapState(['snackbar', 'snackbarTrigger'])
      },
   
      watch: {
         snackbarTrigger() {
            if (this.snackbarTrigger === true) {
               setTimeout(() => {
                  this.clearSnackbar()
               }, 5000)
            }
         }
      },
   
      methods: {
         clearSnackbar() {
            this.$store.dispatch('clearSnackbar')
         }
      }
   }
   </script>