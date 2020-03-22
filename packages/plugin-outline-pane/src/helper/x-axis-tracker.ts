/**
 * X 轴追踪器，左右移动光标时获取正确位置
 */
import { INode, INodeParent, isRootNode } from '../../../../document/node';
import Location, {
  isLocationChildrenDetail,
  LocationChildrenDetail,
  LocationData,
  LocationDetailType,
} from '../../../../document/location';
import { LocateEvent } from '../../../../globals';
import { isContainer } from './is-container';

export default class XAxisTracker {
  private location!: Location;
  private start: number = 0;

  /**
   * @param unit 移动单位
   */
  constructor(readonly unit = 15) {}

  track(loc: Location, e: LocateEvent): LocationData | null {
    this.location = loc;

    if (this.start === 0) {
      this.start = e.globalX;
    }

    const parent = this.locate(e);

    if (!parent) {
      return null;
    }

    return {
      target: parent as INodeParent,
      detail: {
        type: LocationDetailType.Children,
        index: parent.children.length,
      },
    };
  }

  /**
   * 定位
   */
  locate(e: LocateEvent): INode | null {
    if (!isLocationChildrenDetail(this.location.detail)) {
      return null;
    }

    const delta = e.globalX - this.start;
    let direction = null;

    if (delta < 0) {
      direction = 'left';
    } else {
      direction = 'right';
    }

    const n = Math.floor(Math.abs(delta) / this.unit);

    // console.log('x', e.globalX, 'y', e.globalY, 'delta', delta, 'n', n, 'start', this.start);

    if (n < 1) {
      return null;
    }

    // 一旦移动一个单位，就将"原点"清零
    this.reset();

    const node = this.location.target;
    const index = (this.location.detail as LocationChildrenDetail).index;
    let parent = null;

    if (direction === 'left') {
      // 如果光标是往左运动
      // 该节点如果不是最后一个节点，那么就没有继续查找下去的必要
      // console.log('>>> [left]', index, node.children.length, node);
      if (isRootNode(node)) {
        return null;
      }
      // index 为 0 表示第一个位置
      // 第一个位置或者不是最后以为位置，都不需要处理
      if (index < node.children.length - 1) {
        return null;
      }
      parent = node.parent as INode;
    } else {
      // 插入线一般是在元素下面，所以这边需要多减去 1，即 -2
      if (index === 0) {
        return null;
      }
      const i2 = Math.max(index - 1, 0);
      parent = node.children[i2];
      // console.log('>>> [right]', index, i2, parent, node.id);
    }

    // parent 节点判断
    if (!parent || !isContainer(parent)) {
      return null;
    }

    return parent;
  }

  reset() {
    this.start = 0;
  }
}
