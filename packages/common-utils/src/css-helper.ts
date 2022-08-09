/**
 * just for legao
 * @author: jiushen
 */
// 需要通过 Env 来判断是否需要

import { some } from 'lodash';

const pseudoMap = ['hover', 'focus', 'active', 'visited'];

const RE_CAMEL = /[A-Z]/g;
const RE_HYPHEN = /[-\s]+(.)?/g;
const CSS_REG = /:root(.*)\{.*/i;
const PROPS_REG = /([^:]*):\s?(.*)/i;

// 给 css 分组
function groupingCss(css) {
  let stackLength = 0;
  let startIndex = 0;
  const group = [];
  css.split('').forEach((char, index) => {
    if (char === '{') {
      stackLength++;
    }
    if (char === '}') {
      if (stackLength === 1) {
        group.push(css.substring(startIndex, index + 1));
        startIndex = index + 1;
      }
      stackLength--;
    }
  });
  return group;
}


function isString(str) {
  return {}.toString.call(str) === '[object String]';
}

function hyphenate(str) {
  return str.replace(RE_CAMEL, w => `-${w}`).toLowerCase();
}

function camelize(str) {
  return str.replace(RE_HYPHEN, (m, w) => (w ? w.toUpperCase() : ''));
}
/**
 * convert
 * {background-color: "red"}
 * to
 * background-color: red;
 */
function runtimeToCss(runtime) {
  const css = [];
  Object.keys(runtime).forEach((key) => {
    css.push(`  ${key}: ${runtime[key]};`);
  });
  return css.join('\n');
}

function toNativeStyle(runtime) {
  if (!runtime) {
    return {};
  }
  if (runtime.default) {
    const normalized = {};
    Object.keys(runtime).forEach((pseudo) => {
      if (pseudo === 'extra') {
        normalized[pseudo] = runtime[pseudo];
        return;
      }
      normalized[pseudo] = toNativeStyle(runtime[pseudo]);
    });
    return normalized;
  }

  const normalized = {};
  Object.keys(runtime).forEach((key) => {
    normalized[camelize(key)] = runtime[key];
  });
  return normalized;
}

function normalizeStyle(style) {
  if (!style) {
    return {};
  }
  if (style.default) {
    const normalized = {};
    Object.keys(style).forEach((pseudo) => {
      if (pseudo === 'extra') {
        normalized[pseudo] = style[pseudo];
        return;
      }
      normalized[pseudo] = normalizeStyle(style[pseudo]);
    });
    return normalized;
  }

  const normalized = {};
  Object.keys(style).forEach((key) => {
    normalized[hyphenate(key)] = style[key];
  });
  return normalized;
}


function toCss(runtime) {
  if (!runtime) {
    return (
      `:root {

}`);
  }

  if (runtime.default) {
    const css = [];
    Object.keys(runtime).forEach((pseudo) => {
      if (pseudo === 'extra') {
        Array.isArray(runtime.extra) && css.push(runtime.extra.join('\n'));
        return;
      }
      // 只需要对这四种做兼容
      const prefix = pseudoMap.indexOf(pseudo) > -1 ? ':' : '';
      css.push(
        `:root${pseudo === 'default' ? '' : `${prefix}${pseudo}`} {
${runtimeToCss(normalizeStyle(runtime[pseudo]))}
}\n`,
);
    });
    return css.join('\n');
  }

  return (
    `:root {
${runtimeToCss(normalizeStyle(runtime))}
}
`
  );
}

function cssToRuntime(css) {
  if (!css) {
    return {};
  }
  const runtime = {};
  const groups = groupingCss(css);
  groups.forEach((cssItem) => {
    if (!cssItem.startsWith(':root')) {
      runtime.extra = runtime.extra || [];
      runtime.extra.push(cssItem.trim());
    } else {
      const res = /:root:?(.*)?{(.*)/ig.exec(cssItem.replace(/[\r\n]+/ig, '').trim());
      if (res) {
        let pseudo;

        if (res[1] && res[1].trim() && some(pseudoMap, pse => res[1].indexOf(pse) === 0)) {
          pseudo = res[1].trim();
        } else if (res[1] && res[1].trim()) {
          pseudo = res[1];
        }

        const s = {};
        res[2].split(';').reduce((prev, next) => {
          if (next.indexOf('base64') > -1) {
            prev[prev.length - 1] += `;${next}`;
          } else {
            prev.push(next);
          }
          return prev;
        }, []).forEach((item) => {
          if (item) {
            if (PROPS_REG.test(item)) {
              const props = item.match(PROPS_REG);
              const key = props[1];
              const value = props[2];
              if (key && value) {
                s[key.trim()] = value.trim();
              }
            }
          }
        });

        if (!pseudo) {
          pseudo = 'default';
        }
        runtime[pseudo] = s;
      }
    }
  });
  return runtime;
}

function cssToStyle(css) {
  try {
    if (isString(css)) {
      return toNativeStyle(cssToRuntime(css).default);
    }
    if (css.default) {
      return toNativeStyle(normalizeStyle(css.default));
    }
    return toNativeStyle(normalizeStyle(css));
  } catch (e) {
    // do nothing
  }
  return {};
}

export {
  hyphenate,
  camelize,
  toNativeStyle,
  normalizeStyle,
  toCss,
  cssToRuntime,
  cssToStyle,
};
