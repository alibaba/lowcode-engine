import { CompositeObject, ComponentAction } from '@ali/lowcode-types';
import Logger from 'zen-logger';
import { Skeleton } from '@ali/lowcode-editor-skeleton';
import { Editor, Hotkey } from '@ali/lowcode-editor-core';
import {
  MetadataTransducer,
  Designer,
} from '@ali/lowcode-designer';
import { Setters } from '../types';

export interface ILowCodePluginConfig {
  name: string;
  dep?: string[]; // 依赖插件名
  init?(): void;
  destroy?(): void;
  exports?(): any;
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

export interface ILowCodePluginContext {
  skeleton: Skeleton;
  designer: Designer;
  editor: Editor;
  hotkey: Hotkey;
  logger: Logger;
  plugins: ILowCodePluginManager;
  designerCabin: IDesignerCabin;
  setters: Setters;
  /**
    其他暂不增加，按需增加
  */
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
  get(pluginName: string): ILowCodePlugin | undefined;
  getAll(): ILowCodePlugin[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;

export type LowCodeRegisterOptions = {
  autoInit?: boolean;
};
