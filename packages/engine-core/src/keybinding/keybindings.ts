import { illegalArgument, OperatingSystem } from '@alilc/lowcode-shared';
import { KeyCode } from '../common/keyCodes';
import { AriaLabelProvider, UILabelProvider, UserSettingsLabelProvider } from './keybingdingLabels';

/**
 * Binary encoding strategy:
 * ```
 *    1111 11
 *    5432 1098 7654 3210
 *    ---- CSAW KKKK KKKK
 *  C = bit 11 = ctrlCmd flag
 *  S = bit 10 = shift flag
 *  A = bit 9 = alt flag
 *  W = bit 8 = winCtrl flag
 *  K = bits 0-7 = key code
 * ```
 */
export const enum BinaryKeybindingsMask {
  CtrlCmd = (1 << 11) >>> 0,
  Shift = (1 << 10) >>> 0,
  Alt = (1 << 9) >>> 0,
  WinCtrl = (1 << 8) >>> 0,
  KeyCode = 0x000000ff,
}

export function decodeKeybinding(keybinding: number | number[], OS: OperatingSystem): Keybinding | null {
  if (typeof keybinding === 'number') {
    if (keybinding === 0) {
      return null;
    }

    const firstChord = (keybinding & 0x0000ffff) >>> 0;
    const secondChord = (keybinding & 0xffff0000) >>> 16;

    if (secondChord !== 0) {
      return new Keybinding([createSimpleKeybinding(firstChord, OS), createSimpleKeybinding(secondChord, OS)]);
    }

    return new Keybinding([createSimpleKeybinding(firstChord, OS)]);
  } else {
    const chords = [];

    for (let i = 0; i < keybinding.length; i++) {
      chords.push(createSimpleKeybinding(keybinding[i], OS));
    }

    return new Keybinding(chords);
  }
}

export function createSimpleKeybinding(keybinding: number, OS: OperatingSystem): KeyCodeChord {
  const ctrlCmd = keybinding & BinaryKeybindingsMask.CtrlCmd ? true : false;
  const winCtrl = keybinding & BinaryKeybindingsMask.WinCtrl ? true : false;

  const ctrlKey = OS === OperatingSystem.Macintosh ? winCtrl : ctrlCmd;
  const shiftKey = keybinding & BinaryKeybindingsMask.Shift ? true : false;
  const altKey = keybinding & BinaryKeybindingsMask.Alt ? true : false;
  const metaKey = OS === OperatingSystem.Macintosh ? ctrlCmd : winCtrl;
  const keyCode = keybinding & BinaryKeybindingsMask.KeyCode;

  return new KeyCodeChord(ctrlKey, shiftKey, altKey, metaKey, keyCode);
}

export interface Modifiers {
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
}

/**
 * Represents a chord which uses the `keyCode` field of keyboard events.
 * A chord is a combination of keys pressed simultaneously.
 */
export class KeyCodeChord implements Modifiers {
  constructor(
    public readonly ctrlKey: boolean,
    public readonly shiftKey: boolean,
    public readonly altKey: boolean,
    public readonly metaKey: boolean,
    public readonly keyCode: KeyCode,
  ) {}

  equals(other: KeyCodeChord): boolean {
    return (
      other instanceof KeyCodeChord &&
      this.ctrlKey === other.ctrlKey &&
      this.shiftKey === other.shiftKey &&
      this.altKey === other.altKey &&
      this.metaKey === other.metaKey &&
      this.keyCode === other.keyCode
    );
  }

  getHashCode(): string {
    const ctrl = this.ctrlKey ? '1' : '0';
    const shift = this.shiftKey ? '1' : '0';
    const alt = this.altKey ? '1' : '0';
    const meta = this.metaKey ? '1' : '0';
    return `K${ctrl}${shift}${alt}${meta}${this.keyCode}`;
  }

  isModifierKey(): boolean {
    return (
      this.keyCode === KeyCode.Unknown ||
      this.keyCode === KeyCode.Ctrl ||
      this.keyCode === KeyCode.Meta ||
      this.keyCode === KeyCode.Alt ||
      this.keyCode === KeyCode.Shift
    );
  }

  toKeybinding(): Keybinding {
    return new Keybinding([this]);
  }

  /**
   * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
   */
  isDuplicateModifierCase(): boolean {
    return (
      (this.ctrlKey && this.keyCode === KeyCode.Ctrl) ||
      (this.shiftKey && this.keyCode === KeyCode.Shift) ||
      (this.altKey && this.keyCode === KeyCode.Alt) ||
      (this.metaKey && this.keyCode === KeyCode.Meta)
    );
  }
}

/**
 * A keybinding is a sequence of chords.
 */
export class Keybinding {
  readonly chords: KeyCodeChord[];

  constructor(chords: KeyCodeChord[]) {
    if (chords.length === 0) {
      throw illegalArgument(`chords`);
    }
    this.chords = chords;
  }

