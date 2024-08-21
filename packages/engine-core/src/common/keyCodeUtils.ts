import { KeyCode } from './keyCodes';

class KeyCodeStrMap {
  public _keyCodeToStr: string[];
  public _strToKeyCode: { [str: string]: KeyCode };

  constructor() {
    this._keyCodeToStr = [];
    this._strToKeyCode = Object.create(null);
  }

  define(keyCode: KeyCode, str: string): void {
    this._keyCodeToStr[keyCode] = str;
    this._strToKeyCode[str.toLowerCase()] = keyCode;
  }

  keyCodeToStr(keyCode: KeyCode): string {
    return this._keyCodeToStr[keyCode];
  }

  strToKeyCode(str: string): KeyCode {
    return this._strToKeyCode[str.toLowerCase()] || KeyCode.Unknown;
  }
}

const uiMap = new KeyCodeStrMap();
const userSettingsUSMap = new KeyCodeStrMap();
const userSettingsGeneralMap = new KeyCodeStrMap();

export const KeyCodeUtils = {
  toString(keyCode: KeyCode): string {
    return uiMap.keyCodeToStr(keyCode);
  },
  fromString(key: string): KeyCode {
    return uiMap.strToKeyCode(key);
  },
  toUserSettingsUS(keyCode: KeyCode): string {
    return userSettingsUSMap.keyCodeToStr(keyCode);
  },
  toUserSettingsGeneral(keyCode: KeyCode): string {
    return userSettingsGeneralMap.keyCodeToStr(keyCode);
  },
  fromUserSettings(key: string): KeyCode {
    return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
  },
};

export const EVENT_CODE_TO_KEY_CODE_MAP: { [keyCode: string]: KeyCode } = {};

