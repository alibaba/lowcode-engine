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
  preference: IPluginPreferenceMananger;
  [key: string]: any;
}

/**
 *
 *
 * @deprecated please use IPublicModelPluginContext instead
 */
export interface ILowCodePluginContext extends IPublicModelPluginContext {

}