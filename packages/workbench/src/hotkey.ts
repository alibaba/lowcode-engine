/**
 * key event helper：https://www.toptal.com/developers/keycode
 * key code table: https://www.toptal.com/developers/keycode/table
 */

import { isEqual } from 'lodash-es';
import { type EventDisposable, Platform } from '@alilc/lowcode-shared';

type KeyboardEventKeyMapping = Record<string, string>;

interface KeyboardEventLike {
  type: string;
}

type KeyAction = 'keypress' | 'keydown' | 'keyup';

interface KeyInfo {
  key: string;
  modifiers: string[];
  action: KeyAction;
}

type SequenceLevels = Record<string, number>;

export type HotkeyCallback = (e: KeyboardEvent, combo?: string) => void | false | any;

export interface HotkeyCallbackConfig {
  callback: HotkeyCallback;
  modifiers: string[];
  action: KeyAction;
  seq?: string;
  level?: number;
  combo?: string;
}

export type HotkeyCallbackConfigRecord = Record<string, HotkeyCallbackConfig[]>;

const SHIFT_ALTERNATE_KEYS_MAP: KeyboardEventKeyMapping = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  _: '-',
  '+': '=',
  ':': ';',
  // eslint-disable-next-line @stylistic/quotes
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
  '|': '\\',
};

const SPECIAL_DEFINED_ALIASES: KeyboardEventKeyMapping = {
  option: 'alt',
  command: 'meta',
  return: 'enter',
  escape: 'esc',
  plus: '+',
  mod: Platform.isIOS ? 'meta' : 'ctrl',
};

interface KeypressEvent extends KeyboardEvent {
  type: 'keypress';
}

/**
 * takes a key event and figures out what the modifiers are
 */
function eventModifiers(e: KeyboardEvent): string[] {
  const modifiers = [];

  if (e.shiftKey) {
    modifiers.push('shift');
  }
  if (e.altKey) {
    modifiers.push('alt');
  }
  if (e.ctrlKey) {
    modifiers.push('ctrl');
  }
  if (e.metaKey) {
    modifiers.push('meta');
  }

  return modifiers;
}

/**
 * actually calls the callback function
 *
 * if your callback function returns false this will use the jquery
 * convention - prevent default and stop propogation on the event
 */
function fireCallback(callback: HotkeyCallback, e: KeyboardEvent, combo?: string): void {
  try {
    if (callback(e, combo) === false) {
      e.preventDefault();
      e.stopPropagation();
    }
  } catch (err) {
    console.error((err as Error).message);
  }
}

export class Hotkey {
  #resetTimer = 0;
  #ignoreNextKeyup: boolean | string = false;
  #ignoreNextKeypress = false;
  #nextExpectedAction: boolean | string = false;
  #isActivate = true;

  #sequenceLevels: SequenceLevels = {};
  /**
   * 当前快捷键配置
   */
  #callBackConfigRecord: HotkeyCallbackConfigRecord = {};

  active(): void {
    this.#isActivate = true;
  }

  inactive() {
    this.#isActivate = false;
  }

  /**
   * 给指定窗口绑定快捷键
   * @param window 窗口的 window 对象
   */
  mount(window: Window): EventDisposable {
    const { document } = window;
    const handleKeyEvent = this.handleKeyEvent.bind(this);
    document.addEventListener('keypress', handleKeyEvent, false);
    document.addEventListener('keydown', handleKeyEvent, false);
    document.addEventListener('keyup', handleKeyEvent, false);

    return () => {
      document.removeEventListener('keypress', handleKeyEvent, false);
      document.removeEventListener('keydown', handleKeyEvent, false);
      document.removeEventListener('keyup', handleKeyEvent, false);
    };
  }

  /**
   * 绑定快捷键
   * bind hotkey/hotkeys,
   * @param combos 快捷键，格式如：['command + s'] 、['ctrl + shift + s'] 等
   * @param callback 回调函数
   * @param action
   */
  bind(combos: string[] | string, callback: HotkeyCallback, action?: KeyAction): Hotkey {
    this.bindMultiple(Array.isArray(combos) ? combos : [combos], callback, action);
    return this;
  }

