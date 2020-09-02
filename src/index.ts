import BScroll from '@better-scroll/core'
import { extend } from '@better-scroll/shared-utils'

export type myPluginOptions = Partial<myPluginConfig> | true

type myPluginConfig = {
  scrollText: string,
  scrollEndText: string
}

interface PluginAPI {
  printScrollText(): void
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    myPluginOptions?: myPluginOptions
  }

  interface CustomAPI {
    myPluginOptions: PluginAPI
  }
}

export default class MyPlugin implements PluginAPI {
  static pluginName = 'myPluginOptions'
  public options: myPluginConfig
  constructor(public scroll: BScroll){
    this.handleOptions()

    this.handleBScroll()

    this.registerHooks()
  }

  private handleOptions() {
    const userOptions = (this.scroll.options.myPluginOptions === true
      ? {}
      : this.scroll.options.myPluginOptions) as Partial<myPluginConfig>
    const defaultOptions: myPluginConfig = {
      scrollText: 'I am scrolling',
      scrollEndText: 'Scroll has ended'
    }
    this.options = extend(defaultOptions, userOptions)
  }

  private handleBScroll() {
    const propertiesConfig = [
      {
        key: 'printScrollText',
        sourceKey: 'plugins.myPluginOptions.printScrollText'
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