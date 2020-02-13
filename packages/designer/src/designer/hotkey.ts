import Hotkey, { isFormEvent } from '../utils/hotkey';
import { getCurrentDocument, getCurrentAdaptor } from './current';
import { isShadowNode } from '../document/node/shadow-node';
import { focusing } from './focusing';
import { INode, isElementNode, insertChildren } from '../document/node';
import { activeTracker } from './active-tracker';
import clipboard from '../utils/clipboard';

export const hotkey = new Hotkey();

// hotkey binding
hotkey.bind(['backspace', 'del'], (e: KeyboardEvent) => {
  const doc = getCurrentDocument();
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();

  const sel = doc.selection;
  const topItems = sel.getTopNodes();
  topItems.forEach(node => {
    if (isShadowNode(node)) {
      doc.removeNode(node.origin);
    } else {
      doc.removeNode(node);
    }
  });
  sel.clear();
});

hotkey.bind('escape', (e: KeyboardEvent) => {
  const currentFocus = focusing.current;
  if (isFormEvent(e) || !currentFocus) {
    return;
  }
  e.preventDefault();

  currentFocus.esc();
});

function isHTMLTag(name: string) {
  return /^[a-z]\w*$/.test(name);
}

function isIgnore(uri: string) {
  return /^(\.|@(builtins|html|imported):)/.test(uri);
}

function generateMaps(node: INode | INode[], maps: any = {}) {
  if (Array.isArray(node)) {
    node.forEach(n => generateMaps(n, maps));
    return maps;
  }
  if (isElementNode(node)) {
    const { uri, tagName } = node;
    if (uri && !isHTMLTag(tagName) && !isIgnore(uri)) {
      maps[tagName] = uri;
    }
    generateMaps(node.children, maps);
  }
  return maps;
}

// command + c copy  command + x cut
hotkey.bind(['command+c', 'ctrl+c', 'command+x', 'ctrl+x'], (e, action) => {
  const doc = getCurrentDocument();
  if (isFormEvent(e) || !doc || !(focusing.id === 'outline' || focusing.id === 'canvas')) {
    return;
  }
  e.preventDefault();

  const selected = doc.selection.getTopNodes(true);
  if (!selected || selected.length < 1) return;

  const maps = generateMaps(selected);
  const nodesData = selected.map(item => item.nodeData);
  const code = getCurrentAdaptor().viewDataToSource({
    file: '',
    children: nodesData as any,
  });

  clipboard.setData({ code, maps });
  /*
  const cutMode = action.indexOf('x') > 0;
  if (cutMode) {
    const parentNode = selected.getParent();
    parentNode.select();
    selected.remove();
  }
  */
});

// command + v paste
hotkey.bind(['command+v', 'ctrl+v'], e => {
  const doc = getCurrentDocument();
  if (isFormEvent(e) || !doc) {
    return;
  }
  clipboard.waitPasteData(e, data => {
    if (data.code && data.maps) {
      const adaptor = getCurrentAdaptor();
      let nodesData = adaptor.parseToViewData(data.code, data.maps).children;
      nodesData = doc.processDocumentData(nodesData, data.maps);
      const { target, index } = doc.getSuitableInsertion();
      const nodes = insertChildren(target, nodesData, index);
      if (nodes) {
        doc.selection.selectAll(nodes.map(o => o.id));
        setTimeout(() => activeTracker.track(nodes[0]), 10);
      }
    }
  });
});

hotkey.mount(window);
