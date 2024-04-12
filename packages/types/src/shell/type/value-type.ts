import { IPublicTypeNodeData, IPublicTypeCompositeValue, IPublicTypeNodeSchema } from './';

/**
 * 变量表达式
 *
 * 表达式内通过 this 对象获取上下文
 */
export interface IPublicTypeJSExpression {
  type: 'JSExpression';

  /**
   * 表达式字符串
   */
  value: string;

  /**
   * 模拟值
   *
   * @todo 待标准描述
   */
  mock?: any;

  /**
   * 源码
   *
   * @todo 待标准描述
   */
  compiled?: string;
}

/**
 * 事件函数类型
 * @see https://lowcode-engine.cn/lowcode
 *
 * 保留与原组件属性、生命周期 ( React / 小程序) 一致的输入参数，并给所有事件函数 binding 统一一致的上下文（当前组件所在容器结构的 this 对象）
 */
export interface IPublicTypeJSFunction {
  type: 'JSFunction';

  /**
   * 函数定义，或直接函数表达式
   */
  value: string;

  /**
   * 源码
   *
   * @todo 待标准描述
   */
  compiled?: string;

  /**
   * 模拟值
   *
   * @todo 待标准描述
   */
  mock?: any;

  /**
   * 额外扩展属性，如 extType、events
   *
   * @todo 待标准描述
   */
  [key: string]: any;
}

/**
 * Slot 函数类型
 *
 * 通常用于描述组件的某一个属性为 ReactNode 或 Function return ReactNode 的场景。
 */
export interface IPublicTypeJSSlot {

  /**
   * type
   */
  type: 'JSSlot';

  /**
   * @todo 待标准描述
   */
  title?: string;

  /**
   * @todo 待标准描述
   */
  id?: string;

  /**
   * 组件的某一个属性为 Function return ReactNode 时，函数的入参
   *
   * 其子节点可以通过 this[参数名] 来获取对应的参数。
   */
  params?: string[];

  /**
   * 具体的值。
   */
  value?: IPublicTypeNodeData[] | IPublicTypeNodeData;

  /**
   * @todo 待标准描述
   */
  name?: string;
}

/**
 * JSON 基本类型
 */
export type IPublicTypeJSONValue =
  | boolean
  | string
  | number
  | null
  | undefined
  | IPublicTypeJSONArray
  | IPublicTypeJSONObject;
export type IPublicTypeJSONArray = IPublicTypeJSONValue[];
export interface IPublicTypeJSONObject {
  [key: string]: IPublicTypeJSONValue;
}

export type IPublicTypeCompositeArray = IPublicTypeCompositeValue[];
export interface IPublicTypeCompositeObject<T = IPublicTypeCompositeValue> {
  [key: string]: IPublicTypeCompositeValue | T;
}
