import { obx } from '@ali/lowcode-editor-core';
import { LiveTextEditingConfig } from '@ali/lowcode-types';
import { Node, Prop } from '../../document';

const EDITOR_KEY = 'data-setter-prop';

function getSetterPropElement(ele: HTMLElement, root: HTMLElement): HTMLElement | null {
  const box = ele.closest(`[${EDITOR_KEY}]`);
  if (!box || !root.contains(box)) {
    return null;
  }
  return box as HTMLElement;
}

function defaultSaveContent(content: string, prop: Prop) {
  prop.setValue(content);
}

export class LiveEditing {
  @obx.ref private _editing: Prop | null = null;
  apply(target: { node: Node; rootElement: HTMLElement; event: MouseEvent }) {
    const { node, event, rootElement } = target;
    const targetElement = event.target as HTMLElement;
    const liveTextEditing = node.componentMeta.getMetadata().experimental?.liveTextEditing || [];

    let setterPropElement = getSetterPropElement(targetElement, rootElement);
    let propTarget = setterPropElement?.dataset.setterProp;
    let matched: LiveTextEditingConfig | undefined;
    if (propTarget) {
      // 已埋点命中 data-setter-prop="proptarget", 从 liveTextEditing 读取配置（mode|onSaveContent）
      matched = liveTextEditing.find(config => config.propTarget == propTarget);
    } else {
      // 执行 embedTextEditing selector 规则，获得第一个节点 是否 contains e.target，若匹配，读取配置
      matched = liveTextEditing.find(config => {
        if (!config.selector) {
          return false;
        }
        setterPropElement = config.selector === ':root' ? rootElement : rootElement.querySelector(config.selector);
        if (!setterPropElement) {
          return false;
        }
        if (!setterPropElement.contains(targetElement)) {
          // try selectorAll
          setterPropElement = Array.from(rootElement.querySelectorAll(config.selector)).find(item => item.contains(targetElement)) as HTMLElement;
          if (!setterPropElement) {
            return false;
          }
        }
        return true;
      });
      propTarget = matched?.propTarget;
    }

    if (!propTarget) {
      // 自动纯文本编辑满足一下情况：
      //  1. children 内容都是 Leaf 且都是文本（一期）
      //  2. DOM 节点是单层容器，子集都是文本节点 (已满足)
      const isAllText = node.children?.every(item => {
        return item.isLeaf() && item.getProp('children')?.type === 'literal';
      });
      // TODO:
    }

    if (propTarget && setterPropElement) {
      const prop = node.getProp(propTarget, true)!;

      if (this._editing === prop) {
        return;
      }

      // 进入编辑
      //  1. 设置contentEditable="plaintext|..."
      //  2. 添加类名
      //  3. focus & cursor locate
      //  4. 监听 blur 事件
      //  5. 设置编辑锁定：disable hover | disable select | disable canvas drag

      const onSaveContent = matched?.onSaveContent || this.saveHandlers.find(item => item.condition(prop))?.onSaveContent || defaultSaveContent;

      setterPropElement.setAttribute('contenteditable', matched?.mode && matched.mode !== 'plaintext' ? 'true' : 'plaintext-only');
      setterPropElement.classList.add('engine-live-editing');
      // be sure
      setterPropElement.focus();
      setCaret(event);

      this._save = () => {
        onSaveContent(setterPropElement!.innerText, prop);
      };

      this._dispose = () => {
        setterPropElement!.removeAttribute('contenteditable');
        setterPropElement!.classList.remove('engine-live-editing');
      };

      setterPropElement.addEventListener('focusout', (e) => {
        this.saveAndDispose();
      });

      this._editing = prop;
    }

    // TODO: upward testing for b/i/a html elements

    // 非文本编辑
    //  国际化数据，改变当前
    //  JSExpression, 改变 mock 或 弹出绑定变量
  }

  get editing() {
    return this._editing;
  }

  private _dispose?: () => void;
  private _save?: () => void;
  saveAndDispose() {
    if (this._save) {
      this._save();
      this._save = undefined;
    }
    this.dispose();
  }

  dispose() {
    if (this._dispose) {
      this._dispose();
      this._dispose = undefined;
    }
    this._editing = null;
  }

  private saveHandlers: SaveHandler[] = [];
  setSaveHandler(handler: SaveHandler) {
    this.saveHandlers.push(handler);
  }
}

export interface SaveHandler {
  condition: (prop: Prop) => boolean;
  onSaveContent: (content: string, prop: Prop) => void;
}

function setCaret(event: MouseEvent) {
  const doc = event.view?.document!;
  const range = doc.caretRangeFromPoint(event.clientX, event.clientY);
  if (range) {
    selectRange(doc, range);
    setTimeout(() => selectRange(doc, range), 1);
  }
}

function selectRange(doc: Document, range: Range) {
  const selection = doc.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
