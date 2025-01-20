<template>
  <div class="flex h-screen pt-[25px]" @dragstart.prevent>
    <!-- 左侧导航栏 -->
    <div class="w-48 border-r border-gray-200">
      <nav class="p-4 space-y-1">
        <RouterLink v-for="(item, index) in menuItems" :key="index" :to="item.path"
          class="block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-neutral hover:text-neutral-content"
          active-class="bg-neutral text-neutral-content">
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>

    <!-- 右侧内容区域 -->
    <div class=" flex-1 overflow-y-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
const menuItems = [
  { path: '/auth/settings/general', name: '通用设置' },
  { path: '/auth/settings/proxy', name: '代理设置' },
  { path: '/auth/settings/language', name: '语言设置' }
]
</script>

<style scoped>
.overflow-y-auto {
  max-height: 100vh;
}

/* 移除了之前的 .active 类，因为现在使用了内联的条件类 */
</style>
