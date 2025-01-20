[EN](README.md) | [中文](README_zh-CN.md) | [Русский](README_RU.md)

## Note

This project is in the development stage.
You can now build it for the Windows platform, but there are still many bugs to be fixed.

## Description

Gramix is a third-party client using `Electron-vite` + `TDLib`.

## Getting Started

This project is built based on [electron-vite](https://electron-vite.org/) and uses npm for dependency management.

### Environment Setup

Go to https://my.telegram.org/apps and register a new application.

Create a .env file and add the following content:

```.env
VITE_TG_API_ID=12345678  # Telegram API ID
VITE_TG_API_HASH=1234567abcdefghijkl # Telegram API Hash
```

### TDLib

To communicate with the Telegram server, this project uses TDLib.
Go to https://github.com/tdlib/td to get the source code and refer to the official [documentation](https://tdlib.github.io/td/build.html?language=JavaScript) for the JavaScript (node.js) build method on Windows.
Place the built `bin` file with `tdjson.dll` into the `resources/TDLib/win/` directory.

### Debugging

Clone the project and install dependencies

```bash
npm install
npm run dev
```

## Development Progress

- [x] User Authorization
- [x] Proxy
- [ ] Conversation List (currently in progress)
- [ ] Chat Page (the first version is expected to support text messages only)
- [ ] Settings Page (basic settings page)
- [ ] Further improve the message display on the conversation page
- [ ] More to be developed

### Possible Issues

- Does not support multiple account logins (lack of development experience, need help from everyone)
