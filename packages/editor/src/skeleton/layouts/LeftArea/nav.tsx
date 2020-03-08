import React, { PureComponent } from 'react';
import LeftPlugin from '../../components/LeftPlugin';
import './index.scss';

export default class LeftAreaPanel extends PureComponent {
  static displayName = 'lowcodeLeftAreaNav';

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config =
      this.editor.config.plugins && this.editor.config.plugins.leftArea;
  }

  handlePluginClick = item => {};

  renderPluginList = (list = []) => {
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
    const topList = [];
    const bottomList = [];
    this.config.forEach(item => {
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
