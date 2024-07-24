import { type InstanceAccessor, type TypeConstraint } from '@alilc/lowcode-shared';

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
  readonly description: string;
  readonly args?: ReadonlyArray<{
    readonly name: string;
    readonly isOptional?: boolean;
    readonly description?: string;
    readonly constraint?: TypeConstraint;
    readonly default?: any;
  }>;
}
