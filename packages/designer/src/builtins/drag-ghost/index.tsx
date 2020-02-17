import { Component } from 'react';
import { obx } from '@recore/obx';
import { observer } from '@recore/core-obx';
import Designer from '../../designer/designer';
import './ghost.less';

type offBinding = () => any;

@observer
export default class Ghost extends Component<{ designer: Designer }> {
  private dispose: offBinding[] = [];
  @obx.ref private dragment: any = null;
  @obx.ref private x = 0;
  @obx.ref private y = 0;
  private dragon = this.props.designer.dragon;

  componentWillMount() {
    this.dispose = [
       this.dragon.onDragstart((e) => {
        this.dragment = e.dragObject;
        this.x = e.globalX;
        this.y = e.globalY;
      }),
      this.dragon.onDrag(e => {
        this.x = e.globalX;
        this.y = e.globalY;
      }),
      this.dragon.onDragend(() => {
        this.dragment = null;
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
    const dragment = this.dragment;
    if (Array.isArray(dragment)) {
      return dragment.map((node: any, index: number) => {
        const ghost = (
          <div className="my-ghost" key={`ghost-${index}`}>
            <div className="my-ghost-title">{node.tagName}</div>
          </div>
        );
        return ghost;
      });
    } else {
      return (
        <div className="my-ghost">
          <div className="my-ghost-title">{dragment.tagName}</div>
        </div>
      );
    }
  }

  render() {
    if (!this.dragment) {
      return null;
    }

    return (
      <div
        className="my-ghost-group"
        style={{
          transform: `translate(${this.x}px, ${this.y}px)`,
        }}
      >
        {this.renderGhostGroup()}
      </div>
    );
  }
}
