import {
  pathToRegexp,
  match,
  compile,
  type Key,
  type TokensToRegexpOptions,
} from 'path-to-regexp';
import type { RouteParams } from '../types';

export interface PathParser {
  re: RegExp;
  /**
   * optional = token.modifier === "?" || token.modifier === "*";
   * repeat = token.modifier === "*" || token.modifier === "+";
   */
  keys: Key[];
  /**
   * 解析路径中的参数
   */
  parse: (path: string) => RouteParams | undefined;
  stringify: (params: RouteParams) => string;
}

export type PathParserOptions = Pick<
  TokensToRegexpOptions,
  'end' | 'strict' | 'sensitive'
>;

export function createPathParser(path: string, options: PathParserOptions) {
  if (!path.startsWith('/')) {
    throw new Error(
      `Route paths should start with a "/": "${path}" should be "/${path}".`
    );
  }

  const keys: Key[] = [];
  const re = pathToRegexp(path, keys, options);
  const parse = match(path);
  const stringify = compile(path, { encode: encodeURIComponent });

  return {
    re,
    keys,
    parse: (path: string) => {
      const parsed = parse(path);
      if (!parsed) return undefined;
      return parsed.params as RouteParams;
    },
    stringify: (params: RouteParams) => {
      return stringify(params);
    },
  };
}
