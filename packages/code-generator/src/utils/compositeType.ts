import {
  CompositeArray,
  CompositeValue,
  CompositeObject,
  JSFunction,
  isJSExpression,
  isJSFunction,
  isJSSlot,
  JSSlot,
} from '@ali/lowcode-types';
import _ from 'lodash';

import { IScope, CompositeValueGeneratorOptions, CodeGeneratorError } from '../types';
import { generateExpression, generateFunction } from './jsExpression';
import { generateJsSlot } from './jsSlot';
import { isValidIdentifier } from './validate';
import { camelize } from './common';
import { executeFunctionStack } from './aopHelper';

function generateArray(value: CompositeArray, scope: IScope, options: CompositeValueGeneratorOptions = {}): string {
  const body = value.map((v) => generateUnknownType(v, scope, options)).join(',');
  return `[${body}]`;
}

function generateObject(value: CompositeObject, scope: IScope, options: CompositeValueGeneratorOptions = {}): string {
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
      const v = generateUnknownType(value[key], scope, options);
      return `${propName}: ${v}`;
    })
    .join(',\n');

  return `{${body}}`;
}

function generateString(value: string): string {
  return `'${value}'`;
}

function generateNumber(value: number): string {
  return String(value);
}

function generateBool(value: boolean): string {
  return value ? 'true' : 'false';
}

function genFunction(value: JSFunction): string {
  return generateFunction(value, { isArrow: true });
}

function genJsSlot(value: JSSlot, scope: IScope, options: CompositeValueGeneratorOptions = {}) {
  if (options.nodeGenerator) {
    return generateJsSlot(value, scope, options.nodeGenerator);
  }
  return '';
}

function generateUnknownType(
  value: CompositeValue,
  scope: IScope,
  options: CompositeValueGeneratorOptions = {},
): string {
  if (_.isUndefined(value)) {
    return 'undefined';
  }

  if (_.isNull(value)) {
    return 'null';
  }

  if (_.isArray(value)) {
    if (options.handlers?.array) {
      return executeFunctionStack(value, scope, options.handlers.array, generateArray, options);
    }
    return generateArray(value, scope, options);
  }

  if (isJSExpression(value)) {
    if (options.handlers?.expression) {
      return executeFunctionStack(value, scope, options.handlers.expression, generateExpression, options);
    }
    return generateExpression(value);
  }

  if (isJSFunction(value)) {
    if (options.handlers?.function) {
      return executeFunctionStack(value, scope, options.handlers.function, genFunction, options);
    }
    return genFunction(value);
  }

  if (isJSSlot(value)) {
    if (options.handlers?.slot) {
      return executeFunctionStack(value, scope, options.handlers.slot, genJsSlot, options);
    }
    return genJsSlot(value, scope, options);
  }

  if (_.isObject(value)) {
    if (options.handlers?.object) {
      return executeFunctionStack(value, scope, options.handlers.object, generateObject, options);
    }
    return generateObject(value as CompositeObject, scope, options);
  }

  if (_.isString(value)) {
    if (options.handlers?.string) {
      return executeFunctionStack(value, scope, options.handlers.string, generateString, options);
    }
    return generateString(value);
  }

  if (_.isNumber(value)) {
    if (options.handlers?.number) {
      return executeFunctionStack(value, scope, options.handlers.number, generateNumber, options);
    }
    return generateNumber(value);
  }

  if (_.isBoolean(value)) {
    if (options.handlers?.boolean) {
      return executeFunctionStack(value, scope, options.handlers.boolean, generateBool, options);
    }
    return generateBool(value);
  }

  throw new CodeGeneratorError('Meet unknown composite value type');
}

// 这一层曾经是对产出做最外层包装的，但其实包装逻辑不应该属于这一层
// 这一层先不去掉，做冗余，方便后续重构
export function generateCompositeType(
  value: CompositeValue,
  scope: IScope,
  options: CompositeValueGeneratorOptions = {},
): string {
  const result = generateUnknownType(value, scope, options);
  return result;
}
