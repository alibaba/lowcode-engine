import RootNode from './root-node';
import { flags, panes } from '../globals';
import {
  dragon,
  ISenseAble,
  isShaken,
  LocateEvent,
  isNodesDragTarget,
  NodesDragTarget,
  NodeDatasDragTarget,
  isNodeDatasDragTarget,
  DragTargetType,
  isAnyDragTarget,
} from '../globals/dragon';
import cursor from '../utils/cursor';
import {
  INode,
  isElementNode,
  isNode,
  INodeParent,
  insertChildren,
  hasConditionFlow,
  contains,
  isRootNode,
  isConfettiNode,
} from './node/node';
import {
  Point,
  Rect,
  getRectTarget,
  isChildInline,
  isRowContainer,
  LocationDetailType,
  LocationChildrenDetail,
  isLocationChildrenDetail,
  LocationData,
  isLocationData,
} from './location';
import { isConditionFlow } from './node/condition-flow';
import { isElementData, NodeData } from './document-data';
import ElementNode from './node/element-node';
import { AT_CHILD } from '../prototype/prototype';
import Scroller from './scroller';
import { isShadowNode } from './node/shadow-node';
import { activeTracker } from '../globals/active-tracker';
import { edging } from '../globals/edging';
import { setNativeSelection } from '../utils/navtive-selection';
import DocumentContext from './document-context';
import Simulator from '../adaptors/simulator';
import { focusing } from '../globals/focusing';
import embedEditor from '../globals/embed-editor';

export const MasterBoardID = 'master-board';
export default class MasterBoard implements ISenseAble {
  id = MasterBoardID;
  sensitive = true;
  readonly contentDocument: Document;

  private simulator: Simulator<any, any>;
  private sensing = false;
  private scroller: Scroller;

  get bounds() {
    const vw = this.document.viewport;
    const bounds = vw.bounds;
    const innerBounds = vw.innerBounds;
    const doe = this.contentDocument.documentElement;
    return {
      top: bounds.top,
      left: bounds.left,
      right: bounds.right,
      bottom: bounds.bottom,
      width: bounds.width,
      height: bounds.height,
      innerBounds,
      scale: vw.scale,
      scrollHeight: doe.scrollHeight,
      scrollWidth: doe.scrollWidth,
    };
  }

