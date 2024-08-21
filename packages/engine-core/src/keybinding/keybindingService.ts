import {
  DeferredPromise,
  Disposable,
  DisposableStore,
  Events,
  IDisposable,
  illegalState,
  IntervalTimer,
  OperatingSystem,
  OS,
  TimeoutTimer,
} from '@alilc/lowcode-shared';
import { IKeybindingService } from './keybinding';
import {
  BinaryKeybindingsMask,
  Keybinding,
  KeyCodeChord,
  ResolvedChord,
  ResolvedKeybinding,
  SingleModifierChord,
} from './keybindings';
import { type IKeyboardEvent, StandardKeyboardEvent } from './keybindingEvent';
import { addDisposableListener, DOMEventType, KeyCode } from '../common';
import { IKeyboardMapper, USLayoutKeyboardMapper } from './keyboardMapper';
import { KeybindingParser } from './keybindingParser';
import { KeybindingResolver, ResolvedKeybindingItem, ResultKind } from './keybindingResolver';
import { IKeybindingItem, KeybindingsRegistry } from './keybindingRegistry';
import { ICommandService } from '../command';

interface CurrentChord {
  keypress: string;
  label: string | null;
}

export class KeybindingService extends Disposable implements IKeybindingService {
  private _onDidUpdateKeybindings = this._addDispose(new Events.Emitter<void>());
  onDidUpdateKeybindings = this._onDidUpdateKeybindings.event;

  private _keyboardMapper: IKeyboardMapper = new USLayoutKeyboardMapper();

  private _currentlyDispatchingCommandId: string | null = null;
  private _isCompostion = false;
  private _ignoreSingleModifiers: KeybindingModifierSet = KeybindingModifierSet.EMPTY;
  private _currentSingleModifier: SingleModifierChord | null = null;
  private _cachedResolver: KeybindingResolver | null = null;

  private _keybindingHoldMode: DeferredPromise<void> | null = null;
  private _currentSingleModifierClearTimeout: TimeoutTimer = new TimeoutTimer();
  private _currentChordChecker: IntervalTimer = new IntervalTimer();

  /**
   * recently recorded keypresses that can trigger a keybinding;
   *
   * example: say, there's "cmd+k cmd+i" keybinding;
   * the user pressed "cmd+k" (before they press "cmd+i")
   * "cmd+k" would be stored in this array, when on pressing "cmd+i", the service
   * would invoke the command bound by the keybinding
   */
  private _currentChords: CurrentChord[] = [];

  get inChordMode(): boolean {
    return this._currentChords.length > 0;
  }

  constructor(@ICommandService private readonly commandService: ICommandService) {
    super();

    this._addDispose(this._registerKeyboardEvent());
  }

  private _getResolver(): KeybindingResolver {
    if (!this._cachedResolver) {
      const defaults = this._resolveKeybindingItems(KeybindingsRegistry.getDefaultKeybindings(), true);
      // const overrides = this._resolveUserKeybindingItems(this.userKeybindings.keybindings, false);
      this._cachedResolver = new KeybindingResolver(defaults, [], console.log);
    }
    return this._cachedResolver;
  }

  private _resolveKeybindingItems(items: IKeybindingItem[], isDefault: boolean): ResolvedKeybindingItem[] {
    const result: ResolvedKeybindingItem[] = [];

    let resultLen = 0;
    for (const item of items) {
      const keybinding = item.keybinding;
      if (!keybinding) {
        // This might be a removal keybinding item in user settings => accept it
        result[resultLen++] = new ResolvedKeybindingItem(
          undefined,
          item.command,
          item.commandArgs,
          isDefault,
          item.extensionId,
        );
      } else {
        if (this._assertBrowserConflicts(keybinding)) {
          continue;
        }

        const resolvedKeybindings = this._keyboardMapper.resolveKeybinding(keybinding);
        for (let i = resolvedKeybindings.length - 1; i >= 0; i--) {
          const resolvedKeybinding = resolvedKeybindings[i];
          result[resultLen++] = new ResolvedKeybindingItem(
            resolvedKeybinding,
            item.command,
            item.commandArgs,
            isDefault,
            item.extensionId,
          );
        }
      }
    }

    return result;
  }

