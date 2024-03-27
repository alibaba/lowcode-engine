import { Component, ReactElement } from 'react';
import { observer, obx, Title, makeObservable } from '@alilc/lowcode-editor-core';
import { Designer } from '../designer';
import { isDragNodeObject } from '../dragon';
import { isSimulatorHost } from '../../simulator';
import './ghost.less';
import {
  IPublicTypeI18nData,
  IPublicTypeNodeSchema,
  IPublicModelDragObject,
} from '@alilc/lowcode-types';

type offBinding = () => any;

@observer
export default class DragGhost extends Component<{ designer: Designer }> {
  private dispose: offBinding[] = [];

  @obx.ref private titles: (string | IPublicTypeI18nData | ReactElement)[] | null = null;

  @obx.ref private x = 0;

  @obx.ref private y = 0;

  @obx private isAbsoluteLayoutContainer = false;

  private dragon = this.props.designer.dragon;

  constructor(props: any) {
    super(props);
    makeObservable(this);
    this.dispose = [
      this.dragon.onDragstart((e) => {
        if (e.originalEvent.type.slice(0, 4) === 'drag') {
          return;
        }
        this.titles = this.getTitles(e.dragObject!) as any;
        this.x = e.globalX;
        this.y = e.globalY;
      }),
      this.dragon.onDrag((e) => {
        this.x = e.globalX;
        this.y = e.globalY;
        if (isSimulatorHost(e.sensor)) {
          const container = e.sensor.getDropContainer(e);
          if (container?.container.componentMeta.advanced.isAbsoluteLayoutContainer) {
            this.isAbsoluteLayoutContainer = true;
            return;
          }
        }
        this.isAbsoluteLayoutContainer = false;
      }),
      this.dragon.onDragend(() => {
        this.titles = null;
        this.x = 0;
        this.y = 0;
      }),
    ];
  }

  getTitles(dragObject: IPublicModelDragObject) {
    if (isDragNodeObject(dragObject)) {
      return dragObject.nodes.map((node) => node?.title);
    }

    const dataList = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data!];

    return dataList.map(
      (item: IPublicTypeNodeSchema) =>
        this.props.designer.getComponentMeta(item.componentName).title,
    );
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose.forEach((off) => off());
    }
  }

  renderGhostGroup() {
    return this.titles?.map((title, i) => {
      const ghost = (
        <div className="lc-ghost" key={i}>
          <Title title={title} />
        </div>
      );
      return ghost;
    });
  }

  render() {
    if (!this.titles || !this.titles.length) {
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
