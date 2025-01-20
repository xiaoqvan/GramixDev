import { DevWindow, mainWindow } from '../..'
import { ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'
import os from 'os'
const { app } = require('electron')

const appVersion = app.getVersion()
let auth_state = ''

export const initializeAuthState = async (client) => {
  ;(async () => {
    for await (const update of client.iterUpdates()) {
      console.log(update)
      if (update._ !== 'updateAuthorizationState') continue
      const authorizationState = update.authorization_state
      auth_state = authorizationState
      if (is.dev) {
        DevWindow.webContents.send('updateState', authorizationState)
      }
      mainWindow.webContents.send('updateState', authorizationState)
      switch (authorizationState._) {
        case 'authorizationStateClosed':
          break
      }
    }
  })()

  ipcMain.handle('getauthState', async () => {
    const authState = await client.invoke({
      _: 'getAuthorizationState'
    })
    return authState
  })

  ipcMain.handle('request-qr', async () => {
    try {
      if (auth_state._ === 'authorizationStateWaitPhoneNumber') {
        const authState = await client.invoke({
          _: 'requestQrCodeAuthentication'
        })
        return authState
      }
      if (auth_state._ === 'authorizationStateWaitOtherDeviceConfirmation') {
        return auth_state
      }
    } catch (e) {
      return e
    }
  })

  function getSystemVersion() {
    const platform = os.platform()
    const release = os.release()

    if (platform === 'win32') {
      return `Windows ${release}`
    } else if (platform === 'darwin') {
      return `macOS ${release}`
    } else if (platform === 'linux') {
      return `Linux ${release}`
    } else {
      return 'Unknown'
    }
  }
  ipcMain.handle('setTdlibParameters', async () => {
    await client.invoke({
      _: 'setTdlibParameters',
      api_id: Number(import.meta.env.VITE_TG_API_ID),
      api_hash: import.meta.env.VITE_TG_API_HASH,
      use_test_dc: true,
      device_model: `${os.type()} | ${os.hostname()}`,
      system_version: getSystemVersion(),
      application_version: appVersion,
      use_chat_info_database: true,
      use_message_database: true,
      use_secret_chats: false,
      database_directory: '_td_database',
      files_directory: '_td_files',
      use_file_database: true,
      use_storage_optimizer: true,
      system_language_code: 'en'
    })
    return
  })

  ipcMain.handle('getTdVersion', async () => {
    return client.getVersion()
  })
}