  constructor(readonly document: DocumentContext, frame: HTMLIFrameElement) {
    this.simulator = document.simulator!;
    this.contentDocument = frame.contentDocument!;
    this.scroller = new Scroller(this, document.viewport.scrollTarget!);
    const doc = this.contentDocument;
    const selection = document.selection;

    // TODO: think of lock when edit a node
    // 事件路由
    doc.addEventListener('mousedown', (downEvent: MouseEvent) => {
      /*
      if (embedEditor.editing) {
        return;
      }
      */
      const target = document.getNodeFromElement(downEvent.target as Element);
      panes.dockingStation.visible = false;
      focusing.focus('canvas');
      if (!target) {
        selection.clear();
        return;
      }

      const isMulti = downEvent.metaKey || downEvent.ctrlKey;
      const isLeftButton = downEvent.which === 1 || downEvent.button === 0;

      if (isLeftButton) {
        let node: INode = target;
        if (hasConditionFlow(node)) {
          node = node.conditionFlow;
        }
        let nodes: INode[] = [node];
        let ignoreUpSelected = false;
        if (isMulti) {
          // multi select mode, directily add
          if (!selection.has(node.id)) {
            activeTracker.track(node);
            selection.add(node.id);
            ignoreUpSelected = true;
          }
          // 获得顶层 nodes
          nodes = selection.getTopNodes();
        } else if (selection.containsNode(target)) {
          nodes = selection.getTopNodes();
        } else {
          // will clear current selection & select dragment in dragstart
        }
        dragon.boost(
          {
            type: DragTargetType.Nodes,
            nodes,
          },
          downEvent,
        );
        if (ignoreUpSelected) {
          // multi select mode has add selected, should return
          return;
        }
      }

      const checkSelect = (e: MouseEvent) => {
        doc.removeEventListener('mouseup', checkSelect, true);
        if (!isShaken(downEvent, e)) {
          // const node = hasConditionFlow(target) ? target.conditionFlow : target;
          const node = target;
          const id = node.id;
          activeTracker.track(node);
          if (isMulti && selection.has(id)) {
            selection.del(id);
          } else {
            selection.select(id);
          }
        }
      };
      doc.addEventListener('mouseup', checkSelect, true);
    });

    dragon.onDragstart(({ dragTarget }) => {
      if (this.disableEdging) {
        this.disableEdging();
      }
      if (isNodesDragTarget(dragTarget) && dragTarget.nodes.length === 1) {
        // ensure current selecting
        selection.select(dragTarget.nodes[0].id);
      }
      flags.setDragComponentsMode(true);
    });

    dragon.onDragend(({ dragTarget, copy }) => {
      const loc = this.document.dropLocation;
      flags.setDragComponentsMode(false);
      if (loc) {
        if (!isConditionFlow(loc.target)) {
          if (isLocationChildrenDetail(loc.detail)) {
            let nodes: INode[] | undefined;
            if (isNodesDragTarget(dragTarget)) {
              nodes = insertChildren(loc.target, dragTarget.nodes, loc.detail.index, copy);
            } else if (isNodeDatasDragTarget(dragTarget)) {
              // process nodeData
              const nodesData = this.document.processDocumentData(dragTarget.data, dragTarget.maps);
              nodes = insertChildren(loc.target, nodesData, loc.detail.index);
            }
            if (nodes) {
              this.document.selection.selectAll(nodes.map(o => o.id));
              setTimeout(() => activeTracker.track(nodes![0]), 10);
            }
          }
          // TODO: others...
        }
      }
      this.document.clearLocation();
      this.enableEdging();
    });

    // cause edit
    doc.addEventListener('dblclick', (e: MouseEvent) => {
      // TODO: refactor
      let target = document.getNodeFromElement(e.target as Element)!;
      if (target && isElementNode(target)) {
        if (isShadowNode(target)) {
          target = target.origin;
        }
        if (target.children.length === 1 && isConfettiNode(target.children[0])) {
          // test
          // embedEditor.edit(target as any, 'children', document.getDOMNodes(target) as any);

          activeTracker.track(target.children[0]);
          selection.select(target.children[0].id);
        }
      }
    });

    activeTracker.onChange(({ node, detail }) => {
      this.scrollToNode(node, detail);
    });

    this.enableEdging();
  }

  private disableEdging: (() => void) | undefined;

  enableEdging() {
    const edgingWatch = (e: Event) => {
      const node = this.document.getNodeFromElement(e.target as Element);
      edging.watch(node);
      e.stopPropagation();
    };
    const leave = () => edging.watch(null);

    this.contentDocument.addEventListener('mouseover', edgingWatch, true);
    this.contentDocument.addEventListener('mouseleave', leave, false);

    // TODO: refactor this line, contains click, mousedown, mousemove
    this.contentDocument.addEventListener(
      'mousemove',
      (e: Event) => {
        e.stopPropagation();
      },
      true,
    );

    this.disableEdging = () => {
      edging.watch(null);
      this.contentDocument.removeEventListener('mouseover', edgingWatch, true);
      this.contentDocument.removeEventListener('mouseleave', leave, false);
    };
  }

  setNativeSelection(enableFlag: boolean) {
    setNativeSelection(enableFlag);
    this.simulator.utils.setNativeSelection(enableFlag);
  }

  setDragging(flag: boolean) {
    cursor.setDragging(flag);
    this.simulator.utils.cursor.setDragging(flag);
  }

  setCopy(flag: boolean) {
    cursor.setCopy(flag);
    this.simulator.utils.cursor.setCopy(flag);
  }

  isCopy(): boolean {
    return this.simulator.utils.cursor.isCopy();
  }

  releaseCursor() {
    cursor.release();
    this.simulator.utils.cursor.release();
  }

