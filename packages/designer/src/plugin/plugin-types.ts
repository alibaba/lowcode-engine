import { CompositeObject, ComponentAction } from '@alilc/lowcode-types';
import Logger from 'zen-logger';
import {
  Hotkey,
  Skeleton,
  Project,
  Event, Material,
} from '@alilc/lowcode-shell';
import { EngineConfig } from '@alilc/lowcode-editor-core';
import { MetadataTransducer } from '@alilc/lowcode-designer';
import { Setters } from '../types';

export type PreferenceValueType = string | number | boolean;

export interface ILowCodePluginPreferenceDeclarationProperty {
  // shape like 'name' or 'group.name' or 'group.subGroup.name'
  key: string;
  // must have either one of description & markdownDescription
  description: string;
  // value in 'number', 'string', 'boolean'
  type: string;
  // default value
  // NOTE! this is only used in configuration UI, won`t affect runtime
  default?: PreferenceValueType;
  // only works when type === 'string', default value false
  useMultipleLineTextInput?: boolean;
  // enum values, only works when type === 'string'
  enum?: any[];
  // descriptions for enum values
  enumDescriptions?: string[];
  // message that describing deprecation of this property
  deprecationMessage?: string;
}

/**
 * declaration of plugin`s preference
 * when strictPluginMode === true， only declared preference can be obtained from inside plugin.
 *
 * @export
 * @interface ILowCodePluginPreferenceDeclaration
 */
export interface ILowCodePluginPreferenceDeclaration {
  // this will be displayed on configuration UI, can be plugin name
  title: string;
  properties: ILowCodePluginPreferenceDeclarationProperty[];
}

export type PluginPreference = Map<string, Record<string, PreferenceValueType>>;

export interface ILowCodePluginConfig {
  dep?: string | string[];
  init?(): void;
  destroy?(): void;
  exports?(): any;
}

export interface ILowCodePluginConfigMetaEngineConfig {
  lowcodeEngine?: string;
}
export interface ILowCodePluginConfigMeta {
  preferenceDeclaration?: ILowCodePluginPreferenceDeclaration;
  // 依赖插件名
  dependencies?: string[];
  engines?: ILowCodePluginConfigMetaEngineConfig;
}

export interface ILowCodePluginCore {
  name: string;
  dep: string[];
  disabled: boolean;
  config: ILowCodePluginConfig;
  logger: Logger;
  on(event: string | symbol, listener: (...args: any[]) => void): any;
  emit(event: string | symbol, ...args: any[]): boolean;
  removeAllListeners(event?: string | symbol): this;
  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

interface ILowCodePluginExportsAccessor {
  [propName: string]: any;
}

export type ILowCodePlugin = ILowCodePluginCore & ILowCodePluginExportsAccessor;

export interface IDesignerCabin {
  registerMetadataTransducer: (transducer: MetadataTransducer, level: number, id?: string) => void;
  addBuiltinComponentAction: (action: ComponentAction) => void;
  removeBuiltinComponentAction: (actionName: string) => void;
}

export interface IPluginPreferenceMananger {
  // eslint-disable-next-line max-len
  getPreferenceValue: (key: string, defaultValue?: PreferenceValueType) => PreferenceValueType | undefined ;
}

export interface ILowCodePluginContext {
  skeleton: Skeleton;
  hotkey: Hotkey;
  logger: Logger;
  plugins: ILowCodePluginManager;
  setters: Setters;
  config: EngineConfig;
  material: Material;
  event: Event;
  project: Project;
  preference: IPluginPreferenceMananger;
}

interface ILowCodePluginManagerPluginAccessor {
  [pluginName: string]: ILowCodePlugin | any;
}

export interface ILowCodePluginManagerCore {
  register(
    pluginConfigCreator: (ctx: ILowCodePluginContext, pluginOptions?: any) => ILowCodePluginConfig,
    pluginOptions?: any,
    options?: CompositeObject,
  ): Promise<void>;
  init(pluginPreference?: Map<string, Record<string, PreferenceValueType>>): Promise<void>;
  get(pluginName: string): ILowCodePlugin | undefined;
  getAll(): ILowCodePlugin[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;

export function isLowCodeRegisterOptions(opts: any): opts is ILowCodeRegisterOptions {
  return opts && ('autoInit' in opts || 'override' in opts);
}

export interface ILowCodeRegisterOptions {
  autoInit?: boolean;
  // allow overriding existing plugin with same name when override === true
  override?: boolean;
}

export interface IPluginContextOptions {
  pluginName: string;
}