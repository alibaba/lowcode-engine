import { Events, createDecorator } from '@alilc/lowcode-shared';
import { Keybinding, ResolvedKeybinding } from './keybindings';
import { ResolvedKeybindingItem } from './keybindingResolver';
import { type IKeyboardEvent } from './keybindingEvent';

export interface IUserFriendlyKeybinding {
  key: string;
  command: string;
  args?: any;
}

export interface IKeybindingService {
  readonly inChordMode: boolean;

  onDidUpdateKeybindings: Events.Event<void>;

  /**
   * Returns none, one or many (depending on keyboard layout)!
   */
  resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];

  resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;

  resolveUserBinding(userBinding: string): ResolvedKeybinding[];

  /**
   * Resolve and dispatch `keyboardEvent` and invoke the command.
   */
  dispatchEvent(e: IKeyboardEvent, target: any): boolean;

  /**
   * Resolve and dispatch `keyboardEvent`, but do not invoke the command or change inner state.
   */
  // softDispatch(keyboardEvent: IKeyboardEvent, target: any): ResolutionResult;

  /**
   * Enable hold mode for this command. This is only possible if the command is current being dispatched, meaning
   * we are after its keydown and before is keyup event.
   *
   * @returns A promise that resolves when hold stops, returns undefined if hold mode could not be enabled.
   */
  enableKeybindingHoldMode(commandId: string): Promise<void> | undefined;

  dispatchByUserSettingsLabel(userSettingsLabel: string, target: any): void;

  /**
   * Look up keybindings for a command.
   * Use `lookupKeybinding` if you are interested in the preferred keybinding.
   */
  lookupKeybindings(commandId: string): ResolvedKeybinding[];

  /**
   * Look up the preferred (last defined) keybinding for a command.
   * @returns The preferred keybinding or null if the command is not bound.
   */
  // lookupKeybinding(commandId: string, context?: any): ResolvedKeybinding | undefined;

  getDefaultKeybindings(): readonly ResolvedKeybindingItem[];

  getKeybindings(): readonly ResolvedKeybindingItem[];
}

export const IKeybindingService = createDecorator<IKeybindingService>('keybindingService');
