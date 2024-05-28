// fork from https://github.com/vuejs/router/blob/main/packages/router/src/matcher/pathParserRanker.ts

import { Token, TokenType } from './path-tokenizer';

export type PathParams = Record<string, string | string[]>;

/**
 * A param in a url like `/users/:id`
 */
interface PathParserParamKey {
  name: string;
  repeatable: boolean;
  optional: boolean;
}

export interface PathParser {
  /**
   * The regexp used to match a url
   */
  re: RegExp;

  /**
   * The score of the parser
   */
  score: Array<number[]>;

  /**
   * Keys that appeared in the path
   */
  keys: PathParserParamKey[];
  /**
   * Parses a url and returns the matched params or null if it doesn't match. An
   * optional param that isn't preset will be an empty string. A repeatable
   * param will be an array if there is at least one value.
   *
   * @param path - url to parse
   * @returns a Params object, empty if there are no params. `null` if there is
   * no match
   */
  parse(path: string): PathParams | null;

  /**
   * Creates a string version of the url
   *
   * @param params - object of params
   * @returns a url
   */
  stringify(params: PathParams): string;
}

export interface _PathParserOptions {
  /**
   * Makes the RegExp case-sensitive.
   *
   * @defaultValue `false`
   */
  sensitive?: boolean;

  /**
   * Whether to disallow a trailing slash or not.
   *
   * @defaultValue `false`
   */
  strict?: boolean;

  /**
   * Should the RegExp match from the beginning by prepending a `^` to it.
   * @internal
   *
   * @defaultValue `true`
   */
  start?: boolean;

  /**
   * Should the RegExp match until the end by appending a `$` to it.
   *
   * @defaultValue `true`
   */
  end?: boolean;
}

export type PathParserOptions = Pick<_PathParserOptions, 'end' | 'sensitive' | 'strict'>;

// default pattern for a param: non-greedy everything but /
const BASE_PARAM_PATTERN = '[^/]+?';

const BASE_PATH_PARSER_OPTIONS: Required<_PathParserOptions> = {
  sensitive: false,
  strict: false,
  start: true,
  end: true,
};

// Scoring values used in tokensToParser
const enum PathScore {
  _multiplier = 10,
  Root = 9 * _multiplier, // just /
  Segment = 4 * _multiplier, // /a-segment
  SubSegment = 3 * _multiplier, // /multiple-:things-in-one-:segment
  Static = 4 * _multiplier, // /static
  Dynamic = 2 * _multiplier, // /:someId
  BonusCustomRegExp = 1 * _multiplier, // /:someId(\\d+)
  BonusWildcard = -4 * _multiplier - BonusCustomRegExp, // /:namedWildcard(.*) we remove the bonus added by the custom regexp
  BonusRepeatable = -2 * _multiplier, // /:w+ or /:w*
  BonusOptional = -0.8 * _multiplier, // /:w? or /:w*
  // these two have to be under 0.1 so a strict /:page is still lower than /:a-:b
  BonusStrict = 0.07 * _multiplier, // when options strict: true is passed, as the regex omits \/?
  BonusCaseSensitive = 0.025 * _multiplier, // when options strict: true is passed, as the regex omits \/?
}

// Special Regex characters that must be escaped in static tokens
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;

/**
 * Creates a path parser from an array of Segments (a segment is an array of Tokens)
 *
 * @param segments - array of segments returned by tokenizePath
 * @param extraOptions - optional options for the regexp
 * @returns a PathParser
 */
