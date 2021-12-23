import { SettingEntry } from '@ali/lowcode-designer';
import { CompositeValue, SettingTarget } from '@ali/lowcode-types';
import { settingPropEntrySymbol } from './symbols';
import Node from './node';
import SettingTopEntry from './setting-top-entry';

export default class SettingPropEntry {
  private readonly [settingPropEntrySymbol]: SettingEntry;

  constructor(prop: SettingEntry) {
    this[settingPropEntrySymbol] = prop;
  }

  static create(prop: SettingEntry) {
    return new SettingPropEntry(prop);
  }

  get node(): Node | null {
    return Node.create(this[settingPropEntrySymbol].getNode());
  }

  /**
   * @deprecated use .node instead
   */
  getNode() {
    return this.node;
  }

  setValue(val: CompositeValue) {
    this[settingPropEntrySymbol].setValue(val);
  }

  getValue() {
    return this[settingPropEntrySymbol].getValue();
  }

  getProps() {
    return SettingTopEntry.create(this[settingPropEntrySymbol].getProps() as SettingEntry) as any;
  }
}