import { OperatingSystem, OS } from '@alilc/lowcode-shared';
import { Modifiers } from './keybindings';

export interface ModifierLabels {
  readonly ctrlKey: string;
  readonly shiftKey: string;
  readonly altKey: string;
  readonly metaKey: string;
  readonly separator: string;
}

export interface KeyLabelProvider<T extends Modifiers> {
  (keybinding: T): string | null;
}

export class ModifierLabelProvider {
  public readonly modifierLabels: ModifierLabels[];

  constructor(mac: ModifierLabels, windows: ModifierLabels, linux: ModifierLabels = windows) {
    this.modifierLabels = [null!]; // index 0 will never me accessed.
    this.modifierLabels[OperatingSystem.Macintosh] = mac;
    this.modifierLabels[OperatingSystem.Windows] = windows;
    this.modifierLabels[OperatingSystem.Linux] = linux;
  }

  public toLabel<T extends Modifiers>(chords: readonly T[], keyLabelProvider: KeyLabelProvider<T>): string | null {
    if (chords.length === 0) {
      return null;
    }

    const result: string[] = [];
    for (let i = 0, len = chords.length; i < len; i++) {
      const chord = chords[i];
      const keyLabel = keyLabelProvider(chord);
      if (keyLabel === null) {
        // this keybinding cannot be expressed...
        return null;
      }
      result[i] = _simpleAsString(chord, keyLabel, this.modifierLabels[OS]);
    }
    return result.join(' ');
  }
}

function _simpleAsString(modifiers: Modifiers, key: string, labels: ModifierLabels): string {
  if (key === null) {
    return '';
  }

  const result: string[] = [];

  // translate modifier keys: Ctrl-Shift-Alt-Meta
  if (modifiers.ctrlKey) {
    result.push(labels.ctrlKey);
  }

  if (modifiers.shiftKey) {
    result.push(labels.shiftKey);
  }

  if (modifiers.altKey) {
    result.push(labels.altKey);
  }

  if (modifiers.metaKey) {
    result.push(labels.metaKey);
  }

  // the actual key
  if (key !== '') {
    result.push(key);
  }

  return result.join(labels.separator);
}

/**
 * A label provider that prints modifiers in a suitable format for displaying in the UI.
 */
export const UILabelProvider = new ModifierLabelProvider(
  {
    ctrlKey: '\u2303',
    shiftKey: '⇧',
    altKey: '⌥',
    metaKey: '⌘',
    separator: '',
  },
  {
    ctrlKey: 'Ctrl',
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Windows',
    separator: '+',
  },
  {
    ctrlKey: 'Ctrl',
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Super',
    separator: '+',
  },
);

/**
 * A label provider that prints modifiers in a suitable format for ARIA.
 */
export const AriaLabelProvider = new ModifierLabelProvider(
  {
    ctrlKey: 'Control',
    shiftKey: 'Shift',
    altKey: 'Option',
    metaKey: 'Command',
    separator: '+',
  },
  {
    ctrlKey: 'Control',
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Windows',
    separator: '+',
  },
  {
    ctrlKey: 'Control',
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Super',
    separator: '+',
  },
);

/**
 * A label provider that prints modifiers in a suitable format for user settings.
 */
export const UserSettingsLabelProvider = new ModifierLabelProvider(
  {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'cmd',
    separator: '+',
  },
  {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'win',
    separator: '+',
  },
  {
    ctrlKey: 'ctrl',
    shiftKey: 'shift',
    altKey: 'alt',
    metaKey: 'meta',
    separator: '+',
  },
);
