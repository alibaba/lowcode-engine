import { CompositeObject } from '@ali/lowcode-types';
import Logger from 'zen-logger';
import { Skeleton } from '@ali/lowcode-editor-skeleton';
import { Editor, Hotkey } from '@ali/lowcode-editor-core';

export interface ILowCodePluginConfig {
  manager: ILowCodePluginManager;
  name: string;
  dep: string[]; // 依赖插件名
  init(): void;
  destroy(): void;
  exports(): CompositeObject;
}

export interface ILowCodePlugin {
  name: string;
  dep: string[];
  disabled: boolean;
  config: ILowCodePluginConfig;
  logger: Logger;
  emit(): void;
  on(): void;
  init(): void;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

export interface ILowCodePluginContext {
  skeleton: Skeleton;
  editor: Editor;
  plugins: ILowCodePluginManager;
  hotkey: Hotkey;
  logger: Logger;
  /**
    其他暂不增加，按需增加
  */
}

export interface ILowCodePluginManager {
  register(
    pluginConfig: (ctx: ILowCodePluginContext, options: CompositeObject) => ILowCodePluginConfig,
    options: CompositeObject,
  ): void;
  get(pluginName: string): ILowCodePlugin;
  getAll(): ILowCodePlugin[];
  has(pluginName: string): boolean;
  delete(pluginName: string): boolean;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
  /**
    后续可以补充插件操作，比如 disable / enable 之类的
  */
}
