<template>
  <div class="drag_bar drag">
    <div v-if="state === 'auth'" class="drag_icon no_drag" @click="redirectauthset">
      <SettingIcon />
    </div>
    <div class="drag_icon no_drag" @click="minimizeWindow">
      <RemoveIcon />
    </div>
    <div v-if="state != 'auth'" class="drag_icon no_drag" @click="maximizeWindow">
      <PasteIcon />
    </div>
    <div class="drag_icon_close no_drag" @click="closeWindow">
      <CloseIcon />
    </div>
  </div>
</template>

<script setup>
import { RemoveIcon, CloseIcon, PasteIcon, SettingIcon } from 'tdesign-icons-vue-next'
// import { windowControls } from '@/utils/TitleBarButton';
import { useRouter } from 'vue-router'
import { toRefs } from 'vue'

const props = defineProps({
  state: String
})

const { state } = toRefs(props)
const router = useRouter()

// const minimizeWindow = () => {
//   windowControls.minimize();
// };

// const maximizeWindow = () => {
//   windowControls.maximize();

// };

// const closeWindow = () => {
//   windowControls.close();
// };

function redirectauthset() {
  if (!router.currentRoute.value.path.startsWith('/auth/settings')) {
    router.push('/auth/settings')
  } else {
    router.push('/auth/signIn')
  }
}
</script>
<style scoped>
.drag_bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .drag_icon,
  .drag_icon_close {
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drag_icon:hover {
    background-color: var(--color-base-300);
    height: 100%;
  }

  .drag_icon_close:hover {
    background-color: var(--color-error);
    height: 100%;
    color: var(--color-error-content);
  }
}
</style>
