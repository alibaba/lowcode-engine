import { ReactType } from 'react';
type HistoryMode = 'browser' | 'hash';

interface ComponentsMap {
  [key: string]: ReactType;
}

interface UtilsMap {
  [key: string]: any;
}

export interface AppConfig {
  history?: HistoryMode;
  globalComponents?: ComponentsMap;
  globalUtils?: UtilsMap;
  containerId?: string;
}

export function run(Component: any, config?: AppConfig | (() => AppConfig)): any;
