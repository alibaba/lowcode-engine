import { Component, Fragment } from 'react';

// import Bus from '../../../../core/bus';
import DragResizeEngine from './dragResizeEngine';
// import OverlayCore from '../../../../core/overlay';
import { observer, computed, Tip } from '@ali/lowcode-editor-core';
import classNames from 'classnames';
import { SimulatorContext } from '../context';
import { BuiltinSimulatorHost } from '../host';
import { OffsetObserver } from '../../designer';

@observer
export default class BoxResizing extends Component<{ host: BuiltinSimulatorHost }> {
  static contextType = SimulatorContext;

  get host(): BuiltinSimulatorHost {
    return this.props.host;
  }

  get dragging(): boolean {
    return this.host.designer.dragon.dragging;
  }

  @computed get selecting() {
    const doc = this.host.document;
    if (doc.suspensed) {
      return null;
    }
    const selection = doc.selection;
    return this.dragging ? selection.getTopNodes() : selection.getNodes();
  }

  private hoveringLine: any;
  private hoveringCapture: any;
  private willDetach: () => any;
  private willUnbind: () => any;
  private handler: any;
  //   private bus: Bus;

  private outline: any;
  private outlineRight: any;
  private outlineLeft: any;

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    // this.hoveringLine = OverlayCore.getHoveringLine();
    // this.hoveringCapture = OverlayCore.getHoveringCapture();
    // this.willDetach = this.hoveringLine.onSync(() => this.forceUpdate());
    // this.bus = new Bus();
  }

  componentDidUpdate() {
    // this.hoveringCapture.setBoundary(this.outline);
    // this.willBind();
  }

  componentWillUnmount() {
    // // this.hoveringCapture.setBoundary(null);
    // if (this.willDetach) {
    //   this.willDetach();
    // }
    // if (this.willUnbind) {
    //   this.willUnbind();
    // }
  }

  render() {
    const selecting = this.selecting;
    if (!selecting || selecting.length < 1) {
      // DIRTY FIX, recore has a bug!
      return <Fragment />;
    }

    // const componentMeta = selecting[0].componentMeta;
    // const metaData = componentMeta.getMetadata();

    return (
      <Fragment>
        {selecting.map((node) => (
          <BoxResizingForNode key={node.id} node={node} host={this.props.host} />
        ))}
      </Fragment>
    );
  }
}

@observer
export class BoxResizingForNode extends Component<{ host: BuiltinSimulatorHost; node: Node }> {
  static contextType = SimulatorContext;

  get host(): BuiltinSimulatorHost {
    return this.props.host;
  }

  get dragging(): boolean {
    return this.host.designer.dragon.dragging;
  }

  @computed get instances() {
    return this.host.getComponentInstances(this.props.node);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { instances } = this;
    const { node } = this.props;
    const designer = this.host.designer;

    if (!instances || instances.length < 1) {
      return null;
    }
    return (
      <Fragment key={node.id}>
        {instances.map((instance: any) => {
          const observed = designer.createOffsetObserver({
            node,
            instance,
          });
          if (!observed) {
            return null;
          }
          return <BoxResizingInstance key={observed.id} dragging={this.dragging} observed={observed} />;
        })}
      </Fragment>
    );
  }
}

@observer
export class BoxResizingInstance extends Component<{
  observed: OffsetObserver;
  highlight?: boolean;
  dragging?: boolean;
}> {
  // private outline: any;
  private willUnbind: () => any;
  private outlineRight: any;
  private outlineLeft: any;

  componentWillUnmount() {
    this.props.observed.purge();
  }

  getExperiMentalFns = (metaData: any) => {
    if (metaData.experimental && metaData.experimental.callbacks) {
      return metaData.experimantal.callbacks;
    }
  };

  componentDidMount() {
    // this.hoveringCapture.setBoundary(this.outline);
    this.willBind();

    const resize = (e: MouseEvent, direction: string, node: any, moveX: number, moveY: number) => {
      const metaData = node.componentMeta.getMetadata();
      if (
        metaData &&
        metaData.experimental &&
        metaData.experimental.callbacks &&
        metaData.experimental.callbacks.onResize === 'funtion'
      ) {
        metaData.experimental.callbacks.onResize(e, direction, node, moveX, moveY);
      }
    };

    const resizeStart = (e: MouseEvent, direction: string, node: any) => {
      const metaData = node.componentMeta.getMetadata();
      if (
        metaData &&
        metaData.experimental &&
        metaData.experimental.callbacks &&
        metaData.experimental.callbacks.onResizeStart === 'funtion'
      ) {
        metaData.experimental.callbacks.onResizeStart(e, direction, node);
      }
    };

    const resizeEnd = (e: MouseEvent, direction: string, node: any) => {
      const metaData = node.componentMeta.getMetadata();
      if (
        metaData &&
        metaData.experimental &&
        metaData.experimental.callbacks &&
        metaData.experimental.callbacks.onResizeEnd === 'funtion'
      ) {
        metaData.experimental.callbacks.onResizeStart(e, direction, node);
      }
    };

    DragResizeEngine.onResize(resize);
    DragResizeEngine.onResizeStart(resizeStart);
    DragResizeEngine.onResizeEnd(resizeEnd);
  }

  willBind() {
    if (this.willUnbind) {
      this.willUnbind();
    }

    if (!this.outlineRight && !this.outlineLeft) {
      return;
    }

    const unBind: any[] = [];

    unBind.push(
      DragResizeEngine.from(this.outlineRight, 'e', () => {
        // if (!this.hoveringLine.hasOutline()) {
        //   return null;
        // }
        // return this.hoveringLine.getCurrentNode();
        return this.props.observed.node;
      }),
    );
    unBind.push(
      DragResizeEngine.from(this.outlineLeft, 'w', () => {
        return this.props.observed.node;
        // if (!this.hoveringLine.hasOutline()) {
        //   return null;
        // }
        // return this.hoveringLine.getCurrentNode();
      }),
    );

    this.willUnbind = () => {
      if (unBind && unBind.length > 0) {
        unBind.forEach((item) => {
          item();
        });
      }
      this.willUnbind = () => {};
    };
  }

  render() {
    const { observed, highlight, dragging } = this.props;
    if (!observed.hasOffset) {
      return null;
    }

    const { node, offsetWidth, offsetHeight, offsetTop, offsetLeft } = observed;
    let triggerVisible: any = [];
    const metaData = node.componentMeta.getMetadata();
    if (metaData && metaData.experimental && metaData.experimental.getResizingHandlers) {
      triggerVisible = metaData.experimental.getResizingHandlers(node);
    }

    const className = classNames('lc-borders lc-resize-box');

    return (
      <div>
        {triggerVisible.includes('w') && (
          <div
            ref={(ref) => {
              this.outlineLeft = ref;
            }}
            className={className}
            style={{
              height: offsetHeight,
              transform: `translate(${offsetLeft - 10}px, ${offsetTop}px)`,
              width: 20,
            }}
          />
        )}
        {triggerVisible.includes('e') && (
          <div
            className={className}
            ref={(ref) => {
              this.outlineRight = ref;
            }}
            style={{
              height: offsetHeight,
              transform: `translate(${offsetLeft + offsetWidth - 10}px, ${offsetTop}px)`,
              width: 20,
            }}
          />
        )}
      </div>
    );
  }
}
