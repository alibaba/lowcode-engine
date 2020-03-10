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
  lifeCycles?: lifeCyclesConfig;
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
  handler?: (EditorConfig) => EditorConfig;
}

export interface FusionTheme {
  package: string;
  version: string;
}

export interface ThemeConfig {
  fusion?: FusionTheme;
}

export interface PluginsConfig {
  [propName: string]: Array<PluginConfig>;
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

export type HooksConfig = Array<HookConfig>;

export interface HookConfig {
  message: string;
  type: 'on' | 'once';
  handler: (editor: Editor, ...args) => void;
}

export type ShortCutsConfig = Array<ShortCutConfig>;

export interface ShortCutConfig {
  keyboard: string;
  handler: (editor: Editor, ev: React.KeyboardEventHandler<HTMLElement>, keymaster: any) => void;
}

export type UtilsConfig = Array<UtilConfig>;

export interface UtilConfig {
  name: string;
  type: 'npm' | 'function';
  content: NpmConfig | ((...args) => any);
}

export type ConstantsConfig = object;

export interface lifeCyclesConfig {
  init?: (editor: Editor) => any;
  destroy?: (editor: Editor) => any;
}

export type LocaleType = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP';

export interface I18nMessages {
  [propName: string]: string;
}

export interface I18nConfig {
  'zh-CN'?: I18nMessages;
  'zh-TW'?: I18nMessages;
  'en-US'?: I18nMessages;
  'ja-JP'?: I18nMessages;
}

export type I18nFunction = (key: string, params: object) => string;

export interface Utils {
  [propName: string]: (...args) => any;
}

export interface PluginClass extends React.Component {
  init?: (editor: Editor) => void;
}

export interface PluginComponents {
  [propName: string]: PluginClass;
}

export interface PluginStatus {
  [propName: string]: {
    disabled: boolean;
    visible: boolean;
    marked: boolean;
    locked: boolean;
  };
}
