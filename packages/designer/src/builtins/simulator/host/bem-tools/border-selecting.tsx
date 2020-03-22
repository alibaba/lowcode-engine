import {
  Component,
  Fragment,
  ReactNodeArray,
  isValidElement,
  cloneElement,
  createElement,
  ReactNode,
  ComponentType,
} from 'react';
import classNames from 'classnames';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import OffsetObserver from '../../../../designer/helper/offset-observer';
import Node from '../../../../designer/document/node/node';
import {
  observer,
  computed,
  createIcon,
  EmbedTip,
  isReactComponent,
  ActionContentObject,
  isActionContentObject,
} from '../../../../../../globals';

@observer
export class BorderSelectingInstance extends Component<{
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

    const className = classNames('lc-borders lc-borders-selecting', {
      highlight,
      dragging,
    });

    return (
      <div className={className} style={style}>
        {!dragging && <Toolbar observed={observed} />}
      </div>
    );
  }
}

@observer
class Toolbar extends Component<{ observed: OffsetObserver }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { observed } = this.props;
    const { height, width } = observed.viewport;
    const BAR_HEIGHT = 20;
    const MARGIN = 1;
    const BORDER = 2;
    const SPACE_HEIGHT = BAR_HEIGHT + MARGIN + BORDER;
    let style: any;
    if (observed.top > SPACE_HEIGHT) {
      style = {
        right: Math.max(-BORDER, observed.right - width - BORDER),
        top: -SPACE_HEIGHT,
        height: BAR_HEIGHT,
      };
    } else if (observed.bottom + SPACE_HEIGHT < height) {
      style = {
        bottom: -SPACE_HEIGHT,
        height: BAR_HEIGHT,
        right: Math.max(-BORDER, observed.right - width - BORDER),
      };
    } else {
      style = {
        height: BAR_HEIGHT,
        top: Math.max(MARGIN, MARGIN - observed.top),
        right: Math.max(MARGIN, MARGIN + observed.right - width),
      };
    }
    const { node } = observed;
    const actions: ReactNodeArray = [];
    node.componentMeta.availableActions.forEach(action => {
      const { important, condition, content, name } = action;
      if (node.isSlotRoot && (name === 'copy' || name === 'remove')) {
        // FIXME: need this?
        return;
      }
      if (important && (typeof condition === 'function' ? condition(node) : condition !== false)) {
        actions.push(createAction(content, name, node));
      }
    });
    return (
      <div className="lc-borders-actions" style={style}>
        {actions}
      </div>
    );
  }
}

function createAction(content: ReactNode | ComponentType<any> | ActionContentObject, key: string, node: Node) {
  if (isValidElement(content)) {
    return cloneElement(content, { key, node });
  }
  if (isReactComponent(content)) {
    return createElement(content, { key, node });
  }
  if (isActionContentObject(content)) {
    const { action, description, icon } = content;
    return (
      <div
        key={key}
        className="lc-borders-action"
        onClick={() => {
          action && action(node);
        }}
      >
        {icon && createIcon(icon)}
        <EmbedTip>{description}</EmbedTip>
      </div>
    );
  }
  return null;
}

@observer
export class BorderSelectingForNode extends Component<{ node: Node }> {
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
          return <BorderSelectingInstance key={observed.id} dragging={this.dragging} observed={observed} />;
        })}
      </Fragment>
    );
  }
}

@observer
export class BorderSelecting extends Component {
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
          <BorderSelectingForNode key={node.id} node={node} />
        ))}
      </Fragment>
    );
  }
}
