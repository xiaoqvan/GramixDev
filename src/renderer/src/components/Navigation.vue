<template>
  <div class="navbar drag shadow-sm h-full flex items-center flex-col w-15 justify-between" @dragstart.prevent>
    <div class="flex flex-col justify-between gap-2">
      <h1 class="font-bold text-sm">Gramix</h1>
      <div class="flex items-center flex-col text-2xl gap-3">
        <t-dropdown class="no_drag photo">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img src="/@fs/F:\Pictures\67480c1218248c27bde73fb5.png" alt="">
          </div>
        </t-dropdown>
        <!-- chats/对话 -->

        <RouterLink to="/home/chats" active-class="active" class="no_drag no_Link key">
          <ChatBubbleIcon />
        </RouterLink>

        <!-- contacts/联系人 -->
        <RouterLink to="/home/contacts" active-class="active" class="no_Link no_drag key">
          <MemberIcon />
        </RouterLink>
        <!-- archives/已归档对话 -->
        <t-dropdown :options="archivesmenu" placement="right" trigger="context-menu">
          <RouterLink to="/home/archives" active-class="active" class="no_drag no_Link key">
            <el-icon>
              <TakeawayBox />
            </el-icon>
          </RouterLink>
        </t-dropdown>
      </div>
    </div>
    <div class="flex items-center flex-col text-2xl ">
      <div class="flex flex-col gap-3 mb-3">
        <!-- wallet/钱包 -->
        <!-- <div active-class="active" class="home_nav_Page_wallet no_drag">s
                      <WalletIcon />
                  </div> -->
        <!-- Saved Messages/收藏 -->
        <div to="home/saved-messages" active-class="active" class="home_nav_Page_collect no_drag key" @click="comg">
          <BookmarkIcon />
        </div>
        <!-- settings/设置 -->
        <RouterLink to="/home/setting" active-class="active" class="home_nav_Page_setting no_drag no_Link key">
          <SettingIcon />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ChatBubbleIcon, MemberIcon, SettingIcon, BookmarkIcon } from 'tdesign-icons-vue-next';
import { TakeawayBox } from '@element-plus/icons-vue'



const archivesmenu = [
  {
    content: '取消固定',
    value: 1,
  },
]



import { MessagePlugin } from 'tdesign-vue-next';

function comg() {
  MessagePlugin.error('没有开发');
}
</script>
<style scoped>
.key {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key:hover {
  background-color: var(--color-base-300);
  border-radius: var(--radius-field);
}

.active {
  background-color: var(--color-base-300);
  border-radius: var(--radius-field);

}

.navbar {
  user-select: none;
}
</style>
