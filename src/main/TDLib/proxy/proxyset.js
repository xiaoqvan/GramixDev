import { ipcMain } from 'electron'

export const initializeProxy = async (client) => {
  ipcMain.handle('getProxies', async () => {
    const proxies = await client.invoke({
      _: 'getProxies'
    })
    return proxies
  })

  ipcMain.handle('addProxy', async (_, proxy) => {
    console.log(proxy)

    let type
    if (proxy.type === 'proxyTypeSocks5') {
      type = { _: proxy.type, username: proxy.username, password: proxy.password }
    } else if (proxy.type === 'proxyTypeHttp') {
      type = {
        _: proxy.type,
        username: proxy.username,
        password: proxy.password,
        http_only: proxy.http_only || false
      }
    } else if (proxy.type === 'proxyTypeMtproto') {
      type = { _: proxy.type, secret: proxy.secret }
    }

    const result = await client.invoke({
      _: 'addProxy',
      server: proxy.server,
      port: proxy.port,
      enable: proxy.enable,
      type: type
    })
    return result
  })

  ipcMain.handle('removeProxy', async (_, proxyId) => {
    const result = await client.invoke({
      _: 'removeProxy',
      proxy_id: proxyId
    })
    return result
  })

  ipcMain.handle('editProxy', async (_, proxy) => {
    const result = await client.invoke({
      _: 'enableProxy',
      proxy_id: proxy.id,
      server: proxy.server,
      port: proxy.port,
      enable: proxy.enable,
      type: {
        _: proxy.Type
      }
    })
    return result
  })

  ipcMain.handle('enableProxy', async (_, proxyId) => {
    const result = await client.invoke({
      _: 'enableProxy',
      proxy_id: proxyId
    })
    return result
  })

  ipcMain.handle('disableProxy', async (_, proxyId) => {
    const result = await client.invoke({
      _: 'disableProxy',
      proxy_id: proxyId
    })
    return result
  })

  ipcMain.handle('pingProxy', async (_, proxyId) => {
    const result = await client.invoke({
      _: 'pingProxy',
      proxy_id: proxyId
    })

    console.log('ping', JSON.stringify(result, null, 2))

    return result
  })

  ipcMain.handle('testProxy', async (_, proxy) => {
    const result = await client.invoke({
      _: 'testProxy',
      server: proxy.server,
      port: proxy.port,
      dc_id: proxy.dc_id,
      type: {
        _: proxy.Type
      },
      timeout: 10.0
    })
    return result
  })

  ipcMain.handle('getProxyLink', async (_, proxyId) => {
    const result = await client.invoke({
      _: 'getProxyLink',
      proxy_id: proxyId
    })
    return result
  })
}
