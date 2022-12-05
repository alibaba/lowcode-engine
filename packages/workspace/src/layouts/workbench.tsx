import { Component } from 'react';
import { TipContainer, observer } from '@alilc/lowcode-editor-core';
import { EditorWindowView } from '../editor-window/view';
import classNames from 'classnames';
import { Skeleton } from '../skeleton';
import TopArea from './top-area';
import LeftArea from './left-area';
import LeftFixedPane from './left-fixed-pane';
import LeftFloatPane from './left-float-pane';
// import Toolbar from './toolbar';
import MainArea from './main-area';
import BottomArea from './bottom-area';
// import RightArea from './right-area';
import './workbench.less';
import { SkeletonContext } from '../context';
import { EditorConfig, PluginClassSet } from '@alilc/lowcode-types';
import { WorkSpace } from '..';

@observer
export class Workbench extends Component<{ workSpace: WorkSpace; config?: EditorConfig; components?: PluginClassSet; className?: string; topAreaItemClassName?: string }> {
  constructor(props: any) {
    super(props);
    const { config, components, workSpace } = this.props;
    const { skeleton } = workSpace;
    skeleton.buildFromConfig(config, components);
  }

  // componentDidCatch(error: any) {
  //   globalContext.get(Editor).emit('editor.skeleton.workbench.error', error);
  // }

  render() {
    const { workSpace, className, topAreaItemClassName } = this.props;
    const { skeleton } = workSpace;
    return (
      <div className={classNames('lc-workspace-workbench', className)}>
        <SkeletonContext.Provider value={skeleton}>
          <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName} />
          <div className="lc-workspace-workbench-body">
            <LeftArea area={skeleton.leftArea} />
            <LeftFloatPane area={skeleton.leftFloatArea} />
            <LeftFixedPane area={skeleton.leftFixedArea} />
            <div className="lc-workspace-workbench-center">
              {/* <Toolbar area={skeleton.toolbar} /> */}
              <EditorWindowView editorWindow={workSpace.window} />
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
