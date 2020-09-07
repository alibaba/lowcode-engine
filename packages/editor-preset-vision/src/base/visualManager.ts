import { find } from 'lodash';

import {
  BaseManager,
  connectGeneralManager,
  connectGeneralManagerList,
  IDesignerController,
  IManagerController,
} from './base';
import VisualDesigner from './visualDesigner';

export default class VisualManager extends BaseManager implements IManagerController, IDesignerController {
  private visualManagerList: VisualManager[] = [];

  private visualDesignerList: VisualDesigner[] = [];

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

  getDesigner(): VisualDesigner {
    return this.visualDesignerList[0];
  }

  getDesignerByName(name?: string): VisualDesigner[] {
    return this.visualDesignerList.filter((m) => m.getName() === name);
  }

  getDesignerById(id?: string): VisualDesigner {
    return find(this.visualDesignerList, (m) => m.getId() === id) as VisualDesigner;
  }

  getDesignerList() {
    return this.visualDesignerList;
  }

  connectManager(manager: VisualManager) {
    connectGeneralManager.call(this, manager, this.visualManagerList);
    return this;
  }

  connectDesigner(manager: VisualDesigner): this {
    connectGeneralManager.call(this, manager, this.visualDesignerList);
    return this;
  }

  connectManagerList(managerList: VisualManager[]): this {
    this.visualManagerList = connectGeneralManagerList.call(this, managerList, this.visualManagerList);
    return this;
  }

  connectDesignerList(managerList: VisualDesigner[]): this {
    this.visualDesignerList = connectGeneralManagerList.call(this, managerList, this.visualDesignerList);
    return this;
  }

  notifyAllManagers(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.getManagerList()
      .map((m) => m.emit(eventName, eventData))
      .every((r) => r);
  }

  notifyAllDesigners(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.getDesignerList()
      .map((m) => m.emit(eventName, eventData))
      .every((r) => r);
  }
}
