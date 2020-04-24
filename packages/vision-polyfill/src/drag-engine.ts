import { designer } from './editor';
import { DragObjectType, isNode, TransformStage } from '@ali/lowcode-designer';

const dragon = designer.dragon;
const DragEngine = {
  from(shell: Element, boost: (e: MouseEvent) => any): any {
    return dragon.from(shell, (e) => {
      const r = boost(e);
      if (!r) {
        return null;
      }
      if (isNode(r)) {
        return {
          type: DragObjectType.NodeData,
          data: r.export(TransformStage.Save),
        };

        // FIXME! designer has bug
        /*
        return {
          type: DragObjectType.Node,
          nodes: [r],
        };
        */
      } else {
        return {
          type: DragObjectType.NodeData,
          data: r,
        };
      }
    });
  },
  onDragstart(func: (e: any, dragment: any) => any) {
    return dragon.onDragstart((evt) => {
      func(evt.originalEvent, evt.dragObject.nodes[0]);
    });
  },
  onDrag(func: (e: any, dragment: any, location: any) => any) {
    return dragon.onDrag((evt) => {
      const loc = designer.currentDocument?.dropLocation;
      func(evt.originalEvent, evt.dragObject.nodes[0], loc);
    });
  },
  onDragend(func: (dragment: any, location: any, copy: any) => any) {
    return dragon.onDragend(({ dragObject, copy }) => {
      const loc = designer.currentDocument?.dropLocation;
      func(dragObject.nodes[0], loc, copy);
    });
  },
  inDragging() {
    return dragon.dragging;
  },
};

export default DragEngine;
