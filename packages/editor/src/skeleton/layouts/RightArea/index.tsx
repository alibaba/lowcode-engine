import React, { PureComponent } from 'react';
import { Tab, Badge, Icon } from '@alifd/next';
import './index.scss';
import Editor from '../../../framework/editor';
import AreaManager from '../../../framework/areaManager';
import { PluginConfig } from '../../../framework/definitions';
import { isEmpty } from '../../../framework/utils';

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
    const visiblePluginList = this.areaManager.getVisiblePluginList('TabPanel');
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
        className={`right-plugin-title ${active ? 'active' : ''} ${locked ? 'locked' : ''} ${
          disabled ? 'disabled' : ''
        }`}
      >
        {!!icon && (
          <Icon
            size="xs"
            type={icon}
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

  renderTabPanels = (list: PluginConfig[], height: string): void => {
    if (isEmpty(list)) {
      return null;
    }
    return (
      <Tab
        className="right-tabs"
        style={{
          height
        }}
        activeKey={this.state.activeKey}
        lazyLoad={false}
        onChange={this.handlePluginChange}
      >
        {list.map((item, idx) => {
          const Comp = this.editor.components[item.pluginKey];
          return (
            <Tab.Item
              key={item.pluginKey}
              title={this.renderTabTitle(item)}
              disabled={this.editor.pluginStatus[item.pluginKey].disabled}
              style={{
                width: `${100/list.length}%`
              }}
            >
              <Comp editor={this.editor} config={item} {...item.pluginProps} />
            </Tab.Item>
          );
        })}
      </Tab>
    );
  }

  renderPanels = (list: PluginConfig[], height: string): void => {
    return list.map((item) => {
      const Comp = this.editor.components[item.pluginKey];
      return (
        <div className="right-panel" style={{height}} key={item.pluginKey}>
          <Comp editor={this.editor} config={item} {...item.pluginProps} />
        </div>
      );
    });
  }

  render() {
    const tabList = this.areaManager.getVisiblePluginList('TabPanel');
    const panelList = this.areaManager.getVisiblePluginList('Panel');
    if (isEmpty(panelList) && isEmpty(tabList)) {
      return null;
    } else if (tabList.length === 1) {
      panelList.unshift(tabList[0]);
      tabList.splice(0, 1);
    }
    const height = `${Math.floor(100 / (panelList.length + (tabList.length > 0 ? 1 : 0)))}%`;
    return (
      <div className="lowcode-right-area">
        {this.renderTabPanels(tabList, height)}
        {this.renderPanels(panelList, height)}
      </div>
    );
  }
}
