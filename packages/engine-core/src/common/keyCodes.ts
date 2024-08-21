/**
 * Virtual Key Codes, the value does not hold any inherent meaning.
 * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
 * But these are "more general", as they should work across browsers & OS`s.
 */
export const enum KeyCode {
  DependsOnKbLayout = -1,

  /**
   * Placed first to cover the 0 value of the enum.
   */
  Unknown = 0,

  Backspace,
  Tab,
  Enter,
  Shift,
  Ctrl,
  Alt,
  PauseBreak,
  CapsLock,
  Escape,
  Space,
  PageUp,
  PageDown,
  End,
  Home,
  LeftArrow,
  UpArrow,
  RightArrow,
  DownArrow,
  Insert,
  Delete,

  Digit0,
  Digit1,
  Digit2,
  Digit3,
  Digit4,
  Digit5,
  Digit6,
  Digit7,
  Digit8,
  Digit9,

  KeyA,
  KeyB,
  KeyC,
  KeyD,
  KeyE,
  KeyF,
  KeyG,
  KeyH,
  KeyI,
  KeyJ,
  KeyK,
  KeyL,
  KeyM,
  KeyN,
  KeyO,
  KeyP,
  KeyQ,
  KeyR,
  KeyS,
  KeyT,
  KeyU,
  KeyV,
  KeyW,
  KeyX,
  KeyY,
  KeyZ,

  Meta,
  ContextMenu,

  F1,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  F10,
  F11,
  F12,
  F13,
  F14,
  F15,
  F16,
  F17,
  F18,
  F19,
  F20,
  F21,
  F22,
  F23,
  F24,

  NumLock,
  ScrollLock,

  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the ';:' key
   */
  Semicolon,
  /**
   * For any country/region, the '+' key
   * For the US standard keyboard, the '=+' key
   */
  Equal,
  /**
   * For any country/region, the ',' key
   * For the US standard keyboard, the ',<' key
   */
  Comma,
  /**
   * For any country/region, the '-' key
   * For the US standard keyboard, the '-_' key
   */
  Minus,
  /**
   * For any country/region, the '.' key
   * For the US standard keyboard, the '.>' key
   */
  Period,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '/?' key
   */
  Slash,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '`~' key
   */
  Backquote,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '[{' key
   */
  BracketLeft,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the '\|' key
   */
  Backslash,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the ']}' key
   */
  BracketRight,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   * For the US standard keyboard, the ''"' key
   */
  Quote,
  /**
   * Used for miscellaneous characters; it can vary by keyboard.
   */
  OEM_8,
  /**
   * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
   */
  IntlBackslash,

  Numpad0, // VK_NUMPAD0, 0x60, Numeric keypad 0 key
  Numpad1, // VK_NUMPAD1, 0x61, Numeric keypad 1 key
  Numpad2, // VK_NUMPAD2, 0x62, Numeric keypad 2 key
  Numpad3, // VK_NUMPAD3, 0x63, Numeric keypad 3 key
  Numpad4, // VK_NUMPAD4, 0x64, Numeric keypad 4 key
  Numpad5, // VK_NUMPAD5, 0x65, Numeric keypad 5 key
  Numpad6, // VK_NUMPAD6, 0x66, Numeric keypad 6 key
  Numpad7, // VK_NUMPAD7, 0x67, Numeric keypad 7 key
  Numpad8, // VK_NUMPAD8, 0x68, Numeric keypad 8 key
  Numpad9, // VK_NUMPAD9, 0x69, Numeric keypad 9 key

  NumpadMultiply, // VK_MULTIPLY, 0x6A, Multiply key
  NumpadAdd, // VK_ADD, 0x6B, Add key
  NUMPAD_SEPARATOR, // VK_SEPARATOR, 0x6C, Separator key
  NumpadSubtract, // VK_SUBTRACT, 0x6D, Subtract key
  NumpadDecimal, // VK_DECIMAL, 0x6E, Decimal key
  NumpadDivide, // VK_DIVIDE, 0x6F,

  /**
   * Cover all key codes when IME is processing input.
   */
  KEY_IN_COMPOSITION,

  ABNT_C1, // Brazilian (ABNT) Keyboard
  ABNT_C2, // Brazilian (ABNT) Keyboard

  AudioVolumeMute,
  AudioVolumeUp,
  AudioVolumeDown,

  BrowserSearch,
  BrowserHome,
  BrowserBack,
  BrowserForward,

  MediaTrackNext,
  MediaTrackPrevious,
  MediaStop,
  MediaPlayPause,
  LaunchMediaPlayer,
  LaunchMail,
  LaunchApp2,

  /**
   * VK_CLEAR, 0x0C, CLEAR key
   */
  Clear,

  /**
   * Placed last to cover the length of the enum.
   * Please do not depend on this value!
   */
  MAX_VALUE,
}
