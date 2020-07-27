import {
  CompositeArray,
  CompositeValue,
  ICompositeObject,
  CompositeValueGeneratorOptions,
  CodeGeneratorError,
} from '../types';
import { generateExpression, generateFunction, isJsExpression, isJsFunction } from './jsExpression';
import { isJsSlot, generateJsSlot } from './jsSlot';

function generateArray(value: CompositeArray, options: CompositeValueGeneratorOptions = {}): string {
  const body = value.map((v) => generateUnknownType(v, options)).join(',');
  return `[${body}]`;
}

function generateObject(value: ICompositeObject, options: CompositeValueGeneratorOptions = {}): string {
  if (isJsExpression(value)) {
    if (options.handlers && options.handlers.expression) {
      return options.handlers.expression(value);
    }
    return generateExpression(value);
  }

  if (isJsFunction(value)) {
    return generateFunction(value, { isArrow: true });
  }

  if (isJsSlot(value)) {
    if (options.nodeGenerator) {
      return generateJsSlot(value, options.nodeGenerator);
    }
    throw new CodeGeneratorError("Can't find Node Generator");
  }

  const body = Object.keys(value)
    .map((key) => {
      const v = generateUnknownType(value[key], options);
      return `${key}: ${v}`;
    })
    .join(',\n');

  return `{${body}}`;
}

export function generateUnknownType(value: CompositeValue, options: CompositeValueGeneratorOptions = {}): string {
  if (Array.isArray(value)) {
    if (options.handlers && options.handlers.array) {
      return options.handlers.array(value);
    }
    return generateArray(value as CompositeArray, options);
  } else if (typeof value === 'object') {
    if (options.handlers && options.handlers.object) {
      return options.handlers.object(value);
    }
    return generateObject(value as ICompositeObject, options);
  } else if (typeof value === 'string') {
    if (options.handlers && options.handlers.string) {
      return options.handlers.string(value);
    }
    return `'${value}'`;
  } else if (typeof value === 'number' && options.handlers && options.handlers.number) {
    return options.handlers.number(value);
  } else if (typeof value === 'boolean' && options.handlers && options.handlers.boolean) {
    return options.handlers.boolean(value);
  }
  return `${value}`;
}

export function generateCompositeType(
  value: CompositeValue,
  options: CompositeValueGeneratorOptions = {},
): [boolean, string] {
  const result = generateUnknownType(value, options);

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
