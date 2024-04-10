import { IPublicTypePropType } from './prop-types';

// 定义命令处理函数的参数类型
export interface IPublicTypeCommandHandlerArgs {
  [key: string]: any;
}

// 定义命令参数的接口
export interface IPublicTypeCommandParameter {

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

// 定义单个命令的接口
export interface IPublicTypeCommand {

  /**
   * 命令名称
   * 命名规则：commandName
   * 使用规则：commandScope:commandName (commandScope 在插件 meta 中定义，用于区分不同插件的命令)
   */
  name: string;

  /**
   * 命令参数
   */
  parameters?: IPublicTypeCommandParameter[];

  /**
   * 命令描述
   */
  description?: string;

  /**
   * 命令处理函数
   */
  handler: (args: any) => void;
}

export interface IPublicTypeListCommand extends Pick<IPublicTypeCommand, 'name' | 'description' | 'parameters'> {
}
