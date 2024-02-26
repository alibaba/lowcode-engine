import { IPublicApiCommand, IPublicModelPluginContext, IPublicTypeCommand, IPublicTypeCommandHandlerArgs, IPublicTypeListCommand } from '@alilc/lowcode-types';
import { commandSymbol, pluginContextSymbol } from '../symbols';
import { ICommand, ICommandOptions } from '@alilc/lowcode-editor-core';

const optionsSymbol = Symbol('options');
const commandScopeSet = new Set<string>();

export class Command implements IPublicApiCommand {
  [commandSymbol]: ICommand;
  [optionsSymbol]?: ICommandOptions;
  [pluginContextSymbol]?: IPublicModelPluginContext;

  constructor(innerCommand: ICommand, pluginContext?: IPublicModelPluginContext, options?: ICommandOptions) {
    this[commandSymbol] = innerCommand;
    this[optionsSymbol] = options;
    this[pluginContextSymbol] = pluginContext;
    const commandScope = options?.commandScope;
    if (commandScope && commandScopeSet.has(commandScope)) {
      throw new Error(`Command scope "${commandScope}" has been registered.`);
    }
  }

  registerCommand(command: IPublicTypeCommand): void {
    this[commandSymbol].registerCommand(command, this[optionsSymbol]);
  }

  batchExecuteCommand(commands: { name: string; args: IPublicTypeCommandHandlerArgs }[]): void {
    this[commandSymbol].batchExecuteCommand(commands, this[pluginContextSymbol]);
  }

  executeCommand(name: string, args: IPublicTypeCommandHandlerArgs): void {
    this[commandSymbol].executeCommand(name, args);
  }

  listCommands(): IPublicTypeListCommand[] {
    return this[commandSymbol].listCommands();
  }

  unregisterCommand(name: string): void {
    this[commandSymbol].unregisterCommand(name);
  }

  onCommandError(callback: (name: string, error: Error) => void): void {
    this[commandSymbol].onCommandError(callback);
  }
}
