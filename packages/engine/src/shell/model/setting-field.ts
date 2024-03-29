import { ISettingField, isSettingField } from '@alilc/lowcode-designer';
import {
  IPublicTypeCompositeValue,
  IPublicTypeFieldConfig,
  IPublicTypeCustomView,
  IPublicTypeSetterType,
  IPublicTypeFieldExtraProps,
  IPublicModelSettingTopEntry,
  IPublicModelNode,
  IPublicModelComponentMeta,
  IPublicTypeSetValueOptions,
  IPublicModelSettingField,
  IPublicTypeDisposable,
} from '@alilc/lowcode-types';
import { settingFieldSymbol } from '../symbols';
import { Node as ShellNode } from './node';
import { SettingTopEntry, SettingTopEntry as ShellSettingTopEntry } from './setting-top-entry';
import { ComponentMeta as ShellComponentMeta } from './component-meta';
import { isCustomView } from '@alilc/lowcode-utils';

export class SettingField implements IPublicModelSettingField {
  private readonly [settingFieldSymbol]: ISettingField;

  constructor(prop: ISettingField) {
    this[settingFieldSymbol] = prop;
  }

  static create(prop: ISettingField): IPublicModelSettingField {
    return new SettingField(prop);
  }

  /**
   * 获取设置属性的 isGroup
   */
  get isGroup(): boolean {
    return this[settingFieldSymbol].isGroup;
  }

  /**
   * 获取设置属性的 id
   */
  get id(): string {
    return this[settingFieldSymbol].id;
  }

  /**
   * 获取设置属性的 name
   */
  get name(): string | number | undefined {
    return this[settingFieldSymbol].name;
  }

  /**
   * 获取设置属性的 key
   */
  get key(): string | number | undefined {
    return this[settingFieldSymbol].getKey();
  }

  /**
   * 获取设置属性的 path
   */
  get path(): any[] {
    return this[settingFieldSymbol].path;
  }

  /**
   * 获取设置属性的 title
   */
  get title(): any {
    return this[settingFieldSymbol].title;
  }

  /**
   * 获取设置属性的 setter
   */
  get setter(): IPublicTypeSetterType | null {
    return this[settingFieldSymbol].setter;
  }

  /**
   * 获取设置属性的 expanded
   */
  get expanded(): boolean {
    return this[settingFieldSymbol].expanded;
  }

  /**
   * 获取设置属性的 extraProps
   */
  get extraProps(): IPublicTypeFieldExtraProps {
    return this[settingFieldSymbol].extraProps;
  }

  get props(): IPublicModelSettingTopEntry {
    return ShellSettingTopEntry.create(this[settingFieldSymbol].props);
  }

  /**
   * 获取设置属性对应的节点实例
   */
  get node(): IPublicModelNode | null {
    return ShellNode.create(this[settingFieldSymbol].getNode());
  }

  /**
   * 获取设置属性的父设置属性
   */
  get parent(): IPublicModelSettingField | IPublicModelSettingTopEntry {
    if (isSettingField(this[settingFieldSymbol].parent)) {
      return SettingField.create(this[settingFieldSymbol].parent);
    }

    return SettingTopEntry.create(this[settingFieldSymbol].parent);
  }

  /**
   * 获取顶级设置属性
   */
  get top(): IPublicModelSettingTopEntry {
    return ShellSettingTopEntry.create(this[settingFieldSymbol].top);
  }

  /**
   * 是否是 SettingField 实例
   */
  get isSettingField(): boolean {
    return this[settingFieldSymbol].isSettingField;
  }

  /**
   * componentMeta
   */
  get componentMeta(): IPublicModelComponentMeta | null {
    return ShellComponentMeta.create(this[settingFieldSymbol].componentMeta);
  }

  /**
   * 获取设置属性的 items
   */
  get items(): Array<IPublicModelSettingField | IPublicTypeCustomView> {
    return this[settingFieldSymbol].items?.map((item) => {
      if (isCustomView(item)) {
        return item;
      }
      return item.internalToShellField();
    });
  }

  /**
   * 设置 key 值
   * @param key
   */
  setKey(key: string | number): void {
    this[settingFieldSymbol].setKey(key);
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
    this[settingFieldSymbol].setValue(val, false, false, extraOptions);
  }

  /**
   * 设置子级属性值
   * @param propName 子属性名
   * @param value 值
   */
  setPropValue(propName: string | number, value: any): void {
    this[settingFieldSymbol].setPropValue(propName, value);
  }

  /**
   * 清空指定属性值
   * @param propName
   */
  clearPropValue(propName: string | number): void {
    this[settingFieldSymbol].clearPropValue(propName);
  }

  /**
   * 获取配置的默认值
   * @returns
   */
  getDefaultValue(): any {
    return this[settingFieldSymbol].getDefaultValue();
  }

  /**
   * 获取值
   * @returns
   */
  getValue(): any {
    return this[settingFieldSymbol].getValue();
  }

  /**
   * 获取子级属性值
   * @param propName 子属性名
   * @returns
   */
  getPropValue(propName: string | number): any {
    return this[settingFieldSymbol].getPropValue(propName);
  }

  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue(propName: string): any {
    return this[settingFieldSymbol].getExtraPropValue(propName);
  }

  /**
   * 设置顶层附属属性值
   */
  setExtraPropValue(propName: string, value: any): void {
    this[settingFieldSymbol].setExtraPropValue(propName, value);
  }

  /**
   * 获取设置属性集
   * @returns
   */
  getProps(): IPublicModelSettingTopEntry {
    return ShellSettingTopEntry.create(this[settingFieldSymbol].getProps());
  }

  /**
   * 是否绑定了变量
   * @returns
   */
  isUseVariable(): boolean {
    return this[settingFieldSymbol].isUseVariable();
  }

  /**
   * 设置绑定变量
   * @param flag
   */
  setUseVariable(flag: boolean): void {
    this[settingFieldSymbol].setUseVariable(flag);
  }

  /**
   * 创建一个设置 field 实例
   * @param config
   * @returns
   */
  createField(config: IPublicTypeFieldConfig): IPublicModelSettingField {
    return SettingField.create(this[settingFieldSymbol].createField(config));
  }

  /**
   * 获取值，当为变量时，返回 mock
   * @returns
   */
  getMockOrValue(): any {
    return this[settingFieldSymbol].getMockOrValue();
  }

  /**
   * 销毁当前 field 实例
   */
  purge(): void {
    this[settingFieldSymbol].purge();
  }

  /**
   * 移除当前 field 实例
   */
  remove(): void {
    this[settingFieldSymbol].remove();
  }

  /**
   * 设置 autorun
   * @param action
   * @returns
   */
  onEffect(action: () => void): IPublicTypeDisposable {
    return this[settingFieldSymbol].onEffect(action);
  }

  /**
   * 返回 shell 模型，兼容某些场景下 field 已经是 shell field 了
   * @returns
   */
  internalToShellField() {
    return this;
  }
}
