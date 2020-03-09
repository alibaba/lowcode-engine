import React, { PureComponent } from 'react';
import LeftPlugin from '../../components/LeftPlugin';
import './index.scss';
import Editor from '../../../framework/editor';
import { PluginConfig } from '../../../framework/definitions';

export interface LeftAreaNavProps {
  editor: Editor;
}

export default class LeftAreaNav extends PureComponent<LeftAreaNavProps> {
  static displayName = 'LowcodeLeftAreaNav';

  private editor: Editor;
  private config: Array<PluginConfig>;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config = (this.editor.config.plugins && this.editor.config.plugins.leftArea) || [];
  }

  handlePluginClick = item => {};

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
    this.config.forEach(item => {
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
