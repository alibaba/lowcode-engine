import React, { PureComponent } from 'react';
import LeftPlugin from '../../components/LeftPlugin';
import Editor, { utils, AreaManager } from '@ali/lowcode-editor-core';
import { PluginConfig } from '@ali/lowcode-editor-core/lib/definitions';

import './index.scss';

const { isEmpty } = utils;

export interface LeftAreaNavProps {
  editor: Editor;
}

export interface LeftAreaNavState {
  activeKey: string;
}

export default class LeftAreaNav extends PureComponent<
  LeftAreaNavProps,
  LeftAreaNavState
> {
  static displayName = 'LowcodeLeftAreaNav';

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
    this.editor.on('leftNav.change', this.handlePluginChange);
    const visiblePanelPluginList = this.areaManager.getVisiblePluginList(
      'IconPanel',
    );
    const defaultKey =
      (visiblePanelPluginList[0] && visiblePanelPluginList[0].pluginKey) ||
      'componentAttr';
    this.handlePluginChange(defaultKey);
  }

  componentWillUnmount(): void {
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
        nextPlugin.open().then((): void => {
          this.updateActiveKey(key);
        });
      }
    } else if (activeKey === key) {
      if (prePlugin) {
        prePlugin.close().then((): void => {
          this.updateActiveKey('none');
        });
      }
    } else if (prePlugin) {
      // 先关后开
      prePlugin.close().then((): void => {
        if (nextPlugin) {
          nextPlugin.open().then((): void => {
            this.updateActiveKey(key);
          });
        }
      });
    }
  };

  handlePluginClick = (item: PluginConfig): void => {
    if (item.type === 'PanelIcon') {
      this.handlePluginChange(item.pluginKey);
    }
  };

  updateActiveKey = (key: string): void => {
    this.editor.set('leftNav', key);
    this.setState({ activeKey: key });
    this.editor.emit('leftPanel.show', key);
  };

  renderPluginList = (list: PluginConfig[] = []): React.ReactElement[] => {
    const { activeKey } = this.state;
    return list.map(
      (item): React.ReactElement => {
        const pluginStatus = this.areaManager.getPluginStatus(item.pluginKey);
        const pluginClass = this.areaManager.getPluginClass(item.pluginKey);
        return (
          <LeftPlugin
            key={item.pluginKey}
            config={item}
            editor={this.editor}
            pluginClass={pluginClass}
            onClick={(): void => this.handlePluginClick(item)}
            active={activeKey === item.pluginKey}
            {...pluginStatus}
          />
        );
      },
    );
  };

  render(): React.ReactNode {
    const topList: PluginConfig[] = [];
    const bottomList: PluginConfig[] = [];
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    if (isEmpty(visiblePluginList)) {
      return null;
    }
    visiblePluginList.forEach((item): void => {
      const align =
        item.props && item.props.align === 'bottom' ? 'bottom' : 'top';
      if (align === 'bottom') {
        bottomList.push(item);
      } else {
        topList.push(item);
      }
    });

    return (
      <div className="lowcode-left-area-nav">
        <div className="bottom-area">{this.renderPluginList(bottomList)}</div>
        <div className="top-area">{this.renderPluginList(topList)}</div>
      </div>
    );
  }
}
