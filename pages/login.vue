<template>
   <div id="container">
      <v-row dense>
         <v-col cols="12" md="4" class="bg-primary d-flex flex-column justify-center" align-self="stretch">
            <v-container class="mw-md-75 mb-12 pb-md-12">
               <div class="d-flex justify-center mb-6">
                  <p class="text-h4 white--text font-weight-bold">{{ project_name }}</p>
               </div>
               <app-alert/>
               <v-card flat color="transparent">
                  <v-card-text>
                     <v-form ref="form" @submit.prevent="onSubmit">
               
                        <v-text-field
                           v-model="email"
                           dark
                           :rules="rules"
                           label="Email"
                           required
                        ></v-text-field>
                  
                        <v-text-field
                           v-model="password"
                           dark
                           :rules="rules"
                           label="Kata Sandi"
                           type="password"
                           required
                        ></v-text-field>

                        <div class="d-flex justify-end">
                           <v-btn depressed type="submit" color="yellow accent-4" class="mt-5">Login</v-btn>
                        </div>
               
                     </v-form>
                  </v-card-text>
            
               </v-card>
            </v-container>
         </v-col>
         <v-col cols="8" class="d-flex flex-column justify-center align-center bg-light" align-self="stretch">
            <v-img
               width="75%"
               contain
               src="/Admin-amico.svg"
            ></v-img>
            <p class="text-caption ma-0 align-self-end">Illustration by <a href="https://storyset.com" target="_blank">Storyset</a></p>
         </v-col>
      </v-row>
   </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
   auth: 'guest',

   data() {
      return {
         email: '',
         password: '',
         rules: [
            v => !!v || 'Wajib diisi',
         ],

         project_name: process.env.PROJECT_NAME
      }
   },

   head: {
      title: 'Login'
   },

   mounted() {
      this.ifLoggedIn()
   },
   
   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      async onSubmit() {
         if (this.$refs.form.validate()) {
            await this.$auth.loginWith('local', {
               data: {
                  email: this.email,
                  password: this.password
               }
            }).then((resp) => {
               this.SET_IS_AUTH(true)
               this.$store.dispatch('clearAlert')
               this.$router.push('/')
            }).catch((e) => {
               let message = ''
               if (this.email.includes('@')) {
                  message = 'Email atau kata sandi tidak sesuai dengan kredensial yang tersimpan.'
               } else {
                  message = 'Email tidak valid.'
               }
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  message,
               })
               this.$store.dispatch('showAlert')
            })
         }
      },

      ifLoggedIn() {
         if (this.$auth.loggedIn) {
            this.$router.push('/')
         }
      },
   },

}
</script>

<style>
#container {
   min-height: 100%!important;
   overflow: hidden;
   padding: 0;
   display: flex;
   justify-content: center;
   align-items: stretch;
}

/* .row {
   height: inherit!important;
} */

.bg-primary {
   background-color: #424242;
}

.bg-light {
   background-color: #f5f5f5;
}

.v-application .error--text {
   color: #D50000!important;
   caret-color: #D50000!important;
}
</style>