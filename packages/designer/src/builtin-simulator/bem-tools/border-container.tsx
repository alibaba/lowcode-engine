import * as React from 'react';
import { Component, Fragment, ReactElement, PureComponent } from 'react';
import classNames from 'classnames';
import { computed, observer, Title, globalLocale } from '@alilc/lowcode-editor-core';
import { IPublicTypeI18nData, IPublicTypeTitleContent } from '@alilc/lowcode-types';
import { isI18nData } from '@alilc/lowcode-utils';
import { DropLocation } from '../../designer';
import { BuiltinSimulatorHost } from '../../builtin-simulator/host';
import { INode } from '../../document/node';

export class BorderContainerInstance extends PureComponent<{
  title: IPublicTypeTitleContent;
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

    return (
      <div className={className} style={style}>
        <Title title={title} className="lc-borders-title" />
      </div>
    );
  }
}

function getTitle(title: string | IPublicTypeI18nData | ReactElement) {
  if (typeof title === 'string') return title;
  if (isI18nData(title)) {
    const locale = globalLocale.getLocale() || 'zh-CN';
    return `将放入到此${title[locale]}`;
  }
  return '';
}

@observer
export class BorderContainer extends Component<{
  host: BuiltinSimulatorHost;
}, {
    target?: INode;
  }> {
  state = {} as any;

  @computed get scale() {
    return this.props.host.viewport.scale;
  }

  @computed get scrollX() {
    return this.props.host.viewport.scrollX;
  }

  @computed get scrollY() {
    return this.props.host.viewport.scrollY;
  }

  componentDidMount() {
    const { host } = this.props;

    host.designer.editor.eventBus.on('designer.dropLocation.change', (loc: DropLocation) => {
      const { target } = this.state;
      if (target === loc?.target) return;
      this.setState({
        target: loc?.target,
      });
    });
  }

  render() {
    const { host } = this.props;
    const { target } = this.state;
    if (target == undefined) {
      return null;
    }
    const instances = host.getComponentInstances(target!);
    if (!instances || instances.length < 1) {
      return null;
    }

    if (instances.length === 1) {
      return (
        <BorderContainerInstance
          key="line-h"
          title={getTitle(target.componentMeta.title)}
          scale={this.scale}
          scrollX={this.scrollX}
          scrollY={this.scrollY}
          rect={host.computeComponentInstanceRect(instances[0], target.componentMeta.rootSelector)}
        />
      );
    }
    return (
      <Fragment>
        {instances.map((inst, i) => (
          <BorderContainerInstance
            key={`line-h-${i}`}
            title={getTitle(target.componentMeta.title)}
            scale={this.scale}
            scrollX={this.scrollX}
            scrollY={this.scrollY}
            rect={host.computeComponentInstanceRect(inst, target.componentMeta.rootSelector)}
          />
        ))}
      </Fragment>
    );
  }
}
