import { type InstanceAccessor } from '@alilc/lowcode-shared';

export interface ICommandEvent {
  commandId: string;
  args: any[];
}

export interface ICommandHandler {
  (accessor: InstanceAccessor, ...args: any[]): void;
}

export interface ICommand {
  id: string;
  handler: ICommandHandler;
  metadata?: ICommandMetadata | null;
}

export interface ICommandMetadata {
  /**
   * A short summary of what the command does. This will be used in:
   * - API commands
   * - when showing keybindings that have no other UX
   * - when searching for commands in the Command Palette
   */
  readonly description: string;
  readonly args?: ReadonlyArray<{
    readonly name: string;
    readonly isOptional?: boolean;
    readonly description?: string;
    // readonly constraint?: TypeConstraint;
    // readonly schema?: IJSONSchema;
  }>;
  readonly returns?: string;
}
