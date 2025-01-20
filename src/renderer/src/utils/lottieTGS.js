import lottie from 'lottie-web'
import pako from 'pako'

export async function loadAnimation(container, animationPath, color) {
  try {
    const response = await fetch(animationPath)
    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const decompressedData = pako.inflate(data, { to: 'string' })
    const animationData = JSON.parse(decompressedData)

    // 只在传入颜色时才处理颜色
    if (color) {
      const processColors = (obj) => {
        if (!obj) return

        // 处理颜色属性
        if (obj.c?.k) {
          if (Array.isArray(obj.c.k)) {
            obj.c.k = [
              parseInt(color.slice(1, 3), 16) / 255,
              parseInt(color.slice(3, 5), 16) / 255,
              parseInt(color.slice(5, 7), 16) / 255,
              1
            ]
          }
        }

        // 处理数组
        if (Array.isArray(obj)) {
          obj.forEach((item) => processColors(item))
        }
        // 处理对象
        else if (typeof obj === 'object') {
          Object.values(obj).forEach((value) => processColors(value))
        }
      }
      processColors(animationData)
    }

    return lottie.loadAnimation({
      container: container.value,
      animationData: animationData,
      renderer: 'svg',
      loop: true,
      autoplay: true
    })
  } catch (error) {
    console.error('Error loading animation:', error)
  }
}