  /**
   * 取消绑定快捷键
   * bind hotkey/hotkeys,
   * @param combos 快捷键，格式如：['command + s'] 、['ctrl + shift + s'] 等
   * @param callback 回调函数
   * @param action
   */
  unbind(combos: string[] | string, callback: HotkeyCallback, action?: KeyAction) {
    const combinations = Array.isArray(combos) ? combos : [combos];

    combinations.forEach((combination) => {
      const info: KeyInfo = getKeyInfo(combination, action);
      const { key, modifiers } = info;
      const idx = this.#callBackConfigRecord[key].findIndex((info) => {
        return isEqual(info.modifiers, modifiers) && info.callback === callback;
      });
      if (idx !== -1) {
        this.#callBackConfigRecord[key].splice(idx, 1);
      }
    });
  }

  private bindSingle(
    combination: string,
    callback: HotkeyCallback,
    action?: KeyAction,
    sequenceName?: string,
    level?: number,
  ): void {
    // make sure multiple spaces in a row become a single space
    combination = combination.replace(/\s+/g, ' ');

    const sequence: string[] = combination.split(' ');

    // if this pattern is a sequence of keys then run through this method
    // to reprocess each pattern one key at a time
    if (sequence.length > 1) {
      this.bindSequence(combination, sequence, callback, action);
      return;
    }

    const info: KeyInfo = getKeyInfo(combination, action);

    // make sure to initialize array if this is the first time
    // a callback is added for this key
    this.#callBackConfigRecord[info.key] ??= [];

    // remove an existing match if there is one
    this.getMatches(
      info.key,
      info.modifiers,
      { type: info.action },
      sequenceName,
      combination,
      level,
    );

    // add this call back to the array
    // if it is a sequence put it at the beginning
    // if not put it at the end
    //
    // this is important because the way these are processed expects
    // the sequence ones to come first
    this.#callBackConfigRecord[info.key][sequenceName ? 'unshift' : 'push']({
      callback,
      modifiers: info.modifiers,
      action: info.action,
      seq: sequenceName,
      level,
      combo: combination,
    });
  }

  private bindMultiple(combinations: string[], callback: HotkeyCallback, action?: KeyAction) {
    for (const item of combinations) {
      this.bindSingle(item, callback, action);
    }
  }

  /**
   * finds all callbacks that match based on the keycode, modifiers,
   * and action
   */
  private getMatches(
    character: string,
    modifiers: string[],
    e: KeyboardEvent | KeyboardEventLike,
    sequenceName?: string,
    combination?: string,
    level?: number,
  ): HotkeyCallbackConfig[] {
    let i: number;
    let callback: HotkeyCallbackConfig;
    const matches: HotkeyCallbackConfig[] = [];
    const action = e.type as KeyAction;

    // if there are no events related to this keycode
    if (!this.#callBackConfigRecord[character]) {
      return [];
    }

    // if a modifier key is coming up on its own we should allow it
    if (action === 'keyup' && isModifier(character)) {
      modifiers = [character];
    }

    // loop through all callbacks for the key that was pressed
    // and see if any of them match
    for (i = 0; i < this.#callBackConfigRecord[character].length; ++i) {
      callback = this.#callBackConfigRecord[character][i];

      // if a sequence name is not specified, but this is a sequence at
      // the wrong level then move onto the next match
      if (!sequenceName && callback.seq && this.#sequenceLevels[callback.seq] !== callback.level) {
        continue;
      }

      // if the action we are looking for doesn't match the action we got
      // then we should keep going
      if (action !== callback.action) {
        continue;
      }

      // if this is a keypress event and the meta key and control key
      // are not pressed that means that we need to only look at the
      // character, otherwise check the modifiers as well
      //
      // chrome will not fire a keypress if meta or control is down
      // safari will fire a keypress if meta or meta+shift is down
      // firefox will fire a keypress if meta or control is down
      if (
        (isPressEvent(e) && !e.metaKey && !e.ctrlKey) ||
        modifiersMatch(modifiers, callback.modifiers)
      ) {
        const deleteCombo = !sequenceName && callback.combo === combination;
        const deleteSequence =
          sequenceName && callback.seq === sequenceName && callback.level === level;
        if (deleteCombo || deleteSequence) {
          this.#callBackConfigRecord[character].splice(i, 1);
        }

        matches.push(callback);
      }
    }

    return matches;
  }

  private handleKeyEvent(e: KeyboardEvent): void {
    if (!this.#isActivate) return;

    const character = e.key.toLowerCase();

    // need to use === for the character check because the character can be 0
    if (e.type === 'keyup' && this.#ignoreNextKeyup === character) {
      this.#ignoreNextKeyup = false;
      return;
    }

    this.handleKey(character, eventModifiers(e), e);
  }

  private handleKey(character: string, modifiers: string[], e: KeyboardEvent): void {
    const callbacks: HotkeyCallbackConfig[] = this.getMatches(character, modifiers, e);

    let i: number;
    let maxLevel = 0;

    // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
    for (i = 0; i < callbacks.length; ++i) {
      if (callbacks[i].seq) {
        maxLevel = Math.max(maxLevel, callbacks[i].level || 0);
      }
    }

    let processedSequenceCallback = false;
    const doNotReset: SequenceLevels = {};

    // loop through matching callbacks for this key event
    for (i = 0; i < callbacks.length; ++i) {
      // fire for all sequence callbacks
      // this is because if for example you have multiple sequences
      // bound such as "g i" and "g t" they both need to fire the
      // callback for matching g cause otherwise you can only ever
      // match the first one
      if (callbacks[i].seq) {
        // only fire callbacks for the maxLevel to prevent
        // subsequences from also firing
        //
        // for example 'a option b' should not cause 'option b' to fire
        // even though 'option b' is part of the other sequence
        //
        // any sequences that do not match here will be discarded
        // below by the resetSequences call
        if (callbacks[i].level !== maxLevel) {
          continue;
        }

        processedSequenceCallback = true;

        // keep a list of which sequences were matches for later
        doNotReset[callbacks[i].seq || ''] = 1;
        fireCallback(callbacks[i].callback, e, callbacks[i].combo);
        continue;
      }

      // if there were no sequence matches but we are still here
      // that means this is a regular match so we should fire that
      if (!processedSequenceCallback) {
        fireCallback(callbacks[i].callback, e, callbacks[i].combo);
      }
    }

    const ignoreThisKeypress = e.type === 'keypress' && this.#ignoreNextKeypress;
    if (e.type === this.#nextExpectedAction && !isModifier(character) && !ignoreThisKeypress) {
      this.resetSequences(doNotReset);
    }

    this.#ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown';
  }

  private resetSequenceTimer(): void {
    if (this.#resetTimer) {
      clearTimeout(this.#resetTimer);
    }
    this.#resetTimer = window.setTimeout(this.resetSequences, 1000);
  }

  private bindSequence(
    combo: string,
    keys: string[],
    callback: HotkeyCallback,
    action?: KeyAction,
  ): void {
    this.#sequenceLevels[combo] = 0;

    const increaseSequence = (nextAction: string) => {
      return () => {
        this.#nextExpectedAction = nextAction;
        ++this.#sequenceLevels[combo];
        this.resetSequenceTimer();
      };
    };
    const callbackAndReset = (e: KeyboardEvent): void => {
      fireCallback(callback, e, combo);

      if (action !== 'keyup') {
        this.#ignoreNextKeyup = e.key.toLowerCase();
      }

      setTimeout(this.resetSequences, 10);
    };

    for (let i = 0; i < keys.length; ++i) {
      const isFinal = i + 1 === keys.length;
      const wrappedCallback = isFinal
        ? callbackAndReset
        : increaseSequence(action || getKeyInfo(keys[i + 1]).action);

      this.bindSingle(keys[i], wrappedCallback, action, combo, i);
    }
  }

  /**
   * resets all sequence counters except for the ones passed in
   */
  private resetSequences(doNotReset?: SequenceLevels): void {
    // doNotReset = doNotReset || {};
    let activeSequences = false;
    let key = '';
    for (key in this.#sequenceLevels) {
      if (doNotReset && doNotReset[key]) {
        activeSequences = true;
      } else {
        this.#sequenceLevels[key] = 0;
      }
    }
    if (!activeSequences) {
      this.#nextExpectedAction = false;
    }
  }
}

/**
 * Gets info for a specific key combination
 *
 * @param combination key combination ("command+s" or "a" or "*")
 * @param action optional, keyboard event type, eg: keypress key down
 */
function getKeyInfo(combination: string, action?: KeyAction): KeyInfo {
  let keys: string[] = [];
  let key = '';
  let i: number;
  const modifiers: string[] = [];

  // take the keys from this pattern and figure out what the actual
  // pattern is all about
  keys = keysFromString(combination);

  for (i = 0; i < keys.length; ++i) {
    key = keys[i];

    // normalize key names
    if (SPECIAL_DEFINED_ALIASES[key]) {
      key = SPECIAL_DEFINED_ALIASES[key];
    }

    // if this is not a keypress event then we should
    // be smart about using shift keys
    // this will only work for US keyboards however
    if (action && action !== 'keypress' && SHIFT_ALTERNATE_KEYS_MAP[key]) {
      key = SHIFT_ALTERNATE_KEYS_MAP[key];
      modifiers.push('shift');
    }

    // if this key is a modifier then add it to the list of modifiers
    if (isModifier(key)) {
      modifiers.push(key);
    }
  }

  // depending on what the key combination is
  // we will try to pick the best event for it
  action = pickBestAction(key, modifiers, action);

  return {
    key,
    modifiers,
    action,
  };
}

/**
 * Converts from a string key combination to an array
 *
 * @param  {string} combination like "command+shift+l"
 * @return {Array}
 */
function keysFromString(combination: string): string[] {
  if (combination === '+') {
    return ['+'];
  }

  combination = combination.toLowerCase().replace(/\+{2}/g, '+plus');
  return combination.split('+');
}

/**
 * determines if the keycode specified is a modifier key or not
 */
function isModifier(key: string): boolean {
  return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta';
}

/**
 * picks the best action based on the key combination
 */
function pickBestAction(key: string, modifiers: string[], action?: KeyAction): KeyAction {
  // if no action was picked in we should try to pick the one
  // that we think would work best for this key
  if (!action) {
    action = 'keydown';
  }
  // modifier keys don't work as expected with keypress,
  // switch to keydown
  if (action === 'keypress' && modifiers.length) {
    action = 'keydown';
  }
  return action;
}

function isPressEvent(e: KeyboardEvent | KeyboardEventLike): e is KeypressEvent {
  return e.type === 'keypress';
}

/**
 * checks if two arrays are equal
 */
function modifiersMatch(modifiers1: string[], modifiers2: string[]): boolean {
  return modifiers1.sort().join(',') === modifiers2.sort().join(',');
}
