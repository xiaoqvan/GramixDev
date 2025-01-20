import { ipcMain } from 'electron'
import { DataStore } from '../store'
import { DevWindow, mainWindow } from '../..'
import { is } from '@electron-toolkit/utils'

export const updateChatList = async (client) => {
  if (!DataStore) {
    console.error('DataStore not initialized')
    return
  }

  const sendUpdateToRenderer = () => {
    const chatList = DataStore.chatList.get()
    if (is.dev) {
      DevWindow.webContents.send('updatechatList', chatList)
    }
    mainWindow.webContents.send('updatechatList', chatList)
  }

  // 辅助函数：从chat_id提取supergroup_id
  const extractSupergroupId = (chatId) => {
    const strId = String(chatId)
    if (strId.startsWith('-100')) {
      return parseInt(strId.slice(4)) // 移除 '-100' 前缀
    }
    return null
  }

  // 创建或更新聊天信息的辅助函数
  const updateChatInfo = (chatId) => {
    const chat = DataStore.chats.get().find((c) => c.id === chatId)
    if (!chat) return null

    const chatInfo = {
      ...chat,
      id: chatId
    }

    // 添加超级群组信息
    const supergroupId = extractSupergroupId(chatId)
    if (supergroupId) {
      const supergroup = DataStore.supergroups.get().find((sg) => sg.id === supergroupId)
      if (supergroup) {
        chatInfo.supergroup = supergroup
      }
    }

    // 添加基本群组信息
    if (chat.type?._ === 'chatTypeBasicGroup') {
      const basicGroup = DataStore.basicGroups
        .get()
        .find((bg) => bg.id === chat.type.basic_group_id)
      if (basicGroup) {
        chatInfo.basicGroup = basicGroup
      }
    }

    // 添加用户信息
    if (chat.type?._ === 'chatTypePrivate') {
      const user = DataStore.users.get().find((u) => u.id === chat.type.user_id)
      if (user) {
        chatInfo.user = user
      }
    }

    return chatInfo
  }

  ;(async () => {
    for await (const update of client.iterUpdates()) {
      switch (update._) {
        case 'updateNewChat': {
          DataStore.chats.update(update.chat)
          break
        }
        case 'updateUser': {
          DataStore.users.update(update.user)
          break
        }
        case 'updateSupergroup': {
          DataStore.supergroups.update(update.supergroup)
          break
        }
        case 'updateBasicGroup': {
          DataStore.basicGroups.update(update.basic_group)
          break
        }
        case 'updateChatAddedToList': {
          const chatInfo = updateChatInfo(update.chat_id)
          if (chatInfo) {
            DataStore.chatList.update(update.chat_id, update.chat_list, chatInfo)
            sendUpdateToRenderer()
          }
          break
        }
        case 'updateChatLastMessage': {
          // 如果聊天不在列表中，先尝试创建
          const existingChat = DataStore.chatList.get().find((item) => item.id === update.chat_id)

          if (!existingChat) {
            const chatInfo = updateChatInfo(update.chat_id)
            if (chatInfo) {
              DataStore.chatList.update(update.chat_id, { _: 'chatListMain' }, chatInfo)
            }
          }

          DataStore.chatList.updateLastMessage(update.chat_id, update.last_message)
          // 同时更新 positions
          if (update.positions && update.positions.length > 0) {
            for (const position of update.positions) {
              DataStore.chatList.updatePosition(update.chat_id, position)
            }
          }
          sendUpdateToRenderer()
          break
        }
        case 'updateChatPosition': {
          // 如果聊天不在列表中，先尝试创建
          const existingChat = DataStore.chatList.get().find((item) => item.id === update.chat_id)

          if (!existingChat) {
            const chatInfo = updateChatInfo(update.chat_id)
            if (chatInfo) {
              DataStore.chatList.update(update.chat_id, { _: 'chatListMain' }, chatInfo)
            }
          }

          DataStore.chatList.updatePosition(update.chat_id, update.position)
          sendUpdateToRenderer()
          break
        }
        case 'updateChatReadInbox': {
          const existingChat = DataStore.chatList.get().find((item) => item.id === update.chat_id)
          if (existingChat) {
            // 更新未读消息数量和最后读取的消息ID
            DataStore.chatList.updateReadInbox(
              update.chat_id,
              update.last_read_inbox_message_id,
              update.unread_count
            )
            sendUpdateToRenderer()
          }
          break
        }
      }
    }
  })()

  // IPC处理程序
  ipcMain.handle('getUsers', () => DataStore.users.get())
  ipcMain.handle('getSupergroups', () => DataStore.supergroups.get())
  ipcMain.handle('getChats', () => DataStore.chats.get())
  ipcMain.handle('getChatList', () => DataStore.chatList.get())
  ipcMain.handle('getchat', async (_, chatId) => {
    const chat = await client.invoke({
      _: 'getChat',
      chat_id: chatId
    })
    return chat
  })
  ipcMain.handle('getuser', async (_, user_id) => {
    const chat = await client.invoke({
      _: 'getUser',
      user_id: user_id
    })
    return chat
  })
}
