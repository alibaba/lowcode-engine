import { hotkey, Editor, globalContext } from '@alilc/lowcode-editor-core';
import { isFormEvent } from '@alilc/lowcode-utils';
import { focusing } from './focusing';
import { insertChildren, TransformStage } from '../document';
import clipboard from './clipboard';

function isInLiveEditing() {
  if (globalContext.has(Editor)) {
    return Boolean(
      globalContext.get(Editor).get('designer')?.project?.simulator?.liveEditing?.editing,
    );
  }
}

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
  if (isInLiveEditing()) return;
  // TODO: use focus-tracker
  const doc = focusing.focusDesigner?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();

  const sel = doc.selection;
  const topItems = sel.getTopNodes();
  // TODO: check can remove
  topItems.forEach((node) => {
    if (node.canPerformAction('remove')) {
      doc.removeNode(node);
    }
  });
  sel.clear();
});

hotkey.bind('escape', (e: KeyboardEvent) => {
  // const currentFocus = focusing.current;
  if (isInLiveEditing()) return;
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
  if (isInLiveEditing()) return;
  const doc = focusing.focusDesigner?.currentDocument;
  if (isFormEvent(e) || !doc) {
    return;
  }
  e.preventDefault();

  let selected = doc.selection.getTopNodes(true);
  selected = selected.filter((node) => {
    return node.canPerformAction('copy');
  });
  if (!selected || selected.length < 1) {
    return;
  }

  const componentsMap = {};
  const componentsTree = selected.map((item) => item.export(TransformStage.Clone));

  // FIXME: clear node.id

  const data = { type: 'nodeSchema', componentsMap, componentsTree };

  clipboard.setData(data);

  const cutMode = action && action.indexOf('x') > 0;
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
  if (isInLiveEditing()) return;
  const designer = focusing.focusDesigner;
  const doc = designer?.currentDocument;
  if (isFormEvent(e) || !designer || !doc) {
    return;
  }
  clipboard.waitPasteData(e, ({ componentsTree }) => {
    if (componentsTree) {
      const { target, index } = designer.getSuitableInsertion(componentsTree) || {};
      if (!target) {
        return;
      }
      let canAddComponentsTree = componentsTree.filter((i) => {
        return doc.checkNestingUp(target, i);
      });
      if (canAddComponentsTree.length === 0) return;
      const nodes = insertChildren(target, canAddComponentsTree, index);
      if (nodes) {
        doc.selection.selectAll(nodes.map((o) => o.id));
        setTimeout(() => designer.activeTracker.track(nodes[0]), 10);
      }
    }
  });
});

// command + z undo
hotkey.bind(['command+z', 'ctrl+z'], (e) => {
  if (isInLiveEditing()) return;
  const his = focusing.focusDesigner?.currentHistory;
  if (isFormEvent(e) || !his) {
    return;
  }

  e.preventDefault();
  const selection = focusing.focusDesigner?.currentSelection;
  const curSelected = Array.from(selection?.selected || []);
  his.back();
  selection?.selectAll(curSelected);
});

// command + shift + z redo
hotkey.bind(['command+y', 'ctrl+y', 'command+shift+z'], (e) => {
  if (isInLiveEditing()) return;
  const his = focusing.focusDesigner?.currentHistory;
  if (isFormEvent(e) || !his) {
    return;
  }
  e.preventDefault();
  const selection = focusing.focusDesigner?.currentSelection;
  const curSelected = Array.from(selection?.selected || []);
  his.forward();
  selection?.selectAll(curSelected);
});

// sibling selection
hotkey.bind(['left', 'right'], (e, action) => {
  if (isInLiveEditing()) return;
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
  if (isInLiveEditing()) return;
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

hotkey.bind(['option+left', 'option+right'], (e, action) => {
  if (isInLiveEditing()) return;
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
  // TODO: 移动逻辑也需要重新梳理，对于移动目标位置的选择，是否可以移入，需要增加判断

  const firstNode = selected[0];
  const parent = firstNode.getParent();
  if (!parent) return;

  const isPrev = action && /(left)$/.test(action);

  const silbing = isPrev ? firstNode.prevSibling : firstNode.nextSibling;
  if (silbing) {
    if (isPrev) {
      parent.insertBefore(firstNode, silbing);
    } else {
      parent.insertAfter(firstNode, silbing);
    }
    firstNode?.select();
  }
});

hotkey.bind(['option+up'], (e) => {
  if (isInLiveEditing()) return;
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
  // TODO: 移动逻辑也需要重新梳理，对于移动目标位置的选择，是否可以移入，需要增加判断

  const firstNode = selected[0];
  const parent = firstNode.getParent();
  if (!parent) {
    return;
  }

  const silbing = firstNode.prevSibling;
  if (silbing) {
    if (silbing.isContainer()) {
      const place = silbing.getSuitablePlace(firstNode, null);
      place.container.insertAfter(firstNode, place.ref);
    } else {
      parent.insertBefore(firstNode, silbing);
    }
    firstNode?.select();
  } else {
    const place = parent.getSuitablePlace(firstNode, null); // upwards
    if (place) {
      place.container.insertBefore(firstNode, place.ref);
      firstNode?.select();
    }
  }
});

hotkey.bind(['option+down'], (e) => {
  if (isInLiveEditing()) return;
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
  // TODO: 移动逻辑也需要重新梳理，对于移动目标位置的选择，是否可以移入，需要增加判断

  const firstNode = selected[0];
  const parent = firstNode.getParent();
  if (!parent) {
    return;
  }

  const silbing = firstNode.nextSibling;
  if (silbing) {
    if (silbing.isContainer()) {
      // const place = silbing.getSuitablePlace(firstNode, null);
      silbing.insertBefore(firstNode, undefined);
      // place.container.insertBefore(firstNode, place.ref);
    } else {
      parent.insertAfter(firstNode, silbing);
    }
    firstNode?.select();
  } else {
    const place = parent.getSuitablePlace(firstNode, null); // upwards
    if (place) {
      place.container.insertAfter(firstNode, place.ref);
      firstNode?.select();
    }
  }
});
