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

  /**
   * 设置值
   * @param val
   */
  setValue(val: CompositeValue) {
    this[settingPropEntrySymbol].setValue(val);
  }

  /**
   * 获取值
   * @returns
   */
  getValue() {
    return this[settingPropEntrySymbol].getValue();
  }

  /**
   * 获取设置属性集
   * @returns
   */
  getProps() {
    return SettingTopEntry.create(this[settingPropEntrySymbol].getProps() as SettingEntry) as any;
  }

  /**
   * 是否绑定了变量
   * @returns
   */
  isUseVariable() {
    return this[settingPropEntrySymbol].isUseVariable();
  }

  /**
   * 设置绑定变量
   * @param flag
   */
  setUseVariable(flag: boolean) {
    this[settingPropEntrySymbol].setUseVariable(flag);
  }

  /**
   * 创建一个设置 field 实例
   * @param config
   * @returns
   */
  createField(config: FieldConfig) {
    return SettingPropEntry.create(this[settingPropEntrySymbol].createField(config));
  }

  /**
   * 获取值，当为变量时，返回 mock
   * @returns
   */
  getMockOrValue() {
    return this[settingPropEntrySymbol].getMockOrValue();
  }
}