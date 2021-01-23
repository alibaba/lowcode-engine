import React, { Component, Fragment } from 'react';
import DragResizeEngine from './drag-resize-engine';
import { observer, computed, globalContext, Editor } from '@ali/lowcode-editor-core';
import classNames from 'classnames';
import { SimulatorContext } from '../context';
import { BuiltinSimulatorHost } from '../host';
import { OffsetObserver, Designer } from '../../designer';
import { Node } from '../../document';

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
    const doc = this.host.currentDocument;
    if (!doc || doc.suspensed) {
      return null;
    }
    const { selection } = doc;
    return this.dragging ? selection.getTopNodes() : selection.getNodes();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate() {
    // this.hoveringCapture.setBoundary(this.outline);
    // this.willBind();
  }

  render() {
    const { selecting } = this;
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
    const { designer } = this.host;

    if (!instances || instances.length < 1 || this.dragging) {
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
          return (
            <BoxResizingInstance key={observed.id} dragging={this.dragging} designer={designer} observed={observed} />
          );
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
  designer?: Designer;
}> {
  // private outline: any;
  private willUnbind: () => any;

  // outline of eight direction
  private outlineN: any;
  private outlineE: any;
  private outlineS: any;
  private outlineW: any;
  private outlineNE: any;
  private outlineNW: any;
  private outlineSE: any;
  private outlineSW: any;

  private dragEngine: DragResizeEngine;

  constructor(props: any) {
    super(props);
    this.dragEngine = new DragResizeEngine(props.designer);
  }

  componentWillUnmount() {
    if (this.willUnbind) {
      this.willUnbind();
    }
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
        typeof metaData.experimental.callbacks.onResize === 'function'
      ) {
        (e as any).trigger = direction;
        (e as any).deltaX = moveX;
        (e as any).deltaY = moveY;
        metaData.experimental.callbacks.onResize(e, node);
      }
    };

    const resizeStart = (e: MouseEvent, direction: string, node: any) => {
      const metaData = node.componentMeta.getMetadata();
      if (
        metaData &&
        metaData.experimental &&
        metaData.experimental.callbacks &&
        typeof metaData.experimental.callbacks.onResizeStart === 'function'
      ) {
        (e as any).trigger = direction;
        metaData.experimental.callbacks.onResizeStart(e, node);
      }
    };

    const resizeEnd = (e: MouseEvent, direction: string, node: any) => {
      const metaData = node.componentMeta.getMetadata();
      if (
        metaData &&
        metaData.experimental &&
        metaData.experimental.callbacks &&
        typeof metaData.experimental.callbacks.onResizeEnd === 'function'
      ) {
        (e as any).trigger = direction;
        metaData.experimental.callbacks.onResizeEnd(e, node);
      }

      const editor = globalContext.get(Editor);
      const npm = node?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        node?.componentMeta?.componentName ||
        '';
      editor?.emit('designer.border.resize', {
        selected,
        layout: node?.parent?.getPropValue('layout') || '',
      });
    };

    this.dragEngine.onResize(resize);
    this.dragEngine.onResizeStart(resizeStart);
    this.dragEngine.onResizeEnd(resizeEnd);
  }

  willBind() {
    if (this.willUnbind) {
      this.willUnbind();
    }

    if (
      !this.outlineN &&
      !this.outlineE &&
      !this.outlineS &&
      !this.outlineW &&
      !this.outlineNE &&
      !this.outlineNW &&
      !this.outlineSE &&
      !this.outlineSW
    ) {
      return;
    }

    const unBind: any[] = [];
    const node = this.props.observed.node;

    unBind.push(
      ...[
        this.dragEngine.from(this.outlineN, 'n', () => node),
        this.dragEngine.from(this.outlineE, 'e', () => node),
        this.dragEngine.from(this.outlineS, 's', () => node),
        this.dragEngine.from(this.outlineW, 'w', () => node),
        this.dragEngine.from(this.outlineNE, 'ne', () => node),
        this.dragEngine.from(this.outlineNW, 'nw', () => node),
        this.dragEngine.from(this.outlineSE, 'se', () => node),
        this.dragEngine.from(this.outlineSW, 'sw', () => node),
      ],
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
    const { observed } = this.props;
    if (!observed.hasOffset) {
      return null;
    }

    const { node, offsetWidth, offsetHeight, offsetTop, offsetLeft } = observed;
    let triggerVisible: any = [];
    const metaData = node.componentMeta.getMetadata();
    if (metaData && metaData.experimental && metaData.experimental.getResizingHandlers) {
      triggerVisible = metaData.experimental.getResizingHandlers(node);
    }

    const baseSideClass = 'lc-borders lc-resize-side';
    const baseCornerClass = 'lc-borders lc-resize-corner';

    return (
      <div>
        {triggerVisible.includes('n') && (
          <div
            ref={(ref) => { this.outlineN = ref; }}
            className={classNames(baseSideClass, 'n')}
            style={{
              height: 20,
              transform: `translate(${offsetLeft}px, ${offsetTop - 10}px)`,
              width: offsetWidth,
            }}
          />
        )}
        {triggerVisible.includes('ne') && (
          <div
            ref={(ref) => { this.outlineNE = ref; }}
            className={classNames(baseCornerClass, 'ne')}
            style={{
              transform: `translate(${offsetLeft + offsetWidth - 5}px, ${offsetTop - 3}px)`,
              cursor: 'nesw-resize',
            }}
          />
        )}
        {triggerVisible.includes('e') && (
          <div
            className={classNames(baseSideClass, 'e')}
            ref={(ref) => { this.outlineE = ref; }}
            style={{
              height: offsetHeight,
              transform: `translate(${offsetLeft + offsetWidth - 10}px, ${offsetTop}px)`,
              width: 20,
            }}
          />
        )}
        {triggerVisible.includes('se') && (
          <div
            ref={(ref) => { this.outlineSE = ref; }}
            className={classNames(baseCornerClass, 'se')}
            style={{
              transform: `translate(${offsetLeft + offsetWidth - 5}px, ${offsetTop + offsetHeight - 5}px)`,
              cursor: 'nwse-resize',
            }}
          />
        )}
        {triggerVisible.includes('s') && (
          <div
            ref={(ref) => { this.outlineS = ref; }}
            className={classNames(baseSideClass, 's')}
            style={{
              height: 20,
              transform: `translate(${offsetLeft}px, ${offsetTop + offsetHeight - 10}px)`,
              width: offsetWidth,
            }}
          />
        )}
        {triggerVisible.includes('sw') && (
          <div
            ref={(ref) => { this.outlineSW = ref; }}
            className={classNames(baseCornerClass, 'sw')}
            style={{
              transform: `translate(${offsetLeft - 3}px, ${offsetTop + offsetHeight - 5}px)`,
              cursor: 'nesw-resize',
            }}
          />
        )}
        {triggerVisible.includes('w') && (
          <div
            ref={(ref) => { this.outlineW = ref; }}
            className={classNames(baseSideClass, 'w')}
            style={{
              height: offsetHeight,
              transform: `translate(${offsetLeft - 10}px, ${offsetTop}px)`,
              width: 20,
            }}
          />
        )}
        {triggerVisible.includes('nw') && (
          <div
            ref={(ref) => { this.outlineNW = ref; }}
            className={classNames(baseCornerClass, 'nw')}
            style={{
              transform: `translate(${offsetLeft - 3}px, ${offsetTop - 3}px)`,
              cursor: 'nwse-resize',
            }}
          />
        )}
      </div>
    );
  }
}
