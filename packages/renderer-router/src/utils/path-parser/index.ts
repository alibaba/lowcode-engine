import { type PathParserOptions, tokensToParser } from './parser-ranker';
import { tokenizePath } from './path-tokenizer';

export function createPathParser(path: string, options?: PathParserOptions) {
  return tokensToParser(tokenizePath(path), options);
}

export { comparePathParserScore } from './parser-ranker';
export type { PathParser, PathParams, PathParserOptions } from './parser-ranker';
