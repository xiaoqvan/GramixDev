import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

import '@/assets/css/main.css'
import '@/assets/themes/default.css'
import 'tdesign-vue-next/es/style/index.css'

import router from '@/router'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
