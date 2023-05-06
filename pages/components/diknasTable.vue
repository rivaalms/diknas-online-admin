<template>
   <div>
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
               <!-- <v-select
                  v-model="searchValue"
                  :items="schoolType"
                  item-text="name"
                  item-value="id"
                  label="Tipe sekolah"
                  clearable
                  hide-details="auto"
                  class="pt-0 mt-0"
                  @input="dataHandler()"
               ></v-select> -->
               <v-text-field
                  v-model="searchValue"
                  label="Nama/NIP"
                  placeholder="Enter untuk mencari"
                  hide-details="auto"
                  class="pt-0 mt-0"
                  :loading="loading"
                  append-icon="mdi-magnify"
                  clearable
                  @click:append="dataHandler()"
                  @keydown.enter="dataHandler()"
                  @click:clear="nullSearchDataHandler()"
               ></v-text-field>
            </v-col>
         </div>
         <v-btn
            depressed
            color="primary"
            @click.stop="dialog('new')"
         >Input Diknas</v-btn>
      </div>
      <v-data-table
         :headers="headers"
         :items="items"
         :page.sync="current"
         :loading="loading"
         hide-default-footer
         class="mb-3"
      >
         <!-- eslint-disable-next-line vue/valid-v-slot -->
         <template #item.actions="{ item }">
            <!-- <v-tooltip top color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                     v-bind="attrs"
                     icon
                     class="me-2"
                     color="blue"
                     v-on="on"
                     @click.stop="schoolDetailDialog(item)"
                  >
                     <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
               </template>
               <span>Lihat detail</span>
            </v-tooltip> -->
   
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
      <div v-if="items" class="d-flex justify-space-between align-center">
         <p class="text-caption mb-0">
            {{ from }}-{{ to }} dari {{ total }} data
         </p>
         <v-pagination
            v-model="current"
            elevation="0"
            :length="totalPage"
            total-visible="7"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            @input="dataHandler()"
         ></v-pagination>
      </div>
   
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
                           v-model="targetItem.nip"
                           label="NIP"
                           hint="Hanya angka"
                           :rules="textFieldRules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12">
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
         <v-card-title class="text-subtitle-1">Hapus Diknas</v-card-title>
         <v-card-text>
            Anda yakin ingin menghapus akun diknas <code>{{ targetItem.name }}</code>?
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
   </div>
   </template>
   
   <script>
   export default {
      props: {
         headers: {
            type: Array,
            default: () => {}
         },
         items: {
            type: Array,
            default: () => {}
         },
         totalPage: {
            type: Number,
            default: 0
         },
         currentPage: {
            type: Number,
            default: 0
         },
         loading: {
            type: Boolean,
            default: false
         },
         from: {
            type: Number,
            default: 0
         },
         to: {
            type: Number,
            default: 0
         },
         total: {
            type: Number,
            default: 0
         },
      },
   
      data() {
         return {
            current: this.currentPage ? this.currentPage : 1,
            searchValue: null,
   
            targetItem: [],
   
            dialogTrigger: false,
            dialogTitle: null,
            isEdit: false,
            changePasswordCheckbox: false,
            confirmPassword: null,
   
            dialogDeleteTrigger: false,
   
            formOldPasswordVisible: false,
            formPasswordVisible: false,
            formConfirmPasswordVisible: false,
            
            alertType: null,
            alertColor: null,
            alertIcon: null,
            alertMessage: null,
            alertTrigger: false,
         }
      },
   
      computed: {
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
            if (val === null || val.length < 1) return this.nullSearchDataHandler()
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
   
      methods: {
         dataHandler() {
            this.$emit('data-handler', this.searchValue)
         },

         nullSearchDataHandler() {
            this.searchValue = null
            this.dataHandler()
         },
   
         async dialog(type, item) {
            this.dialogTrigger = true
            if (type === 'new') {
               this.dialogTitle = 'Input Diknas'
               this.targetItem = {
                  name: null,
                  nip: null,
                  email: null,
                  password: null,
               }
            } else if (type === 'edit') {
               this.isEdit = true
               this.dialogTitle = 'Edit Diknas'
               this.targetItem = {
                  id: item.id,
                  name: item.name,
                  nip: item.nip,
                  email: item.email,
                  password: null,
                  old_password: null,
               }
            }
            await this.wait(50)
            this.$refs.form.resetValidation()
         },
   
         closeDialog() {
            this.dialogTitle = null
            this.targetItem = []
            this.isEdit = false
            this.changePasswordCheckbox = false
            this.dialogTrigger = false
         },
   
         async submit(type) {
            if (this.$refs.form.validate()) {
               if (type === 'new') {
                  await this.$axios.post(`/diknas/create`, this.targetItem).then((resp) => {
                     this.alertColor = 'green darken-2'
                     this.alertIcon = 'mdi-check-circle'
                     this.alertType = 'success'
                     this.alertMessage = `Diknas baru berhasil dibuat. ID diknas: <code>${resp.data.data.id}</code>`
                  }).catch(e => { console.log(e) })
               } else if (type === 'edit') {
                  await this.$axios.put(`/diknas/update/${this.targetItem.id}`, this.targetItem).then(resp => {
                     this.alertColor = 'cyan darken-2'
                     this.alertIcon = 'mdi-information'
                     this.alertType = 'info'
                     this.alertMessage = `Data diknas <code>${resp.data.data.id}</code> berhasil disunting`
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
            await this.$axios.delete(`/diknas/delete/${item.id}`).then((resp) => {
               this.alertColor = 'amber darken-2'
               this.alertIcon = 'mdi-information'
               this.alertType = 'warning'
               this.alertMessage = `Data diknas <code>${item.name}</code> berhasil dihapus`
               document.getElementById('alertMessage').innerHTML = this.alertMessage
               this.alertTrigger = true
               this.closeDialogDelete()
               this.dataHandler()
            }).catch(e => { console.log(e) })
         },
         
         numberOnly() {
            const e = window.event
            const expect = e.target.value.toString() + e.key.toString();
            if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
               e.preventDefault();
            } else {
               return true;
            }
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
   
   <style>
   .v-pagination__navigation {
      transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
   }
   
   .v-pagination__navigation, .v-pagination__item {
      box-shadow: none!important;
   }
   
   .v-pagination__navigation:hover, .v-pagination__item:hover:not(.v-pagination__item--active) {
      background-color: #eeeeee!important;
   }
   </style>