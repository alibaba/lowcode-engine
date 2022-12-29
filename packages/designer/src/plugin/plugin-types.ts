import {
  IPublicApiHotkey,
  IPublicApiProject,
  IPublicApiSkeleton,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiCommon,
  IPublicTypeCompositeObject,
  IPublicApiPlugins,
  IPublicTypePluginConfig,
  IPublicApiLogger,
  IPublicTypePreferenceValueType,
  IPublicModelEngineConfig,
  IPublicTypePlugin,
  IPublicApiCanvas,
  IPublicApiWorkspace,
  IPublicTypePluginMeta,
} from '@alilc/lowcode-types';

export type PluginPreference = Map<string, Record<string, IPublicTypePreferenceValueType>>;

export interface ILowCodePluginRuntimeCore {
  name: string;
  dep: string[];
  disabled: boolean;
  config: IPublicTypePluginConfig;
  logger: IPublicApiLogger;
  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
  meta: IPublicTypePluginMeta;
}

interface ILowCodePluginRuntimeExportsAccessor {
  [propName: string]: any;
}

// eslint-disable-next-line max-len
export type ILowCodePluginRuntime = ILowCodePluginRuntimeCore & ILowCodePluginRuntimeExportsAccessor;

export interface ILowCodePluginContextPrivate {
  set hotkey(hotkey: IPublicApiHotkey);
  set project(project: IPublicApiProject);
  set skeleton(skeleton: IPublicApiSkeleton);
  set setters(setters: IPublicApiSetters);
  set material(material: IPublicApiMaterial);
  set event(event: IPublicApiEvent);
  set config(config: IPublicModelEngineConfig);
  set common(common: IPublicApiCommon);
  set plugins(plugins: IPublicApiPlugins);
  set logger(plugins: IPublicApiLogger);
  set pluginEvent(event: IPublicApiEvent);
  set canvas(canvas: IPublicApiCanvas);
  set workspace(workspace: IPublicApiWorkspace);
}
export interface ILowCodePluginContextApiAssembler {
  assembleApis(
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ): void;
}

interface ILowCodePluginManagerPluginAccessor {
  [pluginName: string]: ILowCodePluginRuntime | any;
}

export interface ILowCodePluginManagerCore {
  register(
    pluginModel: IPublicTypePlugin,
    pluginOptions?: any,
    options?: IPublicTypeCompositeObject,
  ): Promise<void>;
  init(pluginPreference?: Map<string, Record<string, IPublicTypePreferenceValueType>>): Promise<void>;
  get(pluginName: string): ILowCodePluginRuntime | undefined;
  getAll(): ILowCodePluginRuntime[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;

export interface IPluginContextOptions {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}
