import tdl from 'tdl'
import os from 'os'
import koffi from 'koffi'
import getTdjson from '../../../resources/TDLib/win/bin/tdjson.dll?asset&asarUnpack'
const { app } = require('electron')

const appVersion = app.getVersion()

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

/**
 * TDLib 客户端实例
 * @type {import('tdl').Client}
 * @description Telegram 客户端实例，用于与 Telegram 服务器通信
 */
let isConfigured = false

/**
 * 手动配置 TDLib，仅在应用启动时调用一次
 */
export function configureTDLib() {
  if (isConfigured) return
  koffi.load(getTdjson)
  tdl.configure({ tdjson: getTdjson, verbosityLevel: 0 })
  isConfigured = true
}

/**
 * 初始化并启动 TDLib 客户端
 * @function
 * @description 加载 tdjson 库并配置 TDLib 客户端
 * - 设置 API 凭证
 * - 配置系统信息
 * - 初始化数据库
 * @returns {void}
 */
const start = () => {
  function createClient() {
    return tdl.createClient({
      apiId: Number(import.meta.env.VITE_TG_API_ID),
      apiHash: import.meta.env.VITE_TG_API_HASH,
      useTestDc: true,
      tdlibParameters: {
        device_model: `${os.type()} | ${os.hostname()}`,
        system_version: getSystemVersion(),
        application_version: appVersion,
        use_chat_info_database: true,
        use_message_database: true,
        use_secret_chats: false
      }
    })
  }
  return createClient()
}

export { start }

// import { is } from '@electron-toolkit/utils'
// async function login() {
//   try {
//     for await (const update of client.iterUpdates()) {
//       console.log('update:', update)
//       if (update._ !== 'updateAuthorizationState') continue
//       const authorizationState = update.authorization_state
//       switch (authorizationState._) {
//         case 'authorizationStateWaitTdlibParameters':
//           if (!is.dev) {
//             await client.invoke({
//               _: 'setTdlibParameters',
//               api_id: Number(import.meta.env.VITE_TG_API_ID),
//               api_hash: import.meta.env.VITE_TG_API_HASH,
//               use_test_dc: true,
//               device_model: `${os.type()} | ${os.hostname()}`,
//               system_version: getSystemVersion(),
//               application_version: appVersion,
//               use_chat_info_database: true,
//               use_message_database: true,
//               use_secret_chats: false,
//               database_directory: '_td_database',
//               files_directory: '_td_files',
//               use_file_database: true,
//               use_storage_optimizer: true,
//               system_language_code: 'en'
//             })
//           }
//           break
//       }
//     }
//   } catch (error) {
//     console.error('login error:', error)
//     throw new Error('Failed to log in')
//   }
// }
