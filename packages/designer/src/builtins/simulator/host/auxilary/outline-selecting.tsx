import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@recore/obx-react';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import { computed } from '@recore/obx';
import OffsetObserver from '../../../../designer/helper/offset-observer';
import Node from '../../../../designer/document/node/node';

@observer
export class OutlineSelectingInstance extends Component<{
  observed: OffsetObserver;
  highlight?: boolean;
  dragging?: boolean;
}> {
  componentWillUnmount() {
    this.props.observed.purge();
  }

  render() {
    const { observed, highlight, dragging } = this.props;
    if (!observed.hasOffset) {
      return null;
    }

    const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = observed;

    const style = {
      width: offsetWidth,
      height: offsetHeight,
      transform: `translate3d(${offsetLeft}px, ${offsetTop}px, 0)`,
    };

    const className = classNames('lc-outlines lc-outlines-selecting', {
      highlight,
      dragging,
    });

    return (
      <div className={className} style={style}>
        <a className="lc-outlines-title">{observed.nodeInstance.node.title}</a>
      </div>
    );
  }
}

@observer
export class OutlineSelectingForNode extends Component<{ node: Node }> {
  static contextType = SimulatorContext;

  get host(): SimulatorHost {
    return this.context;
  }

  get dragging(): boolean {
    return this.host.designer.dragon.dragging;
  }

  @computed get instances() {
    return this.host.getComponentInstances(this.props.node);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { instances } = this;
    const { node } = this.props;
    const designer = this.host.designer;

    if (!instances || instances.length < 1) {
      return null;
    }
    return (
      <Fragment key={node.id}>
        {instances.map(instance => {
          const observed = designer.createOffsetObserver({
            node,
            instance,
          });
          if (!observed) {
            return null;
          }
          return <OutlineSelectingInstance key={observed.id} dragging={this.dragging} observed={observed} />;
        })}
      </Fragment>
    );
  }
}

@observer
export class OutlineSelecting extends Component {
  static contextType = SimulatorContext;

  get host(): SimulatorHost {
    return this.context;
  }

  get dragging(): boolean {
    return this.host.designer.dragon.dragging;
  }

  @computed get selecting() {
    const doc = this.host.document;
    if (doc.suspensed) {
      return null;
    }
    const selection = doc.selection;
    return this.dragging ? selection.getTopNodes() : selection.getNodes();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const selecting = this.selecting;
    if (!selecting || selecting.length < 1) {
      // DIRTY FIX, recore has a bug!
      return <Fragment />;
    }

    return (
      <Fragment>
        {selecting.map(node => (
          <OutlineSelectingForNode key={node.id} node={node} />
        ))}
      </Fragment>
    );
  }
}
