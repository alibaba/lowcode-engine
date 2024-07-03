export interface Command {
  /**
   * 命令名称
   * 命名规则：commandName
   * 使用规则：commandScope:commandName (commandScope 在插件 meta 中定义，用于区分不同插件的命令)
   */
  name: string;

  /**
   * 命令描述
   */
  description?: string;

  /**
   * 命令处理函数
   */
  handler: (...args: any[]) => void | Promise<void>;
}

export class Commands {
  /**
   * 注册一个新命令及其处理函数
   */
  registerCommand(command: Command): void;

  /**
   * 注销一个已存在的命令
   */
  unregisterCommand(name: string): void;

  /**
   * 通过名称和给定参数执行一个命令，会校验参数是否符合命令定义
   */
  executeCommand(name: string, args?: IPublicTypeCommandHandlerArgs): void;

  /**
   * 批量执行命令，执行完所有命令后再进行一次重绘，历史记录中只会记录一次
   */
  batchExecuteCommand(commands: { name: string; args?: IPublicTypeCommandHandlerArgs }[]): void;

  /**
   * 列出所有已注册的命令
   */
  listCommands(): IPublicTypeListCommand[];

  /**
   * 注册错误处理回调函数
   */
  onCommandError(callback: (name: string, error: Error) => void): void;
}
