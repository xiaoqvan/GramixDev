<template>
  <div v-if="store.page === 'chat'">
    <ChatWindow :chat="store.id" :chatdate="store.chatInfo" />
  </div>
  <div v-else-if="store.page === 'my'">
    <my />
  </div>
  <div v-else-if="store.page === 'privacy'">
    <privacy />
  </div>
  <div v-else-if="store.page === 'notifications'">
    <notifications />
  </div>
  <div v-else-if="store.page === 'chatsetting'">
    <chat />
  </div>
  <div v-else-if="store.page === 'folders'">
    <folders />
  </div>
  <div v-else-if="store.page === 'advanced'">
    <advanced />
  </div>
  <div v-else-if="store.page === 'device'">
    <device />
  </div>
  <div v-else-if="store.page === 'language'">
    <language />
  </div>
  <div v-else>

  </div>
</template>
<script setup>
import ChatWindow from './ChatWindow.vue';
import { useStore } from '@/stores/rightcontents';
import my from '../../../page/setting/my.vue';
import privacy from '../../../page/setting/privacy.vue';
import notifications from '../../../page/setting/notifications.vue';
import chat from '../../../page/setting/chat.vue';
import folders from '../../../page/setting/folders.vue';
import advanced from '../../../page/setting/advanced.vue';
import device from '../../../page/setting/Devices.vue';
import language from '../../../page/setting/language.vue';

const store = useStore()

</script>
<style scoped></style>
