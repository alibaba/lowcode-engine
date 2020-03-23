import { ISenseAble, LocateEvent, isNodesDragTarget, activeTracker, getCurrentDocument } from '../../../globals';
import Location, { isLocationChildrenDetail, LocationDetailType } from '../../../document/location';
import tree from './tree';
import Scroller, { ScrollTarget } from '../../../document/scroller';
import { isShadowNode } from '../../../document/node/shadow-node';
import TreeNode from './tree-node';
import { INodeParent } from '../../../document/node';
import DwellTimer from './helper/dwell-timer';
import XAxisTracker from './helper/x-axis-tracker';

export const OutlineBoardID = 'outline-board';
export default class OutlineBoard implements ISenseAble {
  id = OutlineBoardID;

  get bounds() {
    const rootElement = this.element;
    const clientBound = rootElement.getBoundingClientRect();

    return {
      height: clientBound.height,
      width: clientBound.width,
      top: clientBound.top,
      left: clientBound.left,
      right: clientBound.right,
      bottom: clientBound.bottom,
      scale: 1,
      scrollHeight: rootElement.scrollHeight,
      scrollWidth: rootElement.scrollWidth,
    };
  }

  sensitive: boolean = true;
  private sensing: boolean = false;

  private scrollTarget = new ScrollTarget(this.element);
  private scroller = new Scroller(this, this.scrollTarget);

  constructor(readonly element: HTMLDivElement) {
    activeTracker.onChange(({ node, detail }) => {
      const treeNode = isShadowNode(node) ? tree.getTreeNode(node.origin) : tree.getTreeNode(node);
      if (treeNode.hidden) {
        return;
      }

      if (detail && detail.type === LocationDetailType.Children) {
        treeNode.expand(true);
      } else {
        treeNode.expandParents();
      }
      this.scrollToNode(treeNode, detail);
    });
  }

  private tryScrollAgain: number | null = null;
  scrollToNode(treeNode: TreeNode, detail?: any, tryTimes: number = 0) {
    this.tryScrollAgain = null;
    if (this.sensing) {
      // is a active sensor
      return;
    }

    const opt: any = {};
    let scroll = false;
    let rect: ClientRect | null;
    if (detail && isLocationChildrenDetail(detail)) {
      rect = tree.getInsertionRect();
    } else {
      rect = treeNode.computeRect();
    }

    if (!rect) {
      if (!this.tryScrollAgain && tryTimes < 3) {
        this.tryScrollAgain = requestAnimationFrame(() => this.scrollToNode(treeNode, detail, tryTimes + 1));
      }
      return;
    }
    const scrollTarget = this.scrollTarget;
    const st = scrollTarget.top;
    const { height, top, bottom, scrollHeight } = this.bounds;

    if (rect.top < top || rect.bottom > bottom) {
      opt.top = Math.min(rect.top + rect.height / 2 + st - top - height / 2, scrollHeight - height);
      scroll = true;
    }

    if (scroll && this.scroller) {
      this.scroller.scrollTo(opt);
    }
  }

  isEnter(e: LocateEvent): boolean {
    return this.inRange(e);
  }

  inRange(e: LocateEvent): boolean {
    const rect = this.bounds;
    return e.globalY >= rect.top && e.globalY <= rect.bottom && e.globalX >= rect.left && e.globalX <= rect.right;
  }

  deactive(): void {
    this.sensing = false;
    console.log('>>> deactive');
  }

  fixEvent(e: LocateEvent): LocateEvent {
    return e;
  }

  private dwellTimer: DwellTimer = new DwellTimer(450);
  private xAxisTracker = new XAxisTracker();

  locate(e: LocateEvent): Location | undefined {
    this.sensing = true;
    this.scroller.scrolling(e);

    const dragTarget = e.dragTarget;
    // FIXME: not support multiples/nodedatas/any data,
    const dragment = isNodesDragTarget(dragTarget) ? dragTarget.nodes[0] : null;
    if (!dragment) {
      return;
    }
    const doc = getCurrentDocument()!;
    const preDraggedNode = doc.dropLocation && doc.dropLocation.target;

    // 左右移动追踪，一旦左右移动满足位置条件，直接返回即可。
    if (doc.dropLocation) {
      const loc2 = this.xAxisTracker.track(doc.dropLocation, e);
      if (loc2) {
        this.dwellTimer.end();
        return doc.createLocation(loc2);
      }
    } else {
      this.dwellTimer.end();
      return doc.createLocation({
        target: dragment.parent!,
        detail: {
          type: LocationDetailType.Children,
          index: dragment.index,
        },
      });
    }

    // 这语句的后半段是解决"丢帧"问题
    // e 有一种情况，是从 root > .flow 开始冒泡，而不是实际节点。这种情况往往发生在：光标在插入框内移动
    // 此时取上一次插入位置的 node 即可
    const treeNode = tree.getTreeNodeByEvent(e as any) || (preDraggedNode && tree.getTreeNode(preDraggedNode));

    // TODO: 没有判断是否可以放入 isDropContainer，决定 target 的值是父节点还是本节点
    if (!treeNode || dragment === treeNode.node || treeNode.ignored) {
      this.dwellTimer.end();
      console.warn('not found tree-node or other reasons', treeNode, e);
      return undefined;
    }

    // console.log('I am at', treeNode.id, e);

    const rect = treeNode.computeRect();
    if (!rect) {
      this.dwellTimer.end();
      console.warn('can not get the rect, node', treeNode.id);
      return undefined;
    }

    const node = treeNode.node;
    const parentNode = node.parent;

    if (!parentNode) {
      this.dwellTimer.end();
      return undefined;
    }

    let index = Math.max(parentNode.children.indexOf(node), 0);
    const center = rect.top + rect.height / 2;

    // 常规处理
    // 如果可以展开，但是没有展开，需要设置延时器，检查停留时间然后展开
    // 最后返回合适的位置信息
    // FIXME: 容器判断存在问题，比如 img 是可以被放入的
    if (treeNode.isContainer() && !treeNode.expanded) {
      if (e.globalY > center) {
        this.dwellTimer.start(treeNode.id, () => {
          doc.createLocation({
            target: node as INodeParent,
            detail: {
              type: LocationDetailType.Children,
              index: 0,
            },
          });
        });
      }
    } else {
      this.dwellTimer.end();
    }

    // 如果节点是展开状态，并且光标是在其下方，不做任何处理，直接返回即可
    // 如果不做这个处理，那么会出现"抖动"情况：在当前元素中心线下方时，会作为该元素的第一个子节点插入，而又会碰到已经存在对第一个字节点"争相"处理
    if (treeNode.expanded) {
      if (e.globalY > center) {
        return undefined;
      }
    }

    // 如果光标移动到节点中心线下方，则将元素插入到该节点下方
    // 反之插入该节点上方
    if (e.globalY > center) {
      // down
      index = index + 1;
    }

    index = Math.min(index, parentNode.children.length);

    return doc.createLocation({
      target: parentNode,
      detail: {
        type: LocationDetailType.Children,
        index,
      },
    });
  }
}