  getDropTarget(e: LocateEvent): INodeParent | LocationData | null {
    const { target, dragTarget } = e;
    const isAny = isAnyDragTarget(dragTarget);
    let container: any;
    if (target) {
      const ref = this.document.getNodeFromElement(target as Element);
      if (ref) {
        container = ref;
      } else if (isAny) {
        return null;
      } else {
        container = this.document.view;
      }
    } else if (isAny) {
      return null;
    } else {
      container = this.document.view;
    }

    if (!isElementNode(container) && !isRootNode(container)) {
      container = container.parent;
    }

    // use spec container to accept specialData
    if (isAny) {
      while (container) {
        if (isRootNode(container)) {
          return null;
        }
        const locationData = this.acceptAnyData(container, e);
        if (locationData) {
          return locationData;
        }
        container = container.parent;
      }
      return null;
    }

    let res: any;
    let upward: any;
    // TODO: improve AT_CHILD logic, mark has checked
    while (container) {
      res = this.acceptNodes(container, e);
      if (isLocationData(res)) {
        return res;
      }
      if (res === true) {
        return container;
      }
      if (!res) {
        if (upward) {
          container = upward;
          upward = null;
        } else {
          container = container.parent;
        }
      } else if (res === AT_CHILD) {
        if (!upward) {
          upward = container.parent;
        }
        container = this.getNearByContainer(container, e);
        if (!container) {
          container = upward;
          upward = null;
        }
      } else if (isNode(res)) {
        container = res;
        upward = null;
      }
    }
    return null;
  }

  acceptNodes(container: RootNode | ElementNode, e: LocateEvent) {
    const { dragTarget } = e;
    if (isRootNode(container)) {
      return this.checkDropTarget(container, dragTarget as any);
    }

    const proto = container.prototype;

    const acceptable: boolean = this.isAcceptable(container);
    if (!proto.isContainer && !acceptable) {
      return false;
    }

    // check is contains, get common parent
    if (isNodesDragTarget(dragTarget)) {
      const nodes = dragTarget.nodes;
      let i = nodes.length;
      let p: any = container;
      while (i-- > 0) {
        if (contains(nodes[i], p)) {
          p = nodes[i].parent;
        }
      }
      if (p !== container) {
        return p || this.document.view;
      }
    }

    // first use accept
    if (acceptable) {
      const view: any = this.document.getView(container);
      if (view && '$accept' in view) {
        if (view.$accept === false) {
          return false;
        }
        if (view.$accept === AT_CHILD || view.$accept === '@CHILD') {
          return AT_CHILD;
        }
        if (typeof view.$accept === 'function') {
          const ret = view.$accept(container, e);
          if (ret || ret === false) {
            return ret;
          }
        }
      }
      if (proto.acceptable) {
        const ret = proto.accept(container, e);
        if (ret || ret === false) {
          return ret;
        }
      }
    }

    return this.checkNesting(container, dragTarget as any);
  }

  getNearByContainer(container: INodeParent, e: LocateEvent): INodeParent | null {
    const children = container.children;
    if (!children || children.length < 1) {
      return null;
    }

    let nearDistance: any = null;
    let nearBy: any = null;
    for (let i = 0, l = children.length; i < l; i++) {
      let child: any = children[i];
      if (!isElementNode(child)) {
        continue;
      }
      if (hasConditionFlow(child)) {
        const bn = child.conditionFlow;
        i = bn.index + bn.length - 1;
        child = bn.visibleNode;
      }
      const rect = this.document.computeRect(child);
      if (!rect) {
        continue;
      }

      if (isPointInRect(e, rect)) {
        return child;
      }

      const distance = distanceToRect(e, rect);
      if (nearDistance === null || distance < nearDistance) {
        nearDistance = distance;
        nearBy = child;
      }
    }

    return nearBy;
  }