  private _assertBrowserConflicts(keybinding: Keybinding): boolean {
    for (const chord of keybinding.chords) {
      if (!chord.metaKey && !chord.altKey && !chord.ctrlKey && !chord.shiftKey) {
        continue;
      }

      const modifiersMask = BinaryKeybindingsMask.CtrlCmd | BinaryKeybindingsMask.Alt | BinaryKeybindingsMask.Shift;

      let partModifiersMask = 0;
      if (chord.metaKey) {
        partModifiersMask |= BinaryKeybindingsMask.CtrlCmd;
      }

      if (chord.shiftKey) {
        partModifiersMask |= BinaryKeybindingsMask.Shift;
      }

      if (chord.altKey) {
        partModifiersMask |= BinaryKeybindingsMask.Alt;
      }

      if (chord.ctrlKey && OS === OperatingSystem.Macintosh) {
        partModifiersMask |= BinaryKeybindingsMask.WinCtrl;
      }

      if ((partModifiersMask & modifiersMask) === (BinaryKeybindingsMask.CtrlCmd | BinaryKeybindingsMask.Alt)) {
        if (chord.keyCode === KeyCode.LeftArrow || chord.keyCode === KeyCode.RightArrow) {
          // console.warn('Ctrl/Cmd+Arrow keybindings should not be used by default in web. Offender: ', kb.getHashCode(), ' for ', commandId);
          return true;
        }
      }

      if ((partModifiersMask & modifiersMask) === BinaryKeybindingsMask.CtrlCmd) {
        if (chord instanceof KeyCodeChord && chord.keyCode >= KeyCode.Digit0 && chord.keyCode <= KeyCode.Digit9) {
          // console.warn('Ctrl/Cmd+Num keybindings should not be used by default in web. Offender: ', kb.getHashCode(), ' for ', commandId);
          return true;
        }
      }
    }

    return false;
  }

  private _registerKeyboardEvent(): IDisposable {
    const disposables = new DisposableStore();

    disposables.add(
      addDisposableListener(document, DOMEventType.KEY_DOWN, (e) => {
        if (this._keybindingHoldMode) {
          return;
        }
        this._isCompostion = e.isComposing;
        const keyEvent = new StandardKeyboardEvent(e);
        const shouldPreventDefault = this._dispatch(keyEvent, keyEvent.target);
        if (shouldPreventDefault) {
          keyEvent.preventDefault();
        }
        this._isCompostion = false;
      }),
    );

    disposables.add(
      addDisposableListener(document, DOMEventType.KEY_UP, (e) => {
        this._resetKeybindingHoldMode();
        this._isCompostion = e.isComposing;
        const keyEvent = new StandardKeyboardEvent(e);
        const shouldPreventDefault = this._singleModifierDispatch(keyEvent, keyEvent.target);
        if (shouldPreventDefault) {
          keyEvent.preventDefault();
        }
        this._isCompostion = false;
      }),
    );

    return disposables;
  }

  private _dispatch(e: IKeyboardEvent, target: HTMLElement): boolean {
    return this._doDispatch(this.resolveKeyboardEvent(e), target, false);
  }

