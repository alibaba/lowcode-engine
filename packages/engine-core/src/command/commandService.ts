import { createDecorator, IInstantiationService } from '@alilc/lowcode-shared';
import { CommandsRegistry } from './commandRegistry';

export interface ICommandService {
  executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
}

export const ICommandService = createDecorator<ICommandService>('commandService');

export class CommandService implements ICommandService {
  constructor(@IInstantiationService private instantiationService: IInstantiationService) {}

  executeCommand<T = any>(id: string, ...args: any[]): Promise<T | undefined> {
    return this.tryExecuteCommand(id, args);
  }

  private tryExecuteCommand(id: string, args: any[]): Promise<any> {
    const command = CommandsRegistry.getCommand(id);
    if (!command) {
      return Promise.reject(new Error(`command '${id}' not found`));
    }

    try {
      const result = this.instantiationService.invokeFunction(command.handler, ...args);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
