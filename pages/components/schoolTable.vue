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
            <v-text-field
               v-model="schoolName"
               label="Nama sekolah"
               clearable
               hide-details="auto"
               class="pt-0 mt-0"
               :loading="loading"
               placeholder="Enter untuk mencari"
               append-icon="mdi-magnify"
               @click:append="dataHandler()"
               @click:clear="nullNamedataHandler()"
               @keydown.enter="dataHandler()"
            ></v-text-field>
         </v-col>
         <v-col cols="2">
            <v-select
               v-model="schoolTypeId"
               :items="schoolType"
               item-text="name"
               item-value="id"
               label="Tipe sekolah"
               clearable
               hide-details="auto"
               class="pt-0 mt-0"
               @input="dataHandler()"
            ></v-select>
         </v-col>
      </div>
      <v-btn
         depressed
         color="primary"
         @click.stop="dialog('new')"
      >Input Sekolah</v-btn>
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
         <v-tooltip top color="black">
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
         </v-tooltip>

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
      v-model="schoolDetailDialogTrigger"
      max-width="1200"
      persistent
   >
      <v-card>
         <v-card-title class="justify-space-between">
            <span class="text-subtitle-1">Detail Sekolah</span>
            <v-tooltip left color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                     v-bind="attrs"
                     icon
                     v-on="on"
                     @click="closeSchoolDetailDialog()"
                  >
                     <v-icon>mdi-window-close</v-icon>
                  </v-btn>
               </template>
               <span>Tutup</span>
            </v-tooltip>
         </v-card-title>
         <v-card-text>
            <v-tabs
               v-model="tab"
               grow
            >
               <v-tab>Informasi sekolah</v-tab>
               <v-tab>Data Siswa</v-tab>
               <v-tab>Data Guru</v-tab>
            </v-tabs>
            <v-tabs-items
               v-model="tab"
            >
               <v-tab-item class="px-1 py-4">
                  <v-row dense>
                     <v-col align-self="stretch">
                        <v-card flat outlined height="100%">
                           <v-card-text>
                              <p class="font-weight-bold mb-0">Nama Sekolah</p>
                              <p>{{ targetItem.name }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col>
                        <v-card flat outlined height="100%">
                           <v-card-text>
                              <p class="font-weight-bold mb-0">Email</p>
                              <p>{{ targetItem.email }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col>
                        <v-card flat outlined height="100%">
                           <v-card-text>
                              <p class="font-weight-bold mb-0">Kepala Sekolah</p>
                              <p>{{ targetItem.principal }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col>
                        <v-card flat outlined height="100%">
                           <v-card-text>
                              <p class="font-weight-bold mb-0">Pengawas</p>
                              <p>{{ targetItem.supervisor_name }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col cols="12">
                        <v-card flat outlined height="100%">
                           <v-card-text>
                              <p class="font-weight-bold mb-0">Alamat</p>
                              <p>{{ targetItem.address }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-tab-item>
               <v-tab-item class="px-1 py-4">
                  <v-row dense>
                     <v-col cols="12" md="3">
                        <v-card flat outlined>
                           <v-card-text>
                              <p class="mb-2">Jumlah Siswa</p>
                              <p class="text-h4 font-weight-medium grey--text text--darken-2">{{ targetItem.total_students }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col v-for="students in targetItem.students" :key="students.grade" cols="12" md="3">
                        <v-card flat outlined>
                           <v-card-text>
                              <p class="mb-2">Kelas {{ students.grade }}</p>
                              <p class="text-h4 font-weight-medium grey--text text--darken-2">{{ students.total }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col cols="12" class="mt-6">
                        <p class="text-subtitle-1">Data Siswa Berdasarkan Agama</p>
                        <v-data-table
                           hide-default-footer
                           :headers="studentHeaders"
                           :items="targetItem.students"
                        >
                           <!-- eslint-disable-next-line vue/valid-v-slot -->
                           <template #item.grade="{item}">
                              Kelas {{ item.grade }}
                           </template>
                        </v-data-table>
                     </v-col>
                  </v-row>
               </v-tab-item>
               <v-tab-item class="px-1 py-4">
                  <v-row dense>
                     <v-col cols="12">
                        <v-card flat outlined>
                           <v-card-text>
                              <p class="mb-2">Jumlah Guru</p>
                              <p class="text-h4 font-weight-medium grey--text text--darken-2">{{ targetItem.total_teachers }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <template
                        v-for="(item, key) in targetItem.teachers"
                     >
                        <template
                           v-if="key !== 'updated_at' && key !== 'created_at' && key !== 'school_id' && key !== 'year' && key !== 'id'"
                        >
                           <v-col :key="key" cols="3" align-self="stretch">
                              <v-card flat outlined height="100%">
                                 <v-card-text>
                                    <p class="mb-2">
                                       {{ (key === 'math') ? 'Matematika' 
                                       : (key === 'ind_lit') ? 'Bahasa Indonesia' 
                                       : (key === 'eng_lit') ? 'Bahasa Inggris' 
                                       : (key === 'science') ? 'Ilmu Pengetahuan Alam' 
                                       : (key === 'social') ? 'Ilmu Pengetahuan Sosial' 
                                       :(key === 'civic') ? 'Pendidikan Kewarganegaraan' 
                                       : (key === 'islam') ? 'Pendidikan Agama Islam' 
                                       : (key === 'catholic') ? 'Pendidikan Agama Katolik' 
                                       : (key === 'protestant') ? 'Pendidikan Agama Protestan' 
                                       : (key === 'hindu') ? 'Pendidikan Agama Hindu' 
                                       : (key === 'buddha') ? 'Pendidikan Agama Buddha' 
                                       : (key === 'konghucu') ? 'Pendidikan Agama Konghucu' 
                                       : (key === 'counseling') ? 'Bimbingan Konseling' 
                                       : (key === 'sports') ? 'Pendidikan Jasmani, Olahraga dan Kesehatan' 
                                       : (key === 'art') ? 'Seni Budaya dan Keterampilan'
                                       : (key === 'entrepreneurship') ? 'Kewirausahaan'
                                       : 'Total' }}
                                    </p>
                                    <p class="text-h4 font-weight-medium grey--text text--darken-2">{{ item }}</p>
                                 </v-card-text>
                              </v-card>
                           </v-col>
                        </template>
                     </template>
                  </v-row>
               </v-tab-item>
            </v-tabs-items>
         </v-card-text>
      </v-card>
   </v-dialog>

   <v-dialog
      v-model="dialogTrigger"
      persistent
      max-width="800"
   >
      <v-card>
         <v-card-title class="justify-space-between">
            <span class="text-subtitle-1">Input Sekolah</span>
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
                        :items="formSupervisor"
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
         schoolTypeId: null,
         schoolType: [],
         schoolName: null,

         targetItem: [],
         tab: null,

         dialogTrigger: false,
         isEdit: false,
         changePasswordCheckbox: false,
         
         dialogDeleteTrigger: false,
         
         schoolDetailDialogTrigger: false,
         formSupervisor: [],
         formSupervisorLoading: false,
         formSupervisorSync: null,
         formOldPasswordVisible: false,
         formPasswordVisible: false,
         formConfirmPasswordVisible: false,
         confirmPassword: null,

         studentHeaders: [
            {
               text: 'Kelas',
               value: 'grade'
            },
            {
               text: 'Islam',
               value: 'islam',
            },
            {
               text: 'Katolik',
               value: 'catholic'
            },
            {
               text: 'Protestan',
               value: 'protestant'
            },
            {
               text: 'Hindu',
               value: 'hindu'
            },
            {
               text: 'Buddha',
               value: 'buddha'
            },
            {
               text: 'Konghucu',
               value: 'konghucu'
            }
         ],

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

   watch: {
      // REVIEW - check for request amount in Network DevTools, if too much requests sent in a time, see REVIEW in pages/components/table.vue
      formSupervisorSync(val) {
         if (val === null || val.length === 0) return
         if (this.formSupervisor.length > 0) return
         if (this.formSupervisorLoading) return
         this.formSupervisorLoading = true
         this.$axios.get('/supervisor/getAll').then((resp) => {
            this.formSupervisor = resp.data.data
         }).catch((e) => {
            console.log(e)
         }).finally(() => {
            this.formSupervisorLoading = false
         })
      },

      alertTrigger() {
         if (this.alertTrigger === true) {
            setTimeout(() => {
               this.onTriggeredAlert()
            }, 5000)
         }
      },

      changePasswordCheckbox() {
         if (this.changePasswordCheckbox === false) {
            if (this.targetItem.password) this.targetItem.password = null
            if (this.targetItem.old_password) this.targetItem.old_password = null
         }
      }
   },

   async mounted() {
      await this.getSchoolType()
   },

   methods: {
      dataHandler() {
         this.$emit('data-handler', this.current, this.schoolTypeId, this.schoolName)
      },

      nullNamedataHandler() {
         this.schoolName = null
         this.dataHandler()
      },

      async getSchoolType() {
         await this.$axios.get(`/getSchoolType`).then((resp) => {
            this.schoolType = resp.data.data
         })
      },

      schoolDetailDialog(item) {
         // console.log("schoolDetailDialog ~ item:", item)
         this.targetItem = item
         this.targetItem.supervisor_name = item.supervisor.name
         this.schoolDetailDialogTrigger = true
      },

      closeSchoolDetailDialog() {
         this.targetItem = []
         this.schoolDetailDialogTrigger = false
         this.tab = null
      },

      async dialog(type, item) {
         this.dialogTrigger = true
         
         if (type === 'new') {
            this.targetItem = {
               name: '',
               school_type_id: null,
               email: null,
               supervisor_id: null,
               principal: null,
               address: null,
               password: null,
            }
         } else if (type === 'edit') {
            this.isEdit = true
            this.targetItem = {
               id: item.id,
               name: item.name,
               school_type_id: item.school_type_id,
               email: item.email,
               supervisor_id: item.supervisor_id,
               principal: item.principal,
               address: item.address,
               password: null,
               supervisor: { name: item.supervisor.name}
            }
            this.targetItem.old_password = null
            this.formSupervisorSync = this.targetItem.supervisor.name
         }

         await this.wait(50)
         this.$refs.form.resetValidation()
      },

      closeDialog() {
         this.targetItem = []
         this.isEdit = false
         this.changePasswordCheckbox = false
         this.dialogTrigger = false
      },

      async submit(type) {
         if (this.$refs.form.validate()) {
            if (type === 'new') {
               await this.$axios.post(`/admin/createSchool`, this.targetItem).then((resp) => {
                  this.alertColor = 'green darken-2'
                  this.alertIcon = 'mdi-check-circle'
                  this.alertType = 'success'
                  this.alertMessage = `Sekolah baru berhasil dibuat. ID sekolah: <code>${resp.data.data.id}</code>`
               }).catch(e => { console.log(e)})
            } else if (type === 'edit') {
               await this.$axios.put(`/school/update/${this.targetItem.id}`, this.targetItem).then((resp) => {
                  this.alertColor = 'cyan darken-2'
                  this.alertIcon = 'mdi-information'
                  this.alertType = 'info'
                  this.alertMessage = `Data sekolah <code>${resp.data.data.id}</code> berhasil disunting`
               }).catch(e => { console.log(e) })
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
         await this.$axios.delete(`/school/delete/${item.id}`).then((resp) => {
            this.alertColor = 'amber darken-2'
            this.alertIcon = 'mdi-information'
            this.alertType = 'warning'
            this.alertMessage = `Sekolah <code>${item.name}</code> berhasil dihapus`
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