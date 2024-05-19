import { globalContext, Hotkey as InnerHotkey } from '@alilc/lowcode-editor-core';
import { hotkeySymbol } from '../symbols';
import { IPublicTypeDisposable, IPublicTypeHotkeyCallback, IPublicTypeHotkeyCallbacks, IPublicApiHotkey } from '@alilc/lowcode-types';

const innerHotkeySymbol = Symbol('innerHotkey');

export class Hotkey implements IPublicApiHotkey {
  private readonly [innerHotkeySymbol]: InnerHotkey;
  get [hotkeySymbol](): InnerHotkey {
    if (this.workspaceMode) {
      return this[innerHotkeySymbol];
    }
    const workspace = globalContext.get('workspace');
    if (workspace.isActive) {
      return workspace.window.innerHotkey;
    }

    return this[innerHotkeySymbol];
  }

  constructor(hotkey: InnerHotkey, readonly workspaceMode: boolean = false) {
    this[innerHotkeySymbol] = hotkey;
  }

  get callbacks(): IPublicTypeHotkeyCallbacks {
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
  bind(
      combos: string[] | string,
      callback: IPublicTypeHotkeyCallback,
      action?: string,
    ): IPublicTypeDisposable {
    this[hotkeySymbol].bind(combos, callback, action);
    return () => {
      this[hotkeySymbol].unbind(combos, callback, action);
    };
  }

  /**
   * 给指定窗口绑定快捷键
   * @param window 窗口的 window 对象
   */
  mount(window: Window) {
    return this[hotkeySymbol].mount(window);
  }
}