<template>
  <div class="SessionList h-dvh flex flex-col" @dragstart.prevent>
    <div class="pt-2 px-2">
      <search />
    </div>
    <el-scrollbar class="h-full flex flex-col overflow-auto px-2">
      <div v-for="n in 3" :key="n">
        <chat :loading="loading" />
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>
<style scoped></style>
