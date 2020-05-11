import { hotkey } from '@ali/lowcode-editor-core';
import { isFormEvent } from '@ali/lowcode-utils';
import { focusing } from './focusing';
import { insertChildren, TransformStage } from '../document';
import clipboard from './clipboard';

function getNextForSelect(next: any, head?: any, parent?: any): any {
  if (next) {
    if (!head) {
      return next;
    }

    let ret;
    if (next.isContainer()) {
      const children = next.getChildren() || [];
      if (children && !children.isEmpty()) {
        ret = getNextForSelect(children.get(0));
        if (ret) {
          return ret;
        }
      }
    }

    ret = getNextForSelect(next.nextSibling);
    if (ret) {
      return ret;
    }
  }

  if (parent) {
    return getNextForSelect(parent.nextSibling, false, parent.getParent());
  }

  return null;
}

function getPrevForSelect(prev: any, head?: any, parent?: any): any {
  if (prev) {
    debugger;
    let ret;
    if (!head && prev.isContainer()) {
      const children = prev.getChildren() || [];
      const lastChild = children && !children.isEmpty() ? children.get(children.size - 1) : null;

      ret = getPrevForSelect(lastChild);
      if (ret) {
        return ret;
      }
    }

    if (!head) {
      return prev;
    }

    ret = getPrevForSelect(prev.prevSibling);
    if (ret) {
      return ret;
    }
  }

  if (parent) {
    return parent;
  }

  return null;
}

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
  const componentsTree = selected.map((item) => item.export(TransformStage.Save));

  const data = { type: 'nodeSchema', componentsMap, componentsTree };

  clipboard.setData(data);

  const cutMode = action.indexOf('x') > 0;
  if (cutMode) {
    selected.forEach((node) => {
      const parentNode = node.getParent();
      parentNode?.select();
      node.remove();
    });
  }
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

// sibling selection
hotkey.bind(['left', 'right'], (e, action) => {
  const designer = focusing.focusDesigner;
  const doc = designer?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();
  const selected = doc.selection.getTopNodes(true);
  if (!selected || selected.length < 1) {
    return;
  }
  const firstNode = selected[0];
  const silbing = action === 'left' ? firstNode?.prevSibling : firstNode?.nextSibling;
  silbing?.select();
});

hotkey.bind(['up', 'down'], (e, action) => {
  const designer = focusing.focusDesigner;
  const doc = designer?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();
  const selected = doc.selection.getTopNodes(true);
  if (!selected || selected.length < 1) {
    return;
  }
  const firstNode = selected[0];

  if (action === 'down') {
    const next = getNextForSelect(firstNode, true, firstNode.getParent());
    next?.select();
  } else if (action === 'up') {
    const prev = getPrevForSelect(firstNode, true, firstNode.getParent());
    prev?.select();
  }
});

hotkey.bind(['option+up', 'option+down', 'option+left', 'option+right'], (e, action) => {
  const designer = focusing.focusDesigner;
  const doc = designer?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();
  const selected = doc.selection.getTopNodes(true);
  if (!selected || selected.length < 1) {
    return;
  }
  // TODO: 此处需要增加判断当前节点是否可被操作移动，原ve里是用 node.canOperating()来判断

  const firstNode = selected[0];
  const parent = firstNode.getParent();
  if (!parent) return;

  const isPrev = /(up|left)$/.test(action);
  const isTravel = /(up|down)$/.test(action);

  const silbing = isPrev ? firstNode.prevSibling : firstNode.nextSibling;
  if (silbing) {
    if (isTravel && silbing.isContainer()) {
      const place = silbing.getSuitablePlace(firstNode, null);
      if (isPrev) {
        place.container.insertAfter(firstNode, place.ref);
      } else {
        place.container.insertBefore(firstNode, place.ref);
      }
    } else if (isPrev) {
      parent.insertBefore(firstNode, silbing);
    } else {
      parent.insertAfter(firstNode, silbing);
    }
    firstNode?.select();
    return;
  }
  if (isTravel) {
    const place = parent.getSuitablePlace(firstNode, null); // upwards
    if (place) {
      if (isPrev) {
        place.container.insertBefore(firstNode, place.ref);
      } else {
        place.container.insertAfter(firstNode, place.ref);
      }
      firstNode?.select();
    }
  }
});
