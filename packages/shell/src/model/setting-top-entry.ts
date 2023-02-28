import { ISettingEntry } from '@alilc/lowcode-designer';
import { settingTopEntrySymbol } from '../symbols';
import { Node as ShellNode } from './node';
import { SettingPropEntry as ShellSettingPropEntry } from './setting-prop-entry';
import { IPublicModelSettingTopEntry, IPublicModelNode, IPublicModelSettingPropEntry } from '@alilc/lowcode-types';

export class SettingTopEntry implements IPublicModelSettingTopEntry {
  private readonly [settingTopEntrySymbol]: ISettingEntry;

  constructor(prop: ISettingEntry) {
    this[settingTopEntrySymbol] = prop;
  }

  static create(prop: ISettingEntry): IPublicModelSettingTopEntry {
    return new SettingTopEntry(prop);
  }

  /**
   * 返回所属的节点实例
   */
  get node(): IPublicModelNode | null {
    return ShellNode.create(this[settingTopEntrySymbol].getNode());
  }

  /**
   * 获取子级属性对象
   * @param propName
   * @returns
   */
  get(propName: string | number): IPublicModelSettingPropEntry {
    return ShellSettingPropEntry.create(this[settingTopEntrySymbol].get(propName) as any);
  }

  /**
   * @deprecated use .node instead
   */
  getNode() {
    return this.node;
  }

  /**
   * 获取指定 propName 的值
   * @param propName
   * @returns
   */
  getPropValue(propName: string | number): any {
    return this[settingTopEntrySymbol].getPropValue(propName);
  }

  /**
   * 设置指定 propName 的值
   * @param propName
   * @param value
   */
  setPropValue(propName: string | number, value: any): void {
    this[settingTopEntrySymbol].setPropValue(propName, value);
  }
}