import React, { PureComponent } from 'react';
import Editor, { AreaManager } from '@ali/lowcode-editor-framework';
import './index.scss';

export interface CenterAreaProps {
  editor: Editor;
}

export default class CenterArea extends PureComponent<CenterAreaProps> {
  static displayName = 'LowcodeCenterArea';

  private editor: Editor;

  private areaManager: AreaManager;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.areaManager = new AreaManager(this.editor, 'centerArea');
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

  render(): React.ReactNode {
    const visiblePluginList = this.areaManager.getVisiblePluginList();
    return (
      <div className="lowcode-center-area">
        {visiblePluginList.map(
          (item): React.ReactNode => {
            const Comp = this.areaManager.getPluginClass(item.pluginKey);
            if (Comp) {
              return (
                <Comp
                  key={item.pluginKey}
                  editor={this.editor}
                  config={item}
                  {...item.pluginProps}
                />
              );
            }
            return null;
          },
        )}
      </div>
    );
  }
}
