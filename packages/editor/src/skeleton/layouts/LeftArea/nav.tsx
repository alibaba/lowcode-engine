import React, { PureComponent } from 'react';
import LeftPlugin from '../../components/LeftPlugin';
import './index.scss';
import Editor from '../../../framework/editor';
import { PluginConfig } from '../../../framework/definitions';
import AreaManager from '../../../framework/areaManager';

export interface LeftAreaNavProps {
  editor: Editor;
}

export default class LeftAreaNav extends PureComponent<LeftAreaNavProps> {
  static displayName = 'LowcodeLeftAreaNav';

  private editor: Editor;
  private areaManager: AreaManager;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'leftArea');
  }

  componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
  }
  componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
  }

  handleSkeletonUpdate = (): void => {
    // 当前区域插件状态改变是更新区域
    if (this.areaManager.isPluginStatusUpdate()) {
      this.forceUpdate();
    }
  };

  handlePluginClick = (item: PluginConfig): void => {};

  renderPluginList = (list: Array<PluginConfig> = []): Array<React.ReactElement> => {
    return list.map((item, idx) => {
      return (
        <LeftPlugin
          key={item.pluginKey}
          config={item}
          editor={this.editor}
          pluginClass={this.editor.components[item.pluginKey]}
          onClick={() => this.handlePluginClick(item)}
        />
      );
    });
  };

  render() {
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
        <div className="top-area">{this.renderPluginList(topList)}</div>
      </div>
    );
  }
}
