import { isEqual } from 'lodash';
import { globalContext } from './di';
import { IPublicTypeHotkeyCallback, IPublicTypeHotkeyCallbackConfig, IPublicTypeHotkeyCallbacks, IPublicApiHotkey } from '@alilc/lowcode-types';

interface KeyMap {
  [key: number]: string;
}

interface CtrlKeyMap {
  [key: string]: string;
}

interface ActionEvent {
  type: string;
}

interface HotkeyDirectMap {
  [key: string]: IPublicTypeHotkeyCallback;
}

interface KeyInfo {
  key: string;
  modifiers: string[];
  action: string;
}

interface SequenceLevels {
  [key: string]: number;
}

const MAP: KeyMap = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'capslock',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'ins',
  46: 'del',
  91: 'meta',
  93: 'meta',
  224: 'meta',
};

const KEYCODE_MAP: KeyMap = {
  106: '*',
  107: '+',
  109: '-',
  110: '.',
  111: '/',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'",
};

const SHIFT_MAP: CtrlKeyMap = {
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
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
  '|': '\\',
};

const SPECIAL_ALIASES: CtrlKeyMap = {
  option: 'alt',
  command: 'meta',
  return: 'enter',
  escape: 'esc',
  plus: '+',
  mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl',
};

let REVERSE_MAP: CtrlKeyMap;

/**
 * loop through the f keys, f1 to f19 and add them to the map
 * programatically
 */
for (let i = 1; i < 20; ++i) {
  MAP[111 + i] = `f${ i}`;
}

/**
 * loop through to map numbers on the numeric keypad
 */
for (let i = 0; i <= 9; ++i) {
  MAP[i + 96] = String(i);
}

/**
 * takes the event and returns the key character
 */
function characterFromEvent(e: KeyboardEvent): string {
  const keyCode = e.keyCode || e.which;
  // for keypress events we should return the character as is
  if (e.type === 'keypress') {
    let character = String.fromCharCode(keyCode);
    // if the shift key is not pressed then it is safe to assume
    // that we want the character to be lowercase.  this means if
    // you accidentally have caps lock on then your key bindings
    // will continue to work
    //
    // the only side effect that might not be desired is if you
    // bind something like 'A' cause you want to trigger an
    // event when capital A is pressed caps lock will no longer
    // trigger the event.  shift+a will though.
    if (!e.shiftKey) {
      character = character.toLowerCase();
    }
    return character;
  }
  // for non keypress events the special maps are needed
  if (MAP[keyCode]) {
    return MAP[keyCode];
  }
  if (KEYCODE_MAP[keyCode]) {
    return KEYCODE_MAP[keyCode];
  }
  // if it is not in the special map
  // with keydown and keyup events the character seems to always
  // come in as an uppercase character whether you are pressing shift
  // or not.  we should make sure it is always lowercase for comparisons
  // tips: Q29weXJpZ2h0IChjKSAyMDIwLXByZXNlbnQgQWxpYmFiYSBJbmMuIFYy
  return String.fromCharCode(keyCode).toLowerCase();
}

interface KeypressEvent extends KeyboardEvent {
  type: 'keypress';
}

function isPressEvent(e: KeyboardEvent | ActionEvent): e is KeypressEvent {
  return e.type === 'keypress';
}

/**
 * checks if two arrays are equal
 */
