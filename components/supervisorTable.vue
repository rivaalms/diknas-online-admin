<template>
   <div>
      <app-alert/>

      <div class="d-flex justify-space-between align-center">
         <div class="d-flex align-center flex-grow-1">
            <span class="me-2 text-subtitle-2">Filter: </span>
            <v-col cols="3">
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
            @click.stop="dialog('supervisor-new')"
         >Input Pengawas</v-btn>
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
                     color="orange darken-2"
                     v-on="on"
                     @click="dialog('supervisor-edit', item)"
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
                     @click="dialog('supervisor-delete', item)"
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
   
      <app-dialog
         @submit="dataHandler()"
      />
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
         }
      },
   
      watch: {
         searchValue(val) {
            if (val === null || val.length < 1) return this.nullSearchDataHandler()
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
   
         dialog(type, item) {
            if (type === 'supervisor-edit') {
               this.$store.dispatch('setDialog', {
                  type,
                  title: 'Sunting Pengawas',
                  item,
               })
            } else if (type === 'supervisor-new') {
               this.$store.dispatch('setDialog', {
                  type,
                  title: 'Input Pengawas'
               })
            } else if (type === 'supervisor-delete') {
               this.$store.dispatch('setDialog', {
                  type,
                  title: 'Hapus Pengawas?',
                  item,
               })
            }
            this.$store.dispatch('showDialog')
         }
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