import { ipcMain } from 'electron'

export const initializeOption = async (client) => {
  const OptionList = []

  const formatOptionData = (update) => {
    return {
      name: update.name,
      value: update.value
    }
  }

  client.on('update', (update) => {
    if (update._ === 'updateOption') {
      const formattedData = formatOptionData(update)
      const index = OptionList.findIndex((option) => option.name === formattedData.name)
      if (index !== -1) {
        OptionList[index] = formattedData
      } else {
        OptionList.push(formattedData)
      }
    }
  })

  ipcMain.handle('getOptionList', () => {
    return OptionList
  })
  ipcMain.handle('getOption', async (_, name) => {
    const option = await client.invoke({
      _: 'getOption',
      name: name
    })
    return option
  })
}
