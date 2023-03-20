import {
  IPublicTypeCompositeArray,
  IPublicTypeCompositeValue,
  IPublicTypeCompositeObject,
  IPublicTypeJSFunction,
  IPublicTypeJSExpression,
  isJSExpression,
  isJSFunction,
  isJSSlot,
  IPublicTypeJSSlot,
} from '@alilc/lowcode-types';
import _ from 'lodash';

import { IScope, CompositeValueGeneratorOptions, CodeGeneratorError } from '../types';
import { generateExpression, generateFunction } from './jsExpression';
import { generateJsSlot } from './jsSlot';
import { executeFunctionStack } from './aopHelper';
import { parseExpressionGetKeywords } from './expressionParser';
import { isJSExpressionFn } from './common';

interface ILegaoVariable {
  type: 'variable';
  value: string;
  variable: string;
}

function isVariable(v: any): v is ILegaoVariable {
  if (_.isObject(v) && (v as ILegaoVariable).type === 'variable') {
    return true;
  }
  return false;
}

interface DataSource {
  type: 'DataSource';
  id: string;
}

/**
 * 判断是否是数据源类型
 */
function isDataSource(v: unknown): v is DataSource {
  return typeof v === 'object' && v != null && (v as Partial<DataSource>).type === 'DataSource';
}

function generateArray(
  value: IPublicTypeCompositeArray,
  scope: IScope,
  options: CompositeValueGeneratorOptions = {},
): string {
  const body = value.map((v) => generateUnknownType(v, scope, options)).join(',');
  return `[${body}]`;
}

function generateObject(
  value: IPublicTypeCompositeObject,
  scope: IScope,
  options: CompositeValueGeneratorOptions = {},
): string {
  if (value.type === 'i18n') {
    // params 可能会绑定变量，这里需要处理下
    if (value.params && typeof value.params === 'object') {
      return `this._i18nText(${generateUnknownType(_.omit(value, 'type'), scope, options)})`;
    }
    return `this._i18nText(${JSON.stringify(_.omit(value, 'type'))})`; // TODO: 优化：这里可以考虑提取成个常量...
  }

  const body = Object.keys(value)
    .map((key) => {
      const propName = JSON.stringify(key);
      const v = generateUnknownType(value[key], scope, options);
      return `${propName}: ${v}`;
    })
    .join(',\n');

  return `{${body}}`;
}

function generateString(value: string): string {
  // 有的字符串里面会有特殊字符，比如换行或引号之类的，这里我们借助 JSON 的字符串转义功能来做下转义并加上双引号
  return JSON.stringify(value);
}

function generateNumber(value: number): string {
  return String(value);
}

function generateBool(value: boolean): string {
  return value ? 'true' : 'false';
}

function genFunction(value: IPublicTypeJSFunction): string {
  const globalVars = parseExpressionGetKeywords(value.value);

  if (globalVars.includes('arguments')) {
    return generateFunction(value, { isBindExpr: true });
  }

  return generateFunction(value, { isArrow: true });
}

function genJsSlot(value: IPublicTypeJSSlot, scope: IScope, options: CompositeValueGeneratorOptions = {}) {
  if (options.nodeGenerator) {
    return generateJsSlot(value, scope, options.nodeGenerator);
  }
  return '';
}

function generateUnknownType(
  value: IPublicTypeCompositeValue,
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

  // FIXME: 这个是临时方案
  // 在遇到 type variable 私有类型时，转换为 JSExpression
  if (isVariable(value)) {
    const transValue: IPublicTypeJSExpression = {
      type: 'JSExpression',
      value: value.variable,
    };

    if (options.handlers?.expression) {
      const expression = executeFunctionStack(
        transValue,
        scope,
        options.handlers.expression,
        generateExpression,
        options,
      );
      return expression || 'undefined';
    }
    return generateExpression(transValue, scope);
  }

  if (isJSExpression(value)) {
    if (options.handlers?.expression) {
      return executeFunctionStack(
        value,
        scope,
        options.handlers.expression,
        generateExpression,
        options,
      );
    }
    return generateExpression(value, scope);
  }

  if (isJSFunction(value) || isJSExpressionFn(value)) {
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

  if (isDataSource(value)) {
    return generateUnknownType(
      {
        type: 'JSExpression',
        value: `this.dataSourceMap[${JSON.stringify(value.id)}]`,
      },
      scope,
      options,
    );
  }

  if (_.isObject(value)) {
    if (options.handlers?.object) {
      return executeFunctionStack(value, scope, options.handlers.object, generateObject, options);
    }
    return generateObject(value as IPublicTypeCompositeObject, scope, options);
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
  value: IPublicTypeCompositeValue,
  scope: IScope,
  options: CompositeValueGeneratorOptions = {},
): string {
  const result = generateUnknownType(value, scope, options);
  return result;
}
