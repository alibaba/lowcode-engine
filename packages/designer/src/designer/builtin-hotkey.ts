import { hotkey, isFormEvent } from '@ali/lowcode-globals';
import { focusing } from './focusing';
import { insertChildren } from '../document';
import clipboard from './clipboard';

// hotkey binding
hotkey.bind(['backspace', 'del'], (e: KeyboardEvent) => {
  const doc = focusing.focusDesigner?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();

  const sel = doc.selection;
  const topItems = sel.getTopNodes();
  // TODO: check can remove
  topItems.forEach((node) => {
    doc.removeNode(node);
  });
  sel.clear();
});

hotkey.bind('escape', (e: KeyboardEvent) => {
  // const currentFocus = focusing.current;
  const sel = focusing.focusDesigner?.currentDocument?.selection;
  if (isFormEvent(e) || !sel) {
    return;
  }
  e.preventDefault();

  sel.clear();
  // currentFocus.esc();
});

// command + c copy  command + x cut
hotkey.bind(['command+c', 'ctrl+c', 'command+x', 'ctrl+x'], (e, action) => {
  const doc = focusing.focusDesigner?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();

  /*
  const doc = getCurrentDocument();
  if (isFormEvent(e) || !doc || !(focusing.id === 'outline' || focusing.id === 'canvas')) {
    return;
  }
  e.preventDefault();
  */

  const selected = doc.selection.getTopNodes(true);
  if (!selected || selected.length < 1) return;

  const componentsMap = {};
  const componentsTree = selected.map((item) => item.export(false));

  const data = { type: 'nodeSchema', componentsMap, componentsTree };

  clipboard.setData(data);
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
hotkey.bind(['command+v', 'ctrl+v'], (e) => {
  const designer = focusing.focusDesigner;
  const doc = designer?.currentDocument;
  if (isFormEvent(e) || !designer || !doc) {
    return;
  }
  clipboard.waitPasteData(e, ({ componentsTree }) => {
    if (componentsTree) {
      const { target, index } = designer.getSuitableInsertion() || {};
      if (!target) {
        return;
      }
      const nodes = insertChildren(target, componentsTree, index);
      if (nodes) {
        doc.selection.selectAll(nodes.map((o) => o.id));
        setTimeout(() => designer.activeTracker.track(nodes[0]), 10);
      }
    }
  });
});

// command + z undo
hotkey.bind(['command+z', 'ctrl+z'], (e) => {
  const his = focusing.focusDesigner?.currentHistory;
  if (isFormEvent(e) || !his) {
    return;
  }

  e.preventDefault();
  his.back();
});

// command + shift + z redo
hotkey.bind(['command+y', 'ctrl+y', 'command+shift+z'], (e) => {
  const his = focusing.focusDesigner?.currentHistory;
  if (isFormEvent(e) || !his) {
    return;
  }
  e.preventDefault();

  his.forward();
});
