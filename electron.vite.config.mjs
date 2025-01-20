import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    assetsInclude: ['**/*.tgs'],
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        resolvers: [
          TDesignResolver({
            library: 'vue-next'
          }),
          ElementPlusResolver()
        ]
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next'
          }),
          ElementPlusResolver()
        ]
      })
    ]
  }
})
