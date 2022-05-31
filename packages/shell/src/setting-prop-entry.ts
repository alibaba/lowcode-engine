import { SettingField, ISetValueOptions } from '@alilc/lowcode-designer';
import { CompositeValue, FieldConfig } from '@alilc/lowcode-types';
import { settingPropEntrySymbol } from './symbols';
import Node from './node';
import SettingTopEntry from './setting-top-entry';
import ComponentMeta from './component-meta';

export default class SettingPropEntry {
  private readonly [settingPropEntrySymbol]: SettingField;

  constructor(prop: SettingField) {
    this[settingPropEntrySymbol] = prop;
  }

  static create(prop: SettingField) {
    return new SettingPropEntry(prop);
  }

  /**
   * 获取设置属性的 id
   */
  get id() {
    return this[settingPropEntrySymbol].id;
  }

  /**
   * 获取设置属性的 name
   */
  get name() {
    return this[settingPropEntrySymbol].name;
  }

  /**
   * 获取设置属性的 key
   */
  get key() {
    return this[settingPropEntrySymbol].getKey();
  }

  /**
   * 获取设置属性的 path
   */
  get path() {
    return this[settingPropEntrySymbol].path;
  }

  /**
   * 获取设置属性的 title
   */
  get title() {
    return this[settingPropEntrySymbol].title;
  }

  /**
   * 获取设置属性的 setter
   */
  get setter() {
    return this[settingPropEntrySymbol].setter;
  }

  /**
   * 获取设置属性的 extraProps
   */
  get extraProps() {
    return this[settingPropEntrySymbol].extraProps;
  }

  get props() {
    return SettingTopEntry.create(this[settingPropEntrySymbol].props);
  }

  /**
   * 获取设置属性对应的节点实例
   */
  get node(): Node | null {
    return Node.create(this[settingPropEntrySymbol].getNode());
  }

  /**
   * 获取设置属性的父设置属性
   */
  get parent(): SettingPropEntry {
    return SettingPropEntry.create(this[settingPropEntrySymbol].parent as any);
  }

  /**
   * 是否是 SettingField 实例
   */
  get isSettingField(): boolean {
    return this[settingPropEntrySymbol].isSettingField;
  }

  /**
   * componentMeta
   */
  get componentMeta(): ComponentMeta | null {
    return ComponentMeta.create(this[settingPropEntrySymbol].componentMeta);
  }

  /**
   * 设置 key 值
   * @param key
   */
  setKey(key: string | number) {
    this[settingPropEntrySymbol].setKey(key);
  }

  /**
   * @deprecated use .node instead
   */
  getNode() {
    return this.node;
  }

  /**
   * @deprecated use .parent instead
   */
  getParent() {
    return this.parent;
  }

  /**
   * 设置值
   * @param val 值
   */
  setValue(val: CompositeValue, extraOptions?: ISetValueOptions) {
    this[settingPropEntrySymbol].setValue(val, false, false, extraOptions);
  }

  /**
   * 设置子级属性值
   * @param propName 子属性名
   * @param value 值
   */
  setPropValue(propName: string | number, value: any) {
    this[settingPropEntrySymbol].setPropValue(propName, value);
  }

  /**
   * 清空指定属性值
   * @param propName
   */
  clearPropValue(propName: string | number) {
    this[settingPropEntrySymbol].clearPropValue(propName);
  }

  /**
   * 获取配置的默认值
   * @returns
   */
  getDefaultValue() {
    return this[settingPropEntrySymbol].getDefaultValue();
  }

  /**
   * 获取值
   * @returns
   */
  getValue() {
    return this[settingPropEntrySymbol].getValue();
  }

  /**
   * 获取子级属性值
   * @param propName 子属性名
   * @returns
   */
  getPropValue(propName: string | number) {
    return this[settingPropEntrySymbol].getPropValue(propName);
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

  /**
   * 销毁当前 field 实例
   */
  purge() {
    this[settingPropEntrySymbol].purge();
  }

  /**
   * 移除当前 field 实例
   */
  remove() {
    this[settingPropEntrySymbol].remove();
  }

  /**
   * 设置 autorun
   * @param action
   * @returns
   */
  onEffect(action: () => void) {
    return this[settingPropEntrySymbol].onEffect(action);
  }

  /**
   * 返回 shell 模型，兼容某些场景下 field 已经是 shell field 了
   * @returns
   */
  internalToShellPropEntry() {
    return this;
  }
}
