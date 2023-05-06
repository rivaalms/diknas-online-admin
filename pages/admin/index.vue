<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Manajemen Admin</p>
         <v-breadcrumbs
         :items="breadcrumb"
         class="px-0 py-2"
      >
         <template #item="{item}">
            <v-breadcrumbs-item
               exact
               :to="item.href"
               :disabled="item.disabled"
            >{{ item.text }}</v-breadcrumbs-item>
         </template>
      </v-breadcrumbs>
      </div>
   </div>
   <v-row dense>
      <v-col cols="12">
         <v-card flat>
            <v-card-title class="text-subtitle-1">
               Tabel Admin
            </v-card-title>
            <v-card-text>
               <v-alert
                  :type="alertType"
                  :color="alertColor"
                  :icon="alertIcon"
                  dismissible
                  text
                  transition="fade-transition"
                  :value="alertTrigger"
                  >
                  <span id="alertMessage"></span>
               </v-alert>
               <div class="d-flex justify-space-between align-center">
                  <div class="d-flex align-center flex-grow-1">
                     <span class="me-2 text-subtitle-2">Filter: </span>
                     <v-col cols="2">
                        <v-text-field
                           v-model="searchValue"
                           label="Cari"
                           placeholder="Nama"
                           hide-details="auto"
                           class="pt-0 mt-0"
                           append-icon="mdi-magnify"
                           :loading="loading"
                           hint="Tekan Enter untuk mencari"
                           @keydown.enter="dataHandler(searchValue)"
                           @click:append="dataHandler(searchValue)"
                        ></v-text-field>
                     </v-col>
                  </div>
                  <v-btn
                     depressed
                     color="primary"
                     @click.stop="dialog('new')"
                  >Input Admin</v-btn>
               </div>
               <v-data-table
                  :headers="tableHeaders"
                  :items="admin.data"
                  :page.sync="admin.current"
                  :loading="loading"
                  hide-default-footer
                  class="mb-3"
               >
                  <!-- eslint-disable-next-line vue/valid-v-slot -->
                  <template #item.actions="{ item }">
                     <v-tooltip top color="black">
                        <template #activator="{on, attrs}">
                           <v-btn
                              v-bind="attrs"
                              icon
                              class="me-2"
                              color="orange darken-2"
                              v-on="on"
                              @click="dialog('edit', item)"
                           >
                              <v-icon>mdi-account-edit</v-icon>
                           </v-btn>
                        </template>
                        <span>Sunting</span>
                     </v-tooltip>

                     <v-tooltip top color="black">
                        <template #activator="{on, attrs}">
                           <v-btn
                              v-bind="attrs"
                              icon
                              class="me-2"
                              color="red darken-1"
                              :disabled="item.id === $auth.user.id ? true : false"
                              v-on="on"
                              @click="dialogDelete(item)"
                           >
                              <v-icon>mdi-delete</v-icon>
                           </v-btn>
                        </template>
                        <span>Hapus</span>
                     </v-tooltip>
                  </template>
               </v-data-table>
               <div v-if="admin" class="d-flex justify-space-between align-center">
                  <p class="text-caption mb-0">
                     {{ admin.from }}-{{ admin.to }} dari {{ admin.total }} data
                  </p>
                  <v-pagination
                     v-model="admin.current_page"
                     elevation="0"
                     :length="admin.last_page"
                     total-visible="7"
                     prev-icon="mdi-menu-left"
                     next-icon="mdi-menu-right"
                     @input="dataHandler()"
                  ></v-pagination>
               </div>
            </v-card-text>
         </v-card>
      </v-col>
   </v-row>

   <v-dialog
      v-model="dialogTrigger"
      max-width="800"
      persistent
   >
      <v-card>
         <v-card-title class="justify-space-between">
            <span class="text-subtitle-1">{{ dialogTitle }}</span>
            <v-tooltip left color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                     v-bind="attrs"
                     icon
                     v-on="on"
                     @click="closeDialog()"
                  >
                     <v-icon>mdi-window-close</v-icon>
                  </v-btn>
               </template>
               <span>Tutup</span>
            </v-tooltip>
         </v-card-title>
         <v-card-text>
            <v-form ref="form" aria-autocomplete="off" @submit.prevent="submit((isEdit) ? 'edit' : 'new')">
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
                     v-if="isEdit"
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
      </v-card>
   </v-dialog>

   <v-dialog
      v-model="dialogDeleteTrigger"
      max-width="800"
      persistent
   >
      <v-card>
         <v-card-title class="text-subtitle-1">Hapus Pengawas</v-card-title>
         <v-card-text>
            Anda yakin ingin menghapus akun pengawas <code>{{ targetItem.name }}</code>?
         </v-card-text>
         <v-card-text>
            <v-alert
               border="left"
               text
               color="red"
               type="warning"
               icon="mdi-alert"
            >Aksi ini tidak bisa dibatalkan</v-alert>
         </v-card-text>
         <v-card-text class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialogDelete">Batal</v-btn>
            <v-btn color="red darken-2" depressed class="white--text" @click="confirmDelete(targetItem)">Hapus</v-btn>
         </v-card-text>
      </v-card>
   </v-dialog>
   
