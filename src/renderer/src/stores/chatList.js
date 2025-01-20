import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const chatList = defineStore('chatList', () => {
  const state = reactive({
    chatList: []
  })

  function updateChatList(newList) {
    state.chatList = newList.map((item) => ({ ...item })) // 确保深层响应性
  }

  return {
    chatList: state.chatList,
    updateChatList
  }
})
