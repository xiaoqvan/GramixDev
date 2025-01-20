const fs = require('fs')
const path = require('path')

// 读取 package.json 文件
const packagePath = path.join(__dirname, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))

// 检查并更新构建号
packageJson.buildNumber = (packageJson.buildNumber || 0) + 1

// 写回 package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf-8')

console.log(`Updated build number to: ${packageJson.buildNumber}`)
