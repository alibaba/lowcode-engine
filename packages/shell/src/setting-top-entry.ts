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

  get node(): Node | null {
    return Node.create(this[settingTopEntrySymbol].getNode());
  }

  /**
   * @deprecated use .node instead
   */
  getNode() {
    return this.node;
  }

  getPropValue(propName: string | number) {
    return this[settingTopEntrySymbol].getPropValue(propName);
  }

  setPropValue(propName: string | number, value: any) {
    this[settingTopEntrySymbol].setPropValue(propName, value);
  }
}