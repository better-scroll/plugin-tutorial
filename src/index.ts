import BScroll from '@better-scroll/core'
import { extend } from '@better-scroll/shared-utils'

export type MyPluginOptions = Partial<MyPluginConfig> | true

type MyPluginConfig = {
  scrollText: string,
  scrollEndText: string
}

interface PluginAPI {
  printScrollText(): void
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    myPlugin?: MyPluginOptions
  }

  interface CustomAPI {
    myPlugin: PluginAPI
  }
}

export default class MyPlugin implements PluginAPI {
  static pluginName = 'myPlugin'
  public options: MyPluginConfig
  constructor(public scroll: BScroll){
    this.handleOptions()

    this.handleBScroll()

    this.registerHooks()
  }

  private handleOptions() {
    const userOptions = (this.scroll.options.myPlugin === true
      ? {}
      : this.scroll.options.myPlugin) as Partial<MyPluginConfig>
    const defaultOptions: MyPluginConfig = {
      scrollText: 'I am scrolling',
      scrollEndText: 'Scroll has ended'
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleBScroll() {
    const propertiesConfig = [
      {
        key: 'printScrollText',
        sourceKey: 'plugins.myPlugin.printScrollText'
      }
    ]
    // 将 myPlugin.printScrollText 代理至 bs.printScrollText
    this.scroll.proxy(propertiesConfig)
    // 注册 printScrollEndText 事件至 bs，以至于用户可以通过 bs.on('printScrollEndText', handler) 来订阅事件
    this.scroll.registerType(['printScrollEndText'])
  }

  printScrollText() {
    console.log(this.options.scrollText)
  }

  private registerHooks() {
    const scroll = this.scroll
    scroll.on(scroll.eventTypes.scrollEnd, ({ x, y }: { x: number, y: number}) => {
      scroll.trigger(
        scroll.eventTypes.printScrollEndText,
        `${this.options.scrollEndText}, position is (${x}, ${y})`
      )
    })
  }
}