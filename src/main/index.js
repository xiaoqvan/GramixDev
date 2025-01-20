import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { start, configureTDLib } from './TDLib/client.js'
import { initializeTDLib, cleanupTDLib } from './TDLib/index.js'

const auth_width = 700
const auth_height = 450
const auth_minwidth = 600
const auth_minheight = 450
const home_width = 980
const home_height = 620
const home_minwidth = 700
const home_minheight = 500

let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: auth_width,
    height: auth_height,
    minWidth: auth_minwidth,
    minHeight: auth_minheight,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    maximizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
export { mainWindow }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const { initializeStore } = await import('./TDLib/store/index.js')
  const DataStore = await initializeStore()

  // TDLib
  let client
  DataStore.users.clear()
  DataStore.chats.clear()
  DataStore.supergroups.clear()
  DataStore.chatList.clear() // 新增
  configureTDLib()
  client = start()
  initializeTDLib(client)
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('closetdlib', async () => {
    if (client) {
      await client.invoke({
        _: 'logOut'
      })
      cleanupTDLib()
      // 清理存储的数据
      DataStore.users.clear()
      DataStore.chats.clear()
      DataStore.supergroups.clear()
      DataStore.chatList.clear() // 新增
      await client.close()
      client = null
    }
  })

  ipcMain.handle('starttdlib', async () => {
    if (client) {
      cleanupTDLib() // 清理旧的监听器
      client = null
    }
    client = start()
    await initializeTDLib(client)
  })

  if (is.dev) {
    createDevWin()
  }
  createWindow()
  ipcMain.on('chatwindow', (_, chatwindow) => {
    mainWindow.setResizable(true)
    if (chatwindow) {
      mainWindow.setSize(home_width, home_height)
      mainWindow.setMinimumSize(home_minwidth, home_minheight)
      mainWindow.center()
      mainWindow.setResizable(true)
      mainWindow.webContents.send('chatwindow', chatwindow)
    } else {
      mainWindow.setMinimumSize(auth_minwidth, auth_minheight)
      mainWindow.setSize(auth_width, auth_height)
      mainWindow.center()
      mainWindow.webContents.send('chatwindow', chatwindow)
      mainWindow.setResizable(false)
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

/**
 * @type {Electron.BrowserWindow}
 * @description 用于调试的窗口，只在开发环境下创建
 */
let DevWindow
function createDevWin() {
  DevWindow = new BrowserWindow({
    width: home_width,
    height: home_height,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    resizable: true,
    frame: false,
    transparent: false,
    maximizable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })

  DevWindow.on('ready-to-show', () => {
    DevWindow.show()
    DevWindow.webContents.openDevTools() // 默认打开控制台
  })

  DevWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 基于 electron-vite cli 的渲染器热模块替换
  // 在开发环境加载远程URL，在生产环境加载本地HTML文件
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    DevWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/dev')
  } else {
    DevWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '#/dev' })
  }
}
// 导出 mainWindow
export { DevWindow }
