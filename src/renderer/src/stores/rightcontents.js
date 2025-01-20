import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    page: '',
    chatid: '',
    chatInfo: {}
  }),
  persist: true
})
