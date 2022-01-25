import {
  Skeleton as InnerSkeleton,
  IWidgetBaseConfig,
  IWidgetConfigArea,
} from '@alilc/lowcode-editor-skeleton';
import { skeletonSymbol } from './symbols';

export default class Skeleton {
  private readonly [skeletonSymbol]: InnerSkeleton;

  constructor(skeleton: InnerSkeleton) {
    this[skeletonSymbol] = skeleton;
  }

  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IWidgetBaseConfig, extraConfig?: Record<string, any>) {
    return this[skeletonSymbol].add(config, extraConfig);
  }

  /**
   * 移除一个面板实例
   * @param config
   * @returns
   */
  remove(config: IWidgetBaseConfig) {
    const { area, name } = config;
    const skeleton = this[skeletonSymbol];
    if (!normalizeArea(area)) return;
    skeleton[normalizeArea(area)!].container.remove(name);
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
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string) {
    this[skeletonSymbol].getWidget(name)?.hide();
  }
}

function normalizeArea(area: IWidgetConfigArea | undefined) {
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
  }
}
