import { Component, Fragment } from 'react';
import { Button, Icon } from '@alifd/next';
import { action, makeObservable } from '@alilc/lowcode-editor-core';
import { IconFix } from '../../icons/fix';
import { IconFloat } from '../../icons/float';
import { Panel } from '../../widget/panel';

export default class PanelOperationRow extends Component<{ panel: Panel }> {
  constructor(props: any) {
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

    panel.skeleton.toggleFloatStatus(panel);
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

    const areaName = panel?.parent?.name ?? '';
    const area = (panel.skeleton as any)[areaName];

    return (
      <Fragment>
        {!hideTitleBar && (
          <Fragment>
            {canSetFixed && (
              // eslint-disable-next-line react/jsx-no-bind
              <Button text className="lc-pane-icon-fix" onClick={this.setDisplay.bind(this)}>
                {areaName === 'leftFloatArea' ? <IconFix /> : <IconFloat />}
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
