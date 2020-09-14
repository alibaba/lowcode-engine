import { Component, Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import { computed, observer, Title } from '@ali/lowcode-editor-core';
import { BuiltinSimulatorHost } from '../host';
import { TitleContent } from '@ali/lowcode-types';

export class BorderDetectingInstance extends PureComponent<{
  title: TitleContent;
  rect: DOMRect | null;
  scale: number;
  scrollX: number;
  scrollY: number;
}> {
  render() {
    const { title, rect, scale, scrollX, scrollY } = this.props;
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
      </div>
    );
  }
}

@observer
// eslint-disable-next-line react/no-multi-comp
export class BorderDetecting extends Component<{ host: BuiltinSimulatorHost }> {
  shouldComponentUpdate() {
    return false;
  }

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
    console.info(doc);
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
    if (!current || host.viewport.scrolling || host.liveEditing.editing) {
      return null;
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
