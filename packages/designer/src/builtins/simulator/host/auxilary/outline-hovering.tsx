import { Component, Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import { observer } from '@recore/obx-react';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import { computed } from '@recore/obx';

export class OutlineHoveringInstance extends PureComponent<{
  title: string;
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

    const className = classNames('lc-outlines lc-outlines-hovering');

    // TODO:
    // 1. thinkof icon
    // 2. thinkof top|bottom|inner space

    return (
      <div className={className} style={style}>
        <a className="lc-outlines-title">{title}</a>
      </div>
    );
  }
}

@observer
export class OutlineHovering extends Component {
  static contextType = SimulatorContext;

  shouldComponentUpdate() {
    return false;
  }

  @computed get scale() {
    return (this.context as SimulatorHost).viewport.scale;
  }

  @computed get scrollX() {
    return (this.context as SimulatorHost).viewport.scrollX;
  }

  @computed get scrollY() {
    return (this.context as SimulatorHost).viewport.scrollY;
  }

  @computed get current() {
    const host = this.context as SimulatorHost;
    const doc = host.document;
    const selection = doc.selection;
    const current = host.designer.hovering.current;
    if (!current || current.document !== doc || selection.has(current.id)) {
      return null;
    }
    return current;
  }

  render() {
    const host = this.context as SimulatorHost;
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
        <OutlineHoveringInstance
          key="line-h"
          title={current.title}
          scale={this.scale}
          scrollX={this.scrollX}
          scrollY={this.scrollY}
          rect={host.computeComponentInstanceRect(instances[0])}
        />
      );
    }
    return (
      <Fragment>
        {instances.map((inst, i) => (
          <OutlineHoveringInstance
            key={`line-h-${i}`}
            title={current.title}
            scale={this.scale}
            scrollX={this.scrollX}
            scrollY={this.scrollY}
            rect={host.computeComponentInstanceRect(inst)}
          />
        ))}
      </Fragment>
    );
  }
}
