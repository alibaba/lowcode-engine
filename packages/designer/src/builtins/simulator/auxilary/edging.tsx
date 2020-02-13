import { observer } from '@ali/recore';
import { Component } from 'react';
import { edging } from '../../globals/edging';
import './edging.less';
import { hasConditionFlow } from '../../document/node';
import { isShadowNode } from '../../document/node/shadow-node';
import { isConditionFlow } from '../../document/node/condition-flow';
import { current } from '../../globals';

@observer
export class EdgingView extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const node = edging.watching;
    if (!node || !edging.enable || (current.selection && current.selection.has(node.id))) {
      return null;
    }

    // TODO: think of multi rects
    // TODO: findDOMNode cause a render bug
    const rect = node.document.computeRect(node);
    if (!rect) {
      return null;
    }

    const { scale, scrollTarget } = node.document.viewport;

    const sx = scrollTarget!.left;
    const sy = scrollTarget!.top;

    const style = {
      width: rect.width * scale,
      height: rect.height * scale,
      transform: `translate(${(sx + rect.left) * scale}px, ${(sy + rect.top) * scale}px)`,
    } as any;

    let className = 'my-edging';

    // handle x-for node
    if (isShadowNode(node)) {
      className += ' x-shadow';
    }
    // handle x-if/else-if/else node
    if (isConditionFlow(node) || hasConditionFlow(node)) {
      className += ' x-flow';
    }

    // TODO:
    // 1. thinkof icon
    // 2. thinkof top|bottom|inner space

    return (
      <div className={className} style={style}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="title">{(node as any).title || node.tagName}</a>
      </div>
    );
  }
}
