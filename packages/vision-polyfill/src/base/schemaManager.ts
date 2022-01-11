import { cloneDeep, find } from 'lodash';

import {
  BaseManager,
  connectGeneralManager,
  connectGeneralManagerList,
  IManagerController,
  ISchemaController,
} from './base';
import VisualManager from './visualManager';

export default class SchemaManager extends BaseManager implements IManagerController, ISchemaController {
  private schemaData: object = {};

  private visualManagerList: VisualManager[] = [];

  private schemaManagerList: SchemaManager[] = [];

  getManager(): VisualManager {
    return this.visualManagerList[0];
  }

  getManagerByName(name?: string): VisualManager[] {
    return this.visualManagerList.filter((m) => m.getName() === name);
  }

  getManagerById(id?: string): VisualManager {
    return find(this.visualManagerList, (m) => m.getId() === id) as VisualManager;
  }

  getManagerList(): VisualManager[] {
    return this.visualManagerList;
  }

  getSchemaManager(): SchemaManager {
    return this.schemaManagerList[0];
  }

  getSchemaManagerById(id?: string): SchemaManager {
    return find(this.schemaManagerList, (m) => m.getId() === id) as SchemaManager;
  }

  getSchemaManagerByName(name?: string): SchemaManager[] {
    return this.schemaManagerList.filter((m) => m.getName() === name);
  }

  getSchemaManagerList() {
    return this.schemaManagerList;
  }

  connectManager(manager: any) {
    connectGeneralManager.call(this, manager, this.visualManagerList as any);
    return this;
  }

  connectSchemaManager(manager: SchemaManager): this {
    connectGeneralManager.call(this, manager, this.schemaManagerList);
    return this;
  }

  connectManagerList(managerList: VisualManager[]): this {
    this.visualManagerList = connectGeneralManagerList.call(this, managerList as any, this.visualManagerList as any);
    return this;
  }

  connectSchemaManagerList(managerList: SchemaManager[]): this {
    this.schemaManagerList = connectGeneralManagerList.call(this, managerList, this.schemaManagerList);
    return this;
  }

  notifyAllManagers(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.visualManagerList.map((m) => m.emit(eventName, eventData)).every((r) => r);
  }

  notifyAllSchemaManagers(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.schemaManagerList.map((m) => m.emit(eventName, eventData)).every((r) => r);
  }

  exportSchema(): string {
    try {
      return JSON.stringify(this.schemaData);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  exportSchemaObject(): object {
    return cloneDeep(this.schemaData);
  }

  importSchema(schemaString: string): this {
    try {
      this.schemaData = JSON.parse(schemaString);
      return this;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  importSchemaObject(schema: object): this {
    this.schemaData = schema;
    return this;
  }
}
