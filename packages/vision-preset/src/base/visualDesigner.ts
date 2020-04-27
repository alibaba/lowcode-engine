import { assign, find, get } from 'lodash';
import { Component } from 'react';

import bus from '../bus';
import {
  BaseManager,
  connectGeneralManager,
  connectGeneralManagerList,
  IEmitter,
  IEventNameMap,
  IManagerController,
  INameable,
  IObservable,
} from './base';
import VisualManager from './visualManager';

interface IDesignerProps {
  name?: string;
  visualManagers?: VisualManager[];
  emitter?: IEmitter;
}

export default class VisualDesigner extends Component implements IManagerController, IObservable, INameable {
  static NAME = 'VisualDesigner';
  static EVENTS: IEventNameMap = {};
  props: IDesignerProps = {};
  defaultProps: IDesignerProps = {
    name: 'defaultDesigner',
    visualManagers: [],
  };

  private visualManagerList: VisualManager[] = [];
  private name = '';
  private id = '';
  private emitter: IEmitter;

  constructor(props: IDesignerProps) {
    super(props);
    this.setName(props.name || get(this, 'constructor', 'NAME'));
    this.connectManagerList(this.props.visualManagers as any);

    if (props.emitter) {
      // 使用自定义的满足 EventEmitter 接口要求的自定义事件对象
      this.emitter = props.emitter;
    } else {
      this.emitter = bus;
    }
  }

  getId(): string {
    return this.id;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  getName() {
    return this.name;
  }

  getManager(): VisualManager {
    return this.visualManagerList[0];
  }

  getManagerByName(name?: string): VisualManager[] {
    return this.visualManagerList.filter((m) => m.getName() === name);
  }

  getManagerById(id: string): VisualManager {
    return find(this.visualManagerList, (m) => m.getId() === id) as VisualManager;
  }

  getManagerList(): VisualManager[] {
    return this.visualManagerList;
  }

  connectManager(manager: VisualManager) {
    connectGeneralManager.call(this, manager, this.visualManagerList);
    return this;
  }

  connectManagerList(managerList: VisualManager[]): this {
    this.visualManagerList = connectGeneralManagerList.call(this, managerList, this.visualManagerList);
    return this;
  }

  getEventMap() {
    /**
     * Hack for get current constructor
     * because if we write this.constructor.EVENTS
     * ts compiler will show compiled error
     */
    return get(this, 'constructor', BaseManager.EVENTS);
  }

  notifyAllManagers(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.visualManagerList.map((m) => m.emit(eventName, eventData)).every((r) => r);
  }

  on(eventName: string | symbol, callback: () => any) {
    this.emitter.on(eventName, callback);
    return () => this.emitter.removeListener(eventName, callback);
  }

  emit(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.emitter.emit.call(this.emitter, eventName, ...eventData);
  }
}