(function () {
  // See https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
  // see https://www.toptal.com/developers/keycode/table

  const empty = '';
  type IMappingEntry = [string, KeyCode, string, string, string];

  const mappings: IMappingEntry[] = [
    // scanCode, keyCode, keyCodeStr, usUserSettingsLabel, generalUserSettingsLabel
    ['Unidentified', KeyCode.Unknown, 'unknown', empty, empty],
    ['KeyA', KeyCode.KeyA, 'A', empty, empty],
    ['KeyB', KeyCode.KeyB, 'B', empty, empty],
    ['KeyC', KeyCode.KeyC, 'C', empty, empty],
    ['KeyD', KeyCode.KeyD, 'D', empty, empty],
    ['KeyE', KeyCode.KeyE, 'E', empty, empty],
    ['KeyF', KeyCode.KeyF, 'F', empty, empty],
    ['KeyG', KeyCode.KeyG, 'G', empty, empty],
    ['KeyH', KeyCode.KeyH, 'H', empty, empty],
    ['KeyI', KeyCode.KeyI, 'I', empty, empty],
    ['KeyJ', KeyCode.KeyJ, 'J', empty, empty],
    ['KeyK', KeyCode.KeyK, 'K', empty, empty],
    ['KeyL', KeyCode.KeyL, 'L', empty, empty],
    ['KeyM', KeyCode.KeyM, 'M', empty, empty],
    ['KeyN', KeyCode.KeyN, 'N', empty, empty],
    ['KeyO', KeyCode.KeyO, 'O', empty, empty],
    ['KeyP', KeyCode.KeyP, 'P', empty, empty],
    ['KeyQ', KeyCode.KeyQ, 'Q', empty, empty],
    ['KeyR', KeyCode.KeyR, 'R', empty, empty],
    ['KeyS', KeyCode.KeyS, 'S', empty, empty],
    ['KeyT', KeyCode.KeyT, 'T', empty, empty],
    ['KeyU', KeyCode.KeyU, 'U', empty, empty],
    ['KeyV', KeyCode.KeyV, 'V', empty, empty],
    ['KeyW', KeyCode.KeyW, 'W', empty, empty],
    ['KeyX', KeyCode.KeyX, 'X', empty, empty],
    ['KeyY', KeyCode.KeyY, 'Y', empty, empty],
    ['KeyZ', KeyCode.KeyZ, 'Z', empty, empty],
    ['Digit1', KeyCode.Digit1, '1', empty, empty],
    ['Digit2', KeyCode.Digit2, '2', empty, empty],
    ['Digit3', KeyCode.Digit3, '3', empty, empty],
    ['Digit4', KeyCode.Digit4, '4', empty, empty],
    ['Digit5', KeyCode.Digit5, '5', empty, empty],
    ['Digit6', KeyCode.Digit6, '6', empty, empty],
    ['Digit7', KeyCode.Digit7, '7', empty, empty],
    ['Digit8', KeyCode.Digit8, '8', empty, empty],
    ['Digit9', KeyCode.Digit9, '9', empty, empty],
    ['Digit0', KeyCode.Digit0, '0', empty, empty],
    ['Enter', KeyCode.Enter, 'Enter', empty, empty],
    ['Escape', KeyCode.Escape, 'Escape', empty, empty],
    ['Backspace', KeyCode.Backspace, 'Backspace', empty, empty],
    ['Tab', KeyCode.Tab, 'Tab', empty, empty],
    ['Space', KeyCode.Space, 'Space', empty, empty],
    ['Minus', KeyCode.Minus, '-', '-', 'OEM_MINUS'],
    ['Equal', KeyCode.Equal, '=', '=', 'OEM_PLUS'],
    ['BracketLeft', KeyCode.BracketLeft, '[', '[', 'OEM_4'],
    ['BracketRight', KeyCode.BracketRight, ']', ']', 'OEM_6'],
    ['Backslash', KeyCode.Backslash, '\\', '\\', 'OEM_5'],
    ['Semicolon', KeyCode.Semicolon, ';', ';', 'OEM_1'],
    ['Quote', KeyCode.Quote, `'`, `'`, 'OEM_7'],
    ['Backquote', KeyCode.Backquote, '`', '`', 'OEM_3'],
    ['Comma', KeyCode.Comma, ',', ',', 'OEM_COMMA'],
    ['Period', KeyCode.Period, '.', '.', 'OEM_PERIOD'],
    ['Slash', KeyCode.Slash, '/', '/', 'OEM_2'],
    ['CapsLock', KeyCode.CapsLock, 'CapsLock', empty, empty],
    ['F1', KeyCode.F1, 'F1', empty, empty],
    ['F2', KeyCode.F2, 'F2', empty, empty],
    ['F3', KeyCode.F3, 'F3', empty, empty],
    ['F4', KeyCode.F4, 'F4', empty, empty],
    ['F5', KeyCode.F5, 'F5', empty, empty],
    ['F6', KeyCode.F6, 'F6', empty, empty],
    ['F7', KeyCode.F7, 'F7', empty, empty],
    ['F8', KeyCode.F8, 'F8', empty, empty],
    ['F9', KeyCode.F9, 'F9', empty, empty],
    ['F10', KeyCode.F10, 'F10', empty, empty],
    ['F11', KeyCode.F11, 'F11', empty, empty],
    ['F12', KeyCode.F12, 'F12', empty, empty],
    ['PrintScreen', KeyCode.Unknown, empty, empty, empty],
    ['ScrollLock', KeyCode.ScrollLock, 'ScrollLock', empty, empty],
    ['Pause', KeyCode.PauseBreak, 'PauseBreak', empty, empty],
    ['Insert', KeyCode.Insert, 'Insert', empty, empty],
    ['Home', KeyCode.Home, 'Home', empty, empty],
    ['PageUp', KeyCode.PageUp, 'PageUp', empty, empty],
    ['Delete', KeyCode.Delete, 'Delete', empty, empty],
    ['End', KeyCode.End, 'End', empty, empty],
    ['PageDown', KeyCode.PageDown, 'PageDown', empty, empty],
    ['ArrowRight', KeyCode.RightArrow, 'RightArrow', 'Right', empty],
    ['ArrowLeft', KeyCode.LeftArrow, 'LeftArrow', 'Left', empty],
    ['ArrowDown', KeyCode.DownArrow, 'DownArrow', 'Down', empty],
    ['ArrowUp', KeyCode.UpArrow, 'UpArrow', 'Up', empty],
    ['NumLock', KeyCode.NumLock, 'NumLock', empty, empty],
    ['NumpadDivide', KeyCode.NumpadDivide, 'NumPad_Divide', empty, empty],
    ['NumpadMultiply', KeyCode.NumpadMultiply, 'NumPad_Multiply', empty, empty],
    ['NumpadSubtract', KeyCode.NumpadSubtract, 'NumPad_Subtract', empty, empty],
    ['NumpadAdd', KeyCode.NumpadAdd, 'NumPad_Add', empty, empty],
    ['NumpadEnter', KeyCode.Enter, empty, empty, empty],
    ['Numpad1', KeyCode.Numpad1, 'NumPad1', empty, empty],
    ['Numpad2', KeyCode.Numpad2, 'NumPad2', empty, empty],
    ['Numpad3', KeyCode.Numpad3, 'NumPad3', empty, empty],
    ['Numpad4', KeyCode.Numpad4, 'NumPad4', empty, empty],
    ['Numpad5', KeyCode.Numpad5, 'NumPad5', empty, empty],
    ['Numpad6', KeyCode.Numpad6, 'NumPad6', empty, empty],
    ['Numpad7', KeyCode.Numpad7, 'NumPad7', empty, empty],
    ['Numpad8', KeyCode.Numpad8, 'NumPad8', empty, empty],
    ['Numpad9', KeyCode.Numpad9, 'NumPad9', empty, empty],
    ['Numpad0', KeyCode.Numpad0, 'NumPad0', empty, empty],
    ['NumpadDecimal', KeyCode.NumpadDecimal, 'NumPad_Decimal', empty, empty],
    ['IntlBackslash', KeyCode.IntlBackslash, 'OEM_102', empty, empty],
    ['ContextMenu', KeyCode.ContextMenu, 'ContextMenu', empty, empty],
    ['Power', KeyCode.Unknown, empty, empty, empty],
    ['NumpadEqual', KeyCode.Unknown, empty, empty, empty],
    ['F13', KeyCode.F13, 'F13', empty, empty],
    ['F14', KeyCode.F14, 'F14', empty, empty],
    ['F15', KeyCode.F15, 'F15', empty, empty],
    ['F16', KeyCode.F16, 'F16', empty, empty],
    ['F17', KeyCode.F17, 'F17', empty, empty],
    ['F18', KeyCode.F18, 'F18', empty, empty],
    ['F19', KeyCode.F19, 'F19', empty, empty],
    ['F20', KeyCode.F20, 'F20', empty, empty],
    ['F21', KeyCode.F21, 'F21', empty, empty],
    ['F22', KeyCode.F22, 'F22', empty, empty],
    ['F23', KeyCode.F23, 'F23', empty, empty],
    ['F24', KeyCode.F24, 'F24', empty, empty],
    ['AudioVolumeMute', KeyCode.AudioVolumeMute, 'AudioVolumeMute', empty, empty],
    ['AudioVolumeUp', KeyCode.AudioVolumeUp, 'AudioVolumeUp', empty, empty],
    ['AudioVolumeDown', KeyCode.AudioVolumeDown, 'AudioVolumeDown', empty, empty],
    ['NumpadComma', KeyCode.NUMPAD_SEPARATOR, 'NumPad_Separator', empty, empty],
    ['IntlRo', KeyCode.ABNT_C1, 'ABNT_C1', empty, empty],
    ['NumpadClear', KeyCode.Clear, 'Clear', empty, empty],
    [empty, KeyCode.Ctrl, 'Ctrl', empty, empty],
    [empty, KeyCode.Shift, 'Shift', empty, empty],
    [empty, KeyCode.Alt, 'Alt', empty, empty],
    [empty, KeyCode.Meta, 'Meta', empty, empty],
    ['ControlLeft', KeyCode.Ctrl, empty, empty, empty],
    ['ShiftLeft', KeyCode.Shift, empty, empty, empty],
    ['AltLeft', KeyCode.Alt, empty, empty, empty],
    ['MetaLeft', KeyCode.Meta, empty, empty, empty],
    ['ControlRight', KeyCode.Ctrl, empty, empty, empty],
    ['ShiftRight', KeyCode.Shift, empty, empty, empty],
    ['AltRight', KeyCode.Alt, empty, empty, empty],
    ['MetaRight', KeyCode.Meta, empty, empty, empty],
    ['MediaTrackNext', KeyCode.MediaTrackNext, 'MediaTrackNext', empty, empty],
    ['MediaTrackPrevious', KeyCode.MediaTrackPrevious, 'MediaTrackPrevious', empty, empty],
    ['MediaStop', KeyCode.MediaStop, 'MediaStop', empty, empty],
    ['MediaPlayPause', KeyCode.MediaPlayPause, 'MediaPlayPause', empty, empty],
    ['MediaSelect', KeyCode.LaunchMediaPlayer, 'LaunchMediaPlayer', empty, empty],
    ['LaunchMail', KeyCode.LaunchMail, 'LaunchMail', empty, empty],
    ['LaunchApp2', KeyCode.LaunchApp2, 'LaunchApp2', empty, empty],
    ['LaunchScreenSaver', KeyCode.Unknown, empty, empty, empty],
    ['BrowserSearch', KeyCode.BrowserSearch, 'BrowserSearch', empty, empty],
    ['BrowserHome', KeyCode.BrowserHome, 'BrowserHome', empty, empty],
    ['BrowserBack', KeyCode.BrowserBack, 'BrowserBack', empty, empty],
    ['BrowserForward', KeyCode.BrowserForward, 'BrowserForward', empty, empty],

    // See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
    // If an Input Method Editor is processing key input and the event is keydown, return 229.
    [empty, KeyCode.KEY_IN_COMPOSITION, 'KeyInComposition', empty, empty],
    [empty, KeyCode.ABNT_C2, 'ABNT_C2', empty, empty],
    [empty, KeyCode.OEM_8, 'OEM_8', empty, empty],
  ];

  const seenKeyCode: boolean[] = [];

  for (const mapping of mappings) {
    const [scanCode, keyCode, keyCodeStr, usUserSettingsLabel, generalUserSettingsLabel] = mapping;

    if (!seenKeyCode[keyCode]) {
      seenKeyCode[keyCode] = true;
      if (!keyCodeStr) {
        throw new Error(`String representation missing for key code ${keyCode} around scan code ${scanCode}`);
      }
      uiMap.define(keyCode, keyCodeStr);
      userSettingsUSMap.define(keyCode, usUserSettingsLabel || keyCodeStr);
      userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel || usUserSettingsLabel || keyCodeStr);
    }

    if (scanCode) {
      EVENT_CODE_TO_KEY_CODE_MAP[scanCode] = keyCode;
    }
  }

  console.log(
    '%c [ IMMUTABLE_KEY_CODE_TO_CODE ]-500',
    'font-size:13px; background:pink; color:#bf2c9f;',
    uiMap,
    userSettingsUSMap,
    userSettingsGeneralMap,
    EVENT_CODE_TO_KEY_CODE_MAP,
  );
})();

export function KeyChord(firstPart: number, secondPart: number): number {
  const chordPart = ((secondPart & 0x0000ffff) << 16) >>> 0;
  return (firstPart | chordPart) >>> 0;
}
