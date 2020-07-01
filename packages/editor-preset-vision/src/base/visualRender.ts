import { find } from 'lodash';

import { BaseManager, connectGeneralManager, connectGeneralManagerList, IManagerController } from './base';
import VisualManager from './visualManager';

export default class VisualRender extends BaseManager implements IManagerController {
  private visualManagerList: VisualManager[] = [];

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

  connectManager(manager: VisualManager) {
    connectGeneralManager.call(this, manager, this.visualManagerList);
    return this;
  }

  connectManagerList(managerList: VisualManager[]): this {
    this.visualManagerList = connectGeneralManagerList.call(this, managerList, this.visualManagerList);
    return this;
  }

  notifyAllManagers(eventName: string | symbol, ...eventData: any[]): boolean {
    return this.visualManagerList.map((m) => m.emit(eventName, eventData)).every((r) => r);
  }

  /**
   * Render function
   * @override
   *
   * @memberof VisualRender
   */
  render(): any {
    return '';
  }
}
