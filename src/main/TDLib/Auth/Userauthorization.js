import { ipcMain } from 'electron'

export const initializeAuth = async (client) => {
  ipcMain.handle('setAuthPhoneNumber', async (_, PhoneNumber) => {
    try {
      const authState = await client.invoke({
        _: 'getAuthorizationState'
      })
      if (authState._ === 'authorizationStateWaitOtherDeviceConfirmation') {
        return 'qrstate'
      } else {
        const res = await client.invoke({
          _: 'setAuthenticationPhoneNumber',
          phone_number: PhoneNumber
        })
        return res
      }
    } catch (e) {
      return e.message
    }
  })

  ipcMain.handle('checkAuthCode', async (_, Code) => {
    try {
      const res = await client.invoke({
        _: 'checkAuthenticationCode',
        code: Code
      })
      return res
    } catch (e) {
      return e.message
    }
  })
  ipcMain.handle('checkAuthPassword', async (_, Password) => {
    try {
      const res = await client.invoke({
        _: 'checkAuthenticationPassword',
        password: Password
      })
      return res
    } catch (e) {
      return e.message
    }
  })
  ipcMain.handle('loadChats', async () => {
    try {
      const res = await client.invoke({
        _: 'loadChats',
        chat_list: {
          _: 'chatListMain'
        },
        limit: 99
      })
      return res
    } catch (e) {
      return e.message
    }
  })
}
