<template>
  <div class="truncate">
    <!-- 常规消息 -->
    <!-- 纯文本消息 -->
    <div v-if="lastMessage.content._ === 'messageText'">
      <p> {{ lastMessage.content.text.text }}</p>
    </div>
    <!-- 图片消息 -->
    <div v-else-if="lastMessage.content._ === 'messagePhoto'">
      <p class="flex gap-1.5"><img class="w-[20px] h-[20px] object-cover rounded-[6px] shadow-sm"
          :src="'data:image/jpeg;base64,' + lastMessage.content.photo.minithumbnail.data">
        <span v-if="!lastMessage.content.caption.text" class="text-neutral">图片</span>
        <span>{{ lastMessage.content.caption.text }}</span>
      </p>
    </div>
    <!-- 动态图消息 -->
    <div v-else-if="lastMessage.content._ === 'messageAnimation'">
      <p class="flex gap-1.5"><img class="w-[20px] h-[20px] object-cover rounded-[6px] shadow-sm"
          :src="'data:image/jpeg;base64,' + lastMessage.content.animation.minithumbnail.data">
        <span class="text-neutral">GIF 动态图</span>
      </p>
    </div>
    <!-- 表情消息 -->
    <div v-else-if="lastMessage.content._ === 'messageAnimatedEmoji'">
      <p>{{ lastMessage.content.emoji }}</p>
    </div>
    <!-- 贴纸消息 -->
    <div v-else-if="lastMessage.content._ === 'messageSticker'">
      <p>
        <span>{{ lastMessage.content.sticker.emoji }}</span>
        <span class="text-neutral">贴纸</span>
      </p>
    </div>
    <!-- 视频便签消息 -->
    <div v-else-if="lastMessage.content._ === 'messageVideoNote'">
      <p class="flex gap-1.5"><img class="w-[20px] h-[20px] object-cover rounded-[6px] shadow-sm"
          :src="'data:image/jpeg;base64,' + lastMessage.content.video_note.minithumbnail.data">
        <span class="text-neutral">视频消息</span>
      </p>
    </div>
    <!-- 音频消息 -->
    <div v-else-if="lastMessage.content._ === 'messageAudio'" class="flex gap-1.5 items-center">
      <FileMusicIcon />
      <p class="text-neutral">
        {{ lastMessage.content.audio.performer + '' + lastMessage.content.audio.title }}
      </p>
    </div>
    <div v-else-if="lastMessage.content._ === 'messageDocument'">
      <p class="text-neutral">
        {{ lastMessage.content.document.file_name }}
      </p>
    </div>

    <div v-else-if="lastMessage.content._ === 'messageVideo'">
      <p class="flex gap-1.5"><img class="w-[20px] h-[20px] object-cover rounded-[6px] shadow-sm"
          :src="'data:image/jpeg;base64,' + lastMessage.content.video.minithumbnail.data">
        <span v-if="!lastMessage.content.caption.text" class="text-neutral">视频消息</span>
        <span v-else>{{ lastMessage.content.caption.text }}</span>
      </p>
    </div>
    <div v-else-if="lastMessage.content._ === 'messageVoiceNote'">
      <span class="text-neutral">语音消息</span>
    </div>
    <!-- 系统消息 -->
    <div v-else-if="lastMessage.content._ === 'messageSupergroupChatCreate'">
      <p class="text-neutral">超级群组已创建</p>
    </div>
    <div v-else-if="lastMessage.content._ === 'messageGiveawayWinners'">
      <p class="text-neutral">抽奖活动结束</p>
    </div>
    <div v-else-if="lastMessage.content._ === 'messageWebAppDataSent'">
      <p class="text-neutral">你已经成功将数据从{{ lastMessage.content.button_text }}按钮传递到机器人</p>
    </div>
    <div v-else-if="lastMessage.content._ === 'messageBasicGroupChatCreate'">
      <p class="text-neutral">{username}创建了(BasicGroup)群组</p>
    </div>
    <!-- 其他 -->
    <div v-else>
      <p class="text-error">未适配消息类型</p>
    </div>
  </div>
</template>
<script setup>
import { toRefs } from 'vue'
import { FileMusicIcon } from 'tdesign-icons-vue-next'


const props = defineProps({
  lastMessage: Object,
})

const { lastMessage } = toRefs(props)
</script>
<style scoped>
.truncate {
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}
</style>
