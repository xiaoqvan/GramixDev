<template>
  <div class="min-h-screen flex items-center justify-center select-none">
    <div class="rounded-lg p-2 w-full max-w-4xl">
      <div class="flex">
        <!-- 左侧手机号码输入区域 - 60% -->
        <div class="w-[55%] space-y-6 px-10 flex flex-col items-center gap-1">
          <h2 class="text-2xl font-bold mt-[10px]">你的手机号码</h2>
          <p class="text-gray-500 text-center">请确认您的国际电话区号
            并输入您的手机号码。</p>
          <div class="space-y-4 w-full">
            <div class="space-y-2">
              <div class="relative">
                <fieldset class="fieldset">
                  <label class="input w-full" :class="{ 'input-error': hasError }">
                    <p>+</p>
                    <input v-model="phoneNumber" type="tel" class="tabular-nums" required placeholder="Phone"
                      pattern="[0-9]*" />
                  </label>
                  <p class="fieldset-label" :class="{ 'text-error': hasError }">
                    {{ errorMessage }}
                  </p>
                </fieldset>
              </div>
            </div>
            <button class="w-full btn btn-neutral py-2 px-4 text-neutral-content" :disabled="isLoading"
              @click="handleLogin">
              <span v-if="isLoading" class="loading loading-spinner"></span>
              登录
            </button>
          </div>
        </div>

        <!-- 右侧二维码显示区域 - 40% -->
        <div class="w-[45%] flex flex-col items-center justify-center border-l pl-2">
          <div v-loading="qrloading" :Lelement-loading-text="qrtip" class="bg-gray-100 p-2 rounded-lg relative">
            <div ref="qrCodeRef" class="w-48 h-48 bg-white flex items-center justify-center"></div>
            <div ref="qrLogo"
              class="tgs-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <h1 class="text-base font-bold text-gray-800 m-0">从手机客户端扫描</h1>
          <ol class="text-sm space-y-2 w-full list-decimal pl-8">
            <li>
              <span>在您的手机上打开 Telegram</span>
            </li>
            <li>
              <span>请转到“设置” > “设备” > “关联桌面设备”</span>
            </li>
            <li>
              <span>请使用扫描二维码以登陆</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import animationPath from '@/assets/icon/tgs/QRtelegramlogo.tgs'
import lottie from 'lottie-web'

const phoneNumber = ref('')
const qrCodeRef = ref(null)
const qrLogo = ref(null)
const qrCodeUrl = ref('')

const qrloading = ref(true)

const hasError = ref(false)
const errorMessage = ref('')
const qrtip = ref('Loading...')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!phoneNumber.value) {
    hasError.value = true
    errorMessage.value = '请输入手机号码'
    return
  }

  if (!/^\d+$/.test(phoneNumber.value)) {
    hasError.value = true
    errorMessage.value = '请输入有效的手机号码'
    return
  }

  hasError.value = false
  errorMessage.value = ''
  isLoading.value = true
  try {
    const res = await window.electron.ipcRenderer.invoke('setAuthPhoneNumber', phoneNumber.value)
    console.log(res)
    if (res === 'qrstate') {
      window.electron.ipcRenderer.invoke('closetdlib')
    }
    if (res === 'PHONE_MIGRATE') {
      hasError.value = true
      errorMessage.value = '当前电话号码需要迁移到另一个数据中心。'
    } else if (res === 'PHONE_NUMBER_INVALID') {
      hasError.value = true
      errorMessage.value = '提供的电话号码无效。'
    } else if (res === 'PHONE_NUMBER_OCCUPIED') {
      hasError.value = true
      errorMessage.value = '电话号码已经被另一个用户占用。'
    } else if (res === 'PHONE_NUMBER_UNOCCUPIED') {
      hasError.value = true
      errorMessage.value = '电话号码未注册。'
    } else if (res === 'PHONE_NUMBER_FLOOD') {
      hasError.value = true
      errorMessage.value = '短时间内请求验证码次数过多，触发了限制。'
    } else if (res === 'PHONE_NUMBER_BANNED') {
      hasError.value = true
      errorMessage.value = '电话号码被封禁，无法使用。'
    }

  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 创建QR码实例
const qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  type: 'svg',
  data: qrCodeUrl.value,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'M' // 提高容错率以支持 logo
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.5,
    margin: 0,
    crossOrigin: 'anonymous'
  },
  dotsOptions: {
    color: '#000000',
    type: "extra-rounded",
  },
  backgroundOptions: {
    color: '#ffffff'
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#000000"
  },
  cornersDotOptions: {
    color: '#000000',
  },
})

// 封装渲染二维码的函数
const renderQrCode = () => {
  if (qrCodeRef.value) {
    qrCodeRef.value.innerHTML = '' // 清除旧的二维码
    qrCode.append(qrCodeRef.value)
  }
}

// 修改 TGS 动画处理函数
const loadTgsAnimation = async () => {
  try {
    // 使用fetch加载TGS文件
    const response = await fetch(animationPath);
    const animationData = await response.json();

    // 渲染动画
    if (qrLogo.value) {
      lottie.loadAnimation({
        container: qrLogo.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: false,
          hideOnTransparent: true,
        }
      })
    }
  } catch (error) {
    console.error('Failed to load TGS animation:', error)
  }
}

onMounted(() => {
  renderQrCode()
  loadTgsAnimation() // 添加动画加载调用
  window.electron.ipcRenderer.invoke('request-qr').then((res) => {
    if (res) {
      qrCodeUrl.value = res.link
      qrloading.value = false
    }
  })
})

// 修改watch部分
watch([qrCodeRef, qrCodeUrl], () => {
  if (qrCodeUrl.value) {
    qrCode.update({
      data: qrCodeUrl.value
    })
    renderQrCode()
  }
})

window.electron.ipcRenderer.on('updateState', (event, state) => {
  if (state._ === 'authorizationStateWaitOtherDeviceConfirmation') {
    qrloading.value = false
    qrCodeUrl.value = state.link
    qrCode.update({
      data: state.link
    })
    renderQrCode()
  };
  if (state._ === 'authorizationStateWaitPhoneNumber' && phoneNumber.value !== '') {
    window.electron.ipcRenderer.invoke('setAuthPhoneNumber', phoneNumber.value)
  }
  if (state._ === 'authorizationStateClosed') {
    window.electron.ipcRenderer.invoke('starttdlib')
  }
})
</script>

<style scoped>
select {
  background-position: right 0.5rem center;
  padding: 0.5rem;
}

input[type="tel"] {
  padding: 0.5rem 0.75rem;
}

.tgs-container {
  width: 40px;
  /* 稍微增加尺寸 */
  height: 40px;
  z-index: 10;
  background: #3390ec;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* 添加平滑过渡效果 */
  transition: transform 0.3s ease;
}

/* 确保SVG动画填充整个容器 */
.tgs-container svg {
  width: 100%;
  height: 100%;
}


.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
