import { ipcMain } from 'electron'

const registeredHandlers = [
  'getOptionList',
  'getOption',
  'getauthState',
  'request-qr',
  'setauth',
  'getTdVersion',
  'setAuthPhoneNumber',
  'checkAuthCode',
  'checkAuthPassword',
  'tdlibClass',
  'getProxies',
  'addProxy',
  'removeProxy',
  'editProxy',
  'enableProxy',
  'disableProxy',
  'pingProxy',
  'testProxy',
  'getProxyLink'
]

export const cleanupTDLib = () => {
  // 移除所有注册的 IPC 处理程序
  registeredHandlers.forEach((handler) => {
    ipcMain.removeHandler(handler)
  })
}

/**
 * 初始化TDLib相关模块
 * @param {Object} options - 初始化选项
 */
export const initializeTDLib = async (client) => {
  try {
    // 先清理旧的处理程序
    cleanupTDLib()

    // 动态导入各个模块，并传递客户端给它们
    const [
      { initializeOption },
      { initializeAuthState },
      { initializeProxy },
      { initializeAuth },
      { updateChatList }
    ] = await Promise.all([
      import('./update/updateOption.js'),
      import('./update/updateauthstate.js'),
      import('./proxy/proxyset.js'),
      import('./Auth/Userauthorization.js'),
      import('./update/HandlingUpdates.js')
    ])

    // 调用每个模块的初始化函数，并传递 `client`
    await Promise.all([
      initializeOption(client),
      initializeAuthState(client),
      initializeProxy(client),
      initializeAuth(client),
      updateChatList(client)
    ])

    console.log('TDLib modules initialized successfully')
  } catch (error) {
    console.error('Failed to initialize TDLib modules:', error)
    throw error
  }
}
