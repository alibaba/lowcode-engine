import { IKeyboardEvent } from './keybindingEvent';
import { Keybinding, KeyCodeChord, ResolvedKeybinding } from './keybindings';
import { USLayoutResolvedKeybinding } from './usLayoutResolvedKeybinding';

export interface IKeyboardMapper {
  resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
  resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
}

/**
 * A keyboard mapper to be used when reading the keymap.
 */
export class USLayoutKeyboardMapper implements IKeyboardMapper {
  public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
    const ctrlKey = keyboardEvent.ctrlKey;
    const altKey = keyboardEvent.altKey;
    const chord = new KeyCodeChord(
      ctrlKey,
      keyboardEvent.shiftKey,
      altKey,
      keyboardEvent.metaKey,
      keyboardEvent.keyCode,
    );
    const result = this.resolveKeybinding(new Keybinding([chord]));
    return result[0];
  }

  public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
    return USLayoutResolvedKeybinding.resolveKeybinding(keybinding);
  }
}
