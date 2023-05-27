<template>
   <v-container fluid>
      <div>
         <page-header
            title="Profil"
         />

         <v-alert
            :type="alertType"
            dismissible
            text
            transition="fade-transition"
            :value="alertTrigger"
         >
            {{ alertMessage }}
         </v-alert>
         
         <v-row dense class="align-stretch">
            <v-col cols="12" md="8">
               <v-card flat height="100%">
                  <v-card-text>
                     <v-row dense>
                        <v-col cols="12" md="6" class="d-flex">
                           <!-- <v-avatar tile size="96" class="me-8">
                              <v-img
                                 src="https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Alex"
                              ></v-img>
                           </v-avatar> -->
                           <div class="flex-grow-1">
                              <p class="text-h6 mb-0">{{ user.name }}</p>
                              <p class="text-subtitle-2 blue--text">{{ user.email }}</p>
                           </div>
                        </v-col>
                        <!-- <v-col cols="12" md="6">
                           <v-row dense>
                              <v-col cols="6">
   
                              </v-col>
                           </v-row>
                        </v-col> -->
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-col>
            <v-col cols="12" md="4">
               <v-card flat height="100%">
                  <v-card-title class="text-subtitle-1">
                     Pengaturan Akun
                  </v-card-title>
                  <v-card-text>
                     <v-list>
                        <v-list-item link @click="dialog()">
                           <v-list-item-content>
                              <v-list-item-title>Ubah Kata Sandi</v-list-item-title>
                           </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item link @click.stop="logout">
                           <v-list-item-content>
                              <v-list-item-title class="red--text">Keluar</v-list-item-title>
                           </v-list-item-content>
                        </v-list-item>
                     </v-list>
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>
   
      <v-dialog
         v-model="dialogTrigger"
         persistent
         max-width="800"
      >
         <v-card>
            <v-card-title>Ubah Kata Sandi</v-card-title>
            <v-card-text>
               <v-alert
                  :type="passwordAlertType"
                  dismissible
                  text
                  transition="fade-transition"
                  :value="passwordAlertTrigger"
               >
                  {{ passwordAlertMessage }}
               </v-alert>
   
               <v-form
                  ref="form" aria-autocomplete="off" lazy-validation @submit.prevent="passwordSubmit()"
               >
                  <v-row>
                     <v-col cols="12">
                        <v-text-field
                           v-model="targetItem.old_password"
                           :append-icon="passwordShow.old_password ? 'mdi-eye' : 'mdi-eye-off'"
                           label="Kata Sandi Saat Ini"
                           :type="passwordShow.old_password ? 'text' : 'password'"
                           counter="true"
                           :rules="passwordRules"
                           @click:append="passwordShow.old_password = !passwordShow.old_password"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                        <v-text-field
                           v-model="targetItem.password"
                           :append-icon="passwordShow.password ? 'mdi-eye' : 'mdi-eye-off'"
                           label="Kata Sandi Baru"
                           :type="passwordShow.password ? 'text' : 'password'"
                           counter="true"
                           :rules="passwordRules"
                           @click:append="passwordShow.password = !passwordShow.password"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                        <v-text-field
                           v-model="targetItem.confirm_password"
                           :append-icon="passwordShow.confirm_password ? 'mdi-eye' : 'mdi-eye-off'"
                           label="Konfirmasi Kata Sandi Baru"
                           :type="passwordShow.confirm_password ? 'text' : 'password'"
                           counter="true"
                           :rules="passwordMatchRules"
                           @click:append="passwordShow.confirm_password = !passwordShow.confirm_password"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" class="d-flex justify-end">
                        <v-btn class="me-2" depressed @click.stop="closeDialog()">Batal</v-btn>
                        <v-btn color="primary" depressed type="submit">Simpan</v-btn>
                     </v-col>
                  </v-row>
               </v-form>
            </v-card-text>
         </v-card>
      </v-dialog>
   </v-container>
   </template>
   
   <script>
   import { mapState, mapMutations } from 'vuex'
   
   export default {
      data() {
         return {
            user: [],
   
            dialogTrigger: false,
            targetItem: [],
            passwordShow: [],
   
            alertType: null,
            alertIcon: null,
            alertColor: null,
            alertMessage: null,
            alertTrigger: false,
   
            passwordAlertTrigger: false,
            passwordAlertColor: '',
            passwordAlertMessage: '',
            passwordAlertType: 'error',
         }
      },

      head: {
         title: 'Profil'
      },
   
      computed: {
         ...mapState(['isAuth']),
   
         passwordRules() {
            const data = [
               val => {
                  if (!val || val.length < 1) return 'Wajib diisi'
                  else if (val.length < 8) return 'Minimal 8 karakter'
                  else return true
               }
            ]
            return data
         },
   
         passwordMatchRules() {
            const data = [
               val => {
                  if (!val || val.length < 1) return 'Wajib diisi'
                  else if (val !== this.targetItem.password) return 'Kata sandi tidak sama'
                  else return true
               }
            ]
            return data
         },
      },
   
      watch: {
         alertTrigger() {
            if (this.alertTrigger === true) {
               setTimeout(() => {
                  this.dismissAlert()
               }, 5000)
            }
         },
   
         passwordAlertTrigger() {
            if (this.passwordAlertTrigger === true) {
               setTimeout(() => {
                  this.onTriggeredPasswordAlert()
               }, 5000)
            }
         }
      },

      created() {
         this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Profil', disabled: true, href: '/profile' }
      ])
      },
   
      async mounted() {
         await this.$axios.get(`/admin/getSelf`).then((resp) => {
            this.user = resp.data.data
         })
      },
   
      methods: {
         ...mapMutations(['SET_IS_AUTH']),
   
         wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
         },
      
         async dialog() {
            this.dialogTrigger = true
            this.targetItem = {
               old_password: '',
               password: '',
               confirm_password: '',
            }
            this.passwordShow = {
               old_password: false,
               password: false,
               confirm_password: false,
            }
            await this.wait(50)
            this.$refs.form.reset()
         },
   
         closeDialog() {
            this.targetItem = []
            this.passwordShow = []
            this.$refs.form.reset()
            this.dialogTrigger = false
         },
   
         async logout() {
            await this.$auth.logout()
            this.SET_IS_AUTH(false)
            this.$router.push('/login')
         },
   
         // TODO - 
         async passwordSubmit() {
            if (this.$refs.form.validate()) {
               try {
                  await this.$axios.put(`/admin/updatepassword/${this.$auth.user.id}`, this.targetItem).then((resp) => {
                     this.closeDialog()
                     this.alertType = 'info'
                     this.alertIcon = 'mdi-information'
                     this.alertColor = 'cyan'
                     this.alertMessage = 'Kata sandi akun berhasil diubah'
                     this.alertTrigger = true
                  })
               } catch (e) {
                  this.passwordAlertType = 'error'
                  this.passwordAlertMessage = e.response.data.message
                  this.passwordAlertColor = 'red'
                  this.passwordAlertTrigger = true
                  this.$refs.form.reset()
               }
            }
         },
   
         onTriggeredPasswordAlert() {
            this.passwordAlertType = null
            this.passwordAlertMessage = null
            this.passwordAlertColor = null
            this.passwordAlertTrigger = false
         },
   
         dismissAlert() {
            this.alertTrigger = false
            this.alertColor = null
            this.alertIcon = null
            this.alertType = null
            this.alertMessage = null
         }
      }
   }
   </script>