import {
  IPublicApiHotkey,
  IPublicApiProject,
  IPublicApiSkeleton,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiCommon,
  CompositeObject,
  ComponentAction,
  MetadataTransducer,
  IPublicApiPlugins,
  ILowCodePluginContext,
  ILowCodePluginConfig,
  IPublicApiLogger,
  ILowCodeRegisterOptions,
  PreferenceValueType,
  IEngineConfig,
} from '@alilc/lowcode-types';

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
  logger: IPublicApiLogger;
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

export interface ILowCodePluginContextPrivate {
  set hotkey(hotkey: IPublicApiHotkey);
  set project(project: IPublicApiProject);
  set skeleton(skeleton: IPublicApiSkeleton);
  set setters(setters: IPublicApiSetters);
  set material(material: IPublicApiMaterial);
  set event(event: IPublicApiEvent);
  set config(config: IEngineConfig);
  set common(common: IPublicApiCommon);
  set plugins(plugins: IPublicApiPlugins);
  set logger(plugins: IPublicApiLogger);
}
export interface ILowCodePluginContextApiAssembler {
  assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string) => void;
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

export interface IPluginContextOptions {
  pluginName: string;
}

export interface IPluginMetaDefinition {
  /** define dependencies which the plugin depends on */
  dependencies?: string[];
  /** specify which engine version is compatible with the plugin */
  engines?: {
    /** e.g. '^1.0.0' */
    lowcodeEngine?: string;
  };
}