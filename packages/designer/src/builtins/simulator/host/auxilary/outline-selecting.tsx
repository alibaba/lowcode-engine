import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@recore/core-obx';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import { computed } from '@recore/obx';
import OffsetObserver from '../../../../designer/offset-observer';

@observer
export class OutlineSelectingInstance extends Component<{ observed: OffsetObserver; highlight?: boolean }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { observed, highlight } = this.props;
    if (!observed.hasOffset) {
      return null;
    }

    const { scale, width, height, offsetTop, offsetLeft } = observed;

    const style = {
      width: width * scale,
      height: height * scale,
      transform: `translate3d(${offsetLeft * scale}px, ${offsetTop * scale}px, 0)`,
    };

    const className = classNames('lc-outlines lc-outlines-selecting', {
      highlight,
    });

    return (
      <div className={className} style={style}>
        <a className="lc-outlines-title">{observed.nodeInstance.node.title}</a>
      </div>
    );
  }
}

@observer
export class OutlineSelecting extends Component {
  static contextType = SimulatorContext;

  shouldComponentUpdate() {
    return false;
  }

  @computed get selecting() {
    const doc = this.host.document;
    if (doc.suspensed) {
      return null;
    }
    return doc.selection.getNodes();
  }

  @computed get host(): SimulatorHost {
    return this.context;
  }

  render() {
    const selecting = this.selecting;
    if (!selecting || selecting.length < 1) {
      // DIRTY FIX, recore has a bug!
      return <Fragment />;
    }

    const designer = this.host.designer;

    return (
      <Fragment>
        {selecting.map(node => {
          const instances = this.host.getComponentInstance(node);
          if (!instances || instances.length < 1) {
            return null;
          }
          return (
            <Fragment key={node.id}>
              {instances.map((instance, i) => {
                const observed = designer.createOffsetObserver({
                  node,
                  instance,
                });
                if (!observed) {
                  return null;
                }
                return <OutlineSelectingInstance key={`line-s-${i}`} observed={observed} />;
              })}
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
}
