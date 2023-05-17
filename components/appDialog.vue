<template>
<v-dialog
   v-model="dialogTrigger"
   persistent
   :max-width="dialogWidth"
>
   <v-card>
      <v-card-title class="justify-space-between">
         <span class="text-subtitle-1">{{ dialog ? dialog.title : '' }}</span>
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

      <!-- //SECTION - Edit -->
         <lazy-edit-data-form
            v-if="dialog && dialog.type === 'edit'"
            @close="closeDialog()"
            @submit="submit()"
         />
      <!-- //!SECTION -->

      <!-- //SECTION - New -->
         <lazy-new-data-form
            v-if="dialog && dialog.type === 'new'"
            @close="closeDialog()"
            @submit="submit()"
         />
      <!-- //!SECTION -->

      <!-- //SECTION - Delete -->
      <lazy-delete-data-dialog
         v-if="dialog && (dialog.type === 'delete' || dialog.type === 'school-delete' || dialog.type === 'supervisor-delete' || dialog.type === 'diknas-delete' || dialog.type === 'admin-delete')"
         @close="closeDialog()"
         @submit="submit()"
      />
      <!-- //!SECTION -->

      <!-- //SECTION - Schools -->
      <lazy-school-detail-dialog
         v-if="dialog && dialog.type === 'school-detail'"
         @close="closeDialog()"
      />

      <lazy-school-input-form
         v-if="dialog && (dialog.type === 'school-edit' || dialog.type === 'school-new')"
         @close="closeDialog()"
         @submit="submit()"
      />
      <!-- //!SECTION -->

      <!-- //SECTION - Supervisor & Diknas -->
      <lazy-supervisor-diknas-input-form
         v-if="dialog && (dialog.type === 'supervisor-edit' || dialog.type === 'supervisor-new' || dialog.type === 'diknas-edit' || dialog.type === 'diknas-new')"
         @close="closeDialog()"
         @submit="submit()"
      />
      <!-- //!SECTION -->

      <!-- //SECTION - Admin -->
      <lazy-admin-input-form
         v-if="dialog && (dialog.type === 'admin-edit' || dialog.type === 'admin-new')"
         @close="closeDialog()"
         @submit="submit()"
      />
      <!-- //!SECTION -->
      
   </v-card>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
   data() {
      return {
         dialogWidth: 1200,
      }
   },
   
   computed: {
      ...mapState(['dialog', 'dialogTrigger']),
   },

   watch: {
      dialogTrigger() {
         if (!this.dialogTrigger) {
            setTimeout(() => {
               this.$store.dispatch('clearDialog')
            }, 200)
         } else {
            switch (this.dialog.type) {
               case 'edit':
               case 'school-detail':
                  this.dialogWidth = 1200
                  break
               case 'new':
               case 'school-edit':
               case 'school-new':
               case 'supervisor-edit':
               case 'supervisor-new':
               case 'diknas-edit':
               case 'diknas-new':
               case 'admin-edit':
               case 'admin-new':
                  this.dialogWidth = 800
                  break
               case 'delete':
               case 'school-delete':
               case 'supervisor-delete':
               case 'diknas-delete':
               case 'admin-delete':
                  this.dialogWidth = 500
                  break
               default: break
            }
         }
      },
   },

   methods: {
      submit() {
         this.$store.dispatch('showAlert')
         this.$emit('submit')
      },

      closeDialog() {
         this.$store.dispatch('closeDialog')
      },
   }
}
</script>