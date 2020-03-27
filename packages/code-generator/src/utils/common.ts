import changeCase from 'change-case';
import short from 'short-uuid';

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

export function uniqueArray<T>(arr: T[]) {
  const uniqueItems = [...new Set<T>(arr)];
  return uniqueItems;
}