</v-container>
</template>

<script>
export default{
   data() {
      return {
         admin: [],
         loading: true,
         tableHeaders: [
         {
               text: 'ID',
               value: 'id'
            },
            {
               text: 'Nama',
               value: 'name'
            },
            {
               text: 'Email',
               value: 'email'
            },
            {
               text: 'Terakhir diperbarui',
               value: 'date'
            },
            {
               text: 'Aksi',
               value: 'actions'
            }
         ],
         searchValue: null,

         targetItem: [],

         alertType: null,
         alertColor: null,
         alertIcon: null,
         alertMessage: null,
         alertTrigger: false,

         dialogTrigger: false,
         dialogTitle: null,
         isEdit: false,

         dialogDeleteTrigger: false,

         confirmPassword: null,
         formOldPasswordVisible: false,
         formPasswordVisible: false,
         formConfirmPasswordVisible: false,
         changePasswordCheckbox: false,
      }
   },

   computed: {
      breadcrumb() {
         return [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Manajemen Admin', disabled: true, href: '/admin'}
         ]
      },

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

   watch: {
      searchValue(val) {
         if (this.loading === true) return
         if (val < 1) return this.dataHandler()
      },

      changePasswordCheckbox() {
         if (this.changePasswordCheckbox === false) {
            if (this.targetItem.password) this.targetItem.password = null
            if (this.targetItem.old_password) this.targetItem.old_password = null
         }
      },

      alertTrigger() {
         if (this.alertTrigger === true) {
            setTimeout(() => {
               this.onTriggeredAlert()
            }, 5000)
         }
      },
   },

   async mounted() {
      await this.$axios.get('/admin').then((resp) => {
         this.admin = resp.data.data
         this.loading = false
      })
   },

   methods: {
      async dataHandler(search) {
         this.loading = true
         await this.$axios.get('/admin', {
            params: {
               search,
            }
         }).then(resp => {
            this.admin = resp.data.data
            this.loading = false
         })
      },

      async dialog(type, item) {
         this.dialogTrigger = true
         if (type === 'new') {
            this.dialogTitle = 'Input Admin'
            this.targetItem = {
               name: null,
               email: null,
               password: null,
            }
         } else if (type === 'edit') {
            this.isEdit = true
            this.dialogTitle = 'Edit Admin'
            this.targetItem = {
               id: item.id,
               name: item.name,
               email: item.email,
               password: null,
               old_password: null,
            }
         }
         await this.wait(50)
         this.$refs.form.resetValidation()
      },

      closeDialog() {
         this.$refs.form.reset()
         this.dialogTitle = null
         this.targetItem = []
         this.isEdit = false
         this.changePasswordCheckbox = false
         this.dialogTrigger = false
      },

      async submit(type) {
         if (this.$refs.form.validate()) {
            if (type === 'new') {
               await this.$axios.post(`/admin/create`, this.targetItem).then((resp) => {
                  this.alertColor = 'green darken-2'
                  this.alertIcon = 'mdi-check-circle'
                  this.alertType = 'success'
                  this.alertMessage = `Admin baru berhasil dibuat. ID pengawas: <code>${resp.data.data.id}</code>`
               }).catch(e => { console.log(e) })
            } else if (type === 'edit') {
               await this.$axios.put(`/admin/update/${this.targetItem.id}`, this.targetItem).then(resp => {
                  this.alertColor = 'cyan darken-2'
                  this.alertIcon = 'mdi-information'
                  this.alertType = 'info'
                  this.alertMessage = `Data admin <code>${resp.data.data.id}</code> berhasil disunting`
               }).catch(e => {console.log(e)})
            }
            document.getElementById('alertMessage').innerHTML = this.alertMessage
            this.alertTrigger = true
            this.closeDialog()
            this.dataHandler()
         }
      },

      dialogDelete(item) {
         this.dialogDeleteTrigger = true
         this.targetItem = {
            id: item.id,
            name: item.name,
         }
      },

      closeDialogDelete() {
         this.dialogDeleteTrigger = false
         this.targetItem = []
      },

      async confirmDelete(item) {
         await this.$axios.delete(`/admin/delete/${item.id}`).then((resp) => {
            this.alertColor = 'amber darken-2'
            this.alertIcon = 'mdi-information'
            this.alertType = 'warning'
            this.alertMessage = `Data admin <code>${item.id}</code> berhasil dihapus`
            document.getElementById('alertMessage').innerHTML = this.alertMessage
            this.alertTrigger = true
            this.closeDialogDelete()
            this.dataHandler()
         }).catch(e => { console.log(e) })
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

      wait(ms) {
         return new Promise(resolve => setTimeout(resolve, ms))
      },

      onTriggeredAlert() {
         this.alertTrigger = false
         this.alertColor = null
         this.alertIcon = null
         this.alertType = null
         this.alertMessage = null
         document.getElementById('alertMessage').innerHTML = this.alertMessage
      },
   }
}
</script>