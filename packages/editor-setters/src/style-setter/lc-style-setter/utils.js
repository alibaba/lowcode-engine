import parseCssFont from 'parse-css-font';
import valueParser, { stringify } from 'postcss-value-parser';
import { cssToRuntime, toNativeStyle, normalizeStyle, toCss } from '@ali/vu-css-style';
import backgroundParser from './background/parser';

function getComputePropertyValue(node, property) {
  const nativeNode = node;
  if (!nativeNode) return null;
  return window.getComputedStyle(nativeNode, null).getPropertyValue(property);
}

function getStylePropertyValue(style, property) {
  if (!style) {
    return null;
  }
  return style[property];
}

function isEmptyCssValue(value) {
  return value == null || value === '';
}

function notEmptyValue(v1, last) {
  return isEmptyCssValue(v1) ? last : v1;
}

function isString(str) {
  return {}.toString.call(str) === '[object String]';
}

function getInheritPropertyValue(style, property, node) {
  return node ? getComputePropertyValue(node, property) : null;
}

// property: padding/padding-top/../margin/margin-top/..
function getPropertyValue(props, property) {
  const style = props.value || props.defaultValue || {};
  const current = getStylePropertyValue(style, property);
  const inherit = getInheritPropertyValue(
    style, property, props.node);

  return { current, inherit, value: notEmptyValue(current, inherit) };
}

const transducer = {
  toHot(style) {
    let runtime;
    let native;
    let css;

    if (isString(style)) {
      css = style;
      runtime = cssToRuntime(style);
      native = toNativeStyle(runtime);
    } else {
      runtime = normalizeStyle(style);
      native = toNativeStyle(runtime);
      css = toCss(runtime);
    }

    return {
      source: css,
      runtime,
      native,
    };
  },
  toNative(hotval) {
    return hotval.native;
  },
};

function setHotValueFromRuntime(props, runtime) {
  const native = toNativeStyle(runtime);
  const css = toCss(runtime);
  props.onChange({
    source: css,
    runtime,
    native,
  });
}

// TODO: 废弃
function setHotValueFromSource(props, source) {
  // do nothing

}

function setValue(scope, property, value) {
  if (isEmptyCssValue(value)) {
    delete scope[property];
  } else {
    // delete key to ensure the new key is placed on the last
    // to have the highest priority of some css props
    delete scope[property];
    scope[property] = value;
  }
}

function getCurrentPropertyValue(props, property) {
  const style = props.value || props.defaultValue || {};
  return getStylePropertyValue(style, property);
}

function getCurrentPropertyHighlight(props, property) {
  const style = props.value || props.defaultValue || {};
  return getStylePropertyValue(style, property) != undefined;
}

function setPropertyValue(props, property, value) {
  const isMulti = typeof property === 'object' && property;
  let style = props.value || props.defaultValue || {};

  const scope = style;

  if (isMulti) {
    Object.keys(property).forEach((key) => {
      setValue(scope, key, property[key]);
    });
  } else {
    setValue(scope, property, value);
  }

  setHotValueFromRuntime(props, style);
}

function parseFont(font) {
  let parsed;
  try {
    parsed = parseCssFont(font || '');
  } catch (e) {
    return {};
  }
  return {
    'font-size': parsed.size,
    'font-family': parsed.family ? parsed.family.join(',') : '',
    'font-style': parsed.style,
    'font-variant': parsed.variant,
    'font-weight': parsed.weight,
    'font-stretch': parsed.stretch,
    'line-height': parsed.lineHeight,
  };
}

function parseBackground(background) {
  if (!background || background === 'initial') {
    return [{}];
  }

  return backgroundParser(background);
}

function getFont(props, item) {
  let { current, inherit } = getPropertyValue(props, item);
  const font = getPropertyValue(props, 'font');
  if (isEmptyCssValue(current)) {
    current = parseFont(font.current)[item];
  }
  if (isEmptyCssValue(inherit)) {
    inherit = parseFont(font.inherit)[item];
  }
  return {
    current,
    inherit,
    value: notEmptyValue(current, inherit),
  };
}

function buildBackground(background) {
  return backgroundParser.build(background);
}

function getBackground(props, item) {
  let { current, inherit } = getPropertyValue(props, item);
  const background = getPropertyValue(props, 'background');
  // if (item === 'background-position') { }
  if (isEmptyCssValue(current)) {
    current = parseBackground(background.current).pop()[item];
  }
  if (isEmptyCssValue(inherit)) {
    inherit = parseBackground(background.inherit).pop()[item];
  }
  return {
    current,
    inherit,
    value: notEmptyValue(current, inherit),
  };
}

function setBackground(props, item, value) {
  const background = getCurrentPropertyValue(props, 'background');
  const bgs = parseBackground(background);
  const bg = bgs.pop();

  if (!isEmptyCssValue(bg['background-image']) || !isEmptyCssValue(bg['background-color'])) {
    bg[item] = value;
    bgs.push(bg);
    setPropertyValue(props, {
      background: buildBackground(bgs),
      [item]: null,
    });
  } else {
    setPropertyValue(props, item, value);
  }
}

function buildFont(font) {
  let size = font['font-size'];
  if (!isEmptyCssValue(font['line-height'])) {
    size = `${size}/${font['line-height']}`;
  }
  let ret = `${size} ${font['font-family']}`;
  if (!isEmptyCssValue(font['font-stretch'])) {
    ret = `${font['font-stretch']} ${ret}`;
  }
  if (!isEmptyCssValue(font['font-weight'])) {
    ret = `${font['font-weight']} ${ret}`;
  }
  if (!isEmptyCssValue(font['font-variant'])) {
    ret = `${font['font-variant']} ${ret}`;
  }
  if (!isEmptyCssValue(font['font-style'])) {
    ret = `${font['font-style']} ${ret}`;
  }
  return ret;
}

function setFont(props, item, value) {
  const font = getCurrentPropertyValue(props, 'font');
  const parsed = parseFont(font);

  if (!isEmptyCssValue(parsed['font-size']) && !isEmptyCssValue(parsed['font-family'])) {
    parsed[item] = value;
    setPropertyValue(props, {
      font: buildFont(parsed),
      [item]: null,
    });
  } else {
    setPropertyValue(props, item, value);
  }
}

function getImageUrl(image) {
  if (!image || image === 'none') {
    return image;
  }

  let nodes = valueParser(image).nodes;
  if (!nodes) {
    return '';
  }

  let node = nodes[0];
  if (node.type !== 'function' && node.value !== 'url') {
    return '';
  }
  nodes = node.nodes;
  node = nodes.find(item => item.type === 'string');
  if (node) {
    return node.value;
  }
  return stringify(nodes);
}

export default {
  transducer,
  getComputePropertyValue,
  getCurrentPropertyValue,
  getInheritPropertyValue,
  isEmptyCssValue,
  notEmptyValue,
  getPropertyValue,
  setPropertyValue,
  setHotValueFromSource,
  getFont,
  setFont,
  getBackground,
  setBackground,
  getImageUrl,
  getCurrentPropertyHighlight,
};
