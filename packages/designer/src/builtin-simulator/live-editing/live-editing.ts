import { obx } from '@alilc/lowcode-editor-core';
import { IPublicTypePluginConfig, IPublicTypeLiveTextEditingConfig } from '@alilc/lowcode-types';
import { INode, Prop } from '../../document';

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

export interface EditingTarget {
  node: INode;
  rootElement: HTMLElement;
  event: MouseEvent;
}

let saveHandlers: SaveHandler[] = [];
function addLiveEditingSaveHandler(handler: SaveHandler) {
  saveHandlers.push(handler);
}
function clearLiveEditingSaveHandler() {
  saveHandlers = [];
}

let specificRules: SpecificRule[] = [];
function addLiveEditingSpecificRule(rule: SpecificRule) {
  specificRules.push(rule);
}
function clearLiveEditingSpecificRule() {
  specificRules = [];
}

export class LiveEditing {
  static addLiveEditingSpecificRule = addLiveEditingSpecificRule;
  static clearLiveEditingSpecificRule = clearLiveEditingSpecificRule;

  static addLiveEditingSaveHandler = addLiveEditingSaveHandler;
  static clearLiveEditingSaveHandler = clearLiveEditingSaveHandler;

  @obx.ref private _editing: Prop | null = null;

  private _dispose?: () => void;

  private _save?: () => void;

  apply(target: EditingTarget) {
    const { node, event, rootElement } = target;
    const targetElement = event.target as HTMLElement;
    const { liveTextEditing } = node.componentMeta;

    const editor = node.document?.designer.editor;
    const npm = node?.componentMeta?.npm;
    const selected =
      [npm?.package, npm?.componentName].filter((item) => !!item).join('-') || node?.componentMeta?.componentName || '';
    editor?.eventBus.emit('designer.builtinSimulator.liveEditing', {
      selected,
    });

    let setterPropElement = getSetterPropElement(targetElement, rootElement);
    let propTarget = setterPropElement?.dataset.setterProp;
    let matched: (IPublicTypePluginConfig & { propElement?: HTMLElement }) | undefined | null;
    if (liveTextEditing) {
      if (propTarget) {
        // 已埋点命中 data-setter-prop="proptarget", 从 liveTextEditing 读取配置（mode|onSaveContent）
        matched = liveTextEditing.find(config => config.propTarget == propTarget);
      } else {
        // 执行 embedTextEditing selector 规则，获得第一个节点 是否 contains e.target，若匹配，读取配置
        matched = liveTextEditing.find(config => {
          if (!config.selector) {
            return false;
          }
          setterPropElement = queryPropElement(rootElement, targetElement, config.selector);
          return !!setterPropElement;
        });
        propTarget = matched?.propTarget;
      }
    } else {
      specificRules.some((rule) => {
        matched = rule(target);
        return !!matched;
      });
      if (matched) {
        propTarget = matched.propTarget;
        setterPropElement = matched.propElement || queryPropElement(rootElement, targetElement, matched.selector);
      }
    }

    // if (!propTarget) {
    //   // 自动纯文本编辑满足一下情况：
    //   //  1. children 内容都是 Leaf 且都是文本（一期）
    //   //  2. DOM 节点是单层容器，子集都是文本节点 (已满足)
    //   const isAllText = node.children?.every(item => {
    //     return item.isLeaf() && item.getProp('children')?.type === 'literal';
    //   });
    //   // TODO:
    // }

    if (propTarget && setterPropElement) {
      const prop = node.getProp(propTarget, true)!;

      if (this._editing === prop) {
        return;
      }

      // 进入编辑
      //  1. 设置 contentEditable="plaintext|..."
      //  2. 添加类名
      //  3. focus & cursor locate
      //  4. 监听 blur 事件
      //  5. 设置编辑锁定：disable hover | disable select | disable canvas drag

      const onSaveContent = matched?.onSaveContent || saveHandlers.find(item => item.condition(prop))?.onSaveContent || defaultSaveContent;

      setterPropElement.setAttribute('contenteditable', matched?.mode && matched.mode !== 'plaintext' ? 'true' : 'plaintext-only');
      setterPropElement.classList.add('engine-live-editing');
      // be sure
      setterPropElement.focus();
      setCaret(event);

      this._save = () => {
        onSaveContent(setterPropElement!.innerText, prop);
      };

      const keydown = (e: KeyboardEvent) => {
        console.info(e.code);
        switch (e.code) {
          case 'Enter':
            break;
            // TODO: check is richtext?
          case 'Escape':
            break;
          case 'Tab':
            setterPropElement?.blur();
        }
        // esc
        // enter
        // tab
      };
      const focusout = (/* e: FocusEvent */) => {
        this.saveAndDispose();
      };
      setterPropElement.addEventListener('focusout', focusout);
      setterPropElement.addEventListener('keydown', keydown, true);

      this._dispose = () => {
        setterPropElement!.classList.remove('engine-live-editing');
        setterPropElement!.removeAttribute('contenteditable');
        setterPropElement!.removeEventListener('focusout', focusout);
        setterPropElement!.removeEventListener('keydown', keydown, true);
      };

      this._editing = prop;
    }

    // TODO: process enter | esc events & joint the FocusTracker

    // TODO: upward testing for b/i/a html elements
  }

  get editing() {
    return this._editing;
  }

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
}

export type SpecificRule = (target: EditingTarget) => (IPublicTypeLiveTextEditingConfig & {
  propElement?: HTMLElement;
}) | null;

export interface SaveHandler {
  condition: (prop: Prop) => boolean;
  onSaveContent: (content: string, prop: Prop) => void;
}

function setCaret(event: MouseEvent) {
  const doc = event.view?.document;
  if (!doc) return;
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

function queryPropElement(rootElement: HTMLElement, targetElement: HTMLElement, selector?: string) {
  if (!selector) {
    return null;
  }
  let propElement = selector === ':root' ? rootElement : rootElement.querySelector(selector);
  if (!propElement) {
    return null;
  }
  if (!propElement.contains(targetElement)) {
    // try selectorAll
    propElement = Array.from(rootElement.querySelectorAll(selector)).find(item => item.contains(targetElement)) as HTMLElement;
    if (!propElement) {
      return null;
    }
  }
  return propElement as HTMLElement;
}
