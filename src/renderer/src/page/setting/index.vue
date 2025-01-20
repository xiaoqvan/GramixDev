<template>
  <div class="select-none h-dvh flex flex-col" @dragstart.prevent>
    <el-scrollbar>
      <div class="p-2 flex gap-2  mt-4">
        <img class="w-15 h-15 rounded-full shadow-md" src="/@fs/F:\Pictures\67480c1218248c27bde73fb5.png" alt="">
        <div>
          <p class="text-xl font-semibold"><span>xiaoqvan</span> <span></span></p>
          <p>online</p>
        </div>
      </div>
      <t-divider style="margin: 0;" />
      <div class="p-2">
        <div class="flex gap-2 flex-col">
          <p class="text-neutral text-sm ml-2">账户</p>
          <div class="text-sm px-3">
            <div class="mb-2">
              <p class="text-xs text-gray-500">Mobile:</p>
              <p class="select-text">+888 123456789</p>
            </div>
            <t-divider style="margin: 0;" />
            <div class="my-2">
              <p class="text-xs text-gray-500">Username:</p>
              <p class="select-text">@xiaoqvan688</p>
            </div>
            <div class="my-2">
              <p class="text-xs text-gray-500">ID:</p>
              <p class="select-text">123456789</p>
            </div>
            <t-divider style="margin: 0;" />
            <div class="mt-2">
              <p class="text-xs text-gray-500">Bio:</p>
              <p>None</p>
            </div>
          </div>
        </div>
      </div>
      <t-divider style="margin: 0;" />
      <div class="p-3 flex gap-2 flex-col ">
        <p class="text-neutral text-sm ml-2">Set</p>
        <div class="flex gap-2 flex-col pl-2">
          <div class="set hover:shadow-md" @click="goMy">
            <UserCircleIcon class="set-icon" />
            <p>我的账户</p>
          </div>
          <div class="set hover:shadow-md" @click="goNotifications">
            <NotificationIcon class="set-icon" />
            <p>通知与声音</p>
          </div>
          <div class="set hover:shadow-md" @click="goPrivacy">
            <UserLockedIcon class="set-icon" />
            <p>隐私和安全</p>
          </div>
          <div class="set hover:shadow-md">
            <ChatSettingIcon class="set-icon" @click="goChat" />
            <p>聊天设置</p>
          </div>
          <div class="set hover:shadow-md" @click="goFolder">
            <FolderIcon class="set-icon" />
            <p>文件夹</p>
          </div>
          <div class="set hover:shadow-md" @click="goDevice">
            <DeviceIcon class="set-icon" />
            <p>设备</p>
          </div>
          <div class="set hover:shadow-md" @click="goLanguage">
            <EarthIcon class="set-icon" />
            <p>语言</p>
          </div>
          <div class="set hover:shadow-md" @click="goAdvanced">
            <SettingIcon class="set-icon" />
            <p>高级设置</p>
          </div>
        </div>
      </div>
      <t-divider style="margin: 0;" />
      <div class="p-3">
        <p class="text-neutral text-sm ml-2">About</p>
        <div class="flex gap-2 flex-col pl-2">
          <div class="set hover:shadow-md">
            <ErrorCircleIcon class="set-icon" />
            <p>关于</p>
          </div>
          <div class="set hover:shadow-md">
            <VerifiedIcon class="set-icon" />
            <p>官方频道</p>
          </div>
          <div class="set hover:shadow-md" @click="openGithub">
            <LogoGithubIcon class="set-icon" />
            <p>GitHub</p>
          </div>
        </div>
      </div>
      <div class="mb-1">
        <p class="text-center text-gray-500 text-xs select-text">Grmix v1.0.1 (00125) © 2025 CatMoeCircle - Electron v{{
          versions.electron }} - Chromium v{{ versions.chrome }} - Node v{{ versions.node }} - TDLib v{{ TDLibversion }}
        </p>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { UserCircleIcon, NotificationIcon, UserLockedIcon, ChatSettingIcon, FolderIcon, DeviceIcon, EarthIcon, SettingIcon, ErrorCircleIcon, VerifiedIcon, LogoGithubIcon } from 'tdesign-icons-vue-next'
import { useStore } from '@/stores/rightcontents';
import { reactive, ref, onMounted } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
const store = useStore()
const TDLibversion = ref('')
const goMy = () => {
  store.page = 'my'
}
const goNotifications = () => {
  store.page = 'notifications'
}
const goPrivacy = () => {
  store.page = 'privacy'
}
const goChat = () => {
  store.page = 'chatsetting'
}
const goFolder = () => {
  store.page = 'folders'
}
const goDevice = () => {
  store.page = 'device'
}
const goLanguage = () => {
  store.page = 'language'
}
const goAdvanced = () => {
  store.page = 'advanced'
}
onMounted(async () => {
  const Option = await window.electron.ipcRenderer.invoke('getOption', 'version')
  TDLibversion.value = Option.value
})
</script>
<style scoped>
.set {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px;
}

.set:hover {
  background-color: var(--color-neutral);
  color: var(--color-neutral-content);
  border-radius: 5px;
}

.set-icon {
  font-size: 20px;
}
</style>
