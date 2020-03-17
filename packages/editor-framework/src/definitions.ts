
export interface EditorConfig {

};

export interface NpmConfig {
  version: string,
  package: string,
  main?: string,
  exportName?: string,
  subName?: string,
  destructuring?: boolean
};

export interface SkeletonConfig {
  config: NpmConfig,
  props?: object,
  handler?: (EditorConfig) => EditorConfig
};

export interface FusionTheme {
  package: string,
  version: string
};

export interface ThemeConfig {
  fusion?: FusionTheme
}

export interface PluginsConfig {
  [key]: Array<PluginConfig>
};

export interface PluginConfig {
  pluginKey: string,
  type: string,
  props: object,
  config: NpmConfig,
  pluginProps: object
};

export type HooksConfig = Array<HookConfig>;

export interface HookConfig {

};


