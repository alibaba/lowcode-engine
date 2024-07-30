export const enum ResultKind {
  /** No keybinding found this sequence of chords */
  NoMatchingKb,

  /** There're several keybindings that have the given sequence of chords as a prefix */
  MoreChordsNeeded,

  /** A single keybinding found to be dispatched/invoked */
  KbFound,
}

export type ResolutionResult =
  | { kind: ResultKind.NoMatchingKb }
  | { kind: ResultKind.MoreChordsNeeded }
  | { kind: ResultKind.KbFound; commandId: string | null; commandArgs: any; isBubble: boolean };

// util definitions to make working with the above types easier within this module:

export const NoMatchingKb: ResolutionResult = { kind: ResultKind.NoMatchingKb };
const MoreChordsNeeded: ResolutionResult = { kind: ResultKind.MoreChordsNeeded };
function KbFound(commandId: string | null, commandArgs: any, isBubble: boolean): ResolutionResult {
  return { kind: ResultKind.KbFound, commandId, commandArgs, isBubble };
}

//#endregion

export class ResolvedKeybindingItem {
  _resolvedKeybindingItemBrand: void = undefined;

  public readonly resolvedKeybinding: ResolvedKeybinding | undefined;
  public readonly chords: string[];
  public readonly bubble: boolean;
  public readonly command: string | null;
  public readonly commandArgs: any;
  public readonly when: ContextKeyExpression | undefined;
  public readonly isDefault: boolean;
  public readonly extensionId: string | null;
  public readonly isBuiltinExtension: boolean;

  constructor(
    resolvedKeybinding: ResolvedKeybinding | undefined,
    command: string | null,
    commandArgs: any,
    when: ContextKeyExpression | undefined,
    isDefault: boolean,
    extensionId: string | null,
    isBuiltinExtension: boolean,
  ) {
    this.resolvedKeybinding = resolvedKeybinding;
    this.chords = resolvedKeybinding
      ? toEmptyArrayIfContainsNull(resolvedKeybinding.getDispatchChords())
      : [];
    if (resolvedKeybinding && this.chords.length === 0) {
      // handle possible single modifier chord keybindings
      this.chords = toEmptyArrayIfContainsNull(
        resolvedKeybinding.getSingleModifierDispatchChords(),
      );
    }
    this.bubble = command ? command.charCodeAt(0) === CharCode.Caret : false;
    this.command = this.bubble ? command!.substr(1) : command;
    this.commandArgs = commandArgs;
    this.when = when;
    this.isDefault = isDefault;
    this.extensionId = extensionId;
    this.isBuiltinExtension = isBuiltinExtension;
  }
}

export function toEmptyArrayIfContainsNull<T>(arr: (T | null)[]): T[] {
  const result: T[] = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    const element = arr[i];
    if (!element) {
      return [];
    }
    result.push(element);
  }
  return result;
}
