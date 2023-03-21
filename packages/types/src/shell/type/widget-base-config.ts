import { IPublicTypeIconType, IPublicTypeTitleContent, IPublicTypeWidgetConfigArea, TipContent } from './';

export interface IPublicTypeWidgetBaseConfig {
  [extra: string]: any;
  type: string;
  name: string;

  /**
   * 停靠位置：
   * - 当 type 为 'Panel' 时自动为 'leftFloatArea'；
   * - 当 type 为 'Widget' 时自动为 'mainArea'；
   * - 其他时候自动为 'leftArea'；
   */
  area?: IPublicTypeWidgetConfigArea;
  props?: Record<string, any>;
  content?: any;
  contentProps?: Record<string, any>;
}

export interface IPublicTypePanelDockConfig extends IPublicTypeWidgetBaseConfig {
  type: 'PanelDock';

  panelProps?: IPublicTypePanelDockPanelProps;

  props?: IPublicTypePanelDockProps;
}

export interface IPublicTypePanelDockProps {
  [key: string]: any;

  size?: 'small' | 'medium' | 'large';

  className?: string;

  description?: TipContent;

  onClick?: () => void;

  icon?: IPublicTypeIconType;

  title?: IPublicTypeTitleContent;
}

export interface IPublicTypePanelDockPanelProps {
  [key: string]: any;

  /** 是否隐藏面板顶部条 */
  hideTitleBar?: boolean;

  width?: number;

  height?: number;

  maxWidth?: number;

  maxHeight?: number;

  area?: IPublicTypeWidgetConfigArea;
}

export type IPublicTypeSkeletonConfig = IPublicTypePanelDockConfig | IPublicTypeWidgetBaseConfig;