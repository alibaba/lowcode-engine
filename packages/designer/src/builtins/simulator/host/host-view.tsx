import { Component, createContext } from 'react';
import { observer } from '@recore/core-obx';
// import { AuxiliaryView } from '../auxilary';
import { SimulatorHost, SimulatorProps } from './host';
import DocumentModel from '../../../designer/document/document-model';
import './host.less';

/*
  Simulator 模拟器，可替换部件，有协议约束, 包含画布的容器，使用场景：当 Canvas 大小变化时，用来居中处理 或 定位 Canvas
  Canvas(DeviceShell) 设备壳层，通过背景图片来模拟，通过设备预设样式改变宽度、高度及定位 CanvasViewport
  CanvasViewport 页面编排场景中宽高不可溢出 Canvas 区
  Content(Shell) 内容外层，宽高紧贴 CanvasViewport，禁用边框，禁用 margin
  ContentFrame 可设置宽高，在页面场景一般只设置框，高度拉伸贴合 Content
  Auxiliary 辅助显示层，初始相对 Content 位置 0,0，紧贴 Canvas, 根据 Content 滚动位置，改变相对位置
*/

export const SimulatorContext = createContext<SimulatorHost>({} as any);

export class SimulatorHostView extends Component<SimulatorProps & {
  documentContext: DocumentModel;
  onMount?: (host: SimulatorHost) => void;
}> {
  readonly host: SimulatorHost;
  constructor(props: any) {
    super(props);
    const { documentContext } = this.props;
    this.host = (documentContext.simulator as SimulatorHost) || new SimulatorHost(documentContext);
    this.host.setProps(this.props);
  }
  shouldComponentUpdate(nextProps: SimulatorProps) {
    this.host.setProps(nextProps);
    return false;
  }
  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.host);
    }
  }
  render() {
    const { Provider } = SimulatorContext;
    return (
      <div className="lc-simulator">
        <Provider value={this.host}>
          {/*progressing.visible ? <PreLoaderView /> : null*/}
          <Canvas />
        </Provider>
      </div>
    );
  }
}

@observer
class Canvas extends Component {
  static contextType = SimulatorContext;
  render() {
    const sim = this.context as SimulatorHost;
    let className = 'lc-simulator-canvas';
    if (sim.deviceClassName) {
      className += ` ${sim.deviceClassName}`;
    } else if (sim.device) {
      className += ` lc-simulator-device-${sim.device}`;
    }

    return (
      <div className={className}>
        <div ref={elmt => sim.mountViewport(elmt)} className="lc-simulator-canvas-viewport">
          {/*<AuxiliaryView />*/}
          <Content />
        </div>
      </div>
    );
  }
}

@observer
class Content extends Component {
  static contextType = SimulatorContext;
  render() {
    const sim = this.context as SimulatorHost;
    const viewport = sim.viewport;
    let frameStyle = {};
    if (viewport.scale < 1) {
      frameStyle = {
        transform: `scale(${viewport.scale})`,
        height: viewport.contentHeight,
        width: viewport.contentWidth,
      };
    }

    return (
      <div className="lc-simulator-content">
        <iframe className="lc-simulator-content-frame" style={frameStyle} ref={frame => sim.mountContentFrame(frame)} />
      </div>
    );
  }
}
