import { HashHistoryBuildOptions, BrowserHistoryBuildOptions, MemoryHistoryBuildOptions } from 'history';
import app from './index';

export type HistoryOptions = {
  mode?: HistoryMode;
} & (HashHistoryBuildOptions | BrowserHistoryBuildOptions | MemoryHistoryBuildOptions);

export interface IComponents {
  [key: string]: any;
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
  [key: string]: any;
}

export default function runApp() {
  const provider = app.getProvider();
  if (!provider) {
    throw new Error('Please register class Provider');
  }
  provider.onReady(() => {
    const promise = provider.async();
    promise.then((config: IAppConfig) => {
      if (!config) {
        return;
      }
      const App = provider.createApp();
      provider.runApp(App, config);
    });
  });
}
