import _ from 'lodash';
// import { encode } from 'html-entities';

const SPECIAL_CHARS = '\n\r\'"<>&';
const SPECIAL_CHARS_REG = new RegExp(
  `[${SPECIAL_CHARS.split('')
    .map((c) => `\\x${_.padStart(c.charCodeAt(0).toString(16), 2, '0')}`)
    .join('')}]`,
  'g',
);

export function encodeJsxStringNode(str: string): string {
  return str.replace(SPECIAL_CHARS_REG, (c) => `&#${c.charCodeAt(0)};`);
}

// export function encodeJsxStringNode(str: string): string {
//   return encode(str);
// }
