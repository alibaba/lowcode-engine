import { Component, Fragment } from 'react';
import { Button, Icon } from '@alifd/next';
import { action, makeObservable } from '@ali/lowcode-editor-core';
import { IconFix } from '../../icons/fix';
import { IconFloat } from '../../icons/float';
import Panel from '../../widget/panel';

export default class PanelOperationRow extends Component<{ panel: Panel }> {
  constructor(props) {
    super(props);
    makeObservable(this);
  }
  // fix or float
  @action
  setDisplay() {
    const { panel } = this.props;
    const current = panel;
    if (!current) {
      return;
    }
    if (panel?.parent?.name === 'leftFloatArea') {
      panel.skeleton.leftFloatArea.remove(current);
      panel.skeleton.leftFixedArea.add(current);
      panel.skeleton.leftFixedArea.container.active(current);
    } else {
      panel.skeleton.leftFixedArea.remove(current);
      panel.skeleton.leftFloatArea.add(current);
      panel.skeleton.leftFloatArea.container.active(current);
    }
  }

  render() {
    const { panel } = this.props;
    const isRightArea = this.props.panel.config?.area === 'rightArea';
    if (isRightArea) {
      return null;
    }
    // can be set fixed by default
    let canSetFixed = true;
    if (panel?.config.props?.canSetFixed === false) {
      canSetFixed = false;
    }

    const hideTitleBar = panel?.config.props?.hideTitleBar;

    const areaName = panel?.parent?.name;
    const area = panel.skeleton[areaName];

    return (
      <Fragment>
        {!hideTitleBar && (
          <Fragment>
            {canSetFixed && (
              // eslint-disable-next-line react/jsx-no-bind
              <Button text className="lc-pane-icon-fix" onClick={this.setDisplay.bind(this)}>
                {areaName === 'leftFloatArea' ? <IconFloat /> : <IconFix />}
              </Button>
            )}
            <Button
              text
              className="lc-pane-icon-close"
              onClick={() => {
                area && area.setVisible(false);
              }}
            >
              <Icon type="close" />
            </Button>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
