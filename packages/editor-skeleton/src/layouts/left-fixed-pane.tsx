import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import { Button, Icon } from '@alifd/next';
import Area from '../area';
import { PanelConfig } from '../types';
import Panel from '../widget/panel';
import { Designer } from '@ali/lowcode-designer';
import { IconFloat } from '../icons/float';

@observer
export default class LeftFixedPane extends Component<{ area: Area<PanelConfig, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate() {
    // FIXME: dirty fix, need deep think
    this.props.area.skeleton.editor.get(Designer)?.touchOffsetObserver();
  }

  // 取消固定
  setFloat() {
    const { area } = this.props;
    const { current } = area;
    if (!current) {
      return;
    }
    area.skeleton.leftFixedArea.remove(current);
    area.skeleton.leftFloatArea.add(current);
    area.skeleton.leftFloatArea.container.active(current);
  }

  render() {
    const { area } = this.props;
    const hideTitleBar = area.current?.config.props?.hideTitleBar;
    const width = area.current?.config.props?.width;
    const style = width
      ? {
        width,
      }
      : undefined;

    return (
      <div
        className={classNames('lc-left-fixed-pane', {
          'lc-area-visible': area.visible,
        })}
        style={style}
      >
        {!hideTitleBar && (
          <Fragment>
            <Button
              text
              className="lc-pane-icon-float"
              onClick={this.setFloat.bind(this)}
            >
              <IconFloat />
            </Button>
            <Button
              text
              className="lc-pane-icon-close"
              onClick={() => {
                area.setVisible(false);
              }}
            >
              <Icon type="close" />
            </Button>
          </Fragment>
        )}
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area<PanelConfig, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    return <Fragment>{area.container.items.map((panel) => panel.content)}</Fragment>;
  }
}