  locate(e: LocateEvent): any {
    this.sensing = true;
    this.scroller.scrolling(e);
    const dropTarget = this.getDropTarget(e);
    if (!dropTarget) {
      return null;
    }

    if (isLocationData(dropTarget)) {
      return this.document.createLocation(dropTarget);
    }

    const target = dropTarget;

    const edge = this.document.computeRect(target);

    const children = target.children;

    const detail: LocationChildrenDetail = {
      type: LocationDetailType.Children,
      index: 0,
    };

    const locationData = {
      target,
      detail,
    };

    if (!children || children.length < 1 || !edge) {
      return this.document.createLocation(locationData);
    }

    let nearRect = null;
    let nearIndex = 0;
    let nearNode = null;
    let nearDistance = null;
    let top = null;
    let bottom = null;

    for (let i = 0, l = children.length; i < l; i++) {
      let node = children[i];
      let index = i;
      if (hasConditionFlow(node)) {
        node = node.conditionFlow;
        index = node.index;
        // skip flow items
        i = index + (node as any).length - 1;
      }
      const rect = this.document.computeRect(node);

      if (!rect) {
        continue;
      }

      const distance = isPointInRect(e, rect) ? 0 : distanceToRect(e, rect);

      if (distance === 0) {
        nearDistance = distance;
        nearNode = node;
        nearIndex = index;
        nearRect = rect;
        break;
      }

      // TODO: 忘记为什么这么处理了，记得添加注释
      if (top === null || rect.top < top) {
        top = rect.top;
      }
      if (bottom === null || rect.bottom > bottom) {
        bottom = rect.bottom;
      }

      if (nearDistance === null || distance < nearDistance) {
        nearDistance = distance;
        nearNode = node;
        nearIndex = index;
        nearRect = rect;
      }
    }

    detail.index = nearIndex;

    if (nearNode && nearRect) {
      const el = getRectTarget(nearRect);
      const inline = el ? isChildInline(el) : false;
      const row = el ? isRowContainer(el.parentElement!) : false;
      const vertical = inline || row;
      // TODO: fix type
      const near: any = {
        node: nearNode,
        pos: 'before',
        align: vertical ? 'V' : 'H',
      };
      detail.near = near;
      if (isNearAfter(e, nearRect, vertical)) {
        near.pos = 'after';
        detail.index = nearIndex + (isConditionFlow(nearNode) ? nearNode.length : 1);
      }
      if (!row && nearDistance !== 0) {
        const edgeDistance = distanceToEdge(e, edge);
        if (edgeDistance.distance < nearDistance!) {
          const nearAfter = edgeDistance.nearAfter;
          if (top == null) {
            top = edge.top;
          }
          if (bottom == null) {
            bottom = edge.bottom;
          }
          near.rect = new DOMRect(edge.left, top, edge.width, bottom - top);
          near.align = 'H';
          near.pos = nearAfter ? 'after' : 'before';
          detail.index = nearAfter ? children.length : 0;
        }
      }
    }

    return this.document.createLocation(locationData);
  }

  private tryScrollAgain: number | null = null;
  scrollToNode(node: INode, detail?: any, tryTimes = 0) {
    this.tryScrollAgain = null;
    if (this.sensing) {
      // actived sensor
      return;
    }

    const opt: any = {};
    let scroll = false;

    if (detail) {
      // TODO:
      /*
      const rect = insertion ? insertion.getNearRect() : node.getRect();
      let y;
      let scroll = false;
      if (insertion && rect) {
        y = insertion.isNearAfter() ? rect.bottom : rect.top;

        if (y < bounds.top || y > bounds.bottom) {
          scroll = true;
        }
      }*/
    } else {
      const rect = this.document.computeRect(node);
      if (!rect || rect.width === 0 || rect.height === 0) {
        if (!this.tryScrollAgain && tryTimes < 3) {
          this.tryScrollAgain = requestAnimationFrame(() => this.scrollToNode(node, null, tryTimes + 1));
        }
        return;
      }
      const scrollTarget = this.document.viewport.scrollTarget!;
      const st = scrollTarget.top;
      const sl = scrollTarget.left;
      const { innerBounds, scrollHeight, scrollWidth } = this.bounds;
      const { height, width, top, bottom, left, right } = innerBounds;

      if (rect.height > height ? rect.top > bottom || rect.bottom < top : rect.top < top || rect.bottom > bottom) {
        opt.top = Math.min(rect.top + rect.height / 2 + st - top - height / 2, scrollHeight - height);
        scroll = true;
      }

      if (rect.width > width ? rect.left > right || rect.right < left : rect.left < left || rect.right > right) {
        opt.left = Math.min(rect.left + rect.width / 2 + sl - left - width / 2, scrollWidth - width);
        scroll = true;
      }
    }

    if (scroll && this.scroller) {
      this.scroller.scrollTo(opt);
    }
  }

