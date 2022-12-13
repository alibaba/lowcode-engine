import { ReactElement, ComponentType } from 'react';
import {
  TitleContent,
  IconType,
  I18nData,
  TipContent,
  IWidgetConfigArea,
  IWidgetBaseConfig,
} from '@alilc/lowcode-types';
import { IWidget } from './widget/widget';

export interface WidgetConfig extends IWidgetBaseConfig {
  type: 'Widget';
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    title?: TitleContent;
  };
  content?: string | ReactElement | ComponentType<any>; // children
}

export function isWidgetConfig(obj: any): obj is WidgetConfig {
  return obj && obj.type === 'Widget';
}

export interface DockProps {
  title?: TitleContent;
  icon?: IconType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  description?: TipContent;
  onClick?: () => void;
}

export interface DividerConfig extends IWidgetBaseConfig {
  type: 'Divider';
  props?: {
    align?: 'left' | 'right' | 'center';
  };
}

export function isDividerConfig(obj: any): obj is DividerConfig {
  return obj && obj.type === 'Divider';
}

export interface IDockBaseConfig extends IWidgetBaseConfig {
  props?: DockProps & {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
  };
}

export interface DockConfig extends IDockBaseConfig {
  type: 'Dock';
  content?: string | ReactElement | ComponentType<any>;
}

export function isDockConfig(obj: any): obj is DockConfig {
  return obj && /Dock$/.test(obj.type);
}

// 按钮弹窗扩展
export interface DialogDockConfig extends IDockBaseConfig {
  type: 'DialogDock';
  dialogProps?: {
    title?: TitleContent;
    [key: string]: any;
  };
}

export function isDialogDockConfig(obj: any): obj is DialogDockConfig {
  return obj && obj.type === 'DialogDock';
}

// 窗格扩展
export interface PanelConfig extends IWidgetBaseConfig {
  type: 'Panel';
  content?: string | ReactElement | ComponentType<any> | PanelConfig[]; // as children
  props?: PanelProps;
}

export function isPanelConfig(obj: any): obj is PanelConfig {
  return obj && obj.type === 'Panel';
}

export type HelpTipConfig = string | { url?: string; content?: string | ReactElement };

export interface PanelProps {
  title?: TitleContent;
  icon?: any; // 冗余字段
  description?: string | I18nData;
  hideTitleBar?: boolean; // panel.props 兼容，不暴露
  help?: HelpTipConfig; // 显示问号帮助
  width?: number; // panel.props
  height?: number; // panel.props
  maxWidth?: number; // panel.props
  maxHeight?: number; // panel.props
  condition?: (widget: IWidget) => any;
  onInit?: (widget: IWidget) => any;
  onDestroy?: () => any;
  shortcut?: string; // 只有在特定位置，可触发 toggle show
  enableDrag?: boolean; // 是否开启通过 drag 调整 宽度
  keepVisibleWhileDragging?: boolean; // 是否在该 panel 范围内拖拽时保持 visible 状态
}

export interface PanelDockConfig extends IDockBaseConfig {
  type: 'PanelDock';
  panelName?: string;
  panelProps?: PanelProps & {
    area?: IWidgetConfigArea;
  };
  content?: string | ReactElement | ComponentType<any> | PanelConfig[]; // content for pane
}

export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
  return obj && obj.type === 'PanelDock';
}
