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

export function uniqueArray<T>(arr: T[], by: (i: T) => string) {
  const map: Record<string, T> = {};
  arr.forEach((item) => {
    map[by(item)] = item;
  });
  const uniqueKeys = [...new Set<string>(Object.keys(map))];
  const uniqueItems = uniqueKeys.map((key) => map[key]);
  return uniqueItems;
}
