import { Component } from 'react';
import { observer } from '@ali/recore';
import { getCurrentDocument } from '../../globals';
import './insertion.less';
import Location, { isLocationChildrenDetail, isVertical, LocationChildrenDetail, Rect } from '../../document/location';
import { isConditionFlow } from '../../document/node/condition-flow';
import { getChildAt, INodeParent } from '../../document/node';
import DocumentContext from '../../document/document-context';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function processPropDetail() {
  // return { insertType: 'cover', coverEdge: ? };
}

interface InsertionData {
  edge?: Rect;
  insertType?: string;
  vertical?: boolean;
  nearRect?: Rect;
  coverRect?: Rect;
}

/**
 * 处理拖拽子节点(INode)情况
 */
function processChildrenDetail(
  doc: DocumentContext,
  target: INodeParent,
  detail: LocationChildrenDetail,
): InsertionData {
  const edge = doc.computeRect(target);
  if (!edge) {
    return {};
  }

  const ret: any = {
    edge,
    insertType: 'before',
  };

  if (isConditionFlow(target)) {
    ret.insertType = 'cover';
    ret.coverRect = edge;
    return ret;
  }

  if (detail.near) {
    const { node, pos, rect, align } = detail.near;
    ret.nearRect = rect || doc.computeRect(node);
    ret.vertical = align ? align === 'V' : isVertical(ret.nearRect);
    ret.insertType = pos;
    return ret;
  }

  // from outline-tree: has index, but no near
  // TODO: think of shadowNode & ConditionFlow
  const { index } = detail;
  let nearNode = getChildAt(target, index);
  if (!nearNode) {
    // index = 0, eg. nochild,
    nearNode = getChildAt(target, index > 0 ? index - 1 : 0);
    if (!nearNode) {
      ret.insertType = 'cover';
      ret.coverRect = edge;
      return ret;
    }
    ret.insertType = 'after';
  }
  if (nearNode) {
    ret.nearRect = doc.computeRect(nearNode);
    ret.vertical = isVertical(ret.nearRect);
  }
  return ret;
}

/**
 * 将 detail 信息转换为页面"坐标"信息
 */
function processDetail({ target, detail, document }: Location): InsertionData {
  if (isLocationChildrenDetail(detail)) {
    return processChildrenDetail(document, target, detail);
  } else {
    // TODO: others...
    const edge = document.computeRect(target);
    return edge ? { edge, insertType: 'cover', coverRect: edge } : {};
  }
}

@observer
export class InsertionView extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const doc = getCurrentDocument();
    if (!doc || !doc.dropLocation) {
      return null;
    }

    const { scale, scrollTarget } = doc.viewport;
    const sx = scrollTarget!.left;
    const sy = scrollTarget!.top;

    const { edge, insertType, coverRect, nearRect, vertical } = processDetail(doc.dropLocation);
    if (!edge) {
      return null;
    }

    let className = 'my-insertion';
    const style: any = {};
    let x: number;
    let y: number;
    if (insertType === 'cover') {
      className += ' cover';
      x = (coverRect!.left + sx) * scale;
      y = (coverRect!.top + sy) * scale;
      style.width = coverRect!.width * scale;
      style.height = coverRect!.height * scale;
    } else {
      if (!nearRect) {
        return null;
      }
      if (vertical) {
        className += ' vertical';
        x = ((insertType === 'before' ? nearRect.left : nearRect.right) + sx) * scale;
        y = (nearRect.top + sy) * scale;
        style.height = nearRect!.height * scale;
      } else {
        x = (nearRect.left + sx) * scale;
        y = ((insertType === 'before' ? nearRect.top : nearRect.bottom) + sy) * scale;
        style.width = nearRect.width * scale;
      }
    }
    style.transform = `translate3d(${x}px, ${y}px, 0)`;

    return <div className={className} style={style} />;
  }
}
