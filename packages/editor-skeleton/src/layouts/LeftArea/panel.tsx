import React, { PureComponent, Fragment } from 'react';
import Editor, { AreaManager } from '@ali/lowcode-editor-framework';
import Panel from '../../components/Panel';

import './index.scss';

export interface LeftAreaPanelProps {
  editor: Editor;
}

export interface LeftAreaPanelState {
  activeKey: string;
}

export default class LeftAreaPanel extends PureComponent<
  LeftAreaPanelProps,
  LeftAreaPanelState
> {
  static displayName = 'LowcodeLeftAreaPanel';

  private editor: Editor;

  private areaManager: AreaManager;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'leftArea');

    this.state = {
      activeKey: 'none',
    };
  }

  componentDidMount(): void {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('leftPanel.show', this.handlePluginChange);
  }

  componentWillUnmount(): void {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('leftPanel.show', this.handlePluginChange);
  }

  handleSkeletonUpdate = (): void => {
    // 当前区域插件状态改变是更新区域
    if (this.areaManager.isPluginStatusUpdate('PanelIcon')) {
      this.forceUpdate();
    }
  };

  handlePluginChange = (key: string): void => {
    this.setState({
      activeKey: key,
    });
  };

  render(): React.ReactNode {
    const { activeKey } = this.state;
    const list = this.areaManager.getVisiblePluginList('PanelIcon');

    return (
      <Fragment>
        {list.map(
          (item): React.ReactNode => {
            const Comp = this.areaManager.getPluginClass(item.pluginKey);
            if (Comp) {
              return (
                <Panel
                  key={item.pluginKey}
                  visible={item.pluginKey === activeKey}
                  {...(item.props && item.props.panelProps)}
                >
                  <Comp
                    editor={this.editor}
                    config={item}
                    {...item.pluginProps}
                  />
                </Panel>
              );
            }
            return null;
          },
        )}
      </Fragment>
    );
  }
}
