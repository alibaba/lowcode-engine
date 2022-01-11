import { project } from '@ali/lowcode-engine';
import { isPlainObject, css } from '@ali/lowcode-utils';

const { toCss } = css;

export function stylePropsReducer(props: any, node: any) {
  let cssId;
  let cssClass;
  let styleProp;
  if (!props || typeof props !== 'object') return props;
  if (props.__style__) {
    cssId = `_style_pseudo_${node.id.replace(/\$/g, '_')}`;
    cssClass = `_css_pseudo_${node.id.replace(/\$/g, '_')}`;
    styleProp = props.__style__;
    appendStyleNode(props, styleProp, cssClass, cssId);
    props.className = cssClass;
  }
  if (props.pageStyle) {
    cssId = '_style_pseudo_engine-document';
    cssClass = 'engine-document';
    styleProp = props.pageStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
    props.className = cssClass;
  }
  if (props.containerStyle) {
    cssId = `_style_pseudo_${node.id}`;
    cssClass = `_css_pseudo_${node.id.replace(/\$/g, '_')}`;
    styleProp = props.containerStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
    props.className = cssClass;
  }

  return props;
}

function appendStyleNode(props: any, styleProp: any, cssClass: string, cssId: string) {
  const doc = project.simulator?.contentDocument;

  if (!doc) {
    return;
  }
  if (isPlainObject(styleProp)) {
    styleProp = isEmptyObject(styleProp) ? '' : toCss(styleProp);
  }
  if (typeof styleProp === 'string' && styleProp) {
    const dom = doc.getElementById(cssId) as HTMLStyleElement;
    const newStyleStr = transformStyleStr(styleProp, cssClass);
    if (!dom) {
      const s = doc.createElement('style');
      s.setAttribute('type', 'text/css');
      s.setAttribute('id', cssId);
      doc.getElementsByTagName('head')[0].appendChild(s);
      s.appendChild(doc.createTextNode(newStyleStr));
      return;
    }
    if (!stringEquals(dom.innerHTML!, newStyleStr)) {
      dom.innerHTML = newStyleStr;
    }
  }
}

function isEmptyObject(obj: any) {
  if (!isPlainObject(obj)) return false;
  let empty = true;
  for (let k in obj) {
    empty = false;
  }
  return empty;
}

function stringEquals(str: string, targetStr: string): boolean {
  return removeWhitespace(str) === removeWhitespace(targetStr);
}

function removeWhitespace(str: string = ''): string {
  return str.replace(/\s/g, '');
}

function transformStyleStr(styleStr: string = '', cssClass: string): string {
  return styleStr
    .replace(/(\d+)rpx/g, (all, num) => {
      return `${num / 2}px`;
    })
    .replace(/:root/g, `.${cssClass}`);
}
