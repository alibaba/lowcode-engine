export interface AppConfig {
  sdkVersion?: string;
  historyMode?: string;
  targetRootID?: string;
  layout?: Layout;
  theme?: Theme;
  [key: string]: any;
}

interface Theme {
  package: string;
  version: string;
  primary: string;
}

interface Layout {
  componentName?: string;
  props?: Record<string, any>;
}
