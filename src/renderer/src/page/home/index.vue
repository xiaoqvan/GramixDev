<template>
  <div class="h-screen flex flex-col">
    <TitleBar state="1" />
    <div class="flex-1 flex flex-row">
      <Navigation />
      <!-- 中间内容区域 -->
      <div class="h-full" :style="{ width: leftWidth + 'px' }">
        <RouterView />
      </div>
      <!-- 分割线 -->
      <div class="w-0.75 h-full bg-gray-200 cursor-col-resize" @mousedown="startResize" @mousemove="onMouseMove"
        @mouseup="stopResize">
      </div>
      <div class="h-full flex-1">
        <rightcontents />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import Navigation from '../../components/Navigation.vue';
import TitleBar from '@/components/TitleBar.vue'
import rightcontents from '../../components/home/chat/rightcontents.vue';
import { chatList } from '../../stores/chatList';
import { useRouter } from 'vue-router';

const router = useRouter();
const chatwindow = ref(true)
const chatListData = chatList()

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

window.electron.ipcRenderer.on('updatechatList', (_, chatList) => {
  console.log('聊天列表更新', chatList);
  chatListData.chatList = chatList
})

onMounted(async () => {
  router.push('/home/chats');
  ipcHandle()
  window.electron.ipcRenderer.invoke('loadChats')
  window.electron.ipcRenderer.send('chatwindow', chatwindow.value)
  try {
    const chatList = await window.electron.ipcRenderer.invoke('getChatList')
    chatListData.chatList = chatList
  } catch (error) {
    console.error('获取聊天列表失败:', error)
  }
})

const leftWidth = ref(300) // 初始宽度
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

const startResize = (e) => {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = leftWidth.value

  // 添加全局事件监听
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResize)
}

const handleMouseMove = (e) => {
  if (!isResizing.value) return

  const diff = e.clientX - startX.value
  leftWidth.value = Math.max(200, Math.min(startWidth.value + diff, 500)) // 限制最小/最大宽度
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
}

</script>
<style scoped>
.cursor-col-resize {
  cursor: ew-resize;
  user-select: none;

}
</style>
