<template>
  <TitleBar />
  <div class="pt-[25px]">
    <RouterLink to="/auth/signIn"><button class="btn">auth</button></RouterLink>
    <RouterLink to="/auth/code"><button class="btn">authcode</button></RouterLink>
    <RouterLink to="/auth/password"><button class="btn">authpassword</button></RouterLink>
    <RouterLink to="/home"><button class="btn">home</button></RouterLink>
  </div>
  <div>
    <button class="btn" @click="getOptionList">getOptionList</button>
    <button class="btn" @click="getInit">getInitialization</button>
    <button class="btn" @click="closetdlib">closetdlib</button>
    <button class="btn" @click="starttdlib">starttdlib</button>
    <button class="btn" @click="setAuthPhoneNumber">setAuthPhoneNumber</button>
    <button class="btn" @click="setTdlibParameters">setTdlibParameters </button>
    <button class="btn" @click="loadChats">loadChats</button>
    <button class="btn" @click="getChats">getChats</button>
    <button class="btn" @click="getUsers">getUsers</button>
    <button class="btn" @click="getSupergroups">getSupergroups</button>
    <button class="btn" @click="getChatList">getChatList</button>

  </div>
  <div class="p-3">
    <p class="text-neutral">TDLib</p>
    <div class="text-sm">
      <p>version: {{ tdversion }}</p>
      <p>authState: {{ authState }}</p>
      <div class="card p-3">
        <p class="text-base font-bold">chatList:</p>
        <p v-for="chat in devchatList" :key="chat.id" class="ml-3">
          {{ chat.title }} - {{ chat.id }}

        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import TitleBar from '@/components/TitleBar.vue'

const authState = ref('');
const tdversion = ref('');
const devchatList = ref([]);

async function getOptionList() {
  const res = await window.electron.ipcRenderer.invoke('getOptionList');
  console.log(res);
}
window.electron.ipcRenderer.on('updateState', (_, state) => {
  console.log(state);
  authState.value = state._;
});
window.electron.ipcRenderer.on('updatechatList', (_, chatList) => {
  devchatList.value = chatList
  console.log(chatList);

})
onMounted(() => {
  window.electron.ipcRenderer.invoke('getauthState').then((res) => {
    console.log(res);
    authState.value = res._;
  });
  window.electron.ipcRenderer.invoke('getTdVersion').then((res) => {
    console.log(res);
    tdversion.value = res;
  });
});

async function getInit() {
  const res = await window.electron.ipcRenderer.invoke('setauth');
  console.log(res);
}

async function closetdlib() {
  const res = await window.electron.ipcRenderer.invoke('closetdlib');
  console.log(res);
}
async function starttdlib() {
  const res = await window.electron.ipcRenderer.invoke('starttdlib');
  console.log(res);
}
async function setAuthPhoneNumber() {
  const res = await window.electron.ipcRenderer.invoke('setAuthPhoneNumber', '88812345678901');
  console.log(res);
}
async function setTdlibParameters() {
  const res = await window.electron.ipcRenderer.invoke('setTdlibParameters');
  console.log(res);
}
async function loadChats() {
  const res = await window.electron.ipcRenderer.invoke('loadChats');
  console.log(res);
}
async function getChats() {
  const res = await window.electron.ipcRenderer.invoke('getChats');
  console.log(res);
}
async function getUsers() {
  const res = await window.electron.ipcRenderer.invoke('getUsers',);
  console.log(res);
}
async function getSupergroups() {
  const res = await window.electron.ipcRenderer.invoke('getSupergroups');
  console.log(res);
}
async function getChatList() {
  const res = await window.electron.ipcRenderer.invoke('getChatList');
  console.log(res);
}
</script>
<style scoped></style>
