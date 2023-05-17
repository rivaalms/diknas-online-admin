<template>
<v-alert
   :type="alert.type"
   :color="alert.color"
   :icon="alert.icon"
   dismissible
   text
   transition="fade-transition"
   :value="alertTrigger"
   >
   <span id="alertMessage"></span>
</v-alert>
</template>

<script>
import { mapState } from 'vuex'
export default {
   computed: {
      ...mapState(['alert', 'alertTrigger'])
   },

   watch: {
      alertTrigger() {
         if (this.alertTrigger) {
            document.getElementById('alertMessage').innerHTML = this.alert.message
            setTimeout(() => {
               this.$store.dispatch('clearAlert')
            }, 5000)
         }
      }
   }
}
</script>