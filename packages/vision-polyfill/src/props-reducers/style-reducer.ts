import { project } from '@ali/lowcode-engine';
import { toCss } from '@ali/vu-css-style';

export function stylePropsReducer(props: any, node: any) {
  let cssId;
  let cssClass;
  let styleProp;
  if (props && typeof props === 'object' && props.__style__) {
    cssId = `_style_pesudo_${node.id.replace(/\$/g, '_')}`;
    cssClass = `_css_pesudo_${node.id.replace(/\$/g, '_')}`;
    styleProp = props.__style__;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  if (props && typeof props === 'object' && props.pageStyle) {
    cssId = '_style_pesudo_engine-document';
    cssClass = 'engine-document';
    styleProp = props.pageStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  if (props && typeof props === 'object' && props.containerStyle) {
    cssId = `_style_pesudo_${node.id}`;
    cssClass = `_css_pesudo_${node.id.replace(/\$/g, '_')}`;
    styleProp = props.containerStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  props.className = cssClass;
  return props;
}

function appendStyleNode(props: any, styleProp: any, cssClass: string, cssId: string) {
  const doc = project.simulator?.contentDocument;

  if (!doc) {
    return;
  }
  const dom = doc.getElementById(cssId) as HTMLStyleElement;
  if (typeof styleProp === 'object') {
    styleProp = toCss(styleProp);
  }
  if (typeof styleProp === 'string') {
    const newStyleStr = transformStyleStr(styleProp, cssClass);
    if (dom && stringEquals(dom.textContent!, newStyleStr)) {
      return;
    }
    if (dom) {
      dom.parentNode?.removeChild(dom);
    }
    const s = doc.createElement('style');
    s.setAttribute('type', 'text/css');
    s.setAttribute('id', cssId);
    doc.getElementsByTagName('head')[0].appendChild(s);
    s.appendChild(doc.createTextNode(newStyleStr));
  }
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
