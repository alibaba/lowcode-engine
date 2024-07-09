import { createDecorator, Provide } from '@alilc/lowcode-shared';
import { Registry } from '../extension';
import { ICommandRegistry, Extension } from './commandRegistry';

export interface ICommandService {
  executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
}

export const ICommandService = createDecorator<ICommandService>('commandService');

@Provide(ICommandService)
export class CommandService implements ICommandService {
  executeCommand<T = any>(id: string, ...args: any[]): Promise<T | undefined> {
    const command = Registry.as<ICommandRegistry>(Extension.command).getCommand(id);

    if (!command) {
      return Promise.reject(new Error(`command '${id}' not found`));
    }
  }
}
