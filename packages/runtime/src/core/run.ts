import { ReactType } from 'react';
import { runApp } from '@ali/recore';
import { HashHistoryBuildOptions, BrowserHistoryBuildOptions, MemoryHistoryBuildOptions } from '@recore/history';
import app from './index';

export type HistoryOptions = {
  mode?: HistoryMode;
} & (HashHistoryBuildOptions | BrowserHistoryBuildOptions | MemoryHistoryBuildOptions);

export interface IComponents {
  [key: string]: ReactType;
}

export interface IUtils {
  [key: string]: any;
}

export type HistoryMode = 'browser' | 'hash';

export interface IAppConfig {
  history?: HistoryMode;
  components?: IComponents;
  utils?: IUtils;
  containerId?: string;
}

export interface IRecoreAppConfig {
  history?: HistoryMode;
  globalComponents?: IComponents;
  globalUtils?: IUtils;
  containerId?: string;
}

function transformConfig(config: IAppConfig | (() => IAppConfig)): IRecoreAppConfig {
  if (!config) {
    return {};
  }
  if (typeof config === 'function') {
    config = config();
  }
  return {
    history: config.history,
    globalComponents: config.components,
    globalUtils: config.utils,
    containerId: config.containerId,
  };
}

export default function run(config?: IAppConfig | (() => IAppConfig)) {
  const provider = app.getProvider();
  if (config) {
    config = transformConfig(config);
    const App = provider.createApp();
    runApp(App, config);
    return;
  }
  const promise = provider.async();
  promise.then((config: IAppConfig) => {
    if (!config) {
      return;
    }
    const App = provider.createApp();
    config = transformConfig(config);
    runApp(App, config);
  });
}
