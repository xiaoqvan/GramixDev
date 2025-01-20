import { app } from 'electron'
import path from 'path'

let DataStore = null
let userStore = null
let chatStore = null
let supergroupStore = null
let chatListStore = null // 新增
let basicGroupStore = null // 新增

export async function initializeStore() {
  const Store = (await import('electron-store')).default
  const userDataPath = app.getPath('userData')

  userStore = new Store({
    name: 'users',
    cwd: path.join(userDataPath, 'stores'),
    defaults: {
      users: []
    }
  })

  chatStore = new Store({
    name: 'chats',
    cwd: path.join(userDataPath, 'stores'),
    defaults: {
      chats: []
    }
  })

  supergroupStore = new Store({
    name: 'supergroups',
    cwd: path.join(userDataPath, 'stores'),
    defaults: {
      supergroups: []
    }
  })

  chatListStore = new Store({
    name: 'chatList',
    cwd: path.join(userDataPath, 'stores'),
    defaults: {
      chatList: []
    }
  })

  basicGroupStore = new Store({
    name: 'basicGroups',
    cwd: path.join(userDataPath, 'stores'),
    defaults: {
      basicGroups: []
    }
  })

  DataStore = {
    users: {
      get: () => userStore.get('users'),
      set: (users) => userStore.set('users', users),
      update: (user) => {
        const users = userStore.get('users')
        const index = users.findIndex((u) => u.id === user.id)
        if (index !== -1) {
          users[index] = user
        } else {
          users.push(user)
        }
        userStore.set('users', users)
      },
      clear: () => userStore.clear()
    },
    chats: {
      get: () => chatStore.get('chats'),
      set: (chats) => chatStore.set('chats', chats),
      update: (chat) => {
        const chats = chatStore.get('chats')
        const index = chats.findIndex((c) => c.id === chat.id)
        if (index !== -1) {
          chats[index] = chat
        } else {
          chats.push(chat)
        }
        chatStore.set('chats', chats)
      },
      clear: () => chatStore.clear()
    },
    supergroups: {
      get: () => supergroupStore.get('supergroups'),
      set: (supergroups) => supergroupStore.set('supergroups', supergroups),
      update: (supergroup) => {
        const supergroups = supergroupStore.get('supergroups')
        const index = supergroups.findIndex((s) => s.id === supergroup.id)
        if (index !== -1) {
          supergroups[index] = supergroup
        } else {
          supergroups.push(supergroup)
        }
        supergroupStore.set('supergroups', supergroups)
      },
      clear: () => supergroupStore.clear()
    },
    chatList: {
      get: () => chatListStore.get('chatList'),
      set: (list) => chatListStore.set('chatList', list),
      update: (chatId, chatList, data = {}) => {
        const list = chatListStore.get('chatList')
        const index = list.findIndex((item) => item.id === chatId)

        if (index !== -1) {
          // 更新现有项
          list[index] = {
            ...list[index],
            ...data,
            id: chatId,
            chat_list: chatList
          }
        } else {
          // 添加新项
          list.push({
            id: chatId,
            chat_list: chatList,
            ...data
          })
        }

        chatListStore.set('chatList', list)
      },
      updateLastMessage: (chatId, lastMessage) => {
        const list = chatListStore.get('chatList')
        const index = list.findIndex((item) => item.id === chatId)
        if (index !== -1) {
          list[index].last_message = lastMessage
          chatListStore.set('chatList', list)
        }
      },
      updatePosition: (chatId, position) => {
        const list = chatListStore.get('chatList')
        const index = list.findIndex((item) => item.id === chatId)
        if (index !== -1) {
          list[index].position = position
          chatListStore.set('chatList', list)
        }
      },
      clear: () => chatListStore.clear()
    },
    basicGroups: {
      get: () => basicGroupStore.get('basicGroups'),
      set: (basicGroups) => basicGroupStore.set('basicGroups', basicGroups),
      update: (basicGroup) => {
        const basicGroups = basicGroupStore.get('basicGroups')
        const index = basicGroups.findIndex((g) => g.id === basicGroup.id)
        if (index !== -1) {
          basicGroups[index] = basicGroup
        } else {
          basicGroups.push(basicGroup)
        }
        basicGroupStore.set('basicGroups', basicGroups)
      },
      clear: () => basicGroupStore.clear()
    }
  }

  return DataStore
}

export { DataStore }
