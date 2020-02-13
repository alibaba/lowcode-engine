export default class StylePoint {
  private lastContent: string | undefined;
  private lastUrl: string | undefined;
  placeholder: Element | Text;
  next: StylePoint | null = null;
  prev: StylePoint | null = null;

  constructor(readonly id: string, readonly level: number, placeholder?: Element) {
    if (placeholder) {
      this.placeholder = placeholder;
    } else {
      this.placeholder = document.createTextNode('');
    }
  }

  insert() {
    if (this.next) {
      document.head.insertBefore(this.placeholder, this.next.placeholder);
    } else if (this.prev) {
      document.head.insertBefore(this.placeholder, this.prev.placeholder.nextSibling);
    } else {
      document.head.appendChild(this.placeholder);
    }
  }

  applyText(content: string) {
    if (this.lastContent === content) {
      return;
    }
    this.lastContent = content;
    this.lastUrl = undefined;
    const element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    element.setAttribute('data-for', this.id);
    element.appendChild(document.createTextNode(content));
    document.head.insertBefore(element, this.placeholder);
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
    element.href = url;
    element.rel = 'stylesheet';
    element.setAttribute('data-for', this.id);
    document.head.insertBefore(element, this.placeholder);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
  }
}
