import { OperatingSystem, OS } from '@alilc/lowcode-shared';
import { BaseResolvedKeybinding, Keybinding, KeyCodeChord, SingleModifierChord } from './keybindings';
import { KeyCode, KeyCodeUtils } from '../common';
import { toEmptyArrayIfContainsNull } from './keybindingResolver';

export class USLayoutResolvedKeybinding extends BaseResolvedKeybinding {
  public static resolveKeybinding(keybinding: Keybinding): USLayoutResolvedKeybinding[] {
    const chords: KeyCodeChord[] = toEmptyArrayIfContainsNull(keybinding.chords);
    if (chords.length > 0) {
      return [new USLayoutResolvedKeybinding(chords)];
    }
    return [];
  }

  constructor(chords: KeyCodeChord[]) {
    super(chords);
  }

  private _keyCodeToUILabel(keyCode: KeyCode): string {
    if (OS === OperatingSystem.Macintosh) {
      switch (keyCode) {
        case KeyCode.LeftArrow:
          return '←';
        case KeyCode.UpArrow:
          return '↑';
        case KeyCode.RightArrow:
          return '→';
        case KeyCode.DownArrow:
          return '↓';
      }
    }
    return KeyCodeUtils.toString(keyCode);
  }

  protected _getLabel(chord: KeyCodeChord): string | null {
    if (chord.isDuplicateModifierCase()) {
      return '';
    }
    return this._keyCodeToUILabel(chord.keyCode);
  }

  protected _getAriaLabel(chord: KeyCodeChord): string | null {
    if (chord.isDuplicateModifierCase()) {
      return '';
    }
    return KeyCodeUtils.toString(chord.keyCode);
  }

  protected _getUserSettingsLabel(chord: KeyCodeChord): string | null {
    if (chord.isDuplicateModifierCase()) {
      return '';
    }
    const result = KeyCodeUtils.toUserSettingsUS(chord.keyCode);
    return result ? result.toLowerCase() : result;
  }

  protected _isWYSIWYG(): boolean {
    return true;
  }

  protected _getChordDispatch(chord: KeyCodeChord): string | null {
    return USLayoutResolvedKeybinding.getDispatchStr(chord);
  }

  public static getDispatchStr(chord: KeyCodeChord): string | null {
    if (chord.isModifierKey()) {
      return null;
    }
    let result = '';

    if (chord.ctrlKey) {
      result += 'ctrl+';
    }
    if (chord.shiftKey) {
      result += 'shift+';
    }
    if (chord.altKey) {
      result += 'alt+';
    }
    if (chord.metaKey) {
      result += 'meta+';
    }
    result += KeyCodeUtils.toString(chord.keyCode);

    return result;
  }

  protected _getSingleModifierChordDispatch(keybinding: KeyCodeChord): SingleModifierChord | null {
    if (keybinding.keyCode === KeyCode.Ctrl && !keybinding.shiftKey && !keybinding.altKey && !keybinding.metaKey) {
      return 'ctrl';
    }
    if (keybinding.keyCode === KeyCode.Shift && !keybinding.ctrlKey && !keybinding.altKey && !keybinding.metaKey) {
      return 'shift';
    }
    if (keybinding.keyCode === KeyCode.Alt && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.metaKey) {
      return 'alt';
    }
    if (keybinding.keyCode === KeyCode.Meta && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.altKey) {
      return 'meta';
    }
    return null;
  }
}
