import React, { PureComponent } from 'react';
import { Grid } from '@alifd/next';
import TopPlugin from '../../components/TopPlugin';
import './index.scss';

const { Row, Col } = Grid;

export default class TopArea extends PureComponent {
  static displayName = 'lowcodeTopArea';

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config = this.editor.config.plugins && this.editor.config.plugins.topArea;
  }

  componentDidMount() {
  }
  componentWillUnmount() {
  }

  handlePluginStatusChange = () => {};

  renderPluginList = (list = []) => {
    return list.map((item, idx) => {
      const isDivider = item.type === 'Divider';

      return (
        <Col
          className={isDivider ? 'divider' : ''}
          key={isDivider ? idx : item.pluginKey}
          style={{
            width: (item.props && item.props.width) || 40,
            flex: 'none',
          }}
        >
          {!isDivider && (
            <TopPlugin
              config={item}
              pluginClass={this.editor.pluginComponents[item.pluginKey]}
              status={this.editor.pluginStatus[item.pluginKey]}
            />
          )}
        </Col>
      );
    });
  };

  render() {
    if (!this.config) return null;
    const leftList = [];
    const rightList = [];
    this.config.forEach(item => {
      const align =
        item.props && item.props.align === 'right' ? 'right' : 'left';
      // 分隔符不允许相邻
      if (item.type === 'Divider') {
        const currentList = align === 'right' ? rightList : leftList;
        if (
          currList.length === 0 ||
          currList[currList.length - 1].type === 'Divider'
        )
          return;
      }
      if (align === 'right') {
        rightList.push(item);
      } else {
        leftList.push(item);
      }
    });

    return (
      <div className="lowcode-top-area">
        <div className="left-area">{this.renderPluginList(leftList)}</div>
        <div classname="right-area">{this.renderPluginList(rightList)}</div>
      </div>
    );
  }
}
