import { Selection, DocumentModel, Node } from '@ali/lowcode-designer';
import editor from './editor';

let currentSelection: Selection;
// let currentDocument: DocumentModel;

// get selection async
editor.once('designer.ready', () => {
  const getSelection = () => {
    if (editor.designer.currentSelection) {
      currentSelection = editor.designer.currentSelection;
      // currentDocument = editor.designer.currentDocument;

      currentSelection.onSelectionChange((ids: string[]) => {
        // console.log(ids);
        // const nodes = ids.map((id: string) => currentDocument.getNode(id));
        // console.log(nodes);
      });
    } else {
      console.log('waiting ...');
      requestAnimationFrame(getSelection);
    }
  };
  getSelection();
});

export default {
  select: (node: Node) => {
    if (!node) {
      return currentSelection.clear();
    }
    currentSelection.select(node.id);
  },
  getSelected: () => {
    const nodes = currentSelection.getNodes();
    return nodes;
  },
  // 以下废弃
  // hover: (node: Node) => {
  //   hovering.hover(node);
  // },
  // getDropping: () => {
  //   return null;
  // },
  // onIntoView: (func: (node: any, insertion: Insertion) => any) => {
  //   currentSelection.onSelectionChange((ids) => {
  //     console.log(ids);
  //   });
  //   return null;
  // },
}
