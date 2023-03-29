import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';

export function format(content: string, options = {}) {
  return prettier.format(content, {
    parser: 'babel',
    plugins: [parserBabel],
    singleQuote: true,
    jsxSingleQuote: false,
    ...options,
  });
}
