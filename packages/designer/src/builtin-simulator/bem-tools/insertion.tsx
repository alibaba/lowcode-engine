import { Component } from 'react';
import { observer } from '@ali/lowcode-editor-core';
import { BuiltinSimulatorHost } from '../host';
import {
  DropLocation,
  Rect,
  isLocationChildrenDetail,
  LocationChildrenDetail,
  isVertical,
} from '../../designer';
import { ISimulatorHost } from '../../simulator';
import { ParentalNode } from '../../document';
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
function processChildrenDetail(sim: ISimulatorHost, container: ParentalNode, detail: LocationChildrenDetail): InsertionData {
  let edge = detail.edge || null;

  if (!edge) {
    edge = sim.computeRect(container);
    if (!edge) {
      return {};
    }
  }

  const ret: any = {
    edge,
    insertType: 'before',
  };

  if (detail.near) {
    const { node, pos, rect, align } = detail.near;
    ret.nearRect = rect || sim.computeRect(node);
    if (pos === 'replace') {
      // FIXME: ret.nearRect mybe null
      ret.coverRect = ret.nearRect;
      ret.insertType = 'cover';
    } else if (!ret.nearRect || (ret.nearRect.width === 0 && ret.nearRect.height === 0)) {
      ret.nearRect = ret.edge;
      ret.insertType = 'after';
      ret.vertical = isVertical(ret.nearRect);
    } else {
      ret.insertType = pos;
      ret.vertical = align ? align === 'V' : isVertical(ret.nearRect);
    }
    return ret;
  }

  // from outline-tree: has index, but no near
  // TODO: think of shadowNode & ConditionFlow
  const { index } = detail;
  if (index == null) {
    ret.coverRect = ret.edge;
    ret.insertType = 'cover';
    return ret;
  }
  let nearNode = container.children.get(index);
  if (!nearNode) {
    // index = 0, eg. nochild,
    nearNode = container.children.get(index > 0 ? index - 1 : 0);
    if (!nearNode) {
      ret.insertType = 'cover';
      ret.coverRect = edge;
      return ret;
    }
    ret.insertType = 'after';
  }
  if (nearNode) {
    ret.nearRect = sim.computeRect(nearNode);
    if (!ret.nearRect || (ret.nearRect.width === 0 && ret.nearRect.height === 0)) {
      ret.nearRect = ret.edge;
      ret.insertType = 'after';
    }
    ret.vertical = isVertical(ret.nearRect);
  } else {
    ret.insertType = 'cover';
    ret.coverRect = edge;
  }
  return ret;
}

/**
 * 将 detail 信息转换为页面"坐标"信息
 */
function processDetail({ target, detail, document }: DropLocation): InsertionData {
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
    const edge = sim.computeComponentInstanceRect(instances[0], target.componentMeta.rootSelector);
    return edge ? { edge, insertType: 'cover', coverRect: edge } : {};
  }
}

@observer
export class InsertionView extends Component<{ host: BuiltinSimulatorHost }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { host } = this.props;
    const loc = host.currentDocument?.dropLocation;
    if (!loc) {
      return null;
    }
    
    // 如果是个绝对定位容器，不需要渲染插入标记
    if (loc.target.componentMeta.getMetadata().experimental?.isAbsoluteLayoutContainer) {
      return null;
    }

    const { scale, scrollX, scrollY } = host.viewport;
    const { edge, insertType, coverRect, nearRect, vertical } = processDetail(loc);

    if (!edge) {
      return null;
    }

    let className = 'lc-insertion';
    if ((loc.detail as any)?.valid === false) {
      className += ' invalid';
    }
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