  fixEvent(e: LocateEvent): LocateEvent {
    if (e.fixed) {
      return e;
    }
    if (!e.target || e.originalEvent.view!.document !== this.contentDocument) {
      e.target = this.contentDocument.elementFromPoint(e.clientX, e.clientY);
    }
    return e;
  }

  isEnter(e: LocateEvent): boolean {
    const rect = this.bounds;
    return e.globalY >= rect.top && e.globalY <= rect.bottom && e.globalX >= rect.left && e.globalX <= rect.right;
  }

  inRange(e: LocateEvent): boolean {
    return e.globalX <= this.bounds.right;
  }

  deactive() {
    this.sensing = false;
    this.scroller.cancel();
  }

  isAcceptable(container: ElementNode): boolean {
    const proto = container.prototype;
    const view: any = this.document.getView(container);
    if (view && '$accept' in view) {
      return true;
    }
    return proto.acceptable;
  }

  acceptAnyData(container: ElementNode, e: LocateEvent | MouseEvent | KeyboardEvent) {
    const proto = container.prototype;
    const view: any = this.document.getView(container);
    // use view instance method: $accept
    if (view && typeof view.$accept === 'function') {
      // should return LocationData
      return view.$accept(container, e);
    }
    // use prototype method: accept
    return proto.accept(container, e);
  }

  checkNesting(dropTarget: ElementNode, dragTarget: NodesDragTarget | NodeDatasDragTarget): boolean {
    const items: Array<INode | NodeData> = dragTarget.nodes || (dragTarget as NodeDatasDragTarget).data;
    return items.every(item => this.checkNestingDown(dropTarget, item));
  }

  checkDropTarget(dropTarget: RootNode | ElementNode, dragTarget: NodesDragTarget | NodeDatasDragTarget): boolean {
    const items: Array<INode | NodeData> = dragTarget.nodes || (dragTarget as NodeDatasDragTarget).data;
    return items.every(item => this.checkNestingUp(dropTarget, item));
  }

  checkNestingUp(parent: RootNode | ElementNode, target: NodeData | INode): boolean {
    if (isElementNode(target) || isElementData(target)) {
      const proto = isElementNode(target)
        ? target.prototype
        : this.document.getPrototypeByTagNameOrURI(target.tagName, target.uri);
      if (proto) {
        return proto.checkNestingUp(target, parent);
      }
    }

    return true;
  }

  checkNestingDown(parent: ElementNode, target: NodeData | INode): boolean {
    const proto = parent.prototype;
    if (isConditionFlow(parent)) {
      return parent.children.every(
        child => proto.checkNestingDown(parent, child) && this.checkNestingUp(parent, child),
      );
    } else {
      return proto.checkNestingDown(parent, target) && this.checkNestingUp(parent, target);
    }
  }
}

function isPointInRect(point: Point, rect: Rect) {
  return (
    point.clientY >= rect.top &&
    point.clientY <= rect.bottom &&
    point.clientX >= rect.left &&
    point.clientX <= rect.right
  );
}

function distanceToRect(point: Point, rect: Rect) {
  let minX = Math.min(Math.abs(point.clientX - rect.left), Math.abs(point.clientX - rect.right));
  let minY = Math.min(Math.abs(point.clientY - rect.top), Math.abs(point.clientY - rect.bottom));
  if (point.clientX >= rect.left && point.clientX <= rect.right) {
    minX = 0;
  }
  if (point.clientY >= rect.top && point.clientY <= rect.bottom) {
    minY = 0;
  }

  return Math.sqrt(minX ** 2 + minY ** 2);
}

function distanceToEdge(point: Point, rect: Rect) {
  const distanceTop = Math.abs(point.clientY - rect.top);
  const distanceBottom = Math.abs(point.clientY - rect.bottom);

  return {
    distance: Math.min(distanceTop, distanceBottom),
    nearAfter: distanceBottom < distanceTop,
  };
}

function isNearAfter(point: Point, rect: Rect, inline: boolean) {
  if (inline) {
    return (
      Math.abs(point.clientX - rect.left) + Math.abs(point.clientY - rect.top) >
      Math.abs(point.clientX - rect.right) + Math.abs(point.clientY - rect.bottom)
    );
  }
  return Math.abs(point.clientY - rect.top) > Math.abs(point.clientY - rect.bottom);
}
