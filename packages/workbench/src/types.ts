import { ReactElement, ComponentType } from 'react';
import {
  IPublicTypeTitleContent,
  IPublicTypeWidgetConfigArea,
  IPublicTypeWidgetBaseConfig,
  IPublicTypePanelDockProps,
  IPublicTypePanelConfigProps,
  IPublicTypePanelConfig,
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

export function isPanelConfig(obj: any): obj is IPublicTypePanelConfig {
  return obj && obj.type === 'Panel';
}

export interface PanelDockConfig extends IDockBaseConfig {
  type: 'PanelDock';
  panelName?: string;
  panelProps?: IPublicTypePanelConfigProps & {
    area?: IPublicTypeWidgetConfigArea;
  };
  content?: string | ReactElement | ComponentType<any> | IPublicTypePanelConfig[]; // content for pane
}

export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
  return obj && obj.type === 'PanelDock';
}
