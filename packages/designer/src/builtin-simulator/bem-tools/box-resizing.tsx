import { Component, Fragment } from 'react';

// import Bus from '../../../../core/bus';
// import DragResizeEngine from '../../../../core/dragResizeEngine';
// import OverlayCore from '../../../../core/overlay';
import { observer, computed, Tip } from '@ali/lowcode-editor-core';
import classNames from 'classnames';
import { SimulatorContext } from '../context';
import { BuiltinSimulatorHost } from '../host';
import { OffsetObserver } from '../../designer';

@observer
export default class BoxResizing extends Component {
  static contextType = SimulatorContext;

  get host(): BuiltinSimulatorHost {
    return this.context;
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

  // componentDidMount() {
  //   // this.hoveringCapture.setBoundary(this.outline);
  //   this.willBind();

  //   const resize = (e: MouseEvent, direction: string, node: any, moveX: number, moveY: number) => {
  //     const proto = node.getPrototype();
  //     if (proto && proto.options && typeof proto.options.onResize === 'function') {
  //       proto.options.onResize(e, direction, node, moveX, moveY);
  //     }
  //   };

  //   const resizeStart = (e: MouseEvent, direction: string, node: any) => {
  //     const proto = node.getPrototype();
  //     if (proto && proto.options && typeof proto.options.onResizeStart === 'function') {
  //       proto.options.onResizeStart(e, direction, node);
  //     }
  //   };

  //   const resizeEnd = (e: MouseEvent, direction: string, node: any) => {
  //     const proto = node.getPrototype();
  //     if (proto && proto.options && typeof proto.options.onResizeEnd === 'function') {
  //       proto.options.onResizeEnd(e, direction, node);
  //     }
  //   };

  //   // DragResizeEngine.onResize(resize);
  //   // DragResizeEngine.onResizeStart(resizeStart);
  //   // DragResizeEngine.onResizeEnd(resizeEnd);
  // }

  // componentDidUpdate() {
  //   this.hoveringCapture.setBoundary(this.outline);
  //   this.willBind();
  // }

  // componentWillUnmount() {
  //   this.hoveringCapture.setBoundary(null);
  //   if (this.willDetach) {
  //     this.willDetach();
  //   }
  //   if (this.willUnbind) {
  //     this.willUnbind();
  //   }
  // }

  // willBind() {
  //   if (this.willUnbind) {
  //     this.willUnbind();
  //   }

  //   if (!this.outlineRight && !this.outlineLeft) {
  //     return;
  //   }

  //   const unBind: any[] = [];
  //   unBind
  //     .push
  //     //   DragResizeEngine.from(this.outlineRight, 'e', () => {
  //     //     if (!this.hoveringLine.hasOutline()) {
  //     //       return null;
  //     //     }
  //     //     return this.hoveringLine.getCurrentNode();
  //     //   }),
  //     ();
  //   unBind
  //     .push
  //     //   DragResizeEngine.from(this.outlineLeft, 'w', () => {
  //     //     if (!this.hoveringLine.hasOutline()) {
  //     //       return null;
  //     //     }
  //     //     return this.hoveringLine.getCurrentNode();
  //     //   }),
  //     ();

  //   this.willUnbind = () => {
  //     if (unBind && unBind.length > 0) {
  //       unBind.forEach((item) => {
  //         item();
  //       });
  //     }
  //     this.willUnbind = null;
  //   };
  // }

  render() {
    const selecting = this.selecting;
    if (!selecting || selecting.length < 1) {
      // DIRTY FIX, recore has a bug!
      return <Fragment />;
    }

    return (
      <Fragment>
        {selecting.map((node) => (
          <BoxResizingForNode key={node.id} node={node} />
        ))}
      </Fragment>
    );
  }

  // render() {
  //   const node = this.selecting;
  //   console.log(selecting, 'selecting');
  //   if (!selecting || selecting.length < 1) {
  //     // DIRTY FIX, recore has a bug!
  //     return <Fragment />;
  //   }
  //   // if (!this.hoveringLine.hasOutline()) {
  //   //   return null;
  //   // }

  //   // const page = node.getPage();
  //   const bounds = 2;
  //   // page.getBounds();
  //   const st = 2;
  //   // page.getScrollTop();
  //   const rect = node.getRect();

  //   if (!rect || !bounds) {
  //     return null;
  //   }

  //   const proto = node.componentMeta;
  //   console.log('proto', proto);
  //   const triggerVisible: any = {
  //     w: true,
  //     e: true,
  //   };
  //   // if (proto && proto.options && typeof proto.options.canResizing === 'boolean') {
  //   //   triggerVisible = {
  //   //     e: proto.options.canResizing,
  //   //     w: proto.options.canResizing,
  //   //     n: proto.options.canResizing,
  //   //     s: proto.options.canResizing,
  //   //   };
  //   // } else if (proto && proto.options && typeof proto.options.canResizing === 'function') {
  //   //   triggerVisible = {
  //   //     e: proto.options.canResizing(node, 'e'),
  //   //     w: proto.options.canResizing(node, 'w'),
  //   //     n: proto.options.canResizing(node, 'n'),
  //   //     s: proto.options.canResizing(node, 's'),
  //   //   };
  //   // }

  //   return (
  //     <Fragment>
  //       {selecting.map((node) => (
  //         <BoxResizingForNode key={node.id} node={node} />
  //       ))}
  //     </Fragment>
  //   );

  //   // return (
  //   //   <div
  //   //     ref={(ref) => {
  //   //       this.outline = ref;
  //   //     }}
  //   //   >
  //   //     {triggerVisible.w && (
  //   //       <div
  //   //         ref={(ref) => {
  //   //           this.outlineLeft = ref;
  //   //         }}
  //   //         className="engine-outline engine-resize-outline"
  //   //         style={{
  //   //           height: rect.height,
  //   //           transform: `translate(${rect.left - bounds.left - 10}px, ${rect.top + st - bounds.top}px)`,
  //   //           width: 20,
  //   //         }}
  //   //       />
  //   //     )}
  //   //     {triggerVisible.e && (
  //   //       <div
  //   //         ref={(ref) => {
  //   //           this.outlineRight = ref;
  //   //         }}
  //   //         className="engine-outline engine-resize-outline"
  //   //         style={{
  //   //           height: rect.height,
  //   //           transform: `translate(${rect.left - bounds.left + rect.width - 10}px, ${rect.top + st - bounds.top}px)`,
  //   //           width: 20,
  //   //         }}
  //   //       />
  //   //     )}
  //   //   </div>
  //   // );
  // }
}

@observer
export class BoxResizingForNode extends Component<{ node: Node }> {
  static contextType = SimulatorContext;

  get host(): BuiltinSimulatorHost {
    return this.context;
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
        {instances.map((instance) => {
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
  componentWillUnmount() {
    this.props.observed.purge();
  }

  render() {
    const { observed, highlight, dragging } = this.props;
    if (!observed.hasOffset) {
      return null;
    }

    const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = observed;
    console.log(offsetHeight, offsetLeft, offsetTop, offsetWidth);
    const triggerVisible = {
      w: true,
      e: true,
    };

    const className = classNames('lc-borders lc-resize-box');

    return (
      <div>
        {triggerVisible.w && (
          <div
            className={className}
            style={{
              height: offsetHeight,
              transform: `translate(${offsetLeft - 10}px, ${offsetTop}px)`,
              width: 20,
            }}
          />
        )}
        {triggerVisible.e && (
          <div
            className={className}
            style={{
              height: offsetHeight,
              transform: `translate(${offsetLeft + offsetWidth - 10}px, ${offsetTop}px)`,
              width: 20,
            }}
          />
        )}
      </div>
    );

    // return (
    //   <div className={className} style={style}>
    //     {!dragging && <Toolbar observed={observed} />}
    //   </div>
    // );
  }
}
