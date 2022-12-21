import { SettingField, SettingEntry } from '@alilc/lowcode-designer';
import {
  IPublicTypeCompositeValue,
  IPublicTypeFieldConfig,
  IPublicTypeCustomView,
  IPublicModelSettingPropEntry,
  IPublicTypeSetterType,
  IPublicTypeFieldExtraProps,
  IPublicModelSettingTopEntry,
  IPublicModelNode,
  IPublicModelComponentMeta,
  IPublicTypeSetValueOptions,
} from '@alilc/lowcode-types';
import { settingPropEntrySymbol } from '../symbols';
import { Node } from './node';
import { SettingTopEntry } from './setting-top-entry';
import { ComponentMeta } from './component-meta';
import { isCustomView } from '@alilc/lowcode-utils';

export class SettingPropEntry implements IPublicModelSettingPropEntry {
  private readonly [settingPropEntrySymbol]: SettingField;

  constructor(prop: SettingField) {
    this[settingPropEntrySymbol] = prop;
  }

  static create(prop: SettingField): IPublicModelSettingPropEntry {
    return new SettingPropEntry(prop);
  }

  /**
   * 获取设置属性的 isGroup
   */
  get isGroup(): boolean {
    return this[settingPropEntrySymbol].isGroup;
  }

  /**
   * 获取设置属性的 id
   */
  get id(): string {
    return this[settingPropEntrySymbol].id;
  }

  /**
   * 获取设置属性的 name
   */
  get name(): string | number {
    return this[settingPropEntrySymbol].name;
  }

  /**
   * 获取设置属性的 key
   */
  get key(): string | number {
    return this[settingPropEntrySymbol].getKey();
  }

  /**
   * 获取设置属性的 path
   */
  get path(): any[] {
    return this[settingPropEntrySymbol].path;
  }

  /**
   * 获取设置属性的 title
   */
  get title(): any {
    return this[settingPropEntrySymbol].title;
  }

  /**
   * 获取设置属性的 setter
   */
  get setter(): IPublicTypeSetterType | null {
    return this[settingPropEntrySymbol].setter;
  }

  /**
   * 获取设置属性的 expanded
   */
  get expanded(): boolean {
    return this[settingPropEntrySymbol].expanded;
  }

  /**
   * 获取设置属性的 extraProps
   */
  get extraProps(): IPublicTypeFieldExtraProps {
    return this[settingPropEntrySymbol].extraProps;
  }

  get props(): IPublicModelSettingTopEntry {
    return SettingTopEntry.create(this[settingPropEntrySymbol].props);
  }

  /**
   * 获取设置属性对应的节点实例
   */
  get node(): IPublicModelNode | null {
    return Node.create(this[settingPropEntrySymbol].getNode());
  }

  /**
   * 获取设置属性的父设置属性
   */
  get parent(): IPublicModelSettingPropEntry {
    return SettingPropEntry.create(this[settingPropEntrySymbol].parent as any);
  }

  /**
   * 获取顶级设置属性
   */
  get top(): IPublicModelSettingTopEntry {
    return SettingTopEntry.create(this[settingPropEntrySymbol].top);
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
  get componentMeta(): IPublicModelComponentMeta | null {
    return ComponentMeta.create(this[settingPropEntrySymbol].componentMeta);
  }

  /**
   * 获取设置属性的 items
   */
  get items(): Array<IPublicModelSettingPropEntry | IPublicTypeCustomView> {
    return this[settingPropEntrySymbol].items?.map((item) => {
      if (isCustomView(item)) {
        return item;
      }
      return item.internalToShellPropEntry();
    });
  }

  /**
   * 设置 key 值
   * @param key
   */
  setKey(key: string | number): void {
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
  setValue(val: IPublicTypeCompositeValue, extraOptions?: IPublicTypeSetValueOptions): void {
    this[settingPropEntrySymbol].setValue(val, false, false, extraOptions);
  }

  /**
   * 设置子级属性值
   * @param propName 子属性名
   * @param value 值
   */
  setPropValue(propName: string | number, value: any): void {
    this[settingPropEntrySymbol].setPropValue(propName, value);
  }

  /**
   * 清空指定属性值
   * @param propName
   */
  clearPropValue(propName: string | number): void {
    this[settingPropEntrySymbol].clearPropValue(propName);
  }

  /**
   * 获取配置的默认值
   * @returns
   */
  getDefaultValue(): any {
    return this[settingPropEntrySymbol].getDefaultValue();
  }

  /**
   * 获取值
   * @returns
   */
  getValue(): any {
    return this[settingPropEntrySymbol].getValue();
  }

  /**
   * 获取子级属性值
   * @param propName 子属性名
   * @returns
   */
  getPropValue(propName: string | number): any {
    return this[settingPropEntrySymbol].getPropValue(propName);
  }

  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue(propName: string): any {
    return this[settingPropEntrySymbol].getExtraPropValue(propName);
  }

  /**
   * 设置顶层附属属性值
   */
  setExtraPropValue(propName: string, value: any): void {
    this[settingPropEntrySymbol].setExtraPropValue(propName, value);
  }

  /**
   * 获取设置属性集
   * @returns
   */
  getProps(): IPublicModelSettingTopEntry {
    return SettingTopEntry.create(this[settingPropEntrySymbol].getProps() as SettingEntry) as any;
  }

  /**
   * 是否绑定了变量
   * @returns
   */
  isUseVariable(): boolean {
    return this[settingPropEntrySymbol].isUseVariable();
  }

  /**
   * 设置绑定变量
   * @param flag
   */
  setUseVariable(flag: boolean): void {
    this[settingPropEntrySymbol].setUseVariable(flag);
  }

  /**
   * 创建一个设置 field 实例
   * @param config
   * @returns
   */
  createField(config: IPublicTypeFieldConfig): IPublicModelSettingPropEntry {
    return SettingPropEntry.create(this[settingPropEntrySymbol].createField(config));
  }

  /**
   * 获取值，当为变量时，返回 mock
   * @returns
   */
  getMockOrValue(): any {
    return this[settingPropEntrySymbol].getMockOrValue();
  }

  /**
   * 销毁当前 field 实例
   */
  purge(): void {
    this[settingPropEntrySymbol].purge();
  }

  /**
   * 移除当前 field 实例
   */
  remove(): void {
    this[settingPropEntrySymbol].remove();
  }

  /**
   * 设置 autorun
   * @param action
   * @returns
   */
  onEffect(action: () => void): () => void {
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
