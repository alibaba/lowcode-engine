import {
  CompositeArray,
  CompositeValue,
  CompositeObject,
  isJSExpression,
  isJSFunction,
  isJSSlot,
} from '@ali/lowcode-types';
import { generateExpression, generateFunction } from './jsExpression';
import { generateJsSlot } from './jsSlot';
import { isValidIdentifier } from './validate';
import { camelize } from './common';

import { CompositeValueGeneratorOptions, CompositeTypeContainerHandlerSet, CodeGeneratorError } from '../types';

const defaultContainerHandlers: CompositeTypeContainerHandlerSet = {
  default: (v) => v,
  string: (v) => `'${v}'`,
};

function generateArray(value: CompositeArray, options: CompositeValueGeneratorOptions = {}): string {
  const body = value.map((v) => generateUnknownType(v, options)).join(',');
  return `[${body}]`;
}

function generateObject(value: CompositeObject, options: CompositeValueGeneratorOptions = {}): string {
  const body = Object.keys(value)
    .map((key) => {
      let propName = key;

      // TODO: 可以增加更多智能修复的方法
      const fixMethods: Array<(v: string) => string> = [camelize];
      // Try to fix propName
      while (!isValidIdentifier(propName)) {
        const fixMethod = fixMethods.pop();
        if (fixMethod) {
          try {
            propName = fixMethod(propName);
          } catch (error) {
            throw new CodeGeneratorError(error.message);
          }
        } else {
          throw new CodeGeneratorError(`Propname: ${key} is not a valid identifier.`);
        }
      }
      const v = generateUnknownType(value[key], options);
      return `${propName}: ${v}`;
    })
    .join(',\n');

  return `{${body}}`;
}

function generateUnknownType(value: CompositeValue, options: CompositeValueGeneratorOptions = {}): string {
  if (Array.isArray(value)) {
    if (options.handlers && options.handlers.array) {
      return options.handlers.array(value);
    }
    return generateArray(value, options);
  } else if (typeof value === 'object') {
    if (value === null) {
      return 'null';
    }

    if (isJSExpression(value)) {
      if (options.handlers && options.handlers.expression) {
        return options.handlers.expression(value);
      }
      return generateExpression(value);
    }

    if (isJSFunction(value)) {
      if (options.handlers && options.handlers.function) {
        return options.handlers.function(value);
      }
      return generateFunction(value, { isArrow: true });
    }

    if (isJSSlot(value)) {
      if (options.nodeGenerator) {
        return generateJsSlot(value, options.nodeGenerator);
      }
      throw new CodeGeneratorError("Can't find Node Generator");
    }

    if (options.handlers && options.handlers.object) {
      return options.handlers.object(value);
    }
    return generateObject(value as CompositeObject, options);
  } else if (typeof value === 'string') {
    if (options.handlers && options.handlers.string) {
      return options.handlers.string(value);
    }
    return `'${value}'`;
  } else if (typeof value === 'number' && options.handlers && options.handlers.number) {
    return options.handlers.number(value);
  } else if (typeof value === 'boolean' && options.handlers && options.handlers.boolean) {
    return options.handlers.boolean(value);
  } else if (typeof value === 'undefined') {
    return 'undefined';
  }

  return JSON.stringify(value);
}

export function generateCompositeType(value: CompositeValue, options: CompositeValueGeneratorOptions = {}): string {
  const result = generateUnknownType(value, options);
  const containerHandlers = {
    ...defaultContainerHandlers,
    ...(options.containerHandlers || {}),
  };

  const isStringType = result.substr(0, 1) === "'" && result.substr(-1, 1) === "'";
  if (isStringType) {
    return (containerHandlers.string && containerHandlers.string(result.substring(1, result.length - 1))) || '';
  }
  return (containerHandlers.default && containerHandlers.default(result)) || '';
}