function modifiersMatch(modifiers1: string[], modifiers2: string[]): boolean {
  return modifiers1.sort().join(',') === modifiers2.sort().join(',');
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
 * determines if the keycode specified is a modifier key or not
 */
function isModifier(key: string): boolean {
  return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta';
}

/**
 * reverses the map lookup so that we can look for specific keys
 * to see what can and can't use keypress
 *
 * @return {Object}
 */
function getReverseMap(): CtrlKeyMap {
  if (!REVERSE_MAP) {
    REVERSE_MAP = {};
    for (const key in MAP) {
      // pull out the numeric keypad from here cause keypress should
      // be able to detect the keys from the character
      if (Number(key) > 95 && Number(key) < 112) {
        continue;
      }

      if (MAP.hasOwnProperty(key)) {
        REVERSE_MAP[MAP[key]] = key;
      }
    }
  }
  return REVERSE_MAP;
}

/**
 * picks the best action based on the key combination
 */
function pickBestAction(key: string, modifiers: string[], action?: string): string {
  // if no action was picked in we should try to pick the one
  // that we think would work best for this key
  if (!action) {
    action = getReverseMap()[key] ? 'keydown' : 'keypress';
  }
  // modifier keys don't work as expected with keypress,
  // switch to keydown
  if (action === 'keypress' && modifiers.length) {
    action = 'keydown';
  }
  return action;
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

  combination = combination.replace(/\+{2}/g, '+plus');
  return combination.split('+');
}

/**
 * Gets info for a specific key combination
 *
 * @param combination key combination ("command+s" or "a" or "*")
 */
function getKeyInfo(combination: string, action?: string): KeyInfo {
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
    if (SPECIAL_ALIASES[key]) {
      key = SPECIAL_ALIASES[key];
    }

    // if this is not a keypress event then we should
    // be smart about using shift keys
    // this will only work for US keyboards however
    if (action && action !== 'keypress' && SHIFT_MAP[key]) {
      key = SHIFT_MAP[key];
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
 * actually calls the callback function
 *
 * if your callback function returns false this will use the jquery
 * convention - prevent default and stop propogation on the event
 */
function fireCallback(callback: IPublicTypeHotkeyCallback, e: KeyboardEvent, combo?: string, sequence?: string): void {
  try {
    const workspace = globalContext.get('workspace');
    const editor = workspace.isActive ? workspace.window?.editor : globalContext.get('editor');
    const designer = editor?.get('designer');
    const node = designer?.currentSelection?.getNodes()?.[0];
    const npm = node?.componentMeta?.npm;
    const selected =
      [npm?.package, npm?.componentName].filter((item) => !!item).join('-') || node?.componentMeta?.componentName || '';
    if (callback(e, combo) === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    editor?.eventBus.emit('hotkey.callback.call', {
      callback,
      e,
      combo,
      sequence,
      selected,
    });
  } catch (err) {
    console.error(err.message);
  }
}

export interface IHotKey extends Omit<IPublicApiHotkey, 'bind' | 'callbacks'> {
  activate(activate: boolean): void;
}

export class Hotkey implements IHotKey {
  callBacks: IPublicTypeHotkeyCallbacks = {};

  private directMap: HotkeyDirectMap = {};

  private sequenceLevels: SequenceLevels = {};

  private resetTimer = 0;

  private ignoreNextKeyup: boolean | string = false;

  private ignoreNextKeypress = false;

  private nextExpectedAction: boolean | string = false;

  private isActivate = true;

  constructor(readonly viewName: string = 'global') {
    this.mount(window);
  }

  activate(activate: boolean): void {
    this.isActivate = activate;
  }

  mount(window: Window) {
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

  bind(combos: string[] | string, callback: IPublicTypeHotkeyCallback, action?: string): Hotkey {
    this.bindMultiple(Array.isArray(combos) ? combos : [combos], callback, action);
    return this;
  }

  unbind(combos: string[] | string, callback: IPublicTypeHotkeyCallback, action?: string) {
    const combinations = Array.isArray(combos) ? combos : [combos];

    combinations.forEach(combination => {
      const info: KeyInfo = getKeyInfo(combination, action);
      const { key, modifiers } = info;
      const idx = this.callBacks[key].findIndex(info => {
        return isEqual(info.modifiers, modifiers) && info.callback === callback;
      });
      if (idx !== -1) {
        this.callBacks[key].splice(idx, 1);
      }
    });
  }

  /**
   * resets all sequence counters except for the ones passed in
   */
  private resetSequences(doNotReset?: SequenceLevels): void {
    // doNotReset = doNotReset || {};
    let activeSequences = false;
    let key = '';
    for (key in this.sequenceLevels) {
      if (doNotReset && doNotReset[key]) {
        activeSequences = true;
      } else {
        this.sequenceLevels[key] = 0;
      }
    }
    if (!activeSequences) {
      this.nextExpectedAction = false;
    }
  }

  /**
   * finds all callbacks that match based on the keycode, modifiers,
   * and action
   */
  private getMatches(
    character: string,
    modifiers: string[],
    e: KeyboardEvent | ActionEvent,
    sequenceName?: string,
    combination?: string,
    level?: number,
  ): IPublicTypeHotkeyCallbackConfig[] {
    let i: number;
    let callback: IPublicTypeHotkeyCallbackConfig;
    const matches: IPublicTypeHotkeyCallbackConfig[] = [];
    const action: string = e.type;

    // if there are no events related to this keycode
    if (!this.callBacks[character]) {
      return [];
    }

    // if a modifier key is coming up on its own we should allow it
    if (action === 'keyup' && isModifier(character)) {
      modifiers = [character];
    }

    // loop through all callbacks for the key that was pressed
    // and see if any of them match
    for (i = 0; i < this.callBacks[character].length; ++i) {
      callback = this.callBacks[character][i];

      // if a sequence name is not specified, but this is a sequence at
      // the wrong level then move onto the next match
      if (!sequenceName && callback.seq && this.sequenceLevels[callback.seq] !== callback.level) {
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
      if ((isPressEvent(e) && !e.metaKey && !e.ctrlKey) || modifiersMatch(modifiers, callback.modifiers)) {
        const deleteCombo = !sequenceName && callback.combo === combination;
        const deleteSequence = sequenceName && callback.seq === sequenceName && callback.level === level;
        if (deleteCombo || deleteSequence) {
          this.callBacks[character].splice(i, 1);
        }

        matches.push(callback);
      }
    }
    return matches;
  }

  private handleKey(character: string, modifiers: string[], e: KeyboardEvent): void {
    const callbacks: IPublicTypeHotkeyCallbackConfig[] = this.getMatches(character, modifiers, e);
    let i: number;
    const doNotReset: SequenceLevels = {};
    let maxLevel = 0;
    let processedSequenceCallback = false;

    // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
    for (i = 0; i < callbacks.length; ++i) {
      if (callbacks[i].seq) {
        maxLevel = Math.max(maxLevel, callbacks[i].level || 0);
      }
    }

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
        fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
        continue;
      }

      // if there were no sequence matches but we are still here
      // that means this is a regular match so we should fire that
      if (!processedSequenceCallback) {
        fireCallback(callbacks[i].callback, e, callbacks[i].combo);
      }
    }

    const ignoreThisKeypress = e.type === 'keypress' && this.ignoreNextKeypress;
    if (e.type === this.nextExpectedAction && !isModifier(character) && !ignoreThisKeypress) {
      this.resetSequences(doNotReset);
    }

    this.ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown';
  }

  private handleKeyEvent(e: KeyboardEvent): void {
    if (!this.isActivate) {
      return;
    }
    const character = characterFromEvent(e);

    // no character found then stop
    if (!character) {
      return;
    }

    // need to use === for the character check because the character can be 0
    if (e.type === 'keyup' && this.ignoreNextKeyup === character) {
      this.ignoreNextKeyup = false;
      return;
    }

    this.handleKey(character, eventModifiers(e), e);
  }

  private resetSequenceTimer(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = window.setTimeout(this.resetSequences, 1000);
  }

  private bindSequence(combo: string, keys: string[], callback: IPublicTypeHotkeyCallback, action?: string): void {
    // const self: any = this;
    this.sequenceLevels[combo] = 0;
    const increaseSequence = (nextAction: string) => {
      return () => {
        this.nextExpectedAction = nextAction;
        ++this.sequenceLevels[combo];
        this.resetSequenceTimer();
      };
    };
    const callbackAndReset = (e: KeyboardEvent): void => {
      fireCallback(callback, e, combo);

      if (action !== 'keyup') {
        this.ignoreNextKeyup = characterFromEvent(e);
      }

      setTimeout(this.resetSequences, 10);
    };
    for (let i = 0; i < keys.length; ++i) {
      const isFinal = i + 1 === keys.length;
      const wrappedCallback = isFinal ? callbackAndReset : increaseSequence(action || getKeyInfo(keys[i + 1]).action);
      this.bindSingle(keys[i], wrappedCallback, action, combo, i);
    }
  }

  private bindSingle(
    combination: string,
    callback: IPublicTypeHotkeyCallback,
    action?: string,
    sequenceName?: string,
    level?: number,
  ): void {
    // store a direct mapped reference for use with HotKey.trigger
    this.directMap[`${combination}:${action}`] = callback;

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
    this.callBacks[info.key] = this.callBacks[info.key] || [];

    // remove an existing match if there is one
    this.getMatches(info.key, info.modifiers, { type: info.action }, sequenceName, combination, level);

    // add this call back to the array
    // if it is a sequence put it at the beginning
    // if not put it at the end
    //
    // this is important because the way these are processed expects
    // the sequence ones to come first
    this.callBacks[info.key][sequenceName ? 'unshift' : 'push']({
      callback,
      modifiers: info.modifiers,
      action: info.action,
      seq: sequenceName,
      level,
      combo: combination,
    });
  }

  private bindMultiple(combinations: string[], callback: IPublicTypeHotkeyCallback, action?: string) {
    for (const item of combinations) {
      this.bindSingle(item, callback, action);
    }
  }
}
