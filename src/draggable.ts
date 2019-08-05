import { on, isFunction, off, PlainObject } from './utils'

interface Handlers extends PlainObject { }

// 坐标
export interface Coordinate {
  top: number
  left: number
}

interface Props {
  start?: Function
  drag?: Function
  end?: Function
}

// 配置项
const defaults: Props = {
  start: (event: Event) => { },
  drag: (coordinate: Coordinate, event: Event) => { },
  end: (coordinate: Coordinate, event: Event) => { }
}

/**
 * 开始拖拽事件
 * @private
 * @param {Draggable} this
 * @param {MouseEvent} event
 */
function handlerStart(this: Draggable, event: MouseEvent) {
  if (Draggable.dragging) {
    return
  }
  document.onselectstart = () => false
  document.ondragstart = () => false
  on(document, 'mousemove', this._handlers.drag)
  on(document, 'mouseup', this._handlers.dragEnd)
  Draggable.dragging = true
  isFunction(this._props.start) && this._props.start.call(this, event)
}

/**
 * 拖拽中事件
 * @private
 * @param {Draggable} this
 * @param {MouseEvent} event
 */
function handlerDrag(this: Draggable, event: MouseEvent) {
  isFunction(this._props.drag) && this._props.drag.call(this, getCoordinate(this._$el, event), event)
}

/**
 * 拖拽结束事件
 * @private
 * @param {Draggable} this
 * @param {(MouseEvent | boolean)} event
 */
function handlerEnd(this: Draggable, event: MouseEvent | boolean) {
  off(document, 'mousemove', this._handlers.drag)
  off(document, 'mouseup', this._handlers.dragEnd)
  document.onselectstart = null
  document.ondragstart = null
  Draggable.dragging = false
  if (typeof event !== 'boolean') {
    isFunction(this._props.end) && this._props.end.call(this, getCoordinate(this._$el, event), event)
  }
}

/**
 * 点击事件
 * @private
 * @param {Draggable} this
 * @param {MouseEvent} event
 */
function handlerClick(this: Draggable, event: MouseEvent) {
  isFunction(this._props.end) && this._props.end.call(this, getCoordinate(this._$el, event), event)
}

/**
 * 绑定DOM事件
 * @private
 * @param {Draggable} this
 */
function bindEvents(this: Draggable) {
  const handlers = this._handlers
  const $el = this._$el
  handlers.dragStart = handlerStart.bind(this)
  handlers.drag = handlerDrag.bind(this)
  handlers.dragEnd = handlerEnd.bind(this)
  handlers.click = handlerClick.bind(this)
  on($el, 'mousedown', handlers.dragStart)
  on($el, 'click', handlers.click)
}

/**
 * 解绑DOM事件
 * @private
 * @param {Draggable} this
 */
function unbindEvents(this: Draggable) {
  const handlers = this._handlers
  const $el = this._$el
  off($el, 'mousedown', handlers.dragStart)
  off($el, 'click', handlers.click)
  handlerEnd.call(this, false)
}

/**
 * 获取坐标
 * @function
 * @param el 
 * @param event todo TouchEvent
 */
function getCoordinate(el: Element, event: MouseEvent | TouchEvent): Coordinate {
  const rect = el.getBoundingClientRect()
  const mouseEvent = event as MouseEvent
  const left = mouseEvent.clientX - rect.left
  const top = mouseEvent.clientY - rect.top
  return {
    top: Math.min(Math.max(0, top), rect.height),
    left: Math.min(Math.max(0, left), rect.width)
  }
}

/**
 * Draggable 基类
 * 用于元素在其父元素上自由拖拽
 * 如 Range 
 * @export
 * @class Draggable
 * @extends {EventsBus}
 */
export class Draggable {

  // 是否正在拖拽中
  static dragging = false
  // 绑定事件的元素
  protected _$el: Element
  // 事件句柄收集器
  protected _handlers: Handlers
  // 配置项
  protected _props: Props

  /**
   * Creates an instance of Draggable.
   * @param {Element} el
   * @param {Props} [options]
   * @memberof Draggable
   */
  constructor(el: Element, options?: Props) {
    this._$el = el
    this._handlers = Object.create(null)
    this._props = Object.assign({}, defaults, options)
    bindEvents.call(this)
  }

  // 销毁
  destroy() {
    unbindEvents.call(this)
    this._$el = null
    this._handlers = null
  }
}

export default Draggable