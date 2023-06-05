export const state = () => ({
   isAuth: false,
   api_token: null,

   tableHeader: [
      {
         text: 'ID',
         value: 'id'
      },
      {
         text: 'Sekolah',
         value: 'school.name'
      },
      {
         text: 'Tipe data',
         value: 'data_type.name'
      },
      {
         text: 'Kategori',
         sortable: false,
         value: 'data_type.data_category.name'
      },
      {
         text: 'Tahun ajaran',
         value: 'year'
      },
      {
         text: 'Status',
         sortable: false,
         value: 'data_status.name'
      },
      {
         text: 'Terakhir diperbarui',
         value: 'date'
      },
      {
         text: 'Aksi',
         sortable: false,
         value: 'actions'
      }
   ],

   alert: {
      type: null,
      color: null,
      icon: null,
      message: null
   },
   alertTrigger: false,

   snackbar: {
      color: null,
      text: null
   },
   snackbarTrigger: false,

   dialog: null,
   dialogTrigger: false,

   breadcrumb: [{
      text: null,
      disabled: false,
      href: null,
   }]
})

export const mutations = {
   SET_IS_AUTH(state, payload) {
      state.isAuth = payload
   },
   SET_API_TOKEN(state, payload) {
      state.api_token = payload
   },
   
   SET_ALERT(state, payload) {
      state.alert = payload
   },
   SHOW_ALERT(state) {
      state.alertTrigger = true
   },
   CLEAR_ALERT(state) {
      state.alert = {
         type: null,
         color: null,
         icon: null,
         message: null
      }
      state.alertTrigger = false
   },

   SET_SNACKBAR(state, payload) {
      state.snackbar = payload
   },
   SHOW_SNACKBAR(state) {
      state.snackbarTrigger = true
   },
   CLEAR_SNACKBAR(state) {
      state.snackbar = {
         text: null,
         color: null
      }
      state.snackbarTrigger = false
   },

   SET_DIALOG(state, payload) {
      state.dialog = payload
   },
   SHOW_DIALOG(state) {
      state.dialogTrigger = true
   },
   CLEAR_DIALOG(state) {
      state.dialog = null
   },
   CLOSE_DIALOG(state) {
      state.dialogTrigger = false
   },

   SET_BREADCRUMB(state, payload) {
      state.breadcrumb = payload
   }
}

export const actions = {
   nuxtServerInit({commit}, context) {
      commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
      if(context.app.$auth.$state.loggedIn) {
         commit('SET_API_TOKEN', context.app.$auth.$state.user.api_token)
      }
   },

   setAlert({commit}, payload) {
      commit('SET_ALERT', payload)
   },

   showAlert({commit}) {
      commit('SHOW_ALERT')
   },

   clearAlert({commit}) {
      commit('CLEAR_ALERT')
   },

   setSnackbar({commit}, payload) {
      commit('SET_SNACKBAR', payload)
   },

   showSnackbar({commit}) {
      commit('SHOW_SNACKBAR')
   },

   clearSnackbar({commit}) {
      commit('CLEAR_SNACKBAR')
   },

   setDialog({commit}, payload) {
      commit('SET_DIALOG', payload)
   },

   showDialog({commit}) {
      commit('SHOW_DIALOG')
   },

   clearDialog({commit}) {
      commit('CLEAR_DIALOG')
   },

   closeDialog({commit}) {
      commit('CLOSE_DIALOG')
   },

   setBreadcrumb({commit}, payload) {
      commit('SET_BREADCRUMB', payload)
   }
}