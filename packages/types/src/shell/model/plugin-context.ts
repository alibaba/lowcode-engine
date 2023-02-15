import {
  IPublicApiSkeleton,
  IPublicApiHotkey,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiProject,
  IPublicApiCommon,
  IPublicApiLogger,
  IPublicApiCanvas,
  IPluginPreferenceMananger,
  IPublicApiPlugins,
} from '../api';
import { IPublicModelEngineConfig } from './';

export interface IPublicModelPluginContext {

  /**
   * 对于插件开发者来说，可以在 context 挂载自定义的内容，作为插件内全局上下文使用
   *
   * for plugin developers, costom properties can be add to plugin context
   * from inside plugin for convenience.
   */
  [key: string]: any;

  /**
   * 可通过该对象读取插件初始化配置
   * by using this, init options can be accessed from inside plugin
   */
  preference: IPluginPreferenceMananger;
  get skeleton(): IPublicApiSkeleton;
  get hotkey(): IPublicApiHotkey;
  get setters(): IPublicApiSetters;
  get config(): IPublicModelEngineConfig;
  get material(): IPublicApiMaterial;

  /**
   * this event works globally, can be used between plugins and engine.
   */
  get event(): IPublicApiEvent;
  get project(): IPublicApiProject;
  get common(): IPublicApiCommon;
  get plugins(): IPublicApiPlugins;
  get logger(): IPublicApiLogger;

  /**
   * this event works within current plugin, on an emit locally.
   */
  get pluginEvent(): IPublicApiEvent;
  get canvas(): IPublicApiCanvas;
}

/**
 *
 *
 * @deprecated please use IPublicModelPluginContext instead
 */
export interface ILowCodePluginContext extends IPublicModelPluginContext {

}
