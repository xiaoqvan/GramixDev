<template>

  <div class="h-screen w-full flex items-center justify-center">
    <div class="container mx-auto px-6 max-w-md flex flex-col items-center">
      <div ref="codetips" class="tgs-container ">
      </div>
      <h1 class="text-2xl font-semibold mb-4">Enter code</h1>
      <p class="text-sm">+{{ phone_number }}</p>
      <p class="text-gray-500 mb-8 leading-relaxed">
        请输入在前一个 **Telegram** app上刚刚收到的验证码。
      </p>
      <div class="form-control mb-8">
        <div class="flex gap-2 justify-center">
          <input v-for="(_, index) in 5" ref="inputs" :key="index" v-model="codeDigits[index]" type="text" maxlength="1"
            class="input input-neutral input-bordered w-12 h-12 text-center text-xl" @input="handleInput(index)"
            @keydown="handleKeydown($event, index)" />
        </div>
      </div>
      <p class="text-sm text-error">{{ codeerror }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import animationPath from '@/assets/icon/tgs/DuckTelegame.tgs'
import lottie from 'lottie-web'

const codeDigits = ref(['', '', '', '', ''])
const inputs = ref([])
const codetips = ref(null)
const phone_number = ref('')
const codeerror = ref('')

const code = computed(() => codeDigits.value.join(''))

const handleInput = (index) => {
  if (codeDigits.value[index] && index < 4) {
    inputs.value[index + 1].focus()
  }
}

const handleKeydown = (event, index) => {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    codeDigits.value[index - 1] = ''
    inputs.value[index - 1].focus()
  }
}

const loadTgsAnimation = async () => {
  try {
    // 使用fetch加载TGS文件
    const response = await fetch(animationPath);
    const animationData = await response.json();

    // 渲染动画
    if (codetips.value) {
      lottie.loadAnimation({
        container: codetips.value,
        renderer: 'svg',
        loop: true,
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
  inputs.value[0].focus()
  loadTgsAnimation()
  window.electron.ipcRenderer.invoke('getauthState').then((res) => {
    if (res._ === 'authorizationStateWaitCode') {
      phone_number.value = res.code_info.phone_number
    }
  });
})

// 添加watch监听code的变化
watch(code, (newValue) => {
  if (newValue.length === 5) {
    window.electron.ipcRenderer.invoke('checkAuthCode', newValue).then((res) => {
      if (res === 'PHONE_CODE_EMPTY') {
        console.log('提供的验证码为空。');
        codeerror.value = '提供的验证码为空。';
      } else if (res === 'PHONE_CODE_EXPIRED') {
        console.log('验证码已过期。');
        codeerror.value = '验证码已过期。';
      } else if (res === 'PHONE_CODE_INVALID') {
        console.log('验证码无效。');
        codeerror.value = '验证码无效。';
      }
    });
  }
})
</script>
<style scoped>
.tgs-container {
  width: 120px;
  height: 120px;
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
