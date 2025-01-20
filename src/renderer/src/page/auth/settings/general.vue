<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-bold">通用设置</h2>
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <input type="checkbox" checked="checked" class="checkbox checkbox-info checkbox-sm" />
        <label for="autoStart">开机自启</label>
      </div>
      <div class="flex items-center space-x-4">
        <input type="checkbox" checked="checked" class="checkbox checkbox-info checkbox-sm" />
        <label for="notifications">启用通知</label>
      </div>
      <div class="divider"></div>
      <div>
        <label for="qrCodeErrorCorrectionLevel" class="block text-sm font-medium text-gray-700">二维码纠错等级</label>
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn m-1">L</div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a>L</a></li>
            <li><a>M</a></li>
            <li><a>Q</a></li>
            <li><a>H</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
