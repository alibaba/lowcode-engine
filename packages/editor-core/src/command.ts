import { IPublicApiCommand, IPublicEnumTransitionType, IPublicModelPluginContext, IPublicTypeCommand, IPublicTypeCommandHandlerArgs, IPublicTypeListCommand } from '@alilc/lowcode-types';
import { checkPropTypes } from '@alilc/lowcode-utils';
export interface ICommand extends Omit<IPublicApiCommand, 'registerCommand' | 'batchExecuteCommand'> {
  registerCommand(command: IPublicTypeCommand, options?: {
    commandScope?: string;
  }): void;

  batchExecuteCommand(commands: { name: string; args: IPublicTypeCommandHandlerArgs }[], pluginContext?: IPublicModelPluginContext): void;
}

export interface ICommandOptions {
  commandScope?: string;
}

export class Command implements ICommand {
  private commands: Map<string, IPublicTypeCommand> = new Map();
  private commandErrors: Function[] = [];

  registerCommand(command: IPublicTypeCommand, options?: ICommandOptions): void {
    if (!options?.commandScope) {
      throw new Error('plugin meta.commandScope is required.');
    }
    const name = `${options.commandScope}:${command.name}`;
    if (this.commands.has(name)) {
      throw new Error(`Command '${command.name}' is already registered.`);
    }
    this.commands.set(name, {
      ...command,
      name,
    });
  }

  unregisterCommand(name: string): void {
    if (!this.commands.has(name)) {
      throw new Error(`Command '${name}' is not registered.`);
    }
    this.commands.delete(name);
  }

  executeCommand(name: string, args: IPublicTypeCommandHandlerArgs): void {
    const command = this.commands.get(name);
    if (!command) {
      throw new Error(`Command '${name}' is not registered.`);
    }
    command.parameters?.forEach(d => {
      if (!checkPropTypes(args[d.name], d.name, d.propType, 'command')) {
        throw new Error(`Command '${name}' arguments ${d.name} is invalid.`);
      }
    });
    try {
      command.handler(args);
    } catch (error) {
      if (this.commandErrors && this.commandErrors.length) {
        this.commandErrors.forEach(callback => callback(name, error));
      } else {
        throw error;
      }
    }
  }

  batchExecuteCommand(commands: { name: string; args: IPublicTypeCommandHandlerArgs }[], pluginContext: IPublicModelPluginContext): void {
    if (!commands || !commands.length) {
      return;
    }
    pluginContext.common.utils.executeTransaction(() => {
      commands.forEach(command => this.executeCommand(command.name, command.args));
    }, IPublicEnumTransitionType.REPAINT);
  }

  listCommands(): IPublicTypeListCommand[] {
    return Array.from(this.commands.values()).map(d => {
      const result: IPublicTypeListCommand = {
        name: d.name,
      };

      if (d.description) {
        result.description = d.description;
      }

      if (d.parameters) {
        result.parameters = d.parameters;
      }

      return result;
    });
  }

  onCommandError(callback: (name: string, error: Error) => void): void {
    this.commandErrors.push(callback);
  }
}
