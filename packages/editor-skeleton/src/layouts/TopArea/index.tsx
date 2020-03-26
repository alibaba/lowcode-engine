import React, { PureComponent } from 'react';
import { Grid } from '@alifd/next';
import Editor, { AreaManager } from '@ali/lowcode-editor-core';
import { PluginConfig } from '@ali/lowcode-editor-core/lib/definitions';
import TopPlugin from '../../components/TopPlugin';
import './index.scss';

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

  componentDidMount(): void {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
  }

  componentWillUnmount(): void {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
  }

  handleSkeletonUpdate = (): void => {
    // 当前区域插件状态改变是更新区域
    if (this.areaManager.isPluginStatusUpdate()) {
      this.forceUpdate();
    }
  };

  renderPluginList = (list: PluginConfig[] = []): React.ReactElement[] => {
    return list.map(
      (item, idx): React.ReactElement => {
        const isDivider = item.type === 'Divider';
        const PluginClass = this.areaManager.getPluginClass(item.pluginKey);
        return (
          <Col
            className={isDivider ? 'divider' : ''}
            key={isDivider ? idx : item.pluginKey}
            style={{
              width: (item.props && item.props.width) || 36,
              flex: 'none',
            }}
          >
            {!isDivider && (
              <TopPlugin
                config={item}
                pluginClass={PluginClass}
                editor={this.editor}
              />
            )}
          </Col>
        );
      },
    );
  };

  render(): React.ReactNode {
    const leftList: PluginConfig[] = [];
    const rightList: PluginConfig[] = [];
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    visiblePluginList.forEach((item): void => {
      const align =
        item.props && item.props.align === 'right' ? 'right' : 'left';
      // 分隔符不允许相邻
      if (item.type === 'Divider') {
        const currList = align === 'right' ? rightList : leftList;
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
