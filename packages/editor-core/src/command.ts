import { checkPropTypes } from '@alilc/lowcode-utils';
import { type AnyFunction } from '@alilc/lowcode-shared';

export interface Command {
  /**
   * 命令名称
   * 命名规则：commandName
   * 使用规则：commandScope:commandName (commandScope 在插件 meta 中定义，用于区分不同插件的命令)
   */
  name: string;

  /**
   * 命令参数
   */
  parameters?: CommandParameter[];

  /**
   * 命令描述
   */
  description?: string;

  /**
   * 命令处理函数
   */
  handler: (args: any) => void;
}

export interface CommandParameter {
  /**
   * 参数名称
   */
  name: string;

  /**
   * 参数类型或详细类型描述
   */
  propType: string | IPublicTypePropType;

  /**
   * 参数描述
   */
  description: string;

  /**
   * 参数默认值（可选）
   */
  defaultValue?: any;
}

/**
 * 定义命令参数的接口
 */
export interface CommandHandlerArgs {
  [key: string]: any;
}

export type ListCommand = Pick<Command, 'name' | 'description' | 'parameters'>;

export interface CommandOptions {
  commandScope?: string;
}

/**
 * 该模块使得与命令系统的交互成为可能，提供了一种全面的方式来处理、执行和管理应用程序中的命令。
 */
export class CommandManager {
  private commands: Map<string, Command> = new Map();
  private commandErrors: AnyFunction[] = [];

  /**
   * 注册一个新命令及其处理函数
   */
  registerCommand(command: Command, options?: CommandOptions): void {
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

  /**
   * 注销一个已存在的命令
   */
  unregisterCommand(name: string): void {
    if (!this.commands.has(name)) {
      throw new Error(`Command '${name}' is not registered.`);
    }
    this.commands.delete(name);
  }

  /**
   * 通过名称和给定参数执行一个命令，会校验参数是否符合命令定义
   */
  executeCommand(name: string, args: CommandHandlerArgs): void {
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

  /**
   * 批量执行命令，执行完所有命令后再进行一次重绘，历史记录中只会记录一次
   */
  batchExecuteCommand(
    commands: { name: string; args: CommandHandlerArgs }[],
    pluginContext: IPublicModelPluginContext
  ): void {
    if (!commands || !commands.length) {
      return;
    }
    pluginContext.common.utils.executeTransaction(() => {
      commands.forEach(command => this.executeCommand(command.name, command.args));
    }, IPublicEnumTransitionType.REPAINT);
  }

  /**
   * 列出所有已注册的命令
   */
  listCommands(): ListCommand[] {
    return Array.from(this.commands.values()).map(d => {
      const result: ListCommand = {
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

  /**
   * 注册错误处理回调函数
   */
  onCommandError(callback: (name: string, error: Error) => void): void {
    this.commandErrors.push(callback);
  }
}
