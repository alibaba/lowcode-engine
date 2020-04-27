import { Component, Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import { computed, observer, Title } from '@ali/lowcode-editor-core';
import { SimulatorContext } from '../context';
import { BuiltinSimulatorHost } from '../host';
import { TitleContent } from '@ali/lowcode-types';

export class BorderHoveringInstance extends PureComponent<{
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

    const className = classNames('lc-borders lc-borders-hovering');

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
export class BorderHovering extends Component {
  static contextType = SimulatorContext;

  shouldComponentUpdate() {
    return false;
  }

  @computed get scale() {
    return (this.context as BuiltinSimulatorHost).viewport.scale;
  }

  @computed get scrollX() {
    return (this.context as BuiltinSimulatorHost).viewport.scrollX;
  }

  @computed get scrollY() {
    return (this.context as BuiltinSimulatorHost).viewport.scrollY;
  }

  @computed get current() {
    const host = this.context as BuiltinSimulatorHost;
    const doc = host.document;
    const selection = doc.selection;
    const current = host.designer.hovering.current;
    if (!current || current.document !== doc || selection.has(current.id)) {
      return null;
    }
    return current;
  }

  render() {
    const host = this.context as BuiltinSimulatorHost;
    const current = this.current;
    if (!current || host.viewport.scrolling) {
      return <Fragment />;
    }
    const instances = host.getComponentInstances(current);
    if (!instances || instances.length < 1) {
      return <Fragment />;
    }

    if (instances.length === 1) {
      return (
        <BorderHoveringInstance
          key="line-h"
          title={current.title}
          scale={this.scale}
          scrollX={this.scrollX}
          scrollY={this.scrollY}
          rect={host.computeComponentInstanceRect(instances[0], current.componentMeta.rectSelector)}
        />
      );
    }
    return (
      <Fragment>
        {instances.map((inst, i) => (
          <BorderHoveringInstance
            key={`line-h-${i}`}
            title={current.title}
            scale={this.scale}
            scrollX={this.scrollX}
            scrollY={this.scrollY}
            rect={host.computeComponentInstanceRect(inst, current.componentMeta.rectSelector)}
          />
        ))}
      </Fragment>
    );
  }
}
