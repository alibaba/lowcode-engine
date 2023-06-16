import { IPublicModelWindow } from '../model';
import { IPublicApiPlugins, IPublicModelResource, IPublicResourceList, IPublicTypeDisposable, IPublicTypeResourceType } from '@alilc/lowcode-types';

export interface IPublicApiWorkspace<
  Plugins = IPublicApiPlugins,
  ModelWindow = IPublicModelWindow
> {

  /** 是否启用 workspace 模式 */
  isActive: boolean;

  /** 当前设计器窗口 */
  window: ModelWindow | null;

  plugins: Plugins;

  /** 当前设计器的编辑窗口 */
  windows: ModelWindow[];

  /** 获取资源树列表 */
  get resourceList(): IPublicModelResource[];

  /** 设置资源树列表 */
  setResourceList(resourceList: IPublicResourceList): void;

  /** 资源树列表更新事件 */
  onResourceListChange(fn: (resourceList: IPublicResourceList) => void): IPublicTypeDisposable;

  /** 注册资源 */
  registerResourceType(resourceTypeModel: IPublicTypeResourceType): void;

  /** 打开视图窗口 */
  openEditorWindow(resourceName: string, title: string, extra: Object, viewName?: string, sleep?: boolean): Promise<void>;

  /** 通过视图 id 打开窗口 */
  openEditorWindowById(id: string): void;

  /** 移除视图窗口 */
  removeEditorWindow(resourceName: string, title: string): void;

  /** 通过视图 id 移除窗口 */
  removeEditorWindowById(id: string): void;

  /** 窗口新增/删除的事件 */
  onChangeWindows(fn: () => void): IPublicTypeDisposable;

  /** active 窗口变更事件 */
  onChangeActiveWindow(fn: () => void): IPublicTypeDisposable;

  /**
   * active 视图变更事件
   * @since v1.1.7
   */
  onChangeActiveEditorView(fn: () => void): IPublicTypeDisposable;

  /**
   * window 下的所有视图 renderer ready 事件
   * @since v1.1.7
   */
  onWindowRendererReady(fn: () => void): IPublicTypeDisposable;
}