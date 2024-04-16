import { Component, Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import { computed, observer } from '@alilc/lowcode-editor-core';
import { IPublicTypeTitleContent } from '@alilc/lowcode-types';
import { getClosestNode } from '@alilc/lowcode-utils';
import { intl } from '../../locale';
import { BuiltinSimulatorHost } from '../host';
import { Title } from '../../widgets';

export class BorderDetectingInstance extends PureComponent<{
  title: IPublicTypeTitleContent;
  rect: DOMRect | null;
  scale: number;
  scrollX: number;
  scrollY: number;
  isLocked?: boolean;
}> {
  render() {
    const { title, rect, scale, scrollX, scrollY, isLocked } = this.props;
    if (!rect) {
      return null;
    }

    const style = {
      width: rect.width * scale,
      height: rect.height * scale,
      transform: `translate(${(scrollX + rect.left) * scale}px, ${(scrollY + rect.top) * scale}px)`,
    };

    const className = classNames('lc-borders lc-borders-detecting');

    // TODO:
    // 1. thinkof icon
    // 2. thinkof top|bottom|inner space

    return (
      <div className={className} style={style}>
        <Title title={title} className="lc-borders-title" />
        {isLocked ? <Title title={intl('locked')} className="lc-borders-status" /> : null}
      </div>
    );
  }
}

@observer
export class BorderDetecting extends Component<{ host: BuiltinSimulatorHost }> {
  @computed get scale() {
    return this.props.host.viewport.scale;
  }

  @computed get scrollX() {
    return this.props.host.viewport.scrollX;
  }

  @computed get scrollY() {
    return this.props.host.viewport.scrollY;
  }

  @computed get current() {
    const { host } = this.props;
    const doc = host.currentDocument;
    if (!doc) {
      return null;
    }
    const { selection } = doc;
    const { current } = host.designer.detecting;

    if (!current || current.document !== doc || selection.has(current.id)) {
      return null;
    }
    return current;
  }

  render() {
    const { host } = this.props;
    const { current } = this;

    const canHoverHook = current?.componentMeta.advanced.callbacks?.onHoverHook;
    const canHover =
      canHoverHook && typeof canHoverHook === 'function'
        ? canHoverHook(current.internalToShellNode()!)
        : true;

    if (!canHover || !current || host.viewport.scrolling || host.liveEditing.editing) {
      return null;
    }

    // rootNode, hover whole viewport
    const focusNode = current.document.focusNode!;

    if (!focusNode.contains(current)) {
      return null;
    }

    if (current.contains(focusNode)) {
      const bounds = host.viewport.bounds;
      return (
        <BorderDetectingInstance
          key="line-root"
          title={current.title}
          scale={this.scale}
          scrollX={host.viewport.scrollX}
          scrollY={host.viewport.scrollY}
          rect={new DOMRect(0, 0, bounds.width, bounds.height)}
        />
      );
    }

    const lockedNode = getClosestNode(current as any, (n) => {
      // 假如当前节点就是 locked 状态，要从当前节点的父节点开始查找
      return !!(current?.isLocked ? n.parent?.isLocked : n.isLocked);
    });
    if (lockedNode && lockedNode.getId() !== current.getId()) {
      // 选中父节锁定的节点
      return (
        <BorderDetectingInstance
          key="line-h"
          title={current.title}
          scale={this.scale}
          scrollX={this.scrollX}
          scrollY={this.scrollY}
          // @ts-ignore
          rect={host.computeComponentInstanceRect(
            host.getComponentInstances(lockedNode)![0],
            lockedNode.componentMeta.rootSelector,
          )}
          isLocked={lockedNode?.getId() !== current.getId()}
        />
      );
    }

    const instances = host.getComponentInstances(current);
    if (!instances || instances.length < 1) {
      return null;
    }

    if (instances.length === 1) {
      return (
        <BorderDetectingInstance
          key="line-h"
          title={current.title}
          scale={this.scale}
          scrollX={this.scrollX}
          scrollY={this.scrollY}
          rect={host.computeComponentInstanceRect(instances[0], current.componentMeta.rootSelector)}
        />
      );
    }
    return (
      <Fragment>
        {instances.map((inst, i) => (
          <BorderDetectingInstance
            key={`line-h-${i}`}
            title={current.title}
            scale={this.scale}
            scrollX={this.scrollX}
            scrollY={this.scrollY}
            rect={host.computeComponentInstanceRect(inst, current.componentMeta.rootSelector)}
          />
        ))}
      </Fragment>
    );
  }
}
