import { hotkey, HotkeyCallback } from '@ali/lowcode-editor-core';
import { Disposable } from '@ali/lowcode-types';

export default class Hotkey {
  bind(combos: string[] | string, callback: HotkeyCallback, action?: string): Disposable {
    hotkey.bind(combos, callback, action);
    return () => {
      hotkey.unbind(combos, callback, action);
    };
  }
}