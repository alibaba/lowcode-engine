import { isObject } from 'lodash-es';

const RE_TOKEN_LIST_VALUE: RegExp = /^(?:\d)+/;
const RE_TOKEN_NAMED_VALUE: RegExp = /^(?:\w)+/;

type Token = {
  type: 'text' | 'named' | 'list' | 'unknown';
  value: string;
};

export function parse(format: string): Array<Token> {
  const tokens: Array<Token> = [];
  let position: number = 0;

  let text: string = '';
  while (position < format.length) {
    let char: string = format[position++];
    if (char === '{') {
      if (text) {
        tokens.push({ type: 'text', value: text });
      }

      text = '';
      let sub: string = '';
      char = format[position++];
      while (char !== undefined && char !== '}') {
        sub += char;
        char = format[position++];
      }
      const isClosed = char === '}';

      const type = RE_TOKEN_LIST_VALUE.test(sub)
        ? 'list'
        : isClosed && RE_TOKEN_NAMED_VALUE.test(sub)
          ? 'named'
          : 'unknown';
      tokens.push({ value: sub, type });
    } else if (char === '%') {
      // when found rails i18n syntax, skip text capture
      if (format[position] !== '{') {
        text += char;
      }
    } else {
      text += char;
    }
  }

  text && tokens.push({ type: 'text', value: text });

  return tokens;
}

export function compile(tokens: Token[], values: Record<string, any> | any[] = {}): string[] {
  const compiled: string[] = [];
  let index: number = 0;

  const mode: string = Array.isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
  if (mode === 'unknown') {
    return compiled;
  }

  while (index < tokens.length) {
    const token: Token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break;
      case 'list':
        compiled.push((values as any[])[parseInt(token.value, 10)]);
        break;
      case 'named':
        if (mode === 'named') {
          compiled.push((values as Record<string, any>)[token.value]);
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `Type of token '${token.type}' and format of value '${mode}' don't match!`,
            );
          }
        }
        break;
      case 'unknown':
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Detect 'unknown' type of token!`);
        }
        break;
    }
    index++;
  }

  return compiled;
}
