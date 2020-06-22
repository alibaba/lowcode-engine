import { NodeSchema, NodeData } from './schema';

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
}

export interface JSSlot {
  type: 'JSSlot';
  title?: string;
  // 函数的入参
  params?: string[];
  value?: NodeData[] | NodeData;
}

export interface JSBlock {
  type: 'JSBlock';
  value: NodeSchema;
}

// JSON 基本类型
export type JSONValue = boolean | string | number | null | undefined | JSONArray | JSONObject;
export type JSONArray = JSONValue[];
export interface JSONObject {
  [key: string]: JSONValue;
}

// 复合类型
export type CompositeValue = JSONValue | JSExpression | JSSlot | CompositeArray | CompositeObject;
export type CompositeArray = CompositeValue[];
export interface CompositeObject {
  [key: string]: CompositeValue;
}


export function isJSExpression(data: any): data is JSExpression {
  return data && data.type === 'JSExpression';
}

export function isJSSlot(data: any): data is JSSlot {
  return data && data.type === 'JSSlot';
}

export function isJSBlock(data: any): data is JSBlock {
  return data && data.type === 'JSBlock'
}
