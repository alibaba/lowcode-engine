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
import { observer, computed, Tip } from '@alilc/lowcode-editor-core';
import { createIcon, isReactComponent, isActionContentObject } from '@alilc/lowcode-utils';
import { IPublicTypeActionContentObject } from '@alilc/lowcode-types';
import { BuiltinSimulatorHost } from '../host';
import { INode, OffsetObserver } from '../../designer';
import NodeSelector from '../node-selector';
import { ISimulatorHost } from '../../simulator';

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

    const { hideSelectTools } = observed.node.componentMeta.advanced;

    if (hideSelectTools) {
      return null;
    }

    return (
      <div className={className} style={style}>
        {!dragging && <Toolbar observed={observed} />}
      </div>
    );
  }
}

@observer
class Toolbar extends Component<{ observed: OffsetObserver }> {
  render() {
    const { observed } = this.props;
    const { height, width } = observed.viewport;
    const BAR_HEIGHT = 20;
    const MARGIN = 1;
    const BORDER = 2;
    const SPACE_HEIGHT = BAR_HEIGHT + MARGIN + BORDER;
    const SPACE_MINIMUM_WIDTH = 160; // magic number，大致是 toolbar 的宽度
    let style: any;
    // 计算 toolbar 的上/下位置
    if (observed.top > SPACE_HEIGHT) {
      style = {
        top: -SPACE_HEIGHT,
        height: BAR_HEIGHT,
      };
    } else if (observed.bottom + SPACE_HEIGHT < height) {
      style = {
        bottom: -SPACE_HEIGHT,
        height: BAR_HEIGHT,
      };
    } else {
      style = {
        height: BAR_HEIGHT,
        top: Math.max(MARGIN, MARGIN - observed.top),
      };
    }
    // 计算 toolbar 的左/右位置
    if (SPACE_MINIMUM_WIDTH > observed.left + observed.width) {
      style.left = Math.max(-BORDER, observed.left - width - BORDER);
    } else {
      style.right = Math.max(-BORDER, observed.right - width - BORDER);
      style.justifyContent = 'flex-start';
    }
    const { node } = observed;
    const actions: ReactNodeArray = [];
    node.componentMeta.availableActions.forEach((action) => {
      const { important = true, condition, content, name } = action;
      if (node.isSlot() && (name === 'copy' || name === 'remove')) {
        // FIXME: need this?
        return;
      }
      if (important && (typeof condition === 'function' ? condition(node) !== false : condition !== false)) {
        actions.push(createAction(content, name, node));
      }
    });
    return (
      <div className="lc-borders-actions" style={style}>
        {actions}
        <NodeSelector node={node} />
      </div>
    );
  }
}

function createAction(content: ReactNode | ComponentType<any> | IPublicTypeActionContentObject, key: string, node: INode) {
  if (isValidElement<{ key: string; node: INode }>(content)) {
    return cloneElement(content, { key, node });
  }
  if (isReactComponent(content)) {
    return createElement(content, { key, node });
  }
  if (isActionContentObject(content)) {
    const { action, title, icon } = content;
    return (
      <div
        key={key}
        className="lc-borders-action"
        onClick={() => {
          action && action(node.internalToShellNode()!);
          const editor = node.document?.designer.editor;
          const npm = node?.componentMeta?.npm;
          const selected =
            [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
            node?.componentMeta?.componentName ||
            '';
          editor?.eventBus.emit('designer.border.action', {
            name: key,
            selected,
          });
        }}
      >
        {icon && createIcon(icon)}
        <Tip>{title}</Tip>
      </div>
    );
  }
  return null;
}

@observer
export class BorderSelectingForNode extends Component<{ host: ISimulatorHost; node: INode }> {
  get host(): ISimulatorHost {
    return this.props.host;
  }

  get dragging(): boolean {
    return this.host.designer.dragon.dragging;
  }

  @computed get instances() {
    return this.host.getComponentInstances(this.props.node);
  }

  render() {
    const { instances } = this;
    const { node } = this.props;
    const { designer } = this.host;

    if (!instances || instances.length < 1) {
      return null;
    }
    return (
      <Fragment key={node.id}>
        {instances.map((instance) => {
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
export class BorderSelecting extends Component<{ host: BuiltinSimulatorHost }> {
  get host(): BuiltinSimulatorHost {
    return this.props.host;
  }

  get dragging(): boolean {
    return this.host.designer.dragon.dragging;
  }

  @computed get selecting() {
    const doc = this.host.currentDocument;
    if (!doc || doc.suspensed || this.host.liveEditing.editing) {
      return null;
    }
    const { selection } = doc;
    return this.dragging ? selection.getTopNodes() : selection.getNodes();
  }

  render() {
    const { selecting } = this;
    if (!selecting || selecting.length < 1) {
      return null;
    }

    return (
      <Fragment>
        {selecting.map((node) => (
          <BorderSelectingForNode key={node.id} host={this.props.host} node={node} />
        ))}
      </Fragment>
    );
  }
}
