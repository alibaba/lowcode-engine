import { SettingField } from '@ali/lowcode-designer';
import { CompositeValue, FieldConfig } from '@ali/lowcode-types';
import { settingPropEntrySymbol } from './symbols';
import Node from './node';
import SettingTopEntry from './setting-top-entry';

export default class SettingPropEntry {
  private readonly [settingPropEntrySymbol]: SettingField;

  constructor(prop: SettingField) {
    this[settingPropEntrySymbol] = prop;
  }

  static create(prop: SettingField) {
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

  isUseVariable() {
    return this[settingPropEntrySymbol].isUseVariable();
  }

  setUseVariable(flag: boolean) {
    this[settingPropEntrySymbol].setUseVariable(flag);
  }

  createField(config: FieldConfig) {
    return SettingPropEntry.create(this[settingPropEntrySymbol].createField(config));
  }

  getMockOrValue() {
    return this[settingPropEntrySymbol].getMockOrValue();
  }
}