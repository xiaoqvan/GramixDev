<template>
  <div v-if="!loading" class="p-1 flex gap-2 flex-row hover:bg-base-300 rounded-[var(--radius-box)]"
    @click="chat(chatdata)">
    <div>
      <div class="w-13 h-13 rounded-full shadow">
        <div v-if="!chatdata.photo || !chatdata.photo.minithumbnail || !chatdata.photo.minithumbnail.data"
          class="avatar avatar-placeholder w-full h-full">
          <div v-if="!chatdata.user" class="w-full rounded-full">
            <span class="text-base">{{
              chatdata.title.slice(0, 2).toUpperCase() }}</span>
          </div>
          <div v-else class="w-full rounded-full">
            <span class="text-base">{{
              chatdata.user.first_name.slice(0, 1).toUpperCase() + chatdata.user.last_name.slice(0,
                1).toUpperCase() }}</span>
          </div>
        </div>
        <img v-else :src="'data:image/jpeg;base64,' + chatdata.photo.minithumbnail.data" alt="img"
          class="avatar avatar-online w-full h-full rounded-full" />
      </div>
    </div>
    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 min-w-0 flex flex-col gap-0.5 justify-center">
        <div>
          <h1 v-if="chatdata.user?.type?._ === 'userTypeDeleted' || chatdata.user?.type?._ === 'userTypeUnknown'">
            Deleted account
          </h1>
          <div v-else class="font-bold truncate flex items-center gap-1">
            <h1>{{ chatdata.title || '????' }} </h1>
            <p v-if="(chatdata.supergroup?.is_verified === true) || (chatdata.user?.is_verified === true)"
              class="text-sky-400 flex items-center">
              <VerifiedFilledIcon />
            </p>
          </div>
        </div>
        <div class="text-sm text-slate-500">
          <message :lastMessage="chatdata.last_message" />
        </div>

        <div v-if="false" class="flex flex-row gap-0.5 truncate">
          <div class="badge badge-xs badge-primary">Primary</div>
          <div class="badge badge-xs badge-secondary">Secondary</div>
          <div class="badge badge-xs badge-accent">Accent</div>
        </div>
      </div>
      <div class="flex flex-col items-end text-xs gap-1.5 mt-1">
        <div class="text-base-content">
          {{ formatTime(chatdata.last_message?.date) }}
        </div>
        <div>
          <div v-if="chatdata.unread_count !== 0" class="badge badge-xs bg-base-300">{{ chatdata.unread_count }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-1 flex gap-2 flex-row">
    <div class="skeleton avatar rounded-full">
      <div class="w-13 h-13 rounded-full">
      </div>
    </div>
    <div class="flex-1 flex overflow-hidden gap-1">
      <div class="flex-1 min-w-0 flex flex-col gap-0.5 justify-center">
        <div>
          <h1 class="skeleton text-sm font-bold truncate w-full h-5"></h1>
        </div>
        <div class="skeleton text-xs truncate text-slate-500 w-full h-3.5">
        </div>

      </div>
      <div class="flex flex-col min-w-10 items-end text-xs gap-1.5 justify-center">
        <div class="skeleton w-full h-4 text-base-content">
        </div>
        <div class="skeleton w-full h-4">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs, ref } from 'vue'
import { useStore } from '@/stores/rightcontents';
import message from '@/components/home/chat/chatlistmessage.vue'
import { VerifiedFilledIcon } from 'tdesign-icons-vue-next'

const Store = useStore()
const props = defineProps({
  chatdata: Object,
  loading: Boolean
})

const { chatdata, loading } = toRefs(props)

const chat = (chatdata) => {
  Store.page = 'chat'
  Store.chatid = chatdata.id
  Store.chatInfo = chatdata
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''; // 检查 timestamp 是否存在
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isThisWeek = (now - date) / (1000 * 60 * 60 * 24) < 7;

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isThisWeek) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  } else {
    return date.toLocaleDateString();
  }
}

const GroupSendername = ref('')


async function getchat(type, id) {
  console.log(type, id);
  if (type === 'messageSenderChat') {
    const chatinfo = await window.electron.ipcRenderer.invoke('getchat', id)
    GroupSendername.value = chatinfo.title
  }
  if (type === 'messageSenderUser') {
    const userinfo = await window.electron.ipcRenderer.invoke('getuser', id)
    GroupSendername.value = userinfo.first_name || userinfo.last_name;
  }
}

</script>
<style scoped>
.shadow {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
