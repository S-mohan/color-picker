export const $ = (selector: string, context: HTMLElement | Document = document): HTMLElement => context.querySelector(selector)

// addEventListener
export const on = (el: Element | Document, event: string, listener: EventListener) => el.addEventListener(event, listener, false)

// removeEventListener
export const off = (el: Element | Document, event: string, listener: EventListener) => el.removeEventListener(event, listener, false)

export const isFunction = (value: any) => typeof value === 'function'

export interface PlainObject {
  [key: string]: any
}
