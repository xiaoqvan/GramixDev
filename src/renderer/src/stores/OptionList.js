import { defineStore } from 'pinia'

export const OptionList = defineStore('main', {
  state: () => ({
    OptionList: []
  }),
  persist: true
})