  private _doDispatch(userKeypress: ResolvedKeybinding, target: HTMLElement, isSingleModiferChord = false): boolean {
    let shouldPreventDefault = false;

    if (userKeypress.hasMultipleChords()) {
      // warn - because user can press a single chord at a time
      console.warn('Unexpected keyboard event mapped to multiple chords');
      return false;
    }

    let userPressedChord: string | null = null;
    let currentChords: string[] | null = null;

    if (isSingleModiferChord) {
      // The keybinding is the second keypress of a single modifier chord, e.g. "shift shift".
      // A single modifier can only occur when the same modifier is pressed in short sequence,
      // hence we disregard `_currentChord` and use the same modifier instead.
      const [dispatchKeyname] = userKeypress.getSingleModifierDispatchChords();
      userPressedChord = dispatchKeyname;
      currentChords = dispatchKeyname ? [dispatchKeyname] : []; // TODO@ulugbekna: in the `else` case we assign an empty array - make sure `resolve` can handle an empty array well
    } else {
      [userPressedChord] = userKeypress.getDispatchChords();
      currentChords = this._currentChords.map(({ keypress }) => keypress);
    }

    if (userPressedChord === null) {
      console.log(`\\ Keyboard event cannot be dispatched in keydown phase.`);
      // cannot be dispatched, probably only modifier keys
      return shouldPreventDefault;
    }

    const keypressLabel = userKeypress.getLabel();
    const resolveResult = this._getResolver().resolve(currentChords, userPressedChord);

    switch (resolveResult.kind) {
      case ResultKind.NoMatchingKb: {
        if (this.inChordMode) {
          const currentChordsLabel = this._currentChords.map(({ label }) => label).join(', ');
          console.log(`+ Leaving multi-chord mode: Nothing bound to "${currentChordsLabel}, ${keypressLabel}".`);

          this._leaveChordMode();

          shouldPreventDefault = true;
        }
        return shouldPreventDefault;
      }

      case ResultKind.MoreChordsNeeded: {
        shouldPreventDefault = true;
        this._expectAnotherChord(userPressedChord, keypressLabel);
        console.log(
          this._currentChords.length === 1 ? `+ Entering multi-chord mode...` : `+ Continuing multi-chord mode...`,
        );
        return shouldPreventDefault;
      }

      case ResultKind.KbFound: {
        if (resolveResult.commandId === null || resolveResult.commandId === '') {
          if (this.inChordMode) {
            const currentChordsLabel = this._currentChords.map(({ label }) => label).join(', ');
            console.log(`+ Leaving chord mode: Nothing bound to "${currentChordsLabel}, ${keypressLabel}".`);
            this._leaveChordMode();
            shouldPreventDefault = true;
          }
        } else {
          if (this.inChordMode) {
            this._leaveChordMode();
          }

          if (!resolveResult.isBubble) {
            shouldPreventDefault = true;
          }

          console.log(`+ Invoking command ${resolveResult.commandId}.`);
          this._currentlyDispatchingCommandId = resolveResult.commandId;
          try {
            this.commandService
              .executeCommand(
                resolveResult.commandId,
                typeof resolveResult.commandArgs === 'undefined' ? undefined : resolveResult.commandArgs,
              )
              .then(undefined, (err) => console.warn(err));
          } finally {
            this._currentlyDispatchingCommandId = null;
          }
        }

        return shouldPreventDefault;
      }
    }
  }

  private _leaveChordMode(): void {
    this._currentChordChecker.cancel();
    this._currentChords = [];
  }

  private _expectAnotherChord(firstChord: string, keypressLabel: string | null): void {
    this._currentChords.push({ keypress: firstChord, label: keypressLabel });

    switch (this._currentChords.length) {
      case 0:
        throw illegalState('impossible');
      case 1:
        // TODO@ulugbekna: revise this message and the one below (at least, fix terminology)
        // this._currentChordStatusMessage = this._notificationService.status(
        //   nls.localize('first.chord', '({0}) was pressed. Waiting for second key of chord...', keypressLabel),
        // );
        break;
      default: {
        // const fullKeypressLabel = this._currentChords.map(({ label }) => label).join(', ');
        // this._currentChordStatusMessage = this._notificationService.status(
        //   nls.localize('next.chord', '({0}) was pressed. Waiting for next key of chord...', fullKeypressLabel),
        // );
      }
    }

    this._scheduleLeaveChordMode();
  }

  private _scheduleLeaveChordMode(): void {
    const chordLastInteractedTime = Date.now();
    this._currentChordChecker.cancelAndSet(() => {
      if (Date.now() - chordLastInteractedTime > 5000) {
        // 5 seconds elapsed => leave chord mode
        this._leaveChordMode();
      }
    }, 500);
  }

