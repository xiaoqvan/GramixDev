<template>
  <TitleBar state="auth" />
  <div>
    <RouterView />
  </div>
</template>
<script setup>
import TitleBar from '@/components/TitleBar.vue'
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

window.electron.ipcRenderer.on('updateState', (event, state) => {
  if (
    state._ === 'authorizationStateWaitPhoneNumber' ||
    state._ === 'authorizationStateWaitOtherDeviceConfirmation'
  ) {
    router.push('/auth/signIn');
  } else if (state._ === 'authorizationStateWaitCode') {
    router.push('/auth/code');
  } else if (state._ === 'authorizationStateWaitPassword') {
    router.push('/auth/password');
  } else if (state._ === 'authorizationStateReady') {
    router.push('/home');
  }
})
onMounted(() => {
  window.electron.ipcRenderer.invoke('getauthState').then((res) => {
    if (
      res._ === 'authorizationStateWaitPhoneNumber' ||
      res._ === 'authorizationStateWaitOtherDeviceConfirmation'
    ) {
      router.push('/auth/signIn');
    } else if (res._ === 'authorizationStateWaitCode') {
      router.push('/auth/code');
    } else if (res._ === 'authorizationStateWaitPassword') {
      router.push('/auth/password');
    } else if (res._ === 'authorizationStateReady') {
      router.push('/home');
    }

  });
});
</script>
<style scoped>
.dsx {
  grid-column: span 3 / span 3;
}
</style>
