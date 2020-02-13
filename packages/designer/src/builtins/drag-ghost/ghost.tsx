import { Component } from 'react';
import { observer, obx } from '@ali/recore';
import { dragon } from '../../globals/dragon';

import './ghost.less';
import { OutlineBoardID } from '../builtin-panes/outline-pane/outline-board';
// import { INode } from '../../document/node';

type offBinding = () => any;

@observer
export default class Ghost extends Component {
  private dispose: offBinding[] = [];
  @obx.ref private dragment: any = null;
  @obx.ref private x = 0;
  @obx.ref private y = 0;

  componentWillMount() {
    this.dispose = [
      dragon.onDragstart(e => {
        this.dragment = e.dragTarget;
        this.x = e.clientX;
        this.y = e.clientY;
      }),
      dragon.onDrag(e => {
        this.x = e.clientX;
        this.y = e.clientY;
      }),
      dragon.onDragend(() => {
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

    // let x = this.x;
    // let y = this.y;

    // todo: 考虑多个图标、title、不同 sensor 区域的形态
    if (dragon.activeSensor && dragon.activeSensor.id === OutlineBoardID) {
      // const nodeId = (this.dragment as INode).id;
      // const elt = document.querySelector(`[data-id="${nodeId}"`) as HTMLDivElement;
      //
      // if (elt) {
      //   // do something
      //   // const target = elt.cloneNode(true) as HTMLDivElement;
      //   console.log('>>> target', elt);
      //   elt.classList.remove('hidden');
      //   elt.classList.add('dragging');
      //   elt.style.transform = `translate(${this.x}px, ${this.y}px)`;
      // }
      //
      // return null;
      // x -= 30;
      // y += 30;
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
