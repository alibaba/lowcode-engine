import { Component } from 'react';
import { obx } from '@recore/obx';
import { observer } from '@recore/core-obx';
import Designer from '../../designer/designer';
import './ghost.less';
import { NodeSchema } from '../../designer/schema';
import Node from '../../designer/document/node/node';
import { isDragNodeObject, DragObject, isDragNodeDataObject } from '../../designer/helper/dragon';

type offBinding = () => any;

@observer
export default class Ghost extends Component<{ designer: Designer }> {
  private dispose: offBinding[] = [];
  @obx.ref private dragObject: DragObject | null = null;
  @obx.ref private x = 0;
  @obx.ref private y = 0;
  private dragon = this.props.designer.dragon;

  constructor(props: any) {
    super(props);
    this.dispose = [
       this.dragon.onDragstart((e) => {
        this.dragObject = e.dragObject;
        this.x = e.globalX;
        this.y = e.globalY;
      }),
      this.dragon.onDrag(e => {
        this.x = e.globalX;
        this.y = e.globalY;
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
    const dragObject = this.dragObject;
    if (isDragNodeObject(dragObject)) {
      return dragObject.nodes.map((node) => {
        const ghost = (
          <div className="lc-ghost" key={node.id}>
            <div className="lc-ghost-title">{node.title}</div>
          </div>
        );
        return ghost;
      });
    } else if (isDragNodeDataObject(dragObject)) {
      return Array.isArray(dragObject.data) ? dragObject.data.map((item, index) => {
        return (
          <div className="lc-ghost" key={`ghost-${index}`}>
            <div className="lc-ghost-title">{item.componentName}</div>
          </div>
        )
      }) : (
        <div className="lc-ghost">
          <div className="lc-ghost-title">{dragObject.data.componentName}</div>
        </div>
      )
    }
  }

  render() {
    if (!this.dragObject) {
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
