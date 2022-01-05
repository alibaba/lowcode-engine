import { SettingEntry } from '@ali/lowcode-designer';
import { settingTopEntrySymbol } from './symbols';
import Node from './node';

export default class SettingTopEntry {
  private readonly [settingTopEntrySymbol]: SettingEntry;

  constructor(prop: SettingEntry) {
    this[settingTopEntrySymbol] = prop;
  }

  static create(prop: SettingEntry) {
    return new SettingTopEntry(prop);
  }

  /**
   * 返回所属的节点实例
   */
  get node(): Node | null {
    return Node.create(this[settingTopEntrySymbol].getNode());
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
  getPropValue(propName: string | number) {
    return this[settingTopEntrySymbol].getPropValue(propName);
  }

  /**
   * 设置指定 propName 的值
   * @param propName
   * @param value
   */
  setPropValue(propName: string | number, value: any) {
    this[settingTopEntrySymbol].setPropValue(propName, value);
  }
}