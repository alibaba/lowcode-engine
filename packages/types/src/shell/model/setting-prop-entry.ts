import { IPublicTypeCustomView, IPublicTypeCompositeValue, IPublicTypeSetterType, IPublicTypeSetValueOptions, IPublicTypeFieldConfig, IPublicTypeFieldExtraProps } from '../type';
import { IPublicModelNode, IPublicModelComponentMeta, IPublicModelSettingTopEntry } from './';


export interface IPublicModelSettingPropEntry {
  /**
   * 获取设置属性的 isGroup
   */
  get isGroup(): boolean;

  /**
   * 获取设置属性的 id
   */
  get id(): string;

  /**
   * 获取设置属性的 name
   */
  get name(): string | number;

  /**
   * 获取设置属性的 key
   */
  get key(): string | number;

  /**
   * 获取设置属性的 path
   */
  get path(): any[];

  /**
   * 获取设置属性的 title
   */
  get title(): any;

  /**
   * 获取设置属性的 setter
   */
  get setter(): IPublicTypeSetterType | null;

  /**
   * 获取设置属性的 expanded
   */
  get expanded(): boolean;

  /**
   * 获取设置属性的 extraProps
   */
  get extraProps(): IPublicTypeFieldExtraProps;

  get props(): IPublicModelSettingTopEntry;

  /**
   * 获取设置属性对应的节点实例
   */
  get node(): IPublicModelNode | null;

  /**
   * 获取设置属性的父设置属性
   */
  get parent(): IPublicModelSettingPropEntry;

  /**
   * 获取顶级设置属性
   */
  get top(): IPublicModelSettingTopEntry;

  /**
   * 是否是 SettingField 实例
   */
  get isSettingField(): boolean;

  /**
   * componentMeta
   */
  get componentMeta(): IPublicModelComponentMeta | null;

  /**
   * 获取设置属性的 items
   */
  get items(): Array<IPublicModelSettingPropEntry | IPublicTypeCustomView>;

  /**
   * 设置 key 值
   * @param key
   */
  setKey(key: string | number): void;

  /**
   * 设置值
   * @param val 值
   */
  setValue(val: IPublicTypeCompositeValue, extraOptions?: IPublicTypeSetValueOptions): void;

  /**
   * 设置子级属性值
   * @param propName 子属性名
   * @param value 值
   */
  setPropValue(propName: string | number, value: any): void;

  /**
   * 清空指定属性值
   * @param propName
   */
  clearPropValue(propName: string | number): void;

  /**
   * 获取配置的默认值
   * @returns
   */
  getDefaultValue(): any;

  /**
   * 获取值
   * @returns
   */
  getValue(): any;

  /**
   * 获取子级属性值
   * @param propName 子属性名
   * @returns
   */
  getPropValue(propName: string | number): any;

  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue(propName: string): any;

  /**
   * 设置顶层附属属性值
   */
  setExtraPropValue(propName: string, value: any): void;

  /**
   * 获取设置属性集
   * @returns
   */
  getProps(): IPublicModelSettingTopEntry;

  /**
   * 是否绑定了变量
   * @returns
   */
  isUseVariable(): boolean;

  /**
   * 设置绑定变量
   * @param flag
   */
  setUseVariable(flag: boolean): void;

  /**
   * 创建一个设置 field 实例
   * @param config
   * @returns
   */
  createField(config: IPublicTypeFieldConfig): IPublicModelSettingPropEntry;

  /**
   * 获取值，当为变量时，返回 mock
   * @returns
   */
  getMockOrValue(): any;

  /**
   * 销毁当前 field 实例
   */
  purge(): void;

  /**
   * 移除当前 field 实例
   */
  remove(): void;

  /**
   * 设置 autorun
   * @param action
   * @returns
   */
  onEffect(action: () => void): () => void;
}