  getHashCode(): string {
    let result = '';
    for (let i = 0, len = this.chords.length; i < len; i++) {
      if (i !== 0) {
        result += ';';
      }
      result += this.chords[i].getHashCode();
    }
    return result;
  }

  equals(other: Keybinding | null): boolean {
    if (other === null) {
      return false;
    }
    if (this.chords.length !== other.chords.length) {
      return false;
    }
    for (let i = 0; i < this.chords.length; i++) {
      if (!this.chords[i].equals(other.chords[i])) {
        return false;
      }
    }
    return true;
  }
}

export class ResolvedChord {
  constructor(
    public readonly ctrlKey: boolean,
    public readonly shiftKey: boolean,
    public readonly altKey: boolean,
    public readonly metaKey: boolean,
    public readonly keyLabel: string | null,
    public readonly keyAriaLabel: string | null,
  ) {}
}

export type SingleModifierChord = 'ctrl' | 'shift' | 'alt' | 'meta';

/**
 * A resolved keybinding. Consists of one or multiple chords.
 */
export abstract class ResolvedKeybinding {
  /**
   * This prints the binding in a format suitable for displaying in the UI.
   */
  public abstract getLabel(): string | null;
  /**
   * This prints the binding in a format suitable for ARIA.
   */
  public abstract getAriaLabel(): string | null;
  /**
   * This prints the binding in a format suitable for user settings.
   */
  public abstract getUserSettingsLabel(): string | null;
  /**
   * Is the user settings label reflecting the label?
   */
  public abstract isWYSIWYG(): boolean;
  /**
   * Does the keybinding consist of more than one chord?
   */
  public abstract hasMultipleChords(): boolean;
  /**
   * Returns the chords that comprise of the keybinding.
   */
  public abstract getChords(): ResolvedChord[];
  /**
   * Returns the chords as strings useful for dispatching.
   * Returns null for modifier only chords.
   * @example keybinding "Shift" -> null
   * @example keybinding ("D" with shift == true) -> "shift+D"
   */
  public abstract getDispatchChords(): (string | null)[];
  /**
   * Returns the modifier only chords as strings useful for dispatching.
   * Returns null for chords that contain more than one modifier or a regular key.
   * @example keybinding "Shift" -> "shift"
   * @example keybinding ("D" with shift == true") -> null
   */
  public abstract getSingleModifierDispatchChords(): (SingleModifierChord | null)[];
}

export abstract class BaseResolvedKeybinding extends ResolvedKeybinding {
  protected readonly _chords: readonly KeyCodeChord[];

  constructor(chords: readonly KeyCodeChord[]) {
    super();
    if (chords.length === 0) {
      throw illegalArgument(`chords`);
    }
    this._chords = chords;
  }

  public getLabel(): string | null {
    return UILabelProvider.toLabel(this._chords, (keybinding) => this._getLabel(keybinding));
  }

  public getAriaLabel(): string | null {
    return AriaLabelProvider.toLabel(this._chords, (keybinding) => this._getAriaLabel(keybinding));
  }

  public getUserSettingsLabel(): string | null {
    return UserSettingsLabelProvider.toLabel(this._chords, (keybinding) => this._getUserSettingsLabel(keybinding));
  }

  public isWYSIWYG(): boolean {
    return this._chords.every((keybinding) => this._isWYSIWYG(keybinding));
  }

  public hasMultipleChords(): boolean {
    return this._chords.length > 1;
  }

  public getChords(): ResolvedChord[] {
    return this._chords.map((keybinding) => this._getChord(keybinding));
  }

  private _getChord(keybinding: KeyCodeChord): ResolvedChord {
    return new ResolvedChord(
      keybinding.ctrlKey,
      keybinding.shiftKey,
      keybinding.altKey,
      keybinding.metaKey,
      this._getLabel(keybinding),
      this._getAriaLabel(keybinding),
    );
  }

  public getDispatchChords(): (string | null)[] {
    return this._chords.map((keybinding) => this._getChordDispatch(keybinding));
  }

  public getSingleModifierDispatchChords(): (SingleModifierChord | null)[] {
    return this._chords.map((keybinding) => this._getSingleModifierChordDispatch(keybinding));
  }

  protected abstract _getLabel(keybinding: KeyCodeChord): string | null;
  protected abstract _getAriaLabel(keybinding: KeyCodeChord): string | null;
  protected abstract _getUserSettingsLabel(keybinding: KeyCodeChord): string | null;
  protected abstract _isWYSIWYG(keybinding: KeyCodeChord): boolean;
  protected abstract _getChordDispatch(keybinding: KeyCodeChord): string | null;
  protected abstract _getSingleModifierChordDispatch(keybinding: KeyCodeChord): SingleModifierChord | null;
}
