// fork from https://github.com/vuejs/router/blob/main/packages/router/src/matcher/pathTokenizer.ts

export const enum TokenType {
  Static,
  Param,
  Group,
}

const enum TokenizerState {
  Static,
  Param,
  ParamRegExp, // custom re for a param
  ParamRegExpEnd, // check if there is any ? + *
  EscapeNext,
}

interface TokenStatic {
  type: TokenType.Static
  value: string
}

interface TokenParam {
  type: TokenType.Param
  regexp?: string
  value: string
  optional: boolean
  repeatable: boolean
}

interface TokenGroup {
  type: TokenType.Group
  value: Exclude<Token, TokenGroup>[]
}

export type Token = TokenStatic | TokenParam | TokenGroup;

const ROOT_TOKEN: Token = {
  type: TokenType.Static,
  value: '',
};

const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
// After some profiling, the cache seems to be unnecessary because tokenizePath
// (the slowest part of adding a route) is very fast

// const tokenCache = new Map<string, Token[][]>()

export function tokenizePath(path: string): Array<Token[]> {
  if (!path) return [[]];
  if (path === '/') return [[ROOT_TOKEN]];
  if (!path.startsWith('/')) {
    throw new Error(
      `Route paths should start with a "/": "${path}" should be "/${path}".`
    );
  }

  // if (tokenCache.has(path)) return tokenCache.get(path)!

  function crash(message: string) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }

  let state: TokenizerState = TokenizerState.Static;
  let previousState: TokenizerState = state;
  const tokens: Array<Token[]> = [];
  // the segment will always be valid because we get into the initial state
  // with the leading /
  let segment!: Token[];

  function finalizeSegment() {
    if (segment) tokens.push(segment);
    segment = [];
  }

  // index on the path
  let i = 0;
  // char at index
  let char: string;
  // buffer of the value read
  let buffer: string = '';
  // custom regexp for a param
  let customRe: string = '';

  function consumeBuffer() {
    if (!buffer) return;

    if (state === TokenizerState.Static) {
      segment.push({
        type: TokenType.Static,
        value: buffer,
      });
    } else if (
      state === TokenizerState.Param ||
      state === TokenizerState.ParamRegExp ||
      state === TokenizerState.ParamRegExpEnd
    ) {
      if (segment.length > 1 && (char === '*' || char === '+'))
        crash(
          `A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`
        );
      segment.push({
        type: TokenType.Param,
        value: buffer,
        regexp: customRe,
        repeatable: char === '*' || char === '+',
        optional: char === '*' || char === '?',
      });
    } else {
      crash('Invalid state to consume buffer');
    }
    buffer = '';
  }

  function addCharToBuffer() {
    buffer += char;
  }

  while (i < path.length) {
    char = path[i++];

    if (char === '\\' && state !== TokenizerState.ParamRegExp) {
      previousState = state;
      state = TokenizerState.EscapeNext;
      continue;
    }

    switch (state) {
      case TokenizerState.Static:
        if (char === '/') {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ':') {
          consumeBuffer();
          state = TokenizerState.Param;
        } else {
          addCharToBuffer();
        }
        break;

      case TokenizerState.EscapeNext:
        addCharToBuffer();
        state = previousState;
        break;

      case TokenizerState.Param:
        if (char === '(') {
          state = TokenizerState.ParamRegExp;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = TokenizerState.Static;
          // go back one character if we were not modifying
          if (char !== '*' && char !== '?' && char !== '+') i--;
        }
        break;

      case TokenizerState.ParamRegExp:
        // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
        // it already works by escaping the closing )
        // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
        // is this really something people need since you can also write
        // /prefix_:p()_suffix
        if (char === ')') {
          // handle the escaped )
          if (customRe[customRe.length - 1] == '\\')
            customRe = customRe.slice(0, -1) + char;
          else state = TokenizerState.ParamRegExpEnd;
        } else {
          customRe += char;
        }
        break;

      case TokenizerState.ParamRegExpEnd:
        // same as finalizing a param
        consumeBuffer();
        state = TokenizerState.Static;
        // go back one character if we were not modifying
        if (char !== '*' && char !== '?' && char !== '+') i--;
        customRe = '';
        break;

      default:
        crash('Unknown state');
        break;
    }
  }

  if (state === TokenizerState.ParamRegExp)
    crash(`Unfinished custom RegExp for param "${buffer}"`);

  consumeBuffer();
  finalizeSegment();

  // tokenCache.set(path, tokens)

  return tokens;
}
