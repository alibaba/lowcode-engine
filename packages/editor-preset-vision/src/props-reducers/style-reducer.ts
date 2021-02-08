import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { toCss } from '@ali/vu-css-style';

export function stylePropsReducer(props: any, node: any) {
  if (props && typeof props === 'object' && props.__style__) {
    const cssId = `_style_pesudo_${ node.id.replace(/\$/g, '_')}`;
    const cssClass = `_css_pesudo_${ node.id.replace(/\$/g, '_')}`;
    const styleProp = props.__style__;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  if (props && typeof props === 'object' && props.pageStyle) {
    const cssId = '_style_pesudo_engine-document';
    const cssClass = 'engine-document';
    const styleProp = props.pageStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  if (props && typeof props === 'object' && props.containerStyle) {
    const cssId = `_style_pesudo_${ node.id}`;
    const cssClass = `_css_pesudo_${ node.id.replace(/\$/g, '_')}`;
    const styleProp = props.containerStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  return props;
}

function appendStyleNode(props: any, styleProp: any, cssClass: string, cssId: string) {
  const editor = globalContext.get(Editor);
  const designer = editor.get('designer');
  const doc = designer.currentDocument?.simulator?.contentDocument;
  if (!doc) {
    return;
  }
  const dom = doc.getElementById(cssId);
  if (dom) {
    dom.parentNode?.removeChild(dom);
  }
  if (typeof styleProp === 'object') {
    styleProp = toCss(styleProp);
  }
  if (typeof styleProp === 'string') {
    const s = doc.createElement('style');
    props.className = cssClass;
    s.setAttribute('type', 'text/css');
    s.setAttribute('id', cssId);
    doc.getElementsByTagName('head')[0].appendChild(s);
    s.appendChild(doc.createTextNode(styleProp.replace(/(\d+)rpx/g, (a, b) => {
      return `${b / 2}px`;
    }).replace(/:root/g, `.${cssClass}`)));
  }
}
