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
  IPublicApiWorkspace,
} from '../api';
import { IPublicEnumPluginRegisterLevel } from '../enum';
import { IPublicModelEngineConfig, IPublicModelEditorView } from './';

export interface IPublicModelPluginContext {

  /**
   * 可通过该对象读取插件初始化配置
   * by using this, init options can be accessed from inside plugin
   */
  preference: IPluginPreferenceMananger;

  /**
   * skeleton API
   * @tutorial https://lowcode-engine.cn/site/docs/api/skeleton
   */
  get skeleton(): IPublicApiSkeleton;

  /**
   * hotkey API
   * @tutorial https://lowcode-engine.cn/site/docs/api/hotkey
   */
  get hotkey(): IPublicApiHotkey;

  /**
   * setter API
   * @tutorial https://lowcode-engine.cn/site/docs/api/setters
   */
  get setters(): IPublicApiSetters;

  /**
   * config API
   * @tutorial https://lowcode-engine.cn/site/docs/api/config
   */
  get config(): IPublicModelEngineConfig;

  /**
   * material API
   * @tutorial https://lowcode-engine.cn/site/docs/api/material
   */
  get material(): IPublicApiMaterial;

  /**
   * event API
   * this event works globally, can be used between plugins and engine.
   * @tutorial https://lowcode-engine.cn/site/docs/api/event
   */
  get event(): IPublicApiEvent;

  /**
   * project API
   * @tutorial https://lowcode-engine.cn/site/docs/api/project
   */
  get project(): IPublicApiProject;

  /**
   * common API
   * @tutorial https://lowcode-engine.cn/site/docs/api/common
   */
  get common(): IPublicApiCommon;

  /**
   * plugins API
   * @tutorial https://lowcode-engine.cn/site/docs/api/plugins
   */
  get plugins(): IPublicApiPlugins;

  /**
   * logger API
   * @tutorial https://lowcode-engine.cn/site/docs/api/logger
   */
  get logger(): IPublicApiLogger;

  /**
   * this event works within current plugin, on an emit locally.
   * @tutorial https://lowcode-engine.cn/site/docs/api/event
   */
  get pluginEvent(): IPublicApiEvent;

  /**
   * canvas API
   * @tutorial https://lowcode-engine.cn/site/docs/api/canvas
   */
  get canvas(): IPublicApiCanvas;

  /**
   * workspace API
   * @tutorial https://lowcode-engine.cn/site/docs/api/workspace
   */
  get workspace(): IPublicApiWorkspace;

  /**
   * 插件注册层级
   * @since v1.1.7
   */
  get registerLevel(): IPublicEnumPluginRegisterLevel;

  get editorWindow(): IPublicModelEditorView;
}

/**
 * @deprecated please use IPublicModelPluginContext instead
 */
export interface ILowCodePluginContext extends IPublicModelPluginContext {

}
