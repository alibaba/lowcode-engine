import {
  combinedDisposable,
  DisposableStore,
  IDisposable,
  LinkedList,
  OperatingSystem,
  OS,
  toDisposable,
} from '@alilc/lowcode-shared';
import { ICommandHandler, ICommandMetadata, CommandsRegistry } from '../command';
import { decodeKeybinding, Keybinding } from './keybindings';
import { Extensions, Registry } from '../extension/registry';

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
  extensionId: string;
}

export interface IKeybindingItem {
  keybinding: Keybinding | null;
  command: string | null;
  commandArgs?: any;
  weight1: number;
  weight2: number;
  extensionId: string | null;
}

export const enum KeybindingWeight {
  EditorCore = 0,
  EditorContrib = 100,
  WorkbenchContrib = 200,
  BuiltinExtension = 300,
  ExternalExtension = 400,
}

export interface IKeybindingsRegistry {
  registerKeybindingRule(rule: IKeybindingRule): IDisposable;

  setExtensionKeybindings(rules: IExtensionKeybindingRule[]): void;

  registerCommandAndKeybindingRule(desc: ICommandAndKeybindingRule): IDisposable;

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

  private _coreKeybindings: LinkedList<IKeybindingItem>;
  private _extensionKeybindings: IKeybindingItem[];
  private _cachedMergedKeybindings: IKeybindingItem[] | null;

  constructor() {
    this._coreKeybindings = new LinkedList();
    this._extensionKeybindings = [];
    this._cachedMergedKeybindings = null;
  }

  registerKeybindingRule(rule: IKeybindingRule): IDisposable {
    const actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform(rule);

    const result = new DisposableStore();

    if (actualKb && actualKb.primary) {
      const kk = decodeKeybinding(actualKb.primary, OS);
      if (kk) {
        result.add(this._registerDefaultKeybinding(kk, rule.id, rule.args, rule.weight, 0));
      }
    }

    if (actualKb && Array.isArray(actualKb.secondary)) {
      for (let i = 0, len = actualKb.secondary.length; i < len; i++) {
        const k = actualKb.secondary[i];
        const kk = decodeKeybinding(k, OS);
        if (kk) {
          result.add(this._registerDefaultKeybinding(kk, rule.id, rule.args, rule.weight, -i - 1));
        }
      }
    }

    return result;
  }

  private _registerDefaultKeybinding(
    keybinding: Keybinding,
    commandId: string,
    commandArgs: any,
    weight1: number,
    weight2: number,
  ): IDisposable {
    const remove = this._coreKeybindings.push({
      keybinding: keybinding,
      command: commandId,
      commandArgs: commandArgs,
      weight1: weight1,
      weight2: weight2,
      extensionId: null,
    });
    this._cachedMergedKeybindings = null;

    return toDisposable(() => {
      remove();
      this._cachedMergedKeybindings = null;
    });
  }

  registerCommandAndKeybindingRule(desc: ICommandAndKeybindingRule): IDisposable {
    return combinedDisposable(this.registerKeybindingRule(desc), CommandsRegistry.registerCommand(desc));
  }

  setExtensionKeybindings(rules: IExtensionKeybindingRule[]): void {
    const result: IKeybindingItem[] = [];

    for (const rule of rules) {
      if (rule.keybinding) {
        result.push({
          keybinding: rule.keybinding,
          command: rule.id,
          commandArgs: rule.args,
          weight1: rule.weight,
          weight2: 0,
          extensionId: rule.extensionId || null,
        });
      }
    }

    this._extensionKeybindings = result;
    this._cachedMergedKeybindings = null;
  }

  getDefaultKeybindings(): IKeybindingItem[] {
    if (!this._cachedMergedKeybindings) {
      this._cachedMergedKeybindings = Array.from(this._coreKeybindings).concat(this._extensionKeybindings);
      this._cachedMergedKeybindings.sort(sorter);
    }
    return this._cachedMergedKeybindings.slice(0);
  }
}

function sorter(a: IKeybindingItem, b: IKeybindingItem): number {
  if (a.weight1 !== b.weight1) {
    return a.weight1 - b.weight1;
  }
  if (a.command && b.command) {
    if (a.command < b.command) {
      return -1;
    }
    if (a.command > b.command) {
      return 1;
    }
  }
  return a.weight2 - b.weight2;
}

export const KeybindingsRegistry = new KeybindingsRegistryImpl();

Registry.add(Extensions.Keybinding, KeybindingsRegistry);
