<template>
  <div class="p-2">
    <label class="input input-ghost input-xs">
      <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input v-model="search" type="search" class="grow" placeholder="Search" />
      <t-dropdown trigger="click">
        <button class="btn btn-ghost btn-xs">
          <AddIcon />
        </button>
        <t-dropdown-menu>
          <t-dropdown-item class=" flex gap-1" :value="1">
            <MemberIcon />
            <p>新键群组</p>
          </t-dropdown-item>
          <t-dropdown-item :value="2">
            <AddIcon />新键频道
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </label>
  </div>
</template>
<script setup>
import { AddIcon, MemberIcon } from 'tdesign-icons-vue-next';
import { ref } from 'vue';

const search = ref('')
</script>

<style scoped></style>
