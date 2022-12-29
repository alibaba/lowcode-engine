import { IPublicModelWindow } from '../model';
import { IPublicResourceOptions } from '../type';
import { IPublicApiPlugins } from '@alilc/lowcode-types';

export interface IPublicApiWorkspace {
  /** 是否启用 workspace 模式 */
  isActive: boolean;

  /** 当前设计器窗口 */
  window: IPublicModelWindow;

  /** 注册资源 */
  registerResourceType(resourceName: string, resourceType: 'editor', options: IPublicResourceOptions): void;

  /** 打开视图窗口 */
  openEditorWindow(resourceName: string, title: string, viewType?: string): void;

  /** 移除窗口 */
  removeEditorWindow(resourceName: string, title: string): void;

  plugins: IPublicApiPlugins;

  /** 当前设计器的编辑窗口 */
  windows: IPublicModelWindow[];

  /** 窗口新增/删除的事件 */
  onChangeWindows: (fn: () => void) => void;

  /** active 窗口变更事件 */
  onChangeActiveWindow: (fn: () => void) => void;
}