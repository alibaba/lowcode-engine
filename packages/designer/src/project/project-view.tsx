import { Component } from 'react';
import { observer } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { BuiltinSimulatorHostView } from '../builtin-simulator';
import './project.less';

class Loading extends Component {
  render() {
    return (
      <div id="engine-loading-wrapper">
        <img width="154" height="100" src="https://img.alicdn.com/tfs/TB1CmVgayERMeJjy0FcXXc7opXa-308-200.gif" />
      </div>
    );
  }
}

@observer
export class ProjectView extends Component<{ designer: Designer }> {
  componentDidMount() {
    const { designer } = this.props;
    const { project } = designer;

    project.onRendererReady(() => {
      this.forceUpdate();
    });
  }
  render() {
    const { designer } = this.props;
    const { project } = designer;
    const { simulatorProps } = project;
    const Simulator = designer.simulatorComponent || BuiltinSimulatorHostView;

    return (
      <div className="lc-project">
        <div className="lc-simulator-shell">
          {!project?.simulator?.renderer && <Loading />}
          <Simulator {...simulatorProps} />
        </div>
      </div>
    );
  }
}
