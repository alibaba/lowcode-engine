import { OperatingSystem, OS } from '@alilc/lowcode-shared';
import { ICommandHandler, ICommandMetadata, CommandsRegistry } from '../command';
import { Keybinding } from './keybindings';
import { Extensions, Registry } from '../extension/registry';

export interface IKeybindingItem {
  keybinding: Keybinding | null;
  command: string | null;
  commandArgs?: any;
  weight1: number;
  weight2: number;
  extensionId: string | null;
  isBuiltinExtension: boolean;
}

export interface IKeybindings {
  primary?: number;
  secondary?: number[];
  win?: {
    primary: number;
    secondary?: number[];
  };
  linux?: {
    primary: number;
    secondary?: number[];
  };
  mac?: {
    primary: number;
    secondary?: number[];
  };
}

export interface IKeybindingRule extends IKeybindings {
  id: string;
  weight: number;
  args?: any;
}

export interface ICommandAndKeybindingRule extends IKeybindingRule {
  handler: ICommandHandler;
  metadata?: ICommandMetadata | null;
}

export interface IExtensionKeybindingRule {
  keybinding: Keybinding | null;
  id: string;
  args?: any;
  weight: number;
  extensionId?: string;
  isBuiltinExtension?: boolean;
}

export const enum KeybindingWeight {
  EditorCore = 0,
  EditorContrib = 100,
  WorkbenchContrib = 200,
  BuiltinExtension = 300,
  ExternalExtension = 400,
}

export interface IKeybindingsRegistry {
  registerKeybindingRule(rule: IKeybindingRule): void;
  setExtensionKeybindings(rules: IExtensionKeybindingRule[]): void;
  registerCommandAndKeybindingRule(desc: ICommandAndKeybindingRule): void;
  getDefaultKeybindings(): IKeybindingItem[];
}

export class KeybindingsRegistryImpl implements IKeybindingsRegistry {
  /**
   * Take current platform into account and reduce to primary & secondary.
   */
  private static bindToCurrentPlatform(kb: IKeybindings): {
    primary?: number;
    secondary?: number[];
  } {
    if (OS === OperatingSystem.Windows) {
      if (kb && kb.win) {
        return kb.win;
      }
    } else if (OS === OperatingSystem.Macintosh) {
      if (kb && kb.mac) {
        return kb.mac;
      }
    } else {
      if (kb && kb.linux) {
        return kb.linux;
      }
    }

    return kb;
  }

  registerKeybindingRule(rule: IKeybindingRule): void {
    const actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform(rule);
  }

  registerCommandAndKeybindingRule(desc: ICommandAndKeybindingRule): void {
    this.registerKeybindingRule(desc);
    CommandsRegistry.registerCommand(desc);
  }

  setExtensionKeybindings(rules: IExtensionKeybindingRule[]): void {}

  getDefaultKeybindings(): IKeybindingItem[] {}
}

export const KeybindingsRegistry = new KeybindingsRegistryImpl();

Registry.add(Extensions.Keybinding, KeybindingsRegistry);
