[EN](README.md) | [中文](README_zh-CN.md)  | [Русский](README_RU.md)

## 注意

本项目处于开发阶段
你现在能构建 windsows 平台使用，但是现在还有很多 bug 需要等待修复。

## 描述

Gramix 是一个使用 `Electron-vite`+`TDLib` 的第三方客户端

## 开始

本项目基于[electron-vite](https://electron-vite.org/)构建，使用 npm 进行依赖管理。

### 配置环境

前往 https://my.telegram.org/apps 并注册一个新应用程序。

创建一个 .env 文件，并添加以下内容：

```.env
VITE_TG_API_ID=12345678  # Telegram API ID
VITE_TG_API_HASH=1234567abcdefghijkl # Telegram API Hash
```

### TDLib

为了与 Telegram 服务器通信，本项目使用 TDLib。
前往 https://github.com/tdlib/td 获取源码，编译参考官方[文档](https://tdlib.github.io/td/build.html?language=JavaScript)JavaScript 的 windsows(node.js)构建方法。
将构建好的 有`tdjson.dll`的 `bin` 文件放入 `resources/TDLib/win/` 目录下。

### 调试

克隆项目并安装依赖

```bash
npm install
npm run dev
```

## 开发进度表

- [x] 用户授权
- [x] 代理
- [ ] 对话列表(当前正在进行)
- [ ] 聊天页面(预计第一版只支持文本消息)
- [ ] 设置页面(基础设置页)
- [ ] 进一步完善对话页面的消息显示
- [ ] 更多等待开发

### 可能的问题

- 不支持多个账号登录(没有开发经验需要大家帮助)