export function tokensToParser(
  segments: Array<Token[]>,
  extraOptions?: _PathParserOptions,
): PathParser {
  const options = Object.assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);

  // the amount of scores is the same as the length of segments except for the root segment "/"
  const score: Array<number[]> = [];
  // the regexp as a string
  let pattern = options.start ? '^' : '';
  // extracted keys
  const keys: PathParserParamKey[] = [];

  for (const segment of segments) {
    // the root segment needs special treatment
    const segmentScores: number[] = segment.length ? [] : [PathScore.Root];

    // allow trailing slash
    if (options.strict && !segment.length) pattern += '/';
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      // resets the score if we are inside a sub-segment /:a-other-:b
      let subSegmentScore: number =
        PathScore.Segment + (options.sensitive ? PathScore.BonusCaseSensitive : 0);

      if (token.type === TokenType.Static) {
        // prepend the slash if we are starting a new segment
        if (!tokenIndex) pattern += '/';
        pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
        subSegmentScore += PathScore.Static;
      } else if (token.type === TokenType.Param) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional,
        });
        const re = regexp ? regexp : BASE_PARAM_PATTERN;
        // the user provided a custom regexp /:id(\\d+)
        if (re !== BASE_PARAM_PATTERN) {
          subSegmentScore += PathScore.BonusCustomRegExp;
          // make sure the regexp is valid before using it
          try {
            new RegExp(`(${re})`);
          } catch (err) {
            throw new Error(
              `Invalid custom RegExp for param "${value}" (${re}): ` + (err as Error).message,
            );
          }
        }

        // when we repeat we must take care of the repeating leading slash
        let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;

        // prepend the slash if we are starting a new segment
        if (!tokenIndex)
          subPattern =
            // avoid an optional / if there are more segments e.g. /:p?-static
            // or /:p?-:p2
            optional && segment.length < 2 ? `(?:/${subPattern})` : '/' + subPattern;
        if (optional) subPattern += '?';

        pattern += subPattern;

        subSegmentScore += PathScore.Dynamic;
        if (optional) subSegmentScore += PathScore.BonusOptional;
        if (repeatable) subSegmentScore += PathScore.BonusRepeatable;
        if (re === '.*') subSegmentScore += PathScore.BonusWildcard;
      }

      segmentScores.push(subSegmentScore);
    }

    // an empty array like /home/ -> [[{home}], []]
    // if (!segment.length) pattern += '/'

    score.push(segmentScores);
  }

  // only apply the strict bonus to the last score
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += PathScore.BonusStrict;
  }

  // TODO: dev only warn double trailing slash
  if (!options.strict) pattern += '/?';

  if (options.end) pattern += '$';
  // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
  else if (options.strict) pattern += '(?:/|$)';

  const re = new RegExp(pattern, options.sensitive ? '' : 'i');

  function parse(path: string): PathParams | null {
    const match = path.match(re);
    const params: PathParams = {};

    if (!match) return null;

    for (let i = 1; i < match.length; i++) {
      const value: string = match[i] || '';
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split('/') : value;
    }

    return params;
  }

  function stringify(params: PathParams): string {
    let path = '';
    // for optional parameters to allow to be empty
    let avoidDuplicatedSlash: boolean = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith('/')) path += '/';
      avoidDuplicatedSlash = false;

      for (const token of segment) {
        if (token.type === TokenType.Static) {
          path += token.value;
        } else if (token.type === TokenType.Param) {
          const { value, repeatable, optional } = token;
          const param: string | readonly string[] = value in params ? params[value] : '';

          if (Array.isArray(param) && !repeatable) {
            throw new Error(
              `Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`,
            );
          }

          const text: string = Array.isArray(param)
            ? (param as string[]).join('/')
            : (param as string);
          if (!text) {
            if (optional) {
              // if we have more than one optional param like /:a?-static we don't need to care about the optional param
              if (segment.length < 2) {
                // remove the last slash as we could be at the end
                if (path.endsWith('/')) path = path.slice(0, -1);
                // do not append a slash on the next iteration
                else avoidDuplicatedSlash = true;
              }
            } else throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }

    // avoid empty path when we have multiple optional params
    return path || '/';
  }

  return {
    re,
    score,
    keys,
    parse,
    stringify,
  };
}

/**
 * Compares an array of numbers as used in PathParser.score and returns a
 * number. This function can be used to `sort` an array
 *
 * @param a - first array of numbers
 * @param b - second array of numbers
 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
 * should be sorted first
 */
function compareScoreArray(a: number[], b: number[]): number {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    // only keep going if diff === 0
    if (diff) return diff;

    i++;
  }

  // if the last subsegment was Static, the shorter segments should be sorted first
  // otherwise sort the longest segment first
  if (a.length < b.length) {
    return a.length === 1 && a[0] === PathScore.Static + PathScore.Segment ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === PathScore.Static + PathScore.Segment ? 1 : -1;
  }

  return 0;
}

/**
 * Compare function that can be used with `sort` to sort an array of PathParser
 *
 * @param a - first PathParser
 * @param b - second PathParser
 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
 */
export function comparePathParserScore(a: PathParser, b: PathParser): number {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    // do not return if both are equal
    if (comp) return comp;

    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore)) return 1;
    if (isLastScoreNegative(bScore)) return -1;
  }

  // if a and b share the same score entries but b has more, sort b first
  return bScore.length - aScore.length;
  // this is the ternary version
  // return aScore.length < bScore.length
  //   ? 1
  //   : aScore.length > bScore.length
  //   ? -1
  //   : 0
}

/**
 * This allows detecting splats at the end of a path: /home/:id(.*)*
 *
 * @param score - score to check
 * @returns true if the last entry is negative
 */
function isLastScoreNegative(score: PathParser['score']): boolean {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
