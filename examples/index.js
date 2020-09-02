import BScroll from '@better-scroll/core'
import MyPlugin from '../src'

BScroll.use(MyPlugin)

const bs = new BScroll('.wrapper', {
  myPlugin: {
    scrollText: 'I am scrolling',
    scrollEndText: 'Scroll has ended'
  },
  // 或者
  // myPlugin: true
})

// 使用插件暴露到 bs 的事件
bs.on('printScrollEndText', (scrollEndText) => {
  const blackboardEl = document.querySelector('.blackboard-content')
  blackboardEl.innerHTML = scrollEndText
  console.log(scrollEndText) // 打印 "Scroll has ended, position is (xx, yy)"
})

// 使用插件代理到 bs 实例上的方法
bs.printScrollText() // 打印 "I am scrolling"