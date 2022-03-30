import {
  Dragon as InnerDragon,
  DragNodeDataObject,
} from '@alilc/lowcode-designer';
import { dragonSymbol } from './symbols';

export default class Dragon {
  private readonly [dragonSymbol]: InnerDragon;

  constructor(dragon: InnerDragon) {
    this[dragonSymbol] = dragon;
  }

  static create(dragon: InnerDragon | null) {
    if (!dragon) return null;
    return new Dragon(dragon);
  }

  /**
   * is dragging or not
   */
  get dragging() {
    return this[dragonSymbol].dragging;
  }

  /**
   * 绑定 dragstart 事件
   * @param func
   * @returns
   */
  onDragstart(func: (/* e: LocateEvent */) => any) {
    // TODO: 补充必要参数
    return this[dragonSymbol].onDragstart(() => func());
  }

  /**
   * 绑定 drag 事件
   * @param func
   * @returns
   */
  onDrag(func: (/* e: LocateEvent */) => any) {
    // TODO: 补充必要参数
    return this[dragonSymbol].onDrag(() => func());
  }

  /**
   * 绑定 dragend 事件
   * @param func
   * @returns
   */
  onDragend(func: (/* e: LocateEvent */) => any) {
    // TODO: 补充必要参数
    return this[dragonSymbol].onDragend(() => func());
  }

  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell: Element, boost: (e: MouseEvent) => DragNodeDataObject | null) {
    return this[dragonSymbol].from(shell, boost);
  }
}