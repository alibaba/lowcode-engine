import { observer } from '@ali/recore';
import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { INode, isElementNode, isConfettiNode, hasConditionFlow } from '../../document/node';
import OffsetObserver from './offset-observer';
import './selecting.less';
import { isShadowNode, isShadowsContainer } from '../../document/node/shadow-node';
import { isConditionFlow } from '../../document/node/condition-flow';
import { current, dragon } from '../../globals';

@observer
export class SingleSelectingView extends Component<{ node: INode; highlight?: boolean }> {
  private offsetObserver: OffsetObserver;

  constructor(props: { node: INode; highlight?: boolean }) {
    super(props);
    this.offsetObserver = new OffsetObserver(props.node);
  }

  render() {
    if (!this.offsetObserver.hasOffset) {
      return null;
    }

    const scale = this.props.node.document.viewport.scale;
    const { width, height, offsetTop, offsetLeft } = this.offsetObserver;

    const style = {
      width: width * scale,
      height: height * scale,
      transform: `translate3d(${offsetLeft * scale}px, ${offsetTop * scale}px, 0)`,
    } as any;

    const { node, highlight } = this.props;

    const className = classNames('my-selecting', {
      'x-shadow': isShadowNode(node),
      'x-flow': hasConditionFlow(node) || isConditionFlow(node),
      highlight,
    });

    return <div className={className} style={style} />;
  }
}

@observer
export class SelectingView extends Component {
  get selecting(): INode[] {
    const sel = current.selection;
    if (!sel) {
      return [];
    }
    if (dragon.dragging) {
      return sel.getTopNodes();
    }

    return sel.getNodes();
  }
  render() {
    return this.selecting.map(node => {
      // select all nodes when doing x-for
      if (isShadowsContainer(node)) {
        // FIXME: thinkof nesting for
        const views = [];
        for (const shadowNode of (node as any).getShadows()!.values()) {
          views.push(<SingleSelectingView key={shadowNode.id} node={shadowNode} />);
        }
        return <Fragment key={node.id}>{views}</Fragment>;
      } else if (isShadowNode(node)) {
        const shadows = node.origin.getShadows()!.values();
        const views = [];
        for (const shadowNode of shadows) {
          views.push(<SingleSelectingView highlight={shadowNode === node} key={shadowNode.id} node={shadowNode} />);
        }
        return <Fragment key={node.id}>{views}</Fragment>;
      }
      // select the visible node when doing x-if
      else if (isConditionFlow(node)) {
        return <SingleSelectingView node={node.visibleNode} key={node.id} />;
      }

      return <SingleSelectingView node={node} key={node.id} />;
    });
  }
}
