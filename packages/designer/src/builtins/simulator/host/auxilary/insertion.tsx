import { Component } from 'react';
import { computed } from '@recore/obx';
import { observer } from '@recore/obx-react';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import Location, {
  Rect,
  isLocationChildrenDetail,
  LocationChildrenDetail,
  isVertical,
} from '../../../../designer/helper/location';
import { ISimulator } from '../../../../designer/simulator';
import { NodeParent } from '../../../../designer/document/node/node';
import './insertion.less';

interface InsertionData {
  edge?: DOMRect;
  insertType?: string;
  vertical?: boolean;
  nearRect?: Rect;
  coverRect?: DOMRect;
}

/**
 * 处理拖拽子节点(INode)情况
 */
function processChildrenDetail(sim: ISimulator, target: NodeParent, detail: LocationChildrenDetail): InsertionData {
  let edge = detail.edge || null;

  if (edge) {
    edge = sim.computeRect(target);
  }

  if (!edge) {
    return {};
  }

  const ret: any = {
    edge,
    insertType: 'before',
  };

  if (detail.near) {
    const { node, pos, rect, align } = detail.near;
    ret.nearRect = rect || sim.computeRect(node);
    ret.vertical = align ? align === 'V' : isVertical(ret.nearRect);
    ret.insertType = pos;
    return ret;
  }

  // from outline-tree: has index, but no near
  // TODO: think of shadowNode & ConditionFlow
  const { index } = detail;
  let nearNode = target.children.get(index);
  if (!nearNode) {
    // index = 0, eg. nochild,
    nearNode = target.children.get(index > 0 ? index - 1 : 0);
    if (!nearNode) {
      ret.insertType = 'cover';
      ret.coverRect = edge;
      return ret;
    }
    ret.insertType = 'after';
  }
  if (nearNode) {
    ret.nearRect = sim.computeRect(nearNode);
    ret.vertical = isVertical(ret.nearRect);
  }
  return ret;
}

/**
 * 将 detail 信息转换为页面"坐标"信息
 */
function processDetail({ target, detail, document }: Location): InsertionData {
  const sim = document.simulator;
  if (!sim) {
    return {};
  }
  if (isLocationChildrenDetail(detail)) {
    return processChildrenDetail(sim, target, detail);
  } else {
    // TODO: others...
    const instances = sim.getComponentInstances(target);
    if (!instances) {
      return {};
    }
    const edge = sim.computeComponentInstanceRect(instances[0], target.componentMeta.rectSelector);
    return edge ? { edge, insertType: 'cover', coverRect: edge } : {};
  }
}

@observer
export class InsertionView extends Component {
  static contextType = SimulatorContext;

  @computed get host(): SimulatorHost {
    return this.context;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const loc = this.host.document.dropLocation;
    if (!loc) {
      return null;
    }

    const { scale, scrollX, scrollY } = this.host.viewport;
    const { edge, insertType, coverRect, nearRect, vertical } = processDetail(loc);

    if (!edge) {
      return null;
    }

    let className = 'lc-insertion';
    const style: any = {};
    let x: number;
    let y: number;
    if (insertType === 'cover') {
      className += ' cover';
      x = (coverRect!.left + scrollX) * scale;
      y = (coverRect!.top + scrollY) * scale;
      style.width = coverRect!.width * scale;
      style.height = coverRect!.height * scale;
    } else {
      if (!nearRect) {
        return null;
      }
      if (vertical) {
        className += ' vertical';
        x = ((insertType === 'before' ? nearRect.left : nearRect.right) + scrollX) * scale;
        y = (nearRect.top + scrollY) * scale;
        style.height = nearRect!.height * scale;
      } else {
        x = (nearRect.left + scrollX) * scale;
        y = ((insertType === 'before' ? nearRect.top : nearRect.bottom) + scrollY) * scale;
        style.width = nearRect.width * scale;
      }
    }
    style.transform = `translate3d(${x}px, ${y}px, 0)`;

    return <div className={className} style={style} />;
  }
}
