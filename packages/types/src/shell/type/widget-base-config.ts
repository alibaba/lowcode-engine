import { ReactElement, ComponentType } from 'react';
import { IPublicTypeI18nData, IPublicTypeIconType, IPublicTypeTitleContent, IPublicTypeWidgetConfigArea, TipContent } from './';

export type IPublicTypeHelpTipConfig = string | { url?: string; content?: string | ReactElement };

export interface IPublicTypePanelConfigProps extends IPublicTypePanelDockPanelProps {
  title?: IPublicTypeTitleContent;
  icon?: any; // 冗余字段
  description?: string | IPublicTypeI18nData;
  help?: IPublicTypeHelpTipConfig; // 显示问号帮助
  hiddenWhenInit?: boolean; //  when this is true, by default will be hidden
  condition?: (widget: any) => any;
  onInit?: (widget: any) => any;
  onDestroy?: () => any;
  shortcut?: string; // 只有在特定位置，可触发 toggle show
  enableDrag?: boolean; // 是否开启通过 drag 调整 宽度
  keepVisibleWhileDragging?: boolean; // 是否在该 panel 范围内拖拽时保持 visible 状态
}

export interface IPublicTypePanelConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Panel';
  content?: string | ReactElement | ComponentType<any> | IPublicTypePanelConfig[]; // as children
  props?: IPublicTypePanelConfigProps;
}

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
  content?: string | ReactElement | ComponentType<any> | IPublicTypePanelConfig[];
  contentProps?: Record<string, any>;

  /**
   * 优先级，值越小，优先级越高，优先级高的会排在前面
   */
  index?: number;
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