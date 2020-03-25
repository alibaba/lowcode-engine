import React, { PureComponent } from 'react';
import { Tab, Badge, Icon } from '@alifd/next';
import classNames from 'classnames';
import Editor, { AreaManager, utils } from '@ali/lowcode-editor-framework';
import { PluginConfig } from '@ali/lowcode-editor-framework/lib/definitions';
import './index.scss';

const { isEmpty } = utils;

export interface RightAreaProps {
  editor: Editor;
}

export interface RightAreaState {
  activeKey: string;
}

export default class RightArea extends PureComponent<
  RightAreaProps,
  RightAreaState
> {
  static displayName = 'LowcodeRightArea';

  private editor: Editor;

  private areaManager: AreaManager;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'rightArea');
    this.state = {
      activeKey: '',
    };
  }

  componentDidMount(): void {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('rightNav.change', this.handlePluginChange);
    const visiblePluginList = this.areaManager.getVisiblePluginList('TabPanel');
    const defaultKey =
      (visiblePluginList[0] && visiblePluginList[0].pluginKey) ||
      'componentAttr';
    this.handlePluginChange(defaultKey, true);
  }

  componentWillUnmount(): void {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('rightNav.change', this.handlePluginChange);
  }

  handleSkeletonUpdate = (): void => {
    // 当前区域插件状态改变是更新区域
    if (this.areaManager.isPluginStatusUpdate()) {
      const activeKey = this.state.activeKey;
      const activePluginStatus = this.areaManager.getPluginStatus(activeKey);
      if (activePluginStatus && activePluginStatus.visible) {
        this.forceUpdate();
      } else {
        const currentPlugin = this.areaManager.getPlugin(activeKey);
        if (currentPlugin) {
          currentPlugin.close().then((): void => {
            this.setState(
              {
                activeKey: '',
              },
              (): void => {
                const visiblePluginList = this.areaManager.getVisiblePluginList(
                  'TabPanel',
                );
                const firstPlugin = visiblePluginList && visiblePluginList[0];
                if (firstPlugin) {
                  this.handlePluginChange(firstPlugin.pluginKey);
                }
              },
            );
          });
        }
      }
    }
  };

  handlePluginChange = (key: string, isinit?: boolean): void => {
    const activeKey = this.state.activeKey;
    const currentPlugin = this.areaManager.getPlugin(activeKey);
    const nextPlugin = this.areaManager.getPlugin(key);
    const openPlugin = (): void => {
      if (!nextPlugin) {
        console.error(`plugin ${key} has not regist in the editor`);
        return;
      }
      nextPlugin.open().then((): void => {
        this.editor.set('rightNav', key);
        this.setState({
          activeKey: key,
        });
      });
    };
    if (key === activeKey && !isinit) return;
    if (currentPlugin) {
      currentPlugin.close().then((): void => {
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
        className={classNames('right-plugin-title', {
          active,
          locked,
          disabled,
        })}
      >
        {!!icon && <Icon size="xs" type={icon} />}
        {title}
      </div>
    );
    if (marked) {
      return <Badge dot>{renderTitle()}</Badge>;
    }
    return renderTitle();
  };

  renderTabPanels = (list: PluginConfig[], height: string): React.ReactNode => {
    if (isEmpty(list)) {
      return null;
    }
    return (
      <Tab
        className="right-tabs"
        style={{
          height,
        }}
        activeKey={this.state.activeKey}
        lazyLoad={false}
        onChange={this.handlePluginChange}
      >
        {list.map(
          (item): React.ReactNode => {
            const Comp = this.areaManager.getPluginClass(item.pluginKey);
            if (Comp) {
              return (
                <Tab.Item
                  key={item.pluginKey}
                  title={this.renderTabTitle(item)}
                  disabled={this.editor.pluginStatus[item.pluginKey].disabled}
                  style={{
                    width: `${100 / list.length}%`,
                  }}
                >
                  <Comp
                    editor={this.editor}
                    config={item}
                    {...item.pluginProps}
                  />
                </Tab.Item>
              );
            }
            return null;
          },
        )}
      </Tab>
    );
  };

  renderPanels = (list: PluginConfig[], height: string): React.ReactNode => {
    return list.map(
      (item): React.ReactNode => {
        const Comp = this.areaManager.getPluginClass(item.pluginKey);
        if (Comp) {
          return (
            <div
              className="right-panel"
              style={{ height }}
              key={item.pluginKey}
            >
              <Comp editor={this.editor} config={item} {...item.pluginProps} />
            </div>
          );
        }
        return null;
      },
    );
  };

  render(): React.ReactNode {
    const tabList = this.areaManager.getVisiblePluginList('TabPanel');
    const panelList = this.areaManager.getVisiblePluginList('Panel');
    if (isEmpty(panelList) && isEmpty(tabList)) {
      return null;
    } else if (tabList.length === 1) {
      panelList.unshift(tabList[0]);
      tabList.splice(0, 1);
    }
    const height = `${Math.floor(
      100 / (panelList.length + (tabList.length > 0 ? 1 : 0)),
    )}%`;
    return (
      <div className="lowcode-right-area">
        {this.renderTabPanels(tabList, height)}
        {this.renderPanels(panelList, height)}
      </div>
    );
  }
}
