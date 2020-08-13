import {
  CompositeArray,
  CompositeValue,
  CompositeObject,
  JSExpression,
  JSFunction,
  JSONArray,
  JSONObject,
  isJSExpression,
  isJSFunction,
  isJSSlot,
  JSSlot,
  NodeSchema,
  NodeData,
  CodePiece,
} from '../types';
import { generateExpression, generateFunction } from './jsExpression';
import { IScopeBindings } from './ScopeBindings';

export interface CustomHandlerSet {
  boolean?(this: CustomHandlerSet, bool: boolean): string;
  number?(this: CustomHandlerSet, num: number): string;
  string?(this: CustomHandlerSet, str: string): string;
  array?(this: CustomHandlerSet, arr: JSONArray | CompositeArray): string;
  object?(this: CustomHandlerSet, obj: JSONObject | CompositeObject): string;
  expression?(this: CustomHandlerSet, jsExpr: JSExpression): string;
  function?(this: CustomHandlerSet, jsFunc: JSFunction): string;
  slot?(this: CustomHandlerSet, jsSlot: JSSlot): string;
  node?(this: CustomHandlerSet, node: NodeSchema): string;
  nodeAttrs?(this: CustomHandlerSet, node: NodeSchema): CodePiece[];
  nodeAttr?(this: CustomHandlerSet, attrName: string, attrValue: CompositeValue): CodePiece[];
  loopDataExpr?(this: CustomHandlerSet, loopDataExpr: string): string;
  conditionExpr?(this: CustomHandlerSet, conditionExpr: string): string;
  tagName?(this: CustomHandlerSet, tagName: string): string;
  scopeBindings?: IScopeBindings;
}

function generateArray(value: CompositeArray, handlers: CustomHandlerSet): string {
  const body = value.map((v) => generateUnknownType(v, handlers)).join(',');
  return `[${body}]`;
}

function generateObject(value: CompositeObject, handlers: CustomHandlerSet): string {
  const body = Object.keys(value)
    .map((key) => {
      const v = generateUnknownType(value[key], handlers);
      return `${key}: ${v}`;
    })
    .join(',\n');

  return `{${body}}`;
}

export function generateUnknownType(value: CompositeValue, handlers: CustomHandlerSet = {}): string {
  if (Array.isArray(value)) {
    if (handlers.array) {
      return handlers.array(value);
    }
    return generateArray(value, handlers);
  } else if (typeof value === 'object') {
    if (value === null) {
      return 'null';
    }

    if (isJSExpression(value)) {
      if (handlers.expression) {
        return handlers.expression(value);
      }
      return generateExpression(value);
    }

    if (isJSFunction(value)) {
      if (handlers.function) {
        return handlers.function(value);
      }
      return generateFunction(value);
    }

    if (isJSSlot(value)) {
      if (handlers.slot) {
        return handlers.slot(value);
      }

      return generateSlot(value, handlers);
    }

    if (handlers.object) {
      return handlers.object(value);
    }

    return generateObject(value, handlers);
  } else if (typeof value === 'string') {
    if (handlers.string) {
      return handlers.string(value);
    }

    return JSON.stringify(value);
  } else if (typeof value === 'number' && handlers.number) {
    return handlers.number(value);
  } else if (typeof value === 'boolean' && handlers.boolean) {
    return handlers.boolean(value);
  } else if (typeof value === 'undefined') {
    return 'undefined';
  }

  return JSON.stringify(value);
}

export function generateCompositeType(value: CompositeValue, handlers: CustomHandlerSet = {}): [boolean, string] {
  const result = generateUnknownType(value, handlers);

  // TODO：什么场景下会返回这样的字符串？？
  if (result.substr(0, 1) === "'" && result.substr(-1, 1) === "'") {
    return [true, result.substring(1, result.length - 1)];
  }

  return [false, result];
}

export function handleStringValueDefault([isString, result]: [boolean, string]) {
  if (isString) {
    return `'${result}'`;
  }

  return result;
}

function generateSlot({ title, params, value }: JSSlot, handlers: CustomHandlerSet): string {
  return [
    title && generateSingleLineComment(title),
    `(`,
    ...(params || []),
    `) => (`,
    ...(!value
      ? ['null']
      : !Array.isArray(value)
      ? [generateNodeData(value, handlers)]
      : value.map((node) => generateNodeData(node, handlers))),
    `)`,
  ]
    .filter(Boolean)
    .join('');
}

function generateNodeData(node: NodeData, handlers: CustomHandlerSet): string {
  if (typeof node === 'string') {
    if (handlers.string) {
      return handlers.string(node);
    }

    return JSON.stringify(node);
  }

  if (isJSExpression(node)) {
    if (handlers.expression) {
      return handlers.expression(node);
    }
    return generateExpression(node);
  }

  if (!handlers.node) {
    throw new Error('cannot handle NodeSchema, handlers.node is missing');
  }

  return handlers.node(node);
}

function generateSingleLineComment(commentText: string): string {
  return '/* ' + commentText.split('\n').join(' ').replace(/\*\//g, '*-/') + '*/';
}
