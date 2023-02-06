import { globalContext } from '@alilc/lowcode-editor-core';
import {
  Skeleton as InnerSkeleton,
  SkeletonEvents,
} from '@alilc/lowcode-editor-skeleton';
import { skeletonSymbol } from '../symbols';
import { IPublicApiSkeleton, IPublicTypeDisposable, IPublicTypeWidgetBaseConfig, IPublicTypeWidgetConfigArea } from '@alilc/lowcode-types';

const innerSkeletonSymbol = Symbol('skeleton');
export class Skeleton implements IPublicApiSkeleton {
  private readonly [innerSkeletonSymbol]: InnerSkeleton;
  private readonly pluginName: string;

  get [skeletonSymbol](): InnerSkeleton {
    if (this.workspaceMode) {
      return this[innerSkeletonSymbol];
    }
    const workspace = globalContext.get('workspace');
    if (workspace.isActive) {
      return workspace.window.innerSkeleton;
    }

    return this[innerSkeletonSymbol];
  }

  constructor(
      skeleton: InnerSkeleton,
      pluginName: string,
      readonly workspaceMode: boolean = false,
    ) {
    this[innerSkeletonSymbol] = skeleton;
    this.pluginName = pluginName;
  }

  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>) {
    const configWithName = {
      ...config,
      pluginName: this.pluginName,
    };
    return this[skeletonSymbol].add(configWithName, extraConfig);
  }

  /**
   * 移除一个面板实例
   * @param config
   * @returns
   */
  remove(config: IPublicTypeWidgetBaseConfig): number | undefined {
    const { area, name } = config;
    const skeleton = this[skeletonSymbol];
    if (!normalizeArea(area)) {
      return;
    }
    skeleton[normalizeArea(area)!].container?.remove(name);
  }

  /**
   * 显示面板
   * @param name
   */
  showPanel(name: string) {
    this[skeletonSymbol].getPanel(name)?.show();
  }

  /**
   * 隐藏面板
   * @param name
   */
  hidePanel(name: string) {
    this[skeletonSymbol].getPanel(name)?.hide();
  }

  /**
   * 显示 widget
   * @param name
   */
  showWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.show();
  }

  /**
   * enable widget
   * @param name
   */
  enableWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.enable?.();
  }

  /**
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.hide();
  }

  /**
   * disable widget，不可点击
   * @param name
   */
  disableWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.disable?.();
  }

  /**
   * show area
   * @param areaName name of area
   */
  showArea(areaName: string) {
    (this[skeletonSymbol] as any)[areaName]?.show();
  }

  /**
   * hide area
   * @param areaName name of area
   */
  hideArea(areaName: string) {
    (this[skeletonSymbol] as any)[areaName]?.hide();
  }

  /**
   * 监听 panel 显示事件
   * @param listener
   * @returns
   */
  onShowPanel(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.PANEL_SHOW, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...restPanel } = panel;
      listener(name, restPanel);
    });
    return () => editor.eventBus.off(SkeletonEvents.PANEL_SHOW, listener);
  }

  /**
   * 监听 panel 隐藏事件
   * @param listener
   * @returns
   */
  onHidePanel(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.PANEL_HIDE, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...restPanel } = panel;
      listener(name, restPanel);
    });
    return () => editor.eventBus.off(SkeletonEvents.PANEL_HIDE, listener);
  }

  /**
   * 监听 widget 显示事件
   * @param listener
   * @returns
   */
  onShowWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.WIDGET_SHOW, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...rest } = panel;
      listener(name, rest);
    });
    return () => editor.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    const { editor } = this[skeletonSymbol];
    editor.eventBus.on(SkeletonEvents.WIDGET_HIDE, (name: any, panel: any) => {
      // 不泄漏 skeleton
      const { skeleton, ...rest } = panel;
      listener(name, rest);
    });
    return () => editor.eventBus.off(SkeletonEvents.WIDGET_HIDE, listener);
  }
}

function normalizeArea(area: IPublicTypeWidgetConfigArea | undefined) {
  switch (area) {
    case 'leftArea':
    case 'left':
      return 'leftArea';
    case 'rightArea':
    case 'right':
      return 'rightArea';
    case 'topArea':
    case 'top':
      return 'topArea';
    case 'toolbar':
      return 'toolbar';
    case 'mainArea':
    case 'main':
    case 'center':
    case 'centerArea':
      return 'mainArea';
    case 'bottomArea':
    case 'bottom':
      return 'bottomArea';
    case 'leftFixedArea':
      return 'leftFixedArea';
    case 'leftFloatArea':
      return 'leftFloatArea';
    case 'stages':
      return 'stages';
    default:
      throw new Error(`${area} not supported`);
  }
}
