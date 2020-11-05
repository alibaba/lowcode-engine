// 表达式
export interface JSExpression {
  type: 'JSExpression';
  /**
   * 表达式字符串
   */
  value: string;
  /**
   * 模拟值
   */
  mock?: any;
  /** 源码 */
  compiled?: string;
}

// 函数
export interface JSFunction {
  type: 'JSFunction';
  /**
   * 表达式字符串
   */
  value: string;
}

/**
 * 事件函数类型
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#feHTW
 */
export interface JSFunction {
  type: 'JSFunction';

  /**
   * 函数定义，或直接函数表达式
   */
  value: string;

  /** 源码 */
  compiled?: string;
}

// 函数
export interface JSFunction {
  type: 'JSFunction';
  /**
   * 函数字符串
   */
  value: string;
  /**
   * 模拟值
   */
  mock?: any;
  /**
   * 额外扩展属性，如 extType、events
   */
  [key: string]: any;
}

// JSON 基本类型
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

// 复合类型
export type CompositeValue =
  | JSONValue
  | JSExpression
  | JSFunction
  // | JSSlot // 后续这里应该要再提取一个 base types
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
