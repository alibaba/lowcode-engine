import React, { PureComponent } from 'react';
import LeftPlugin from '../../components/LeftPlugin';
import './index.scss';
import Editor from '../../../framework/editor';
import { PluginConfig } from '../../../framework/definitions';
import AreaManager from '../../../framework/areaManager';

export interface LeftAreaNavProps {
  editor: Editor;
}

export interface LeftAreaNavState {
  activeKey: string;
}

export default class LeftAreaNav extends PureComponent<LeftAreaNavProps, LeftAreaNavState> {
  static displayName = 'LowcodeLeftAreaNav';

  private editor: Editor;
  private areaManager: AreaManager;
  private cacheActiveKey: string;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'leftArea');

    this.state = {
      activeKey: 'none'
    };
    this.cacheActiveKey = 'none';
  }

  componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('leftNav.change', this.handlePluginChange);
    const visiblePanelPluginList = this.areaManager.getVisiblePluginList().filter(item => item.type === 'IconPanel');
    const defaultKey = (visiblePanelPluginList[0] && visiblePanelPluginList[0].pluginKey) || 'componentAttr';
    this.handlePluginChange(defaultKey);
  }
  componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('leftNav.change', this.handlePluginChange);
  }

  handleSkeletonUpdate = (): void => {
    // 当前区域插件状态改变是更新区域
    if (this.areaManager.isPluginStatusUpdate()) {
      this.forceUpdate();
    }
  };

  handlePluginChange = (key: string): void => {
    const { activeKey } = this.state;
    const plugins = this.editor.plugins;
    const prePlugin = plugins[activeKey];
    const nextPlugin = plugins[key];
    if (activeKey === 'none') {
      if (nextPlugin) {
        nextPlugin.open().then(() => {
          this.updateActiveKey(key);
        });
      }
    } else if (activeKey === key) {
      if (prePlugin) {
        prePlugin.close().then(() => {
          this.updateActiveKey('none');
        });
      }
    } else {
      // 先关后开
      if (prePlugin) {
        prePlugin.close().then(() => {
          if (nextPlugin) {
            nextPlugin.open().then(() => {
              this.updateActiveKey(key);
            });
          }
        });
      }
    }
  };

  handleCollapseClick = (): void => {
    const { activeKey } = this.state;
    if (activeKey === 'none') {
      const plugin = this.editor.plugins[this.cacheActiveKey];
      if (plugin) {
        plugin.open().then(() => {
          this.updateActiveKey(this.cacheActiveKey);
        });
      }
    } else {
      const plugin = this.editor.plugins[activeKey];
      if (plugin) {
        plugin.close().then(() => {
          this.updateActiveKey('none');
        });
      }
    }
  };

  handlePluginClick = (item: PluginConfig): void => {
    if (item.type === 'PanelIcon') {
      this.handlePluginChange(item.pluginKey);
    }
  };

  updateActiveKey = (key: string): void => {
    if (key === 'none') {
      this.cacheActiveKey = this.state.activeKey;
    }
    this.editor.set('leftNav', key);
    this.setState({ activeKey: key });
    this.editor.emit('leftPanel.show', key);
  };

  renderPluginList = (list: Array<PluginConfig> = []): Array<React.ReactElement> => {
    const { activeKey } = this.state;
    return list.map((item, idx) => {
      const pluginStatus = this.editor.pluginStatus[item.pluginKey];
      return (
        <LeftPlugin
          key={item.pluginKey}
          config={item}
          editor={this.editor}
          pluginClass={this.editor.components[item.pluginKey]}
          onClick={() => this.handlePluginClick(item)}
          active={activeKey === item.pluginKey}
          {...pluginStatus}
        />
      );
    });
  };

  render() {
    const { activeKey } = this.state;
    const topList: Array<PluginConfig> = [];
    const bottomList: Array<PluginConfig> = [];
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    visiblePluginList.forEach(item => {
      const align = item.props && item.props.align === 'bottom' ? 'bottom' : 'top';
      if (align === 'bottom') {
        bottomList.push(item);
      } else {
        topList.push(item);
      }
    });

    return (
      <div className="lowcode-left-area-nav">
        <div className="bottom-area">{this.renderPluginList(bottomList)}</div>
        <div className="top-area">
          <LeftPlugin
            editor={this.editor}
            key="collapse"
            config={{
              pluginKey: 'collapse',
              type: 'Icon',
              props: {
                icon: activeKey === 'none' ? 'zhankaizhuangtai' : 'shouqizhuangtai',
                title: activeKey === 'none' ? '展开' : '收起'
              }
            }}
            onClick={this.handleCollapseClick}
          />
          {this.renderPluginList(topList)}
        </div>
      </div>
    );
  }
}
