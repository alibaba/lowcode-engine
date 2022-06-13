import { NodeSchema, NodeData } from './schema';

/**
 * 变量表达式
 *
 * 表达式内通过 this 对象获取上下文
 */
export interface JSExpression {
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
 * 保留与原组件属性、生命周期( React / 小程序)一致的输入参数，并给所有事件函数 binding 统一一致的上下文（当前组件所在容器结构的 this 对象）
 */
export interface JSFunction {
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
export interface JSSlot {
  type: 'JSSlot';
  /**
   * @todo 待标准描述
   */
  title?: string;
  /**
   * 组件的某一个属性为 Function return ReactNode 时，函数的入参
   *
   * 其子节点可以通过this[参数名] 来获取对应的参数。
   */
  params?: string[];
  /**
   * 具体的值。
   */
  value?: NodeData[] | NodeData;
  /**
   * @todo 待标准描述
   */
  name?: string;
}

/**
 * @deprecated
 *
 * @todo 待文档描述
 */
export interface JSBlock {
  type: 'JSBlock';
  value: NodeSchema;
}

/**
 * JSON 基本类型
 */
export type JSONValue =
  | boolean
  | string
  | number
  | null
  | undefined
  | JSONArray
  | JSONObject;
export type JSONArray = JSONValue[];
export interface JSONObject {
  [key: string]: JSONValue;
}

/**
 * 复合类型
 */
export type CompositeValue =
  | JSONValue
  | JSExpression
  | JSFunction
  | JSSlot
  | CompositeArray
  | CompositeObject;
export type CompositeArray = CompositeValue[];
export interface CompositeObject {
  [key: string]: CompositeValue;
}

export function isJSExpression(data: any): data is JSExpression {
  return data && data.type === 'JSExpression';
}

export function isJSFunction(x: any): x is JSFunction {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}

export function isJSSlot(data: any): data is JSSlot {
  return data && data.type === 'JSSlot';
}

export function isJSBlock(data: any): data is JSBlock {
  return data && data.type === 'JSBlock';
}
