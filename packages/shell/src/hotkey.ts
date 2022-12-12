import { globalContext, Hotkey as InnerHotkey } from '@alilc/lowcode-editor-core';
import { hotkeySymbol } from './symbols';
import { Disposable, HotkeyCallback, IPublicApiHotkey } from '@alilc/lowcode-types';

const innerHotkeySymbol = Symbol('innerHotkey');

export default class Hotkey implements IPublicApiHotkey {
  private readonly [innerHotkeySymbol]: InnerHotkey;
  get [hotkeySymbol](): InnerHotkey {
    if (this.workspaceMode) {
      return this[innerHotkeySymbol];
    }
    const workSpace = globalContext.get('workSpace');
    if (workSpace.isActive) {
      return workSpace.window.innerHotkey;
    }

    return this[innerHotkeySymbol];
  }

  constructor(hotkey: InnerHotkey, public name: string = 'unknown', public workspaceMode: boolean = false) {
    this[innerHotkeySymbol] = hotkey;
  }

  get callbacks(): any {
    return this[hotkeySymbol].callBacks;
  }
  /**
   * @deprecated
   */
  get callBacks() {
    return this.callbacks;
  }
  /**
   * 绑定快捷键
   * @param combos 快捷键，格式如：['command + s'] 、['ctrl + shift + s'] 等
   * @param callback 回调函数
   * @param action
   * @returns
   */
  bind(combos: string[] | string, callback: HotkeyCallback, action?: string): Disposable {
    this[hotkeySymbol].bind(combos, callback, action);
    return () => {
      this[hotkeySymbol].unbind(combos, callback, action);
    };
  }
}