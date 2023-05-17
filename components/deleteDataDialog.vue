<template>
   <v-card-text>
      <p class="text-body-2">
      Anda yakin ingin menghapus {{ text }} <code>{{ targetItem.id }}</code>?
      </p>
      <v-alert
         border="left"
         text
         color="red"
         type="warning"
         icon="mdi-alert"
      >
         Aksi ini tidak bisa dibatalkan
      </v-alert>
      <div class="d-flex justify-end">
         <v-btn class="me-2" text @click="closeDialog()">Batal</v-btn>
         <v-btn color="red darken-2" depressed class="white--text" @click="submit(dialog.type)">Hapus</v-btn>
      </div>
   </v-card-text>
</template>

<script>
import { mapState} from 'vuex'
export default {
   data() {
      return {
         targetItem: null,
         text: null
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),
   },

   beforeMount() {
      this.targetItem = this.dialog.item
      
      switch (this.dialog.type) {
         case 'delete':
            this.text = 'data'
            break
         case 'school-delete':
            this.text = 'akun sekolah'
            break
         case 'supervisor-delete':
            this.text = 'akun pengawas'
            break
         case 'diknas-delete':
            this.text = 'akun diknas'
            break
         default: break
      }
   },

   methods: {
      async submit(type) {
         let endpoint = null
         let alertMessage = null
         switch(type) {
            case 'delete':
               endpoint = 'data'
               alertMessage = `Data <code>${this.targetItem.id}</code> berhasil dihapus`
               break
            case 'school-delete':
               endpoint = 'school'
               alertMessage = `Sekolah <code>${this.targetItem.id}</code> berhasil dihapus`
               break
            case 'supervisor-delete':
               endpoint = 'supervisor'
               alertMessage = `Akun pengawas <code>${this.targetItem.id}</code> berhasil dihapus`
               break
            case 'diknas-delete':
               endpoint = 'diknas'
               alertMessage = `Akun diknas <code>${this.targetItem.id}</code> berhasil dihapus`
               break
            case 'admin-delete':
               endpoint = 'admin'
               alertMessage = `Akun admin <code>${this.targetItem.id}</code> berhasil dihapus`
               break
            default: break
         }

         await this.$axios.delete(`/${endpoint}/delete/${this.targetItem.id}`).then((resp) => {
               this.$store.dispatch('setAlert', {
                  type: 'warning',
                  icon: 'mdi-alert',
                  message: alertMessage
               })
            }).catch((e) => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  icon: 'mdi-information-outline',
                  message: e
               })
            })
         
         this.$emit('submit')
         this.closeDialog()
      },

      closeDialog() {
         this.targetItem = {id: null}
         this.$emit('close')
      },
   }
}
</script>