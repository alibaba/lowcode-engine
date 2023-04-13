import React, { Component } from 'react';
import { observer } from '@alilc/lowcode-editor-core';
import { BuiltinSimulatorHost, BuiltinSimulatorProps } from './host';
import { BemTools } from './bem-tools';
import { Project } from '../project';
import './host.less';

/*
  Simulator 模拟器，可替换部件，有协议约束，包含画布的容器，使用场景：当 Canvas 大小变化时，用来居中处理 或 定位 Canvas
  Canvas(DeviceShell) 设备壳层，通过背景图片来模拟，通过设备预设样式改变宽度、高度及定位 CanvasViewport
  CanvasViewport 页面编排场景中宽高不可溢出 Canvas 区
  Content(Shell) 内容外层，宽高紧贴 CanvasViewport，禁用边框，禁用 margin
  BemTools 辅助显示层，初始相对 Content 位置 0,0，紧贴 Canvas, 根据 Content 滚动位置，改变相对位置
*/

type SimulatorHostProps = BuiltinSimulatorProps & {
  project: Project;
  onMount?: (host: BuiltinSimulatorHost) => void;
};

export class BuiltinSimulatorHostView extends Component<SimulatorHostProps> {
  readonly host: BuiltinSimulatorHost;

  constructor(props: any) {
    super(props);
    const { project, onMount, designer } = this.props;
    this.host = (project.simulator as BuiltinSimulatorHost) || new BuiltinSimulatorHost(project, designer);
    this.host.setProps(this.props);
    onMount?.(this.host);
  }

  shouldComponentUpdate(nextProps: BuiltinSimulatorProps) {
    this.host.setProps(nextProps);
    return false;
  }

  render() {
    return (
      <div className="lc-simulator">
        {/* progressing.visible ? <PreLoaderView /> : null */}
        <Canvas host={this.host} />
      </div>
    );
  }
}

@observer
class Canvas extends Component<{ host: BuiltinSimulatorHost }> {
  render() {
    const sim = this.props.host;
    let className = 'lc-simulator-canvas';
    const { canvas = {}, viewport = {} } = sim.deviceStyle || {};
    if (sim.deviceClassName) {
      className += ` ${sim.deviceClassName}`;
    } else if (sim.device) {
      className += ` lc-simulator-device-${sim.device}`;
    }

    return (
      <div className={className} style={canvas}>
        <div ref={(elmt) => sim.mountViewport(elmt)} className="lc-simulator-canvas-viewport" style={viewport}>
          <BemTools host={sim} />
          <Content host={sim} />
        </div>
      </div>
    );
  }
}

@observer
class Content extends Component<{ host: BuiltinSimulatorHost }> {
  state = {
    disabledEvents: false,
  };

  private dispose?: () => void;

  componentDidMount() {
    const editor = this.props.host.designer.editor;
    const onEnableEvents = (type: boolean) => {
      this.setState({
        disabledEvents: type,
      });
    };

    editor.eventBus.on('designer.builtinSimulator.disabledEvents', onEnableEvents);

    this.dispose = () => {
      editor.removeListener('designer.builtinSimulator.disabledEvents', onEnableEvents);
    };
  }

  componentWillUnmount() {
    this.dispose?.();
  }

  render() {
    const sim = this.props.host;
    const { disabledEvents } = this.state;
    const { viewport, designer } = sim;
    const frameStyle: any = {
      transform: `scale(${viewport.scale})`,
      height: viewport.contentHeight,
      width: viewport.contentWidth,
    };
    if (disabledEvents) {
      frameStyle.pointerEvents = 'none';
    }

    const { viewName } = designer;

    return (
      <div className="lc-simulator-content">
        <iframe
          name={`${viewName}-SimulatorRenderer`}
          className="lc-simulator-content-frame"
          style={frameStyle}
          ref={(frame) => sim.mountContentFrame(frame)}
        />
      </div>
    );
  }
}
