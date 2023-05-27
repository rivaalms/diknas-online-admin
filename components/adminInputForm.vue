<template>
<v-card-text>
   <v-form ref="form" aria-autocomplete="off" @submit.prevent="submit(dialog.type)">
      <v-row>
         <v-col cols="12" md="6">
            <v-text-field
               v-model="targetItem.name"
               label="Nama"
               :rules="textFieldRules"
            ></v-text-field>
         </v-col>
         <v-col cols="12" md="6">
            <v-text-field
               v-model="targetItem.email"
               label="Email"
               :rules="emailRules"
            ></v-text-field>
         </v-col>
         <template
            v-if="dialog.type === 'admin-edit'"
         >
            <v-col cols="12">
               <v-checkbox
                  v-model="changePasswordCheckbox"
                  label="Ubah kata sandi?"
                  dense
                  hide-details="auto"
               ></v-checkbox>
            </v-col>
            <template
               v-if="changePasswordCheckbox"
            >
               <v-col cols="12" md="4">
                  <v-text-field
                     v-model="targetItem.old_password"
                     label="Kata sandi lama"
                     :type="formOldPasswordVisible ? 'text' : 'password'"
                     :append-icon="formOldPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                     counter="true"
                     :rules="passwordRules"
                     @click:append="toggleOldPasswordVisibility()"
                  ></v-text-field>
               </v-col>
               <v-col cols="12" md="4">
                  <v-text-field
                     v-model="targetItem.password"
                     label="Kata sandi baru"
                     :type="formPasswordVisible ? 'text' : 'password'"
                     :append-icon="formPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                     counter="true"
                     :rules="passwordRules"
                     @click:append="togglePasswordVisibility()"
                  ></v-text-field>
               </v-col>
               <v-col cols="12" md="4">
                  <v-text-field
                     v-model="confirmPassword"
                     label="Konfirmasi kata sandi"
                     :type="formConfirmPasswordVisible ? 'text' : 'password'"
                     :append-icon="formConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                     counter="true"
                     :rules="passwordMatchRules"
                     @click:append="toggleConfirmPasswordVisibility()"
                  ></v-text-field>
               </v-col>
            </template>
         </template>
         <template
            v-else
         >
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="targetItem.password"
                  label="Kata sandi"
                  :type="formPasswordVisible ? 'text' : 'password'"
                  :append-icon="formPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  counter="true"
                  :rules="passwordRules"
                  @click:append="togglePasswordVisibility()"
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="confirmPassword"
                  label="Konfirmasi kata sandi"
                  :type="formConfirmPasswordVisible ? 'text' : 'password'"
                  :append-icon="formConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  counter="true"
                  :rules="passwordMatchRules"
                  @click:append="toggleConfirmPasswordVisibility()"
               ></v-text-field>
            </v-col>
         </template>
         <v-col cols="12" class="d-flex justify-end">
            <v-btn depressed class="me-2" @click="closeDialog()">Batal</v-btn>
            <v-btn depressed color="primary" type="submit">Simpan</v-btn>
         </v-col>
      </v-row>
   </v-form>
</v-card-text>
</template>

<script>
import { mapState } from 'vuex'
export default {
   data() {
      return {
         targetItem: null,
         changePasswordCheckbox: false,
         confirmPassword: null,

         formOldPasswordVisible: false,
         formPasswordVisible: false,
         formConfirmPasswordVisible: false,
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),

      textFieldRules() {
         return [v => !!v || 'Wajib diisi']
      },

      emailRules() {
         return [
            v => !!v || 'Wajib diisi',
            v => /.+@.+\..+/.test(v) || 'Email harus menggunakan format yang valid',
         ]
      },

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

   beforeMount() {
      if (this.dialog.type === 'admin-edit' || this.dialog.type === 'diknas-edit') {
         this.targetItem = {
            id: this.dialog.item.id,
            name: this.dialog.item.name,
            nip: this.dialog.item.nip,
            email: this.dialog.item.email,
            old_password: null,
            password: null,
         }
      } else if (this.dialog.type === 'admin-new' || this.dialog.type === 'diknas-new') {
         this.targetItem = {
            name: null,
            nip: null,
            email: null,
            password: null,
         }
      }
   },

   methods: {
      async submit(type) {
         if (this.$refs.form.validate()) {
            if (type === 'admin-edit') {
               await this.$axios.put(`/admin/update/${this.targetItem.id}`, this.targetItem).then((resp) => {
                  this.$store.dispatch('setAlert', {
                     type: 'info',
                     color: 'cyan darken-2',
                     icon: 'mdi-information',
                     message: `Data admin <code>${resp.data.data.id}</code> berhasil disunting`
                  })
               }).catch((e) => {
                  this.$store.dispatch('setAlert', {
                     type: 'error',
                     color: 'red darken-2',
                     icon: 'mdi-information-outline',
                     message: e
                  })
               })
            } else if (type === 'admin-new') {
               await this.$axios.post(`/admin/create`, this.targetItem).then((resp) => {
                  this.$store.dispatch('setAlert', {
                     type: 'success',
                     color: 'green darken-2',
                     icon: 'mdi-check-circle',
                     message: `Admin baru berhasil dibuat. ID pengawas: <code>${resp.data.data.id}</code>`
                  })
               }).catch((e) => {
                  this.$store.dispatch('setAlert', {
                     type: 'error',
                     color: 'red darken-2',
                     icon: 'mdi-information-outline',
                     message: e
                  })
               })
            }
            this.$emit('submit')
            this.closeDialog()
         }
      },

      closeDialog() {
         this.$emit('close')
      },
      
      toggleOldPasswordVisibility() {
         this.formOldPasswordVisible = !this.formOldPasswordVisible
      },

      togglePasswordVisibility() {
         this.formPasswordVisible = !this.formPasswordVisible
      },

      toggleConfirmPasswordVisibility() {
         this.formConfirmPasswordVisible = !this.formConfirmPasswordVisible
      },
   }
}
</script>