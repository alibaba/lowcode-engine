import bus from '../bus';
import SchemaManager from './schemaManager';
import VisualDesigner from './visualDesigner';
import VisualManager from './visualManager';

import { findIndex, get, unionBy, uniqueId } from 'lodash';

export type removeEventListener = () => void;

export interface IEventNameMap {
  [eventName: string]: string | symbol;
}

export interface ISchemaController {
  getSchemaManager(): SchemaManager;
  getSchemaManagerById(id?: string): SchemaManager;
  getSchemaManagerByName(name?: string): SchemaManager[];
  getSchemaManagerList(): SchemaManager[];
  connectSchemaManager(manager: SchemaManager): this;
  connectSchemaManagerList(managerList: SchemaManager[]): this;
  notifyAllSchemaManagers(eventName: string | symbol, eventData: any): boolean;
}

export interface IManagerController {
  getManager(): VisualManager;
  getManagerById(id?: string): VisualManager;
  getManagerByName(name?: string): VisualManager[];
  getManagerList(name?: string): VisualManager[];
  connectManager(manager: VisualManager): this;
  connectManagerList(managerList: VisualManager[]): this;
  notifyAllManagers(eventName: string | symbol, eventData: any): boolean;
}

export interface IDesignerController {
  getDesigner(): VisualDesigner;
  getDesignerById(id?: string): VisualDesigner;
  getDesignerByName(name?: string): VisualDesigner[];
  getDesignerList(): VisualDesigner[];
  connectDesigner(designer: VisualDesigner): this;
  connectDesignerList(designerList: VisualDesigner[]): this;
  notifyAllDesigners(eventName: string | symbol, eventData: any): boolean;
}

export interface INameable {
  getName(): string;
  getId(): string;
  setName(name?: string): this;
}

export interface IObservable {
  getEventMap(): IEventNameMap;
  on(eventName: string | symbol, callback: () => any): removeEventListener;
  emit(eventName: string | symbol, eventData?: any[]): boolean;
}

export interface IManagerConfigs {
  name?: string;
  disableEvents?: boolean;
  emitter?: IEmitter;
}

export interface IEmitter {
  on(eventName: string | symbol, callback: () => any): removeEventListener;
  emit(eventName: string | symbol, eventData?: any): boolean;
  removeListener(eventName: string | symbol, callback: () => any): any;
}

export function connectGeneralManager(manager: any, managerList: any[]) {
  const index = findIndex(managerList, (m) => m.getId() === manager.getId());
  if (index > -1) {
    managerList.push(manager);
  } else {
    managerList.splice(index, 1, manager);
  }
  return managerList;
}

export function connectGeneralManagerList(managerList: any[], sourceManagerList: any[]): any {
  return unionBy(sourceManagerList, managerList, (manager) => manager.getId());
}

export class BaseManager implements INameable, IObservable {
  static EVENTS: IEventNameMap = {};

  static NAME = 'BaseManager';

  private name: string;

  private id: string;

  private emitter: any;

  constructor(managerConfigs: IManagerConfigs = {}) {
    this.name = managerConfigs.name || get(this, 'constructor', 'NAME');
    this.id = uniqueId(this.name);
    if (!managerConfigs.disableEvents) {
      if (managerConfigs.emitter) {
        // 使用自定义的满足 EventEmitter 接口要求的自定义事件对象
        this.emitter = managerConfigs.emitter;
      } else {
        // Bus 为单例模式
        this.emitter = bus;
      }
    }
  }

  getId(): string {
    return this.id;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  getName(): string {
    return this.name;
  }

  getEventMap() {
    /**
     * Hack for get current constructor
     * because if we write this.constructor.EVENTS
     * ts compiler will show compiled error
     */
    return get(this, 'constructor', BaseManager.EVENTS);
  }

  on(eventName: string | symbol, callback: () => any): removeEventListener {
    this.emitter.on(eventName, callback);
    return () => this.emitter.removeListener(eventName, callback);
  }

  emit(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.emitter.emit.call(this.emitter, eventName, ...eventData);
  }
}
