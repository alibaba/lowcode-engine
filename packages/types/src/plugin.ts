import { CompositeObject, ComponentAction } from '@ali/lowcode-types';
import Logger from 'zen-logger';
import { Skeleton } from '@ali/lowcode-editor-skeleton';
import { Editor, Hotkey } from '@ali/lowcode-editor-core';
import {
  MetadataTransducer,
  Designer,
} from '@ali/lowcode-designer';

export interface ILowCodePluginConfig {
  name: string;
  dep?: string[]; // 依赖插件名
  init(): void;
  destroy?(): void;
  exports?(): CompositeObject;
}

export interface ILowCodePlugin {
  name: string;
  dep: string[];
  disabled: boolean;
  config: ILowCodePluginConfig;
  logger: Logger;
  on(event: string | symbol, listener: (...args: any[]) => void): any;
  off(event: string | symbol, listener: (...args: any[]) => void): any;
  emit(event: string | symbol, ...args: any[]): boolean;
  removeAllListeners(event?: string | symbol): this;
  init(): void;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

export interface IDesignerHelper {
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
  designerHelper: IDesignerHelper;
  /**
    其他暂不增加，按需增加
  */
}

export interface ILowCodePluginManager {
  register(
    pluginConfig: (ctx: ILowCodePluginContext, options: CompositeObject) => ILowCodePluginConfig,
    options: CompositeObject,
  ): void;
  get(pluginName: string): ILowCodePlugin | undefined;
  getAll(): ILowCodePlugin[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
}
