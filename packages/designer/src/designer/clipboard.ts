import { IPublicModelClipboard } from '@alilc/lowcode-types';

function getDataFromPasteEvent(event: ClipboardEvent) {
  const { clipboardData } = event;
  if (!clipboardData) {
    return null;
  }

  try {
    // { componentsMap, componentsTree, ... }
    const data = JSON.parse(clipboardData.getData('text/plain'));
    if (!data) {
      return {};
    }
    if (data.componentsTree) {
      return data;
    } else if (data.componentName) {
      return {
        componentsTree: [data],
      };
    }
  } catch (error) {
    // TODO: open the parser implement
    return { };
  }
}

export interface IClipboard extends IPublicModelClipboard {

  initCopyPaster(el: HTMLTextAreaElement): void;

  injectCopyPaster(document: Document): void;
}
class Clipboard implements IClipboard {
  private copyPasters: HTMLTextAreaElement[] = [];

  private waitFn?: (data: any, e: ClipboardEvent) => void;

  constructor() {
    this.injectCopyPaster(document);
  }

  isCopyPasteEvent(e: Event) {
    this.isCopyPaster(e.target);
  }

  private isCopyPaster(el: any) {
    return this.copyPasters.includes(el);
  }

  initCopyPaster(el: HTMLTextAreaElement) {
    this.copyPasters.push(el);
    const onPaste = (e: ClipboardEvent) => {
      if (this.waitFn) {
        this.waitFn(getDataFromPasteEvent(e), e);
        this.waitFn = undefined;
      }
      el.blur();
    };
    el.addEventListener('paste', onPaste, false);
    return () => {
      el.removeEventListener('paste', onPaste, false);
      const i = this.copyPasters.indexOf(el);
      if (i > -1) {
        this.copyPasters.splice(i, 1);
      }
    };
  }

  injectCopyPaster(document: Document) {
    if (this.copyPasters.find((x) => x.ownerDocument === document)) {
      return;
    }
    const copyPaster = document.createElement<'textarea'>('textarea');
    copyPaster.style.cssText = 'position: absolute;left: -9999px;top:-100px';
    document.body.appendChild(copyPaster);
    const dispose = this.initCopyPaster(copyPaster);
    return () => {
      dispose();
      document.removeChild(copyPaster);
    };
  }

  setData(data: any): void {
    const copyPaster = this.copyPasters.find((x) => x.ownerDocument);
    if (!copyPaster) {
      return;
    }
    copyPaster.value = typeof data === 'string' ? data : JSON.stringify(data);
    copyPaster.select();
    copyPaster.ownerDocument!.execCommand('copy');

    copyPaster.blur();
  }

  waitPasteData(keyboardEvent: KeyboardEvent, cb: (data: any, e: ClipboardEvent) => void) {
    const win = keyboardEvent.view;
    if (!win) {
      return;
    }
    const copyPaster = this.copyPasters.find((cp) => cp.ownerDocument === win.document);
    if (copyPaster) {
      copyPaster.select();
      this.waitFn = cb;
    }
  }
}

export const clipboard = new Clipboard();
