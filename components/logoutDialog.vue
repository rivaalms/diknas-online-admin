<template>
<v-card-text>
   <p class="text-body-1">
      Anda yakin ingin keluar?
   </p>
   <div class="d-flex justify-end">
      <v-btn class="me-2" text @click="closeDialog()">Batal</v-btn>
      <v-btn color="red darken-2" depressed :loading="loading" class="white--text" @click="logout">Keluar</v-btn>
   </div>
</v-card-text>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
   data() {
      return {
         loading: false,
      }
   },
   
   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      closeDialog() {
         this.$emit('close')
      },
      
      async logout() {
         this.loading = true
         await this.$auth.logout().then(resp => {
            this.loading = false
         })

         this.closeDialog()
         this.SET_IS_AUTH(false)
         this.$router.push('/login')
      },
   }
}
</script>