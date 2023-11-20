import { Component } from 'react';
import { TipContainer, engineConfig, observer } from '@alilc/lowcode-editor-core';
import classNames from 'classnames';
import { ISkeleton } from '../skeleton';
import TopArea from './top-area';
import LeftArea from './left-area';
import LeftFixedPane from './left-fixed-pane';
import LeftFloatPane from './left-float-pane';
import Toolbar from './toolbar';
import MainArea from './main-area';
import BottomArea from './bottom-area';
import RightArea from './right-area';
import './workbench.less';
import { SkeletonContext } from '../context';
import { EditorConfig, PluginClassSet } from '@alilc/lowcode-types';

@observer
export class Workbench extends Component<{
  skeleton: ISkeleton;
  config?: EditorConfig;
  components?: PluginClassSet;
  className?: string;
  topAreaItemClassName?: string;
}> {
  constructor(props: any) {
    super(props);
    const { config, components, skeleton } = this.props;
    skeleton.buildFromConfig(config, components);
  }

  renderMainArea = () => {
    const {
      skeleton,
    } = this.props;

    return (
      <>
        <Toolbar area={skeleton.toolbar} />
        <MainArea area={skeleton.mainArea} />
      </>
    );
  };

  renderTopArea = () => {
    const {
      skeleton,
      topAreaItemClassName,
    } = this.props;

    return <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName} />;
  };

  renderLeftArea = () => {
    const {
      skeleton,
    } = this.props;
    return (
      <>
        <LeftArea area={skeleton.leftArea} />
        <LeftFloatPane area={skeleton.leftFloatArea} />
        <LeftFixedPane area={skeleton.leftFixedArea} />
      </>
    );
  };

  renderBottomArea = () => {
    const {
      skeleton,
    } = this.props;

    return <BottomArea area={skeleton.bottomArea} />;
  };

  renderRightArea = () => {
    const {
      skeleton,
    } = this.props;

    return <RightArea area={skeleton.rightArea} />;
  };

  renderWindowLayout = ({
    renderTopArea,
    renderLeftArea,
    renderMainArea,
    renderBottomArea,
    renderRightArea,
  }: any) => {
    return (
      <>
        {renderTopArea()}
        <div className="lc-workbench-body">
          {renderLeftArea()}
          <div className="lc-workbench-center">
            {renderMainArea()}
            {renderBottomArea()}
          </div>
          {renderRightArea()}
        </div>
      </>
    );
  };

  render() {
    const {
      className,
    } = this.props;
    const renderWindowLayout = engineConfig.get('windowCustomWorkbench') ?? this.renderWindowLayout;

    return (
      <div className={classNames('lc-workbench', className)}>
        <SkeletonContext.Provider value={this.props.skeleton}>
          {renderWindowLayout({
            renderTopArea: this.renderTopArea,
            renderLeftArea: this.renderLeftArea,
            renderMainArea: this.renderMainArea,
            renderBottomArea: this.renderBottomArea,
            renderRightArea: this.renderRightArea,
          })}

          <TipContainer />
        </SkeletonContext.Provider>
      </div>
    );
  }
}
