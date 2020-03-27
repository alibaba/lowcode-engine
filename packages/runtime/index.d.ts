import { ReactType } from 'react';

export as namespace LowCodeEngineRuntime;
export = LowCodeEngineRuntime;

declare module LowCodeEngineRuntime {
  type HistoryMode = 'browser' | 'hash';

  interface ComponentsMap {
    [key: string]: ReactType;
  }

  interface UtilsMap {
    [key: string]: any;
  }

  interface AppConfig {
    history?: HistoryMode;
    globalComponents?: ComponentsMap;
    globalUtils?: UtilsMap;
    containerId?: string;
  }

  function runApp(Component: any, config?: AppConfig | (() => AppConfig), exposeModule?: boolean): any;
}