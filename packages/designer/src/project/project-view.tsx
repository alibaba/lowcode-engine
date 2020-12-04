import { Component } from 'react';
import { observer } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { BuiltinSimulatorHostView } from '../builtin-simulator';
import './project.less';

@observer
export class ProjectView extends Component<{ designer: Designer }> {
  render() {
    const { designer } = this.props;
    const project = designer.project;
    const simulatorProps = project.simulatorProps;
    const Simulator = designer.simulatorComponent || BuiltinSimulatorHostView;

    return (
      <div className="lc-project">
        <div className="lc-simulator-shell">
          <Simulator {...simulatorProps} />
        </div>
      </div>
    );
  }
}
