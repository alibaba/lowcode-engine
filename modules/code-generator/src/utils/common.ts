import type { IPublicTypeJSExpression, IPublicTypeJSFunction } from '@alilc/lowcode-types';
import changeCase from 'change-case';
import short from 'short-uuid';
import { DependencyType, IDependency, IExternalDependency, IInternalDependency } from '../types';

// Doc: https://www.npmjs.com/package/change-case

export function camel2dash(input: string): string {
  return changeCase.paramCase(input);
}

/**
 * 转为驼峰
 */
export function camelize(str: string): string {
  return changeCase.camelCase(str);
}

export function generateID(): string {
  return short.generate();
}

export function upperCaseFirst(inputValue: string): string {
  return changeCase.upperCaseFirst(inputValue);
}

export function uniqueArray<T>(arr: T[], by: (i: T) => string) {
  const map: Record<string, T> = {};
  arr.forEach((item) => {
    map[by(item)] = item;
  });
  // FIXME: Babel 编译存在问题，暂时替换实现
  // const uniqueKeys = [...new Set<string>(Object.keys(map))];
  const uniqueKeys = Array.from(new Set<string>(Object.keys(map)));
  const uniqueItems = uniqueKeys.map((key) => map[key]);
  return uniqueItems;
}

export function getStaticExprValue<T>(expr: string): T {
  // TODO: 需要安全性检查
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${expr})`)();
}

export function isJSExpressionFn(data: any): data is IPublicTypeJSFunction {
  return data?.type === 'JSExpression' && data?.extType === 'function';
}

export function isInternalDependency(
  dependency: IDependency,
): dependency is IInternalDependency {
  return dependency.dependencyType === DependencyType.Internal;
}

export function isExternalDependency(
  dependency: IDependency,
): dependency is IExternalDependency {
  return dependency.dependencyType === DependencyType.External;
}