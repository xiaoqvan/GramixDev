<template>
  <div class="SessionList h-dvh flex flex-col" @dragstart.prevent>
    <div class="pt-2 px-2">
      <search />
    </div>
    <chatfolders :tabs="tabs" />
    <el-scrollbar class="h-full flex flex-col overflow-auto px-2 ">
      <div class="flex flex-col gap-1">
        <chat v-for="chatItem in sortedChatList" :key="chatItem.id" :chatdata="chatItem" :loading="loading" />
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import chat from '@/components/home/chat.vue'
import search from '@/components/home/search.vue'
import chatfolders from '@/components/home/chatfolders.vue'
import { chatList } from '../../../stores/chatList'

const chatListData = chatList()
const loading = ref(false)
const tabs = ref([
  'All Chats',
  'Groups',
  'Channels',
  'Bots',
])

onMounted(() => {
  window.electron.ipcRenderer.on('updatechatList', (_, newChatList) => {
    console.log('聊天列表更新', newChatList)
    chatListData.updateChatList(newChatList)
  })
})

const sortedChatList = computed(() => {
  // 确保每次计算时都创建新的数组并进行深拷贝
  return chatListData.chatList.map(chat => ({ ...chat }))
    .sort((a, b) => b.position.order - a.position.order)
})
</script>
<style>
.SessionList {

  user-select: none;
}
</style>
