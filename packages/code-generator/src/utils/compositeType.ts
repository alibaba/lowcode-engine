import {
  CompositeArray,
  CompositeValue,
  CompositeObject,
  isJSExpression,
  isJSFunction,
  isJSSlot,
} from '@ali/lowcode-types';
import _ from 'lodash';

import { generateExpression, generateFunction } from './jsExpression';
import { generateJsSlot } from './jsSlot';
import { isValidIdentifier } from './validate';
import { camelize } from './common';

import { CompositeValueGeneratorOptions, CompositeTypeContainerHandler, CodeGeneratorError } from '../types';

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
  if (_.isUndefined(value)) {
    return 'undefined';
  }

  if (_.isNull(value)) {
    return 'null';
  }

  if (_.isArray(value)) {
    if (options.handlers?.array) {
      return options.handlers.array(value);
    }
    return generateArray(value, options);
  }

  if (isJSExpression(value)) {
    if (options.handlers?.expression) {
      return options.handlers.expression(value);
    }
    return generateExpression(value);
  }

  if (isJSFunction(value)) {
    if (options.handlers?.function) {
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

  if (_.isObject(value)) {
    if (options.handlers?.object) {
      return options.handlers.object(value);
    }
    return generateObject(value as CompositeObject, options);
  }

  if (_.isString(value)) {
    if (options.handlers?.string) {
      return options.handlers.string(value);
    }
    return `'${value}'`;
  }

  if (_.isNumber(value) && options.handlers?.number) {
    return options.handlers.number(value);
  }

  if (_.isBoolean(value) && options.handlers?.boolean) {
    return options.handlers.boolean(value);
  }

  return JSON.stringify(value);
}

const defaultContainer: CompositeTypeContainerHandler = (v: string) => v;

export function generateCompositeType(value: CompositeValue, options: CompositeValueGeneratorOptions = {}): string {
  const isStringType = _.isString(value);
  const result = generateUnknownType(value, options);
  const handler: CompositeTypeContainerHandler = options.containerHandler || defaultContainer;

  if (isStringType && result.length >= 2) {
    return handler(result, true, result.substring(1, result.length - 1));
  }

  return handler(result, false, result);
}
