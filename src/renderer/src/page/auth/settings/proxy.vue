<template>
  <el-scrollbar class="overflow-auto">
    <div class="p-6">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold">代理设置</h1>
      </div>
      <form class="flex gap-2 items-center mt-2">
        <input v-model="proxyType" type="radio" name="proxy-type" value="disabled" class="radio radio-neutral radio-sm"
          @change="handleProxyChange(proxyType)" />
        <p>禁用代理</p>

        <input v-model="proxyType" type="radio" name="proxy-type" value="system" class="radio radio-neutral radio-sm"
          disabled />
        <p>使用系统代理设置</p>

        <input v-model="proxyType" type="radio" name="proxy-type" value="custom" class="radio radio-neutral radio-sm"
          @change="handleProxyChange(proxyType)" />
        <p>使用自定义代理</p>
      </form>
      <form class="filter mt-2">
        <input class="btn btn-square" type="reset" value="×" @click="resetProtocol" />
        <input v-model="proxyProtocol" aria-label="SOCKS5" :class="{ 'btn-error': protocolError }" class="btn"
          type="radio" name="proxy-protocol" value="proxyTypeSocks5" @change="handleProtocolChange(proxyProtocol)" />
        <input v-model="proxyProtocol" aria-label="HTTP" :class="{ 'btn-error': protocolError }" class="btn"
          type="radio" name="proxy-protocol" value="proxyTypeHttp" @change="handleProtocolChange(proxyProtocol)" />
        <input v-model="proxyProtocol" aria-label="MTProto" :class="{ 'btn-error': protocolError }" class="btn"
          type="radio" name="proxy-protocol" value="proxyTypeMtproto" @change="handleProtocolChange(proxyProtocol)" />
      </form>
      <div class="mt-2 flex flex-col gap-2">
        <div class="flex space-x-4">
          <label class="input input-sm" :class="{ 'input-error': hostError }">
            <p>主机名:</p>
            <input v-model="proxyHost" class="grow" />
          </label>

          <label class="input input-sm" :class="{ 'input-error': portError }">
            <p>端口:</p>
            <input v-model="proxyPort" type="number" class="grow" min="1" max="65535" />
          </label>
        </div>
        <p v-if="proxyProtocol !== 'proxyTypeMtproto'" class="text-sm text-slate-500">认证信息(可选)</p>
        <p v-else class="text-sm text-slate-500">认证信息</p>
        <div v-if="proxyProtocol !== 'proxyTypeMtproto'" class="flex space-x-4">
          <label class="input input-sm">
            <p>用户名:</p>
            <input v-model="proxyUsername" class="grow" />
          </label>

          <label class="input input-sm">
            <p>密码:</p>
            <input v-model="proxyPassword" class="grow" />
          </label>
        </div>
        <div v-else class="flex space-x-4">
          <label class="input input-sm w-full" :class="{ 'input-error': secretError }">
            <p>Secret:</p>
            <input v-model="proxySecret" class="grow" />
          </label>
        </div>
        <div class="flex items-center justify-between space-x-4 w-full">
          <p class="text-xs  text-slate-500 w-1/2">代理服务器可能有助于解决个别地区无法连接Telegram的情况。</p>
          <button class="btn btn-neutral btn-sm text-neutral-content" @click="saveProxy">保存</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex items-center">
        <div v-for="proxy in proxys" :key="proxy.id" class="card shadow-xl text-sm p-2 w-40 hover:shadow-2xl"
          @click="enableProxy(proxy.id)">
          <p><span>{{ proxy.server }}</span>:<span>{{ proxy.port }}</span></p>
          <p class="text-accent cursor-pointer hover:bg-base-300 w-auto" @click.stop="refreshPing(proxy)">
            {{ proxy.ping }}ms
          </p>
          <div class="flex items-center justify-between">
            <p class="text-slate-500">{{ proxy.type._.replace('proxyType', '') }}</p>
            <div>
              <CheckIcon v-if="proxy.is_enabled" size="large" class="text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CheckIcon } from 'tdesign-icons-vue-next'

const proxys = ref([])
const proxyHost = ref('')
const proxyPort = ref('')
const proxyUsername = ref('')
const proxyPassword = ref('')
const proxySecret = ref('')
const proxyProtocol = ref('')
const proxyType = ref('disabled')
const hostError = ref(false)
const portError = ref(false)
const protocolError = ref(false)
const secretError = ref(false)
// 监听数据变化
const handleProxyChange = (val) => {
  if (val === 'disabled') {
    const enabledProxy = proxys.value.find(p => p.is_enabled)
    if (enabledProxy) {
      disableProxy(enabledProxy.id)
    }
  }
}

const handleProtocolChange = (val) => {
  console.log('当前选择的协议:', val)
}

const resetProtocol = () => {
  proxyProtocol.value = ''
}

function saveProxy() {
  // 重置错误状态
  hostError.value = false
  portError.value = false
  protocolError.value = false
  secretError.value = false
  let hasError = false

  // 验证服务器地址
  if (!proxyHost.value.trim()) {
    hostError.value = true
    hasError = true
  }

  // 验证端口
  if (!proxyPort.value || proxyPort.value < 1 || proxyPort.value > 65535) {
    portError.value = true
    hasError = true
  }

  // 验证协议类型
  if (!proxyProtocol.value) {
    protocolError.value = true
    hasError = true
  }

  // 验证MTProto密钥
  if (proxyProtocol.value === 'proxyTypeMtproto' && !proxySecret.value.trim()) {
    secretError.value = true
    hasError = true
  }

  // 如果有错误则返回
  if (hasError) return

  const proxy = {
    server: proxyHost.value,
    port: proxyPort.value,
    enable: false,
    type: proxyProtocol.value,
    username: proxyUsername.value,
    password: proxyPassword.value,
    secret: proxySecret.value,
  }

  window.electron.ipcRenderer.invoke('addProxy', proxy).then((res) => {
    proxys.value.push(res)
  })
}

const refreshPing = async (proxy) => {
  const pingResult = await window.electron.ipcRenderer.invoke('pingProxy', proxy.id)
  proxy.ping = Math.floor(pingResult.seconds * 1000)
}

const enableProxy = async (proxyId) => {
  await window.electron.ipcRenderer.invoke('enableProxy', proxyId)
  const proxy = proxys.value.find(p => p.id === proxyId)
  if (proxy) {
    proxy.is_enabled = true
    proxyType.value = 'custom'
  }
}

const disableProxy = async (proxyId) => {
  await window.electron.ipcRenderer.invoke('disableProxy', proxyId)
  const proxy = proxys.value.find(p => p.id === proxyId)
  if (proxy) {
    proxy.is_enabled = false
  }
}

onMounted(() => {
  window.electron.ipcRenderer.invoke('getProxies').then(async (res) => {
    if (res.proxies === []) {
      proxyType.value = 'disabled'
    } else {
      for (const proxy of res.proxies) {
        const pingResult = await window.electron.ipcRenderer.invoke('pingProxy', proxy.id)
        proxy.ping = Math.floor(pingResult.seconds * 1000);
        if (proxy.is_enabled) {
          proxyType.value = 'custom'
        }
      }
      proxys.value = res.proxies
    }
  })
})

</script>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.card:hover {
  transform: translateY(-1px) scale(1.01);
  transition: transform 0.3s ease;
}
</style>
