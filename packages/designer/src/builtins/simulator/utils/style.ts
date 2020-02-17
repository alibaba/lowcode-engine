import { createDefer } from '../../../utils/create-defer';

export default class StylePoint {
  private lastContent: string | undefined;
  private lastUrl: string | undefined;
  private placeholder: Element | Text;

  constructor(readonly level: number, readonly id?: string) {
    let placeholder: any;
    if (id) {
      placeholder = document.head.querySelector(`style[data-id="${id}"]`);
    }
    if (!placeholder) {
      placeholder = document.createTextNode('');
      const meta = document.head.querySelector(`meta[level="${level}"]`);
      if (meta) {
        document.head.insertBefore(placeholder, meta);
      } else {
        document.head.appendChild(placeholder);
      }
    }
    this.placeholder = placeholder;
  }

  applyText(content: string) {
    if (this.lastContent === content) {
      return;
    }
    this.lastContent = content;
    this.lastUrl = undefined;
    const element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    if (this.id) {
      element.setAttribute('data-id', this.id);
    }
    element.appendChild(document.createTextNode(content));
    document.head.insertBefore(element, this.placeholder.parentNode === document.head ? this.placeholder.nextSibling : null);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
  }

  applyUrl(url: string) {
    if (this.lastUrl === url) {
      return;
    }
    this.lastContent = undefined;
    this.lastUrl = url;
    const element = document.createElement('link');
    element.onload = onload;
    element.onerror = onload;

    const i = createDefer();
    function onload(e: any) {
      element.onload = null;
      element.onerror = null;
      if (e.type === 'load') {
        i.resolve();
      } else {
        i.reject();
      }
    }

    element.href = url;
    element.rel = 'stylesheet';
    if (this.id) {
      element.setAttribute('data-id', this.id);
    }
    document.head.insertBefore(element, this.placeholder.parentNode === document.head ? this.placeholder.nextSibling : null);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
    return i.promise();
  }
}
