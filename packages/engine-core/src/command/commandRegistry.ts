import {
  type Event,
  type EventDisposable,
  type EventListener,
  Emitter,
  LinkedList,
  TypeConstraint,
  validateConstraints,
  Iterable,
} from '@alilc/lowcode-shared';
import { ICommand, ICommandHandler } from './command';
import { Extensions, Registry } from '../common/registry';
import { ICommandService } from './commandService';

export type ICommandsMap = Map<string, ICommand>;

export interface ICommandRegistry {
  onDidRegisterCommand: Event<string>;

  registerCommand(id: string, command: ICommandHandler): EventDisposable;
  registerCommand(command: ICommand): EventDisposable;

  registerCommandAlias(oldId: string, newId: string): EventDisposable;

  getCommand(id: string): ICommand | undefined;
  getCommands(): ICommandsMap;
}

class CommandsRegistry implements ICommandRegistry {
  private readonly _commands = new Map<string, LinkedList<ICommand>>();

  private readonly _didRegisterCommandEmitter = new Emitter<string>();

  onDidRegisterCommand(fn: EventListener<string>) {
    return this._didRegisterCommandEmitter.on(fn);
  }

  registerCommand(idOrCommand: string | ICommand, handler?: ICommandHandler): EventDisposable {
    if (!idOrCommand) {
      throw new Error(`invalid command`);
    }

    if (typeof idOrCommand === 'string') {
      if (!handler) {
        throw new Error(`invalid command`);
      }
      return this.registerCommand({ id: idOrCommand, handler });
    }

    // add argument validation if rich command metadata is provided
    if (idOrCommand.metadata && Array.isArray(idOrCommand.metadata.args)) {
      const constraints: Array<TypeConstraint | undefined> = [];
      for (const arg of idOrCommand.metadata.args) {
        constraints.push(arg.constraint);
      }
      const actualHandler = idOrCommand.handler;
      idOrCommand.handler = function (accessor, ...args: any[]) {
        validateConstraints(args, constraints);
        return actualHandler(accessor, ...args);
      };
    }

    // find a place to store the command
    const { id } = idOrCommand;

    let commands = this._commands.get(id);
    if (!commands) {
      commands = new LinkedList<ICommand>();
      this._commands.set(id, commands);
    }

    const removeFn = commands.unshift(idOrCommand);

    const ret = () => {
      removeFn();
      const command = this._commands.get(id);
      if (command?.isEmpty()) {
        this._commands.delete(id);
      }
    };

    // tell the world about this command
    this._didRegisterCommandEmitter.emit(id);

    return ret;
  }

  registerCommandAlias(oldId: string, newId: string): EventDisposable {
    return this.registerCommand(oldId, (accessor, ...args) =>
      accessor.get(ICommandService).executeCommand(newId, ...args),
    );
  }

  getCommand(id: string): ICommand | undefined {
    const list = this._commands.get(id);
    if (!list || list.isEmpty()) {
      return undefined;
    }
    return Iterable.first(list);
  }

  getCommands(): ICommandsMap {
    const result = new Map<string, ICommand>();
    for (const key of this._commands.keys()) {
      const command = this.getCommand(key);
      if (command) {
        result.set(key, command);
      }
    }
    return result;
  }
}

const commandsRegistry = new CommandsRegistry();

Registry.add(Extensions.Command, commandsRegistry);
