<template>

  <div class="h-screen w-full flex items-center justify-center">
    <div class="container mx-auto px-6 max-w-md flex flex-col items-center">
      <div ref="passwordtips" class="tgs-container ">
      </div>
      <h1 class="text-2xl font-semibold mb-4">两步验证</h1>
      <p class="text-gray-500 mb-8 leading-relaxed">
        请输入两步验证密码
      </p>

      <div class="form-control mb-8 w-full">
        <fieldset class="fieldset w-full">
          <input v-model="password" type="password" class="input input-neutral w-full" />
          <p class="fieldset-label text-sm">提示：{password_hint}</p>
        </fieldset>
      </div>
      <p class="text-sm text-error">{{ passworderror }}</p>
      <button class="btn w-full btn-neutral text-neutral-content" @click="submit">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import animationPath from '@/assets/icon/tgs/pawmonkey.tgs'
import lottie from 'lottie-web'


const passwordtips = ref(null)
const password_hint = ref('')
const password = ref('')
const passworderror = ref('')

const loadTgsAnimation = async () => {
  try {
    // 使用fetch加载TGS文件
    const response = await fetch(animationPath);
    const animationData = await response.json();

    // 渲染动画
    if (passwordtips.value) {
      lottie.loadAnimation({
        container: passwordtips.value,
        renderer: 'svg',
        loop: false, // 设置为false使动画只运行一次
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: false,
          hideOnTransparent: true
        }
      })
    }
  } catch (error) {
    console.error('Failed to load TGS animation:', error)
  }
}

onMounted(() => {
  loadTgsAnimation()
  window.electron.ipcRenderer.invoke('getauthState').then((res) => {
    if (res._ === 'authorizationStateWaitPassword') {
      password_hint.value = res.password_hint
    }
  });
})
const submit = () => {
  window.electron.ipcRenderer.invoke('checkAuthPassword', password.value).then((res) => {
    if (res === 'PASSWORD_HASH_INVALID') {
      passworderror.value = '无效密码。'
    } else if (res === 'PHONE_PASSWORD_FLOOD') {
      passworderror.value = '短时间内尝试输入密码次数过多。'
    } else if (res === 'FLOOD') {
      passworderror.value = '请求频率过高。'
    } else {
      passworderror.value = ''
      // Handle successful password check
    }
  }).catch((error) => {
    console.error('Error checking password:', error)
    passworderror.value = '发生错误，请稍后再试。'
  })
}
</script>
<style scoped>
.tgs-container {
  width: 100px;
  height: 100px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  overflow: hidden;
  margin: 0 auto;
  /* 添加水平居中 */
}
</style>
