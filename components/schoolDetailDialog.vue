<template>
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
                  :headers="dialog.tableHeader"
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
</template>

<script>
import { mapState } from 'vuex'
export default {
   data() {
      return {
         targetItem: null,
         tab: null,
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),
   },

   beforeMount() {
      this.targetItem = this.dialog.item
   }
}
</script>