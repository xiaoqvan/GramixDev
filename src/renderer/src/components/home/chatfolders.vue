<template>
  <div class="relative w-full px-1.5 selection:">
    <div ref="scrollContainer" role="tablist"
      class="tabs tabs-border flex w-full flex-nowrap overflow-x-auto scroll-smooth" @wheel="handleWheel">
      <a v-for="(tab, index) in tabs" :key="index" role="tab" class="tab whitespace-nowrap"
        :class="{ 'tab-active': activeTabIndex === index }" @click="setActiveTab(index)">
        {{ tab }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  tabs: Object,
})

const { tabs } = toRefs(props)

const scrollContainer = ref(null)
const momentum = ref(0)
const lastDelta = ref(0)
const isScrolling = ref(false)

const activeTabIndex = ref(0)

const setActiveTab = (index) => {
  activeTabIndex.value = index
}

const handleWheel = (event) => {
  event.preventDefault()
  if (!scrollContainer.value) return

  // 基础滚动速度
  const baseSpeed = 1.2

  // 计算动量
  const currentDelta = event.deltaY
  const acceleration = Math.sign(currentDelta) === Math.sign(lastDelta.value) ? 1.2 : 0.8

  // 更新动量
  momentum.value = currentDelta * baseSpeed * acceleration
  lastDelta.value = currentDelta

  // 应用滚动
  scrollContainer.value.scrollBy({
    left: momentum.value,
    behavior: 'smooth'
  })

  // 重置滚动状态
  if (!isScrolling.value) {
    isScrolling.value = true
    setTimeout(() => {
      isScrolling.value = false
      momentum.value = 0
    }, 150) // 滚动停止后重置动量
  }
}
</script>

<style scoped>
/* 添加过渡效果 */
.scroll-smooth {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

@keyframes decelerate {
  from {
    scroll-behavior: smooth;
  }

  to {
    scroll-behavior: auto;
  }
}

/* 隐藏滚动条 */
.scroll-smooth::-webkit-scrollbar {
  display: none;
}

.scroll-smooth {
  scrollbar-width: none;
}
</style>
