<template>
  <div class="flex flex-col h-dvh" @dragstart.prevent>
    <!-- 顶部标题栏 -->
    <div class="navbar pt-3 select-none">
      <div class="flex-none" @click="Store.page = ''">
        <button class="btn btn-square btn-ghost text-2xl mr-0.5">
          <ChevronLeftIcon />
        </button>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <div class="avatar">
            <div class="w-10 h-10 rounded-full">
              <img :src="'/@fs/' + chatdate?.ptoto" alt="群组头像" />
            </div>
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ chatdate?.name }}</h2>
            <p class="text-sm text-base-content/70">5998 members, 160 online</p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
    <t-divider style="margin: 0;" />
    <!-- 置顶消息 -->
    <div class="px-4 py-2 select-none">
      <div>
        <div>
          <h3 class="text-base text-neutral">Pinned Message</h3>
          <div class="text-xs text-gray-500">Test message !!</div>
        </div>
      </div>
    </div>
    <t-divider style="margin: 0;" />
    <!-- 聊天内容区域 -->
    <el-scrollbar class="flex-1 p-4 select-none">
      <!-- 消息列表 -->
      <div v-for="(message, index) in messages" :key="index" class="chat"
        :class="message.isAdmin ? 'chat-end' : 'chat-start'">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full">
            <img :src="message.avatar" />
          </div>
        </div>
        <div class="chat-header">
          {{ message.name }}
          <time class="text-xs opacity-50">{{ message.time }}</time>
        </div>
        <div class="chat-bubble select-text" :class="message.isAdmin ? 'chat-bubble-primary' : ''">
          {{ message.content }}
        </div>
      </div>
    </el-scrollbar>
    <!-- 底部输入框 -->
    <div class="bg-base-300 m-3 rounded-lg p-1 flex items-center ">
      <textarea class="textarea textarea-ghost w-full min-h-[40px] max-h-[120px] resize-y" placeholder="Bio"
        rows="1"></textarea>
      <button class="btn btn-ghost btn-circle w-10 h-10 ml-2 hover:bg-neutral hover:text-neutral-content text-2xl">
        <SmileIcon />
      </button>
      <button class="btn btn-ghost btn-circle w-10 h-10 ml-2 hover:bg-neutral hover:text-neutral-content text-2xl">
        <EnterIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { ChevronLeftIcon, EnterIcon, SmileIcon } from 'tdesign-icons-vue-next'
import { useStore } from '@/stores/rightcontents.js'

const Store = useStore()
const messages = ref([
  {
    name: 'my1',
    avatar: 'https://placeholder.com/40x40',
    content: '今天的天气真好',
    time: '14:39',
    isAdmin: true
  },
  {
    name: 'my2',
    avatar: 'https://placeholder.com/40x40',
    content: '是的',
    time: '14:40',
    isAdmin: false
  },
  // 可以添加更多消息...
])
const props = defineProps({
  chatdate: Object,
  chat: String
})

const { chatdate } = toRefs(props)
</script>

<style scoped></style>
