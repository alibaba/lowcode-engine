import { ReactElement, ComponentType } from 'react';
import {
  IPublicTypeTitleContent,
  IPublicTypeI18nData,
  IPublicTypeWidgetConfigArea,
  IPublicTypeWidgetBaseConfig,
  IPublicTypePanelDockPanelProps,
  IPublicTypePanelDockProps,
} from '@alilc/lowcode-types';
import { IWidget } from './widget/widget';

export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Widget';
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    title?: IPublicTypeTitleContent | null;
  };
  content?: string | ReactElement | ComponentType<any>; // children
}

export function isWidgetConfig(obj: any): obj is WidgetConfig {
  return obj && obj.type === 'Widget';
}

export interface DockProps extends IPublicTypePanelDockProps {
}

export interface DividerConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Divider';
  props?: {
    align?: 'left' | 'right' | 'center';
  };
}

export function isDividerConfig(obj: any): obj is DividerConfig {
  return obj && obj.type === 'Divider';
}

export interface IDockBaseConfig extends IPublicTypeWidgetBaseConfig {
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
    [key: string]: any;
    title?: IPublicTypeTitleContent;
  };
}

export function isDialogDockConfig(obj: any): obj is DialogDockConfig {
  return obj && obj.type === 'DialogDock';
}

// 窗格扩展
export interface PanelConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Panel';
  content?: string | ReactElement | ComponentType<any> | PanelConfig[]; // as children
  props?: PanelProps;
}

export function isPanelConfig(obj: any): obj is PanelConfig {
  return obj && obj.type === 'Panel';
}

export type HelpTipConfig = string | { url?: string; content?: string | ReactElement };

export interface PanelProps extends IPublicTypePanelDockPanelProps {
  title?: IPublicTypeTitleContent;
  icon?: any; // 冗余字段
  description?: string | IPublicTypeI18nData;
  help?: HelpTipConfig; // 显示问号帮助
  hiddenWhenInit?: boolean; //  when this is true, by default will be hidden
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
    area?: IPublicTypeWidgetConfigArea;
  };
  content?: string | ReactElement | ComponentType<any> | PanelConfig[]; // content for pane
}

export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
  return obj && obj.type === 'PanelDock';
}
