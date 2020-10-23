import valueParser, { stringify } from 'postcss-value-parser';
import namedColors from 'css-color-names';

const RE_BOX = /^(border-box|padding-box|content-box|text)$/i;
const RE_LENGTH_PERCENTAGE = /^\d*(\.\d+)?(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|q|cm|in|pt|pc|%)?$/i;
const RE_POS_PRESET = /^(left|center|right|top|bottom)$/i;
const RE_SIZE_PRESET = /^(cover|contain)$/i;
const RE_IMAGE_FUNC = /^(url|image(-set)?|cross\-fade|element|((repeating-)?(linear|radial)\-)gradient)$/i; // eslint-disable-line
const RE_REPEAT = /^(repeat|repeat\-x|repeat\-y|no\-repeat|space|round)$/i;
const RE_COLOR_FUNC = /^(rgb|rgba|hsl|hsla)$/i;
const RE_COLOR_PRESET = /^(transparent|currentColor)$/i;
const RE_COLOR_HEX = /^#(?:[a-f0-9]{3})?(?:[a-f0-9]{3})$/;
const RE_ATTACHMENT = /^(scroll|fixed|local)$/i;

function isColorValue(word) {
  return namedColors.hasOwnProperty(word) || RE_COLOR_PRESET.test(word) || RE_COLOR_HEX.test(word);
}

function isColorFunc(word) {
  return RE_COLOR_FUNC.test(word);
}

function isColorNode(node) {
  if (node.type === 'word') {
    return isColorValue(node.value);
  }
  if (node.type === 'function') {
    return isColorFunc(node.value);
  }
  return false;
}

function isImageFunc(word) {
  return RE_IMAGE_FUNC.test(word);
}
function isImageNode(node) {
  if (node.type === 'word') {
    return node.value === 'none';
  }
  if (node.type === 'function') {
    return isImageFunc(node.value);
  }
  return false;
}

function isRepeatNode(node) {
  if (node.type === 'word') {
    return RE_REPEAT.test(node.value);
  }
  return false;
}

function isAttachmentNode(node) {
  if (node.type === 'word') {
    return RE_ATTACHMENT.test(node.value);
  }
  return false;
}

function isBoxNode(node) {
  if (node.type === 'word') {
    return RE_BOX.test(node.value);
  }
  return false;
}

function isPostionValue(word) {
  return RE_LENGTH_PERCENTAGE.test(word) || RE_POS_PRESET.test(word);
}

function isPositionNode(node) {
  if (node.type === 'word') {
    return isPostionValue(node.value);
  }
  return false;
}

function isSizePreset(word) {
  return RE_SIZE_PRESET.test(word);
}

function isSizeValue(word) {
  return RE_LENGTH_PERCENTAGE.test(word) || word === 'auto' || isSizePreset(word);
}

function isSizeNode(node) {
  if (node.type === 'word') {
    return isSizeValue(node.value);
  }
  return false;
}

function eatSpace(nodes, index) {
  const node = nodes[index];
  if (!node || node.type !== 'space') {
    return index;
  }
  return index + 1;
}

function readValue(nodes, index, store) {
  const node = nodes[index];
  // color
  if (isColorNode(node)) {
    store['background-color'] = stringify(node);
    return index + 1;
  }
  // image
  if (isImageNode(node)) {
    store['background-image'] = stringify(node);
    return index + 1;
  }
  // attchment
  if (isAttachmentNode(node)) {
    store['background-attachment'] = stringify(node);
    return index + 1;
  }
  // repeat
  if (isRepeatNode(node)) {
    let repeat = stringify(node);
    index = eatSpace(nodes, index + 1);
    const sibling = nodes[index];
    if (sibling && isRepeatNode(sibling)) {
      repeat = `${repeat} ${stringify(sibling)}`;
      index += 1;
    }
    store['background-repeat'] = repeat;
    return index;
  }
  // origin & clip
  if (isBoxNode(node)) {
    let origin = stringify(node);
    let clip = null;
    if (origin === 'text') {
      clip = origin;
      origin = null;
    }

    index = eatSpace(nodes, index + 1);
    const sibling = nodes[index];
    if (sibling && isBoxNode(sibling)) {
      if (clip) {
        origin = stringify(sibling);
      } else {
        clip = stringify(sibling);
      }
      index += 1;
    }

    if (origin) {
      store['background-origin'] = origin;
    }
    if (clip) {
      store['background-clip'] = clip;
    }
    return index;
  }
  // position & size
  if (isPositionNode(node)) {
    let position = stringify(node);
    let size = null;
    index = eatSpace(nodes, index + 1);
    let sibling = nodes[index];
    if (sibling && isPositionNode(sibling)) {
      position = `${position} ${stringify(sibling)}`;
      index = eatSpace(nodes, index + 1);
      sibling = nodes[index];
    }
    if (sibling && sibling.type === 'div' && sibling.value === '/') {
      index = eatSpace(nodes, index + 1);
      sibling = nodes[index];
      if (sibling && isSizeNode(sibling)) {
        size = stringify(sibling);
        if (!isSizePreset(size)) {
          index = eatSpace(nodes, index + 1);
          sibling = nodes[index];
          if (sibling && isSizeNode(sibling)) {
            size = `${size} ${stringify(sibling)}`;
            index += 1;
          }
        }
      }
    }

    store['background-position'] = position;
    if (size) {
      store['background-size'] = size;
    }

    return index;
  }

  return index + 1;
}

function parser(bakcground) {
  const nodes = valueParser(typeof bakcground === 'string' ? bakcground : '').nodes;
  const l = nodes.length;
  const items = [];
  let item;
  const append = () => {
    item = {};
    items.push(item);
  };
  append();

  let node;
  let type;
  let value;
  let i = 0;
  while (i < l) {
    node = nodes[i];
    type = node.type;
    value = node.value;
    if (type === 'word' || type === 'function') {
      i = readValue(nodes, i, item);
      continue;
    }
    i++;
    // div = ,
    if (type === 'div' && value === ',') {
      append();
    }
  }
  return items;
}

function build(bg) {
  if (Array.isArray(bg)) {
    return bg.map(build).join(',');
  }

  let pos = bg['background-position'];
  if (pos && bg['background-size']) {
    pos = `${pos}/${bg['background-size']}`;
  }

  return ['image', 'repeat', 'attachment', 'position', 'origin', 'clip', 'color'].map(key => {
    return (key === 'position' ? pos : bg[`background-${key}`]) || '';
  }).filter(item => item !== '').join(' ');
}

parser.build = build;

export default parser;
