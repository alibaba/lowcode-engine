import { isMacintosh, isLinux, isFirefox } from '@alilc/lowcode-shared';
import { EVENT_CODE_TO_KEY_CODE_MAP, KeyCode } from '../common';
import { KeyCodeChord, BinaryKeybindingsMask } from './keybindings';

const ctrlKeyMod = isMacintosh ? BinaryKeybindingsMask.WinCtrl : BinaryKeybindingsMask.CtrlCmd;
const altKeyMod = BinaryKeybindingsMask.Alt;
const shiftKeyMod = BinaryKeybindingsMask.Shift;
const metaKeyMod = isMacintosh ? BinaryKeybindingsMask.CtrlCmd : BinaryKeybindingsMask.WinCtrl;

export interface IKeyboardEvent {
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly keyCode: KeyCode;
  readonly code: string;

  preventDefault(): void;
  stopPropagation(): void;

  toKeyCodeChord(): KeyCodeChord;
  equals(keybinding: number): boolean;
}

export class StandardKeyboardEvent implements IKeyboardEvent {
  public readonly navtiveEvent: KeyboardEvent;
  public readonly target: HTMLElement;

  public readonly ctrlKey: boolean;
  public readonly shiftKey: boolean;
  public readonly altKey: boolean;
  public readonly metaKey: boolean;
  public readonly keyCode: KeyCode;
  public readonly code: string;

  private _asKeybinding: number;
  private _asKeyCodeChord: KeyCodeChord;

  constructor(source: KeyboardEvent) {
    const e = source;

    this.navtiveEvent = e;
    this.target = <HTMLElement>e.target;

    this.ctrlKey = e.ctrlKey;
    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.metaKey = e.metaKey;
    this.keyCode = extractKeyCode(e);
    this.code = e.code;

    this.ctrlKey = this.ctrlKey || this.keyCode === KeyCode.Ctrl;
    this.altKey = this.altKey || this.keyCode === KeyCode.Alt;
    this.shiftKey = this.shiftKey || this.keyCode === KeyCode.Shift;
    this.metaKey = this.metaKey || this.keyCode === KeyCode.Meta;

    this._asKeybinding = this._computeKeybinding();
    this._asKeyCodeChord = this._computeKeyCodeChord();
  }

  preventDefault(): void {
    if (this.navtiveEvent && this.navtiveEvent.preventDefault) {
      this.navtiveEvent.preventDefault();
    }
  }

  stopPropagation(): void {
    if (this.navtiveEvent && this.navtiveEvent.stopPropagation) {
      this.navtiveEvent.stopPropagation();
    }
  }

  toKeyCodeChord(): KeyCodeChord {
    return this._asKeyCodeChord;
  }

  equals(other: number): boolean {
    return this._asKeybinding === other;
  }

  private _computeKeybinding(): number {
    let key = KeyCode.Unknown;
    if (
      this.keyCode !== KeyCode.Ctrl &&
      this.keyCode !== KeyCode.Shift &&
      this.keyCode !== KeyCode.Alt &&
      this.keyCode !== KeyCode.Meta
    ) {
      key = this.keyCode;
    }

    let result = 0;
    if (this.ctrlKey) {
      result |= ctrlKeyMod;
    }
    if (this.altKey) {
      result |= altKeyMod;
    }
    if (this.shiftKey) {
      result |= shiftKeyMod;
    }
    if (this.metaKey) {
      result |= metaKeyMod;
    }
    result |= key;

    return result;
  }

  private _computeKeyCodeChord(): KeyCodeChord {
    let key = KeyCode.Unknown;
    if (
      this.keyCode !== KeyCode.Ctrl &&
      this.keyCode !== KeyCode.Shift &&
      this.keyCode !== KeyCode.Alt &&
      this.keyCode !== KeyCode.Meta
    ) {
      key = this.keyCode;
    }
    return new KeyCodeChord(this.ctrlKey, this.shiftKey, this.altKey, this.metaKey, key);
  }
}

function extractKeyCode(e: KeyboardEvent): KeyCode {
  const code = e.code;

  // browser quirks
  if (isFirefox) {
    switch (code) {
      case 'Backquote':
        if (isLinux) {
          return KeyCode.IntlBackslash;
        }
        break;
      case 'OSLeft':
        if (isMacintosh) {
          return KeyCode.Meta;
        }
        break;
    }
  }

  // cross browser keycodes:
  return EVENT_CODE_TO_KEY_CODE_MAP[code] || KeyCode.Unknown;
}
