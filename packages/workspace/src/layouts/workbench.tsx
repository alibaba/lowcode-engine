import React, { Component } from 'react';
import { TipContainer, engineConfig, observer } from '@alilc/lowcode-editor-core';
import { WindowView } from '../view/window-view';
import classNames from 'classnames';
import { SkeletonContext } from '../skeleton-context';
import { EditorConfig, PluginClassSet } from '@alilc/lowcode-types';
import { Workspace } from '../workspace';
import { BottomArea, LeftArea, LeftFixedPane, LeftFloatPane, MainArea, SubTopArea, TopArea } from '@alilc/lowcode-editor-skeleton';

@observer
export class Workbench extends Component<{
  workspace: Workspace;
  config?: EditorConfig;
  components?: PluginClassSet;
  className?: string;
  topAreaItemClassName?: string;
}, {
  workspaceEmptyComponent: any;
  theme?: string;
}> {
  constructor(props: any) {
    super(props);
    const { config, components, workspace } = this.props;
    const { skeleton } = workspace;
    skeleton.buildFromConfig(config, components);
    engineConfig.onGot('theme', (theme) => {
      this.setState({
        theme,
      });
    });
    engineConfig.onGot('workspaceEmptyComponent', (workspaceEmptyComponent) => {
      this.setState({
        workspaceEmptyComponent,
      });
    });
    this.state = {
      workspaceEmptyComponent: engineConfig.get('workspaceEmptyComponent'),
      theme: engineConfig.get('theme'),
    };
  }

  renderMainArea = () => {
    const { workspace, topAreaItemClassName } = this.props;
    const { skeleton } = workspace;
    const { workspaceEmptyComponent: WorkspaceEmptyComponent } = this.state;

    return (
      <>
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

            {
              !workspace.windows.length && WorkspaceEmptyComponent ? <WorkspaceEmptyComponent /> : null
            }
          </div>
        </div>
        <MainArea area={skeleton.mainArea} />
      </>
    );
  };

  renderTopArea = () => {
    const { workspace, topAreaItemClassName } = this.props;
    const { skeleton } = workspace;

    return <TopArea className="lc-workspace-top-area" area={skeleton.topArea} itemClassName={topAreaItemClassName} />;
  };

  renderLeftArea = () => {
    const { workspace } = this.props;
    const { skeleton } = workspace;

    return (
      <>
        <LeftArea className="lc-workspace-left-area lc-left-area" area={skeleton.leftArea} />
        <LeftFloatPane area={skeleton.leftFloatArea} />
        <LeftFixedPane area={skeleton.leftFixedArea} />
      </>
    );
  };

  renderBottomArea = () => {
    const { workspace } = this.props;
    const { skeleton } = workspace;
    return <BottomArea area={skeleton.bottomArea} />;
  };

  renderWorkspaceLayout = ({
    renderTopArea,
    renderLeftArea,
    renderMainArea,
    renderBottomArea,
  }: any) => {
    return (
      <>
        {renderTopArea()}
        <div className="lc-workspace-workbench-body">
          {renderLeftArea()}
          <div className="lc-workspace-workbench-center">
            {renderMainArea()}
            {renderBottomArea()}
          </div>
        </div>
      </>
    );
  };

  render() {
    const { workspace, className } = this.props;
    const { skeleton } = workspace;
    const { theme } = this.state;
    const renderWorkspaceLayout = engineConfig.get('workspaceCustomWorkbench') ?? this.renderWorkspaceLayout;

    return (
      <div className={classNames('lc-workspace-workbench', className, theme)}>
        <SkeletonContext.Provider value={skeleton}>
          {renderWorkspaceLayout({
            renderTopArea: this.renderTopArea,
            renderLeftArea: this.renderLeftArea,
            renderMainArea: this.renderMainArea,
            renderBottomArea: this.renderBottomArea,
          })}
          <TipContainer />
        </SkeletonContext.Provider>
      </div>
    );
  }
}
