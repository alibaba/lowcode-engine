import * as React from 'react';
import Editor from './editor';

export interface EditorConfig {
  skeleton?: SkeletonConfig;
  theme?: ThemeConfig;
  plugins?: PluginsConfig;
  hooks?: HooksConfig;
  shortCuts?: ShortCutsConfig;
  utils?: UtilsConfig;
  constants?: ConstantsConfig;
  lifeCycles?: LifeCyclesConfig;
  i18n?: I18nConfig;
}

export interface NpmConfig {
  version: string;
  package: string;
  main?: string;
  exportName?: string;
  subName?: string;
  destructuring?: boolean;
}

export interface SkeletonConfig {
  config: NpmConfig;
  props?: object;
  handler?: (config: EditorConfig) => EditorConfig;
}

export interface FusionTheme {
  package: string;
  version: string;
}

export interface ThemeConfig {
  fusion?: FusionTheme;
}

export interface PluginsConfig {
  [key: string]: PluginConfig[];
}

export interface PluginConfig {
  pluginKey: string;
  type: string;
  props: {
    icon?: string;
    title?: string;
    width?: number;
    height?: number;
    visible?: boolean;
    disabled?: boolean;
    marked?: boolean;
    align?: 'left' | 'right' | 'top' | 'bottom';
    onClick?: () => void;
    dialogProps?: object;
    balloonProps?: object;
    panelProps?: object;
    linkProps?: object;
  };
  config?: NpmConfig;
  pluginProps?: object;
}

export type HooksConfig = HookConfig[];

export interface HookConfig {
  message: string;
  type: 'on' | 'once';
  handler: (editor: Editor, ...args: any[]) => void;
}

export type ShortCutsConfig = ShortCutConfig[];

export interface ShortCutConfig {
  keyboard: string;
  handler: (editor: Editor, ev: Event, keymaster: any) => void;
}

export type UtilsConfig = UtilConfig[];

export interface UtilConfig {
  name: string;
  type: 'npm' | 'function';
  content: NpmConfig | ((...args: []) => any);
}

export type ConstantsConfig = object;

export interface LifeCyclesConfig {
  init?: (editor: Editor) => any;
  destroy?: (editor: Editor) => any;
}

export type LocaleType = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP';

export interface I18nMessages {
  [key: string]: string;
}

export interface I18nConfig {
  'zh-CN'?: I18nMessages;
  'zh-TW'?: I18nMessages;
  'en-US'?: I18nMessages;
  'ja-JP'?: I18nMessages;
}

export type I18nFunction = (key: string, params: any) => string;

export interface Utils {
  [key: string]: (...args: any[]) => any;
}

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
  i18n?: I18nFunction;
  ref?: React.RefObject<React.ReactElement>;
  [key: string]: any;
}

export type Plugin = React.ReactNode & {
  open?: () => boolean | void | Promise<any>;
  close?: () => boolean | void | Promise<any>;
};

export type HOCPlugin = React.ReactNode & {
  open: () => Promise<any>;
  close: () => Promise<any>;
};

export interface PluginSet {
  [key: string]: HOCPlugin;
}

export type PluginClass = React.ComponentType<PluginProps> & {
  init?: (editor: Editor) => void;
  defaultProps?: {
    locale?: LocaleType;
    messages?: I18nMessages;
  };
};

export interface PluginClassSet {
  [key: string]: PluginClass;
}

export interface PluginStatus {
  disabled?: boolean;
  visible?: boolean;
  marked?: boolean;
  locked?: boolean;
}

export interface PluginStatusSet {
  [key: string]: PluginStatus;
}
