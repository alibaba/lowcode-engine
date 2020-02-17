import { observer } from '@recore/core-obx';
import { Component } from 'react';
import './edging.less';

@observer
export class GlidingView extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const node = edging.watching;
    if (!node || !edging.enable || (current.selection && current.selection.has(node.id))) {
      return null;
    }

    // TODO: think of multi ReactInstance
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

    // TODO:
    // 1. thinkof icon
    // 2. thinkof top|bottom|inner space

    return (
      <div className={className} style={style}>
        <a className="title">{(node as any).title || node.tagName}</a>
      </div>
    );
  }
}
