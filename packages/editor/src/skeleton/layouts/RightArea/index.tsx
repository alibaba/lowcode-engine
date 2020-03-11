import React, { PureComponent } from 'react';
import { Tab, Badge, Icon } from '@alifd/next';
import './index.scss';
import Editor from '../../../framework/editor';
import AreaManager from '../../../framework/areaManager';
import { PluginConfig } from '../../../framework/definitions';

export interface RightAreaProps {
  editor: Editor;
}

export interface RightAreaState {
  activeKey: string;
}

export default class RightArea extends PureComponent<RightAreaProps, RightAreaState> {
  static displayName = 'LowcodeRightArea';

  private editor: Editor;
  private areaManager: AreaManager;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'rightArea');
    this.state = {
      activeKey: ''
    };
  }

  componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('rightNav.change', this.handlePluginChange);
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    const defaultKey = (visiblePluginList[0] && visiblePluginList[0].pluginKey) || 'componentAttr';
    this.handlePluginChange(defaultKey, true);
  }
  componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('rightNav.change', this.handlePluginChange);
  }

  handleSkeletonUpdate = (): void => {
    // 当前区域插件状态改变是更新区域
    if (this.areaManager.isPluginStatusUpdate()) {
      const pluginStatus = this.editor.pluginStatus;
      const activeKey = this.state.activeKey;
      if (pluginStatus[activeKey] && pluginStatus[activeKey].visible) {
        this.forceUpdate();
      } else {
        const currentPlugin = this.editor.plugins[activeKey];
        if (currentPlugin) {
          currentPlugin.close().then(() => {
            this.setState(
              {
                activeKey: ''
              },
              () => {
                const visiblePluginList = this.areaManager.getVisiblePluginList();
                const firstPlugin = visiblePluginList && visiblePluginList[0];
                if (firstPlugin) {
                  this.handlePluginChange(firstPlugin.pluginKey);
                }
              }
            );
          });
        }
      }
    }
  };

  handlePluginChange = (key: string, isinit?: boolean): void => {
    const activeKey = this.state.activeKey;
    const plugins = this.editor.plugins || {};
    const openPlugin = () => {
      if (!plugins[key]) {
        console.error(`plugin ${key} has not regist in the editor`);
        return;
      }
      plugins[key].open().then(() => {
        this.editor.set('rightNav', key);
        this.setState({
          activeKey: key
        });
      });
    };
    if (key === activeKey && !isinit) return;
    if (activeKey && plugins[activeKey]) {
      plugins[activeKey].close().then(() => {
        openPlugin();
      });
    } else {
      openPlugin();
    }
  };

  renderTabTitle = (config: PluginConfig): React.ReactElement => {
    const { icon, title } = config.props || {};
    const pluginStatus = this.editor.pluginStatus[config.pluginKey];
    const { marked, disabled, locked } = pluginStatus;
    const active = this.state.activeKey === config.pluginKey;

    const renderTitle = (): React.ReactElement => (
      <div
        className={`right-addon-title ${active ? 'active' : ''} ${locked ? 'locked' : ''} ${
          disabled ? 'disabled' : ''
        }`}
      >
        {!!icon && (
          <Icon
            type={icon}
            style={{
              marginRight: 2,
              fontSize: '14px',
              lineHeight: '14px',
              verticalAlign: 'top'
            }}
          />
        )}
        {title}
      </div>
    );
    if (marked) {
      return <Badge dot>{renderTitle()}</Badge>;
    }
    return renderTitle();
  };

  render() {
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    if (visiblePluginList.length < 2) {
      const pane = visiblePluginList[0];
      if (!pane) {
        return <div className="lowcode-right-area"></div>;
      }
      const Comp = this.editor.components[pane.pluginKey];
      return (
        <div className="lowcode-right-area">
          <Comp editor={this.editor} config={pane} {...pane.pluginProps} />
        </div>
      );
    }
    return (
      <div className="lowcode-right-area">
        <Tab
          shape="wrapped"
          className="right-tabs"
          style={{
            height: '100%'
          }}
          activeKey={this.state.activeKey}
          lazyLoad={false}
          onChange={this.handlePluginChange}
        >
          {visiblePluginList.map((item, idx) => {
            const Comp = this.editor.components[item.pluginKey];
            return (
              <Tab.Item
                key={item.pluginKey}
                title={this.renderTabTitle(item)}
                disabled={this.editor.pluginStatus[item.pluginKey].disabled}
              >
                <Comp editor={this.editor} config={item} {...item.pluginProps} />
              </Tab.Item>
            );
          })}
        </Tab>
      </div>
    );
  }
}