  private _singleModifierDispatch(e: IKeyboardEvent, target: HTMLElement): boolean {
    const keybinding = this.resolveKeyboardEvent(e);
    const [singleModifier] = keybinding.getSingleModifierDispatchChords();

    if (singleModifier) {
      if (this._ignoreSingleModifiers.has(singleModifier)) {
        console.log(`+ Ignoring single modifier ${singleModifier} due to it being pressed together with other keys.`);
        this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;
        this._currentSingleModifierClearTimeout.cancel();
        this._currentSingleModifier = null;
        return false;
      }

      this._ignoreSingleModifiers = KeybindingModifierSet.EMPTY;

      if (this._currentSingleModifier === null) {
        // we have a valid `singleModifier`, store it for the next keyup, but clear it in 300ms
        console.log(`+ Storing single modifier for possible chord ${singleModifier}.`);
        this._currentSingleModifier = singleModifier;
        this._currentSingleModifierClearTimeout.cancelAndSet(() => {
          console.log(`+ Clearing single modifier due to 300ms elapsed.`);
          this._currentSingleModifier = null;
        }, 300);
        return false;
      }

      if (singleModifier === this._currentSingleModifier) {
        // bingo!
        console.log(`/ Dispatching single modifier chord ${singleModifier} ${singleModifier}`);
        this._currentSingleModifierClearTimeout.cancel();
        this._currentSingleModifier = null;
        return this._doDispatch(keybinding, target, /*isSingleModiferChord*/ true);
      }

      console.log(
        `+ Clearing single modifier due to modifier mismatch: ${this._currentSingleModifier} ${singleModifier}`,
      );
      this._currentSingleModifierClearTimeout.cancel();
      this._currentSingleModifier = null;
      return false;
    }

    // When pressing a modifier and holding it pressed with any other modifier or key combination,
    // the pressed modifiers should no longer be considered for single modifier dispatch.
    const [firstChord] = keybinding.getChords();
    this._ignoreSingleModifiers = new KeybindingModifierSet(firstChord);

    if (this._currentSingleModifier !== null) {
      console.log(`+ Clearing single modifier due to other key up.`);
    }
    this._currentSingleModifierClearTimeout.cancel();
    this._currentSingleModifier = null;
    return false;
  }

  enableKeybindingHoldMode(commandId: string): Promise<void> | undefined {
    if (this._currentlyDispatchingCommandId !== commandId) {
      return undefined;
    }

    this._keybindingHoldMode = new DeferredPromise<void>();

    return this._keybindingHoldMode.p;
  }

  private _resetKeybindingHoldMode(): void {
    if (this._keybindingHoldMode) {
      this._keybindingHoldMode?.complete();
      this._keybindingHoldMode = null;
    }
  }

  resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
    return this._keyboardMapper.resolveKeybinding(keybinding);
  }

  resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
    return this._keyboardMapper.resolveKeyboardEvent(keyboardEvent);
  }

  resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
    const keybinding = KeybindingParser.parseKeybinding(userBinding);
    return keybinding ? this._keyboardMapper.resolveKeybinding(keybinding) : [];
  }

  dispatchEvent(e: IKeyboardEvent, target: HTMLElement): boolean {
    return this._dispatch(e, target);
  }

  dispatchByUserSettingsLabel(userSettingsLabel: string, target: HTMLElement): void {
    const keybindings = this.resolveUserBinding(userSettingsLabel);
    if (keybindings.length === 0) {
      console.log(`\\ Could not resolve - ${userSettingsLabel}`);
    } else {
      this._doDispatch(keybindings[0], target, /*isSingleModiferChord*/ false);
    }
  }

  lookupKeybindings(commandId: string): ResolvedKeybinding[] {
    return this._getResolver()
      .lookupKeybindings(commandId)
      .map((item) => item.resolvedKeybinding)
      .filter(Boolean) as ResolvedKeybinding[];
  }

  getDefaultKeybindings(): readonly ResolvedKeybindingItem[] {
    return this._getResolver().getDefaultKeybindings();
  }

  getKeybindings(): readonly ResolvedKeybindingItem[] {
    return this._getResolver().getKeybindings();
  }
}

class KeybindingModifierSet {
  public static EMPTY = new KeybindingModifierSet(null);

  private readonly _ctrlKey: boolean;
  private readonly _shiftKey: boolean;
  private readonly _altKey: boolean;
  private readonly _metaKey: boolean;

  constructor(source: ResolvedChord | null) {
    this._ctrlKey = source ? source.ctrlKey : false;
    this._shiftKey = source ? source.shiftKey : false;
    this._altKey = source ? source.altKey : false;
    this._metaKey = source ? source.metaKey : false;
  }

  has(modifier: SingleModifierChord) {
    switch (modifier) {
      case 'ctrl':
        return this._ctrlKey;
      case 'shift':
        return this._shiftKey;
      case 'alt':
        return this._altKey;
      case 'meta':
        return this._metaKey;
    }
  }
}
