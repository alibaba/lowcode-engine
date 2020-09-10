import { EventEmitter } from 'events';
import { ReactNode, ComponentType } from 'react';
import { NpmInfo } from './npm';
import { RegisterOptions } from 'power-di';

export type KeyType = new (...args: any[]) => any | symbol | string;
export type ClassType = new (...args: any[]) => any;
export interface GetOptions {
  forceNew?: boolean;
  sourceCls?: ClassType;
}
export type GetReturnType<T, ClsType> = T extends undefined
  ? ClsType extends {
    prototype: infer R;
  }
    ? R
    : any
  : T;

export interface IEditor extends EventEmitter {
  get<T = undefined, KeyOrType = any>(keyOrType: KeyOrType, opt?: GetOptions): GetReturnType<T, KeyOrType> | undefined;

  has(keyOrType: KeyType): boolean;

  set(key: KeyType, data: any): void;

  onceGot<T = undefined, KeyOrType extends KeyType = any>(keyOrType: KeyOrType): Promise<GetReturnType<T, KeyOrType>>;

  onGot<T = undefined, KeyOrType extends KeyType = any>(
    keyOrType: KeyOrType,
    fn: (data: GetReturnType<T, KeyOrType>) => void,
  ): () => void;

  register(data: any, key?: KeyType, options?: RegisterOptions): void;
}

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

export interface SkeletonConfig {
  config: NpmInfo;
  props?: Record<string, unknown>;
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
    dialogProps?: Record<string, unknown>;
    balloonProps?: Record<string, unknown>;
    panelProps?: Record<string, unknown>;
    linkProps?: Record<string, unknown>;
  };
  config?: NpmInfo;
  pluginProps?: Record<string, unknown>;
}

export type HooksConfig = HookConfig[];

export interface HookConfig {
  message: string;
  type: 'on' | 'once';
  handler: (this: IEditor, editor: IEditor, ...args: any[]) => void;
}

export type ShortCutsConfig = ShortCutConfig[];

export interface ShortCutConfig {
  keyboard: string;
  handler: (editor: IEditor, ev: Event, keymaster: any) => void;
}

export type UtilsConfig = UtilConfig[];

export interface UtilConfig {
  name: string;
  type: 'npm' | 'function';
  content: NpmInfo | ((...args: []) => any);
}

export type ConstantsConfig = Record<string, unknown>;

export interface LifeCyclesConfig {
  init?: (editor: IEditor) => any;
  destroy?: (editor: IEditor) => any;
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
  editor: IEditor;
  config: PluginConfig;
  [key: string]: any;
}

export type Plugin = ReactNode & {
  open?: () => boolean | void | Promise<any>;
  close?: () => boolean | void | Promise<any>;
};

export type HOCPlugin = ReactNode & {
  open: () => Promise<any>;
  close: () => Promise<any>;
};

export interface PluginSet {
  [key: string]: HOCPlugin;
}

export type PluginClass = ComponentType<PluginProps> & {
  init?: (editor: IEditor) => void;
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
