import { hotkey, HotkeyCallback } from '@ali/lowcode-editor-core';
import { Disposable } from '@ali/lowcode-types';

export default class Hotkey {
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