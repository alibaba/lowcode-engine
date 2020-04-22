import { CompositeArray, CompositeValue, ICompositeObject } from '../types';
import { generateExpression, isJsExpression } from './jsExpression';

type CustomHandler = (data: unknown) => string;
interface CustomHandlerSet {
  boolean?: CustomHandler;
  number?: CustomHandler;
  string?: CustomHandler;
  array?: CustomHandler;
  object?: CustomHandler;
  expression?: CustomHandler;
}

function generateArray(
  value: CompositeArray,
  handlers: CustomHandlerSet = {},
): string {
  const body = value.map(v => generateUnknownType(v, handlers)).join(',');
  return `[${body}]`;
}

function generateObject(
  value: ICompositeObject,
  handlers: CustomHandlerSet = {},
): string {
  if (isJsExpression(value)) {
    if (handlers.expression) {
      return handlers.expression(value);
    }
    return generateExpression(value);
  }

  const body = Object.keys(value)
    .map(key => {
      const v = generateUnknownType(value[key], handlers);
      return `${key}: ${v}`;
    })
    .join(',\n');

  return `{${body}}`;
}

export function generateUnknownType(
  value: CompositeValue,
  handlers: CustomHandlerSet = {},
): string {
  if (Array.isArray(value)) {
    if (handlers.array) {
      return handlers.array(value);
    }
    return generateArray(value as CompositeArray, handlers);
  } else if (typeof value === 'object') {
    if (handlers.object) {
      return handlers.object(value);
    }
    return generateObject(value as ICompositeObject, handlers);
  } else if (typeof value === 'string') {
    if (handlers.string) {
      return handlers.string(value);
    }
    return `'${value}'`;
  } else if (typeof value === 'number' && handlers.number) {
    return handlers.number(value);
  } else if (typeof value === 'boolean' && handlers.boolean) {
    return handlers.boolean(value);
  }
  return `${value}`;
}

export function generateCompositeType(
  value: CompositeValue,
  handlers: CustomHandlerSet = {},
): [boolean, string] {
  const result = generateUnknownType(value, handlers);

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
