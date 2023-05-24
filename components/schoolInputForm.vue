<template>
   <v-card-text>
      <v-form ref="form" aria-autocomplete="off" @submit.prevent="submit(dialog.type)">
         <v-row>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="targetItem.name"
                  label="Nama sekolah"
                  :rules="textFieldRules"
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-select
                  v-model="targetItem.school_type_id"
                  :items="schoolType"
                  item-text="name"
                  item-value="id"
                  label="Tipe sekolah"
                  :rules="selectRules"
               ></v-select>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="targetItem.email"
                  label="Email"
                  :rules="textFieldRules"
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="targetItem.principal"
                  label="Kepala sekolah"
                  hint="Boleh kosong"
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-autocomplete
                  v-model="targetItem.supervisor_id"
                  :items="supervisors"
                  :loading="formSupervisorLoading"
                  :search-input.sync="formSupervisorSync"
                  no-data-text="Data tidak ditemukan"
                  item-text="name"
                  item-value="id"
                  label="Pengawas"
                  :rules="selectRules"
               ></v-autocomplete>
            </v-col>
            <v-col cols="6" md="6">
               <v-textarea
                  v-model="targetItem.address"
                  label="Alamat"
                  hint="Boleh kosong"
                  auto-grow
                  rows="1"
               ></v-textarea>
            </v-col>
   
            <template
               v-if="dialog.type === 'school-edit'"
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
                  <v-col cols="4">
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
                  <v-col cols="4">
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
                  <v-col cols="4">
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
               <v-col cols="6">
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
               <v-col cols="6">
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
         formOldPasswordVisible: false,
         formPasswordVisible: false,
         formConfirmPasswordVisible: false,

         changePasswordCheckbox: false,
         confirmPassword: null,

         supervisors: null,
         formSupervisorSync: null,
         formSupervisorLoading: false,

         schoolType: null,
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),

      textFieldRules() {
         return [v => !!v || 'Wajib diisi']
      },

      selectRules() {
         return [v => !!v || 'Wajib diisi']
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
      if (this.dialog.type === 'school-edit') {
         this.targetItem = {
            id: this.dialog.item.id,
            name: this.dialog.item.name,
            school_type_id: this.dialog.item.school_type_id,
            email: this.dialog.item.email,
            supervisor_id: this.dialog.item.supervisor_id,
            principal: this.dialog.item.principal,
            address: this.dialog.item.address,
            password: null,
            supervisor: { name: this.dialog.item.supervisor.name},
            old_password: null,
         }
         this.formSupervisorSync = this.targetItem.supervisor.name
      } else if (this.dialog.type === 'school-new') {
         this.targetItem = {
            name: null,
            school_type_id: null,
            email: null,
            supervisor_id: null,
            principal: null,
            address: null,
            password: null,
         }
      }

      this.supervisors = this.dialog.supervisors
      this.schoolType = this.dialog.school_type
   },

   mounted() {
      this.$refs.form.resetValidation()
   },

   methods: {
      async submit(type) {
         if (this.$refs.form.validate()) {
            if (type === 'school-edit') {
               await this.$axios.put(`/school/update/${this.targetItem.id}`, this.targetItem).then((resp) => {
                  this.$store.dispatch('setAlert', {
                     color: 'cyan darken-2',
                     icon: 'mdi-information',
                     type: 'info',
                     message: `Data sekolah <code>${resp.data.data.id}</code> berhasil disunting`
                  })
               }).catch((e) => {
                  this.$store.dispatch('setAlert', {
                     type: 'error',
                     color: 'red darken-2',
                     icon: 'mdi-information-outline',
                     message: e
                  })
               })
            } else if (type === 'school-new') {
               await this.$axios.post('/school/create', this.targetItem).then((resp) => {
                  this.$store.dispatch('setAlert', {
                     color: 'green darken-2',
                     icon: 'mdi-check-circle',
                     type: 'success',
                     message: `Sekolah baru berhasil dibuat. ID sekolah: <code>${resp.data.data.id}</code>`
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