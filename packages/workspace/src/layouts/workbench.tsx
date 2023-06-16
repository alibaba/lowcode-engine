import { Component } from 'react';
import { TipContainer, observer } from '@alilc/lowcode-editor-core';
import { WindowView } from '../view/window-view';
import classNames from 'classnames';
import TopArea from './top-area';
import LeftArea from './left-area';
import LeftFixedPane from './left-fixed-pane';
import LeftFloatPane from './left-float-pane';
import MainArea from './main-area';
import BottomArea from './bottom-area';
import './workbench.less';
import { SkeletonContext } from '../skeleton-context';
import { EditorConfig, PluginClassSet } from '@alilc/lowcode-types';
import { Workspace } from '../workspace';
import SubTopArea from './sub-top-area';

@observer
export class Workbench extends Component<{
  workspace: Workspace;
  config?: EditorConfig;
  components?: PluginClassSet;
  className?: string;
  topAreaItemClassName?: string;
}> {
  constructor(props: any) {
    super(props);
    const { config, components, workspace } = this.props;
    const { skeleton } = workspace;
    skeleton.buildFromConfig(config, components);
  }

  render() {
    const { workspace, className, topAreaItemClassName } = this.props;
    const { skeleton } = workspace;
    return (
      <div className={classNames('lc-workspace-workbench', className)}>
        <SkeletonContext.Provider value={skeleton}>
          <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName} />
          <div className="lc-workspace-workbench-body">
            <LeftArea area={skeleton.leftArea} />
            <LeftFloatPane area={skeleton.leftFloatArea} />
            <LeftFixedPane area={skeleton.leftFixedArea} />
            <div className="lc-workspace-workbench-center">
              <div className="lc-workspace-workbench-center-content">
                <SubTopArea area={skeleton.subTopArea} itemClassName={topAreaItemClassName} />
                <div className="lc-workspace-workbench-window">
                  {
                    workspace.windows.map(d => (
                      <WindowView
                        active={d.id === workspace.window?.id}
                        window={d}
                        key={d.id}
                      />
                    ))
                  }
                </div>
              </div>
              <MainArea area={skeleton.mainArea} />
              <BottomArea area={skeleton.bottomArea} />
            </div>
            {/* <RightArea area={skeleton.rightArea} /> */}
          </div>
          <TipContainer />
        </SkeletonContext.Provider>
      </div>
    );
  }
}
