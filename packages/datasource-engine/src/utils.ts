/* eslint-disable no-new-func */

import {
  CompositeValue,
  IDataSourceRuntimeContext,
  InterpretDataSourceConfig,
  isJSExpression,
  isJSFunction,
  JSExpression,
  JSFunction,
  JSONObject,
  RuntimeOptionsConfig,
} from '@ali/lowcode-types';

export const transformExpression = (
  code: string,
  context: IDataSourceRuntimeContext,
) => {
  try {
    return new Function(`return (${code})`).call(context);
  } catch (error) {
    console.error(
      `transformExpression error, code is ${code}, context is ${context}, error is ${error}`,
    );
  }
};

export const transformFunction = (
  code: string,
  context: IDataSourceRuntimeContext,
) => {
  try {
    return new Function(`return (${code})`).call(context).bind(context);
  } catch (error) {
    console.error(
      `transformFunction error, code is ${code}, context is ${context}, error is ${error}`,
    );
  }
};

export const transformBoolStr = (str: string) => {
  return str !== 'false';
};

export const getRuntimeJsValue = (
  value: JSExpression | JSFunction,
  context: IDataSourceRuntimeContext,
) => {
  if (!['JSExpression', 'JSFunction'].includes(value.type)) {
    console.error(`translate error, value is ${JSON.stringify(value)}`);
    return '';
  }
  // TODO: 类型修复
  const code = value.compiled || value.value;
  return value.type === 'JSFunction'
    ? transformFunction(code, context)
    : transformExpression(code, context);
};

export const getRuntimeBaseValue = (type: string, value: any) => {
  switch (type) {
    case 'string':
      return `${value}`;
    case 'boolean':
      return typeof value === 'string'
        ? transformBoolStr(value as string)
        : value;
    case 'number':
      return Number(value);
    default:
      return value;
  }
};

export const getRuntimeValueFromConfig = (
  type: string,
  value: CompositeValue,
  context: IDataSourceRuntimeContext,
) => {
  if (!value) return undefined;
  if (isJSExpression(value) || isJSFunction(value)) {
    return getRuntimeBaseValue(type, getRuntimeJsValue(value, context));
  }
  return getRuntimeBaseValue(type, value);
};

export const buildJsonObj = (
  params: JSONObject | JSExpression,
  context: IDataSourceRuntimeContext,
) => {
  const result: Record<string, any> = {};
  if (isJSExpression(params)) {
    return transformExpression(params.value, context);
  }
  Object.keys(params).forEach((key: string) => {
    const currentParam: any = params[key];
    if (isJSExpression(currentParam)) {
      result[key] = transformExpression(currentParam.value, context);
    } else {
      result[key] = getRuntimeBaseValue(currentParam.type, currentParam.value);
    }
  });

  return result;
};

export const buildShouldFetch = (
  ds: InterpretDataSourceConfig,
  context: IDataSourceRuntimeContext,
) => {
  if (!ds.options || !ds.shouldFetch) {
    return true; // 默认为 true
  }
  if (isJSExpression(ds.shouldFetch) || isJSFunction(ds.shouldFetch)) {
    return getRuntimeJsValue(ds.shouldFetch, context);
  }

  return getRuntimeBaseValue('boolean', ds.shouldFetch);
};

export const buildOptions = (
  ds: InterpretDataSourceConfig,
  context: IDataSourceRuntimeContext,
) => {
  const { options } = ds;
  if (!options) return undefined;
  // eslint-disable-next-line space-before-function-paren
  return function() {
    // 默认值
    const fetchOptions: RuntimeOptionsConfig = {
      uri: '',
      params: {},
      method: 'GET',
      isCors: true,
      timeout: 5000,
      headers: undefined,
      v: '1.0',
    };
    Object.keys(options).forEach((key: string) => {
      switch (key) {
        case 'uri':
          fetchOptions.uri = getRuntimeValueFromConfig(
            'string',
            options.uri,
            context,
          );
          break;
        case 'params':
          fetchOptions.params = buildJsonObj(options.params!, context);
          break;
        case 'method':
          fetchOptions.method = getRuntimeValueFromConfig(
            'string',
            options.method,
            context,
          );
          break;
        case 'isCors':
          fetchOptions.isCors = getRuntimeValueFromConfig(
            'boolean',
            options.isCors,
            context,
          );
          break;
        case 'timeout':
          fetchOptions.timeout = getRuntimeValueFromConfig(
            'number',
            options.timeout,
            context,
          );
          break;
        case 'headers':
          fetchOptions.headers = buildJsonObj(options.headers!, context);
          break;
        case 'v':
          fetchOptions.v = getRuntimeValueFromConfig(
            'string',
            options.v,
            context,
          );
          break;
        default:
          // 其余的除了做表达式或者 function 的转换，直接透传
          fetchOptions[key] = getRuntimeValueFromConfig(
            'unknown',
            options[key],
            context,
          );
      }
    });
    return fetchOptions;
  };
};
