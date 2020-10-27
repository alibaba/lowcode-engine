import { Component } from 'react';
import { observer, obx, Title } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { DragObject, isDragNodeObject, isDragNodeDataObject } from '../dragon';
import { isSimulatorHost } from '../../simulator';
import './ghost.less';

type offBinding = () => any;

@observer
export default class DragGhost extends Component<{ designer: Designer }> {
  private dispose: offBinding[] = [];

  @obx.ref private dragObject: DragObject | null = null;

  @obx.ref private x = 0;

  @obx.ref private y = 0;

  @obx private isAbsoluteLayoutContainer = false;

  private dragon = this.props.designer.dragon;

  constructor(props: any) {
    super(props);
    this.dispose = [
      this.dragon.onDragstart(e => {
        if (e.originalEvent.type.substr(0, 4) === 'drag') {
          return;
        }
        this.dragObject = e.dragObject;
        this.x = e.globalX;
        this.y = e.globalY;
      }),
      this.dragon.onDrag(e => {
        this.x = e.globalX;
        this.y = e.globalY;
        if (isSimulatorHost(e.sensor)) {
          const container = e.sensor.getDropContainer(e);
          if (container.container.componentMeta.getMetadata().experimental?.isAbsoluteLayoutContainer) {
            this.isAbsoluteLayoutContainer = true;
            return;
          }
        }
        this.isAbsoluteLayoutContainer = false;
      }),
      this.dragon.onDragend(() => {
        this.dragObject = null;
        this.x = 0;
        this.y = 0;
      }),
    ];
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose.forEach(off => off());
    }
  }

  renderGhostGroup() {
    const { dragObject } = this;
    if (isDragNodeObject(dragObject)) {
      return dragObject.nodes.map(node => {
        const ghost = (
          <div className="lc-ghost" key={node.id}>
            <Title title={node.title} />
          </div>
        );
        return ghost;
      });
    } else if (isDragNodeDataObject(dragObject)) {
      return Array.isArray(dragObject.data) ? (
        dragObject.data.map((item, index) => {
          return (
            <div className="lc-ghost" key={`ghost-${index}`}>
              <div className="lc-ghost-title">{item.componentName}</div>
            </div>
          );
        })
      ) : (
        <div className="lc-ghost">
          <div className="lc-ghost-title">{dragObject.data.componentName}</div>
        </div>
      );
    }
  }

  render() {
    if (!this.dragObject) {
      return null;
    }

    if (this.isAbsoluteLayoutContainer) {
      return null;
    }

    return (
      <div
        className="lc-ghost-group"
        style={{
          left: this.x,
          top: this.y,
        }}
      >
        {this.renderGhostGroup()}
      </div>
    );
  }
}
