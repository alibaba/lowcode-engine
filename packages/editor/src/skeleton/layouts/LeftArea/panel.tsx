import React, { PureComponent, Fragment } from 'react';
import Panel from '../../components/Panel';
import './index.scss';
import Editor from '../../../framework/editor';
import AreaManager from '../../../framework/areaManager';

export interface LeftAreaPanelProps {
  editor: Editor;
}

export interface LeftAreaPanelState {
  activeKey: string;
}

export default class LeftAreaPanel extends PureComponent<LeftAreaPanelProps, LeftAreaPanelState> {
  static displayName = 'LowcodeLeftAreaPanel';

  private editor: Editor;
  private areaManager: AreaManager;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'leftArea');

    this.state = {
      activeKey: 'none'
    };
  }

  componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('leftPanel.show', this.handlePluginChange);
  }
  componentWillUnmount() {
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
      activeKey: key
    });
  };

  render() {
    const { activeKey } = this.state;
    const list = this.areaManager.getVisiblePluginList('PanelIcon');

    return (
      <Fragment>
        {list.map((item, idx) => {
          const Comp = this.editor.components[item.pluginKey];
          return (
            <Panel key={item.pluginKey} visible={item.pluginKey === activeKey} {...(item.props && item.props.panelProps)}>
              <Comp editor={this.editor} config={item} {...item.pluginProps} />
            </Panel>
          );
        })}
      </Fragment>
    );
  }
}
