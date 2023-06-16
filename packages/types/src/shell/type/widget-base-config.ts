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

  /** 面板 name, 当没有 props.title 时, 会使用 name 作为标题 */
  name: string;
}

export interface IPublicTypePanelDockProps {
  [key: string]: any;

  size?: 'small' | 'medium' | 'large';

  className?: string;

  /** 详细描述，hover 时在标题上方显示的 tips 内容 */
  description?: TipContent;

  onClick?: () => void;

  /**
   * 面板标题前的 icon
   */
  icon?: IPublicTypeIconType;

  /**
   * 面板标题
   */
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