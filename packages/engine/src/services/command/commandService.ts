import { createDecorator, Provide } from '@alilc/lowcode-shared';

export interface ICommandService {}

export const ICommandService = createDecorator<ICommandService>('commandService');

@Provide(ICommandService)
export class CommandService implements ICommandService {}
