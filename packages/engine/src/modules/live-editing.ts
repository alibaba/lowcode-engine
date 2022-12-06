import { EditingTarget, Node as DocNode, SaveHandler, LiveEditing } from '@alilc/lowcode-designer';
import { isJSExpression } from '@alilc/lowcode-utils';

function getText(node: DocNode, prop: string) {
  const p = node.getProp(prop, false);
  if (!p || p.isUnset()) {
    return null;
  }
  let v = p.getValue();
  if (isJSExpression(v)) {
    v = v.mock;
  }
  if (v == null) {
    return null;
  }
  if (p.type === 'literal') {
    return v;
  }
  return Symbol.for('not-literal');
}

export function liveEditingRule(target: EditingTarget) {
  // for vision components specific
  const { node, event } = target;

  const targetElement = event.target as HTMLElement;

  if (!Array.from(targetElement.childNodes).every(item => item.nodeType === Node.TEXT_NODE)) {
    return null;
  }

  const { innerText } = targetElement;
  const propTarget = ['title', 'label', 'text', 'content', 'children'].find(prop => {
    return equalText(getText(node, prop), innerText);
  });

  if (propTarget) {
    return {
      propElement: targetElement,
      propTarget,
    };
  }
  return null;
}

function equalText(v: any, innerText: string) {
  // TODO: enhance compare text logic
  if (typeof v !== 'string') {
    return false;
  }
  return v.trim() === innerText;
}

export const liveEditingSaveHander: SaveHandler = {
  condition: (prop) => {
    return prop.type === 'expression';
  },
  onSaveContent: (content, prop) => {
    const v = prop.getValue();
    let data = v;
    if (isJSExpression(v)) {
      data = v.mock;
    }
    data = content;
    if (isJSExpression(v)) {
      prop.setValue({
        type: 'JSExpression',
        value: v.value,
        mock: data,
      });
    } else {
      prop.setValue(data);
    }
  },
};
// TODO:
// 非文本编辑
//  国际化数据，改变当前
//  JSExpression, 改变 mock 或 弹出绑定变量

LiveEditing.addLiveEditingSpecificRule(liveEditingRule);
LiveEditing.addLiveEditingSaveHandler(liveEditingSaveHander);
