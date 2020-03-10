import React, { PureComponent } from 'react';
import { Grid } from '@alifd/next';
import TopPlugin from '../../components/TopPlugin';
import './index.scss';
import Editor from '../../../framework/index';
import { PluginConfig } from '../../../framework/definitions';
import AreaManager from '../../../framework/areaManager';

const { Row, Col } = Grid;

export interface TopAreaProps {
  editor: Editor;
}

export default class TopArea extends PureComponent<TopAreaProps> {
  static displayName = 'LowcodeTopArea';

  private areaManager: AreaManager;
  private editor: Editor;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(props.editor, 'topArea');
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

  renderPluginList = (list: Array<PluginConfig> = []): Array<React.ReactElement> => {
    return list.map((item, idx) => {
      const isDivider = item.type === 'Divider';
      return (
        <Col
          className={isDivider ? 'divider' : ''}
          key={isDivider ? idx : item.pluginKey}
          style={{
            width: (item.props && item.props.width) || 40,
            flex: 'none'
          }}
        >
          {!isDivider && (
            <TopPlugin config={item} pluginClass={this.editor.components[item.pluginKey]} editor={this.editor} />
          )}
        </Col>
      );
    });
  };

  render() {
    const leftList: Array<PluginConfig> = [];
    const rightList: Array<PluginConfig> = [];
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    visiblePluginList.forEach(item => {
      const align = item.props && item.props.align === 'right' ? 'right' : 'left';
      // 分隔符不允许相邻
      if (item.type === 'Divider') {
        const currList = align === 'right' ? rightList : leftList;
        if (currList.length === 0 || currList[currList.length - 1].type === 'Divider') return;
      }
      if (align === 'right') {
        rightList.push(item);
      } else {
        leftList.push(item);
      }
    });
    return (
      <div className="lowcode-top-area">
        <div className="left-area">
          <Row>{this.renderPluginList(leftList)}</Row>
        </div>
        <div className="right-area">
          <Row justify="end">{this.renderPluginList(rightList)}</Row>
        </div>
      </div>
    );
  }
}
