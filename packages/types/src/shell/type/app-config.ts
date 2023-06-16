export interface IPublicTypeAppConfig {
  sdkVersion?: string;
  historyMode?: string;
  targetRootID?: string;
  layout?: IPublicTypeLayout;
  theme?: IPublicTypeTheme;
}

interface IPublicTypeTheme {
  package: string;
  version: string;
  primary: string;
}

interface IPublicTypeLayout {
  componentName?: string;
  props?: Record<string, any>;
}
