import { hotkey } from '@alilc/lowcode-editor-core';
import { Disposable, HotkeyCallback, IPublicApiHotkey } from '@alilc/lowcode-types';

export default class Hotkey implements IPublicApiHotkey {
  get callbacks() {
    return hotkey.callBacks;
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
    hotkey.bind(combos, callback, action);
    return () => {
      hotkey.unbind(combos, callback, action);
    };
  }
}