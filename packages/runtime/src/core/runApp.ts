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

export type HistoryMode = 'browser' | 'hash' | 'BROWSER' | 'HASH';

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
  provider.onReady((params) => {
    const promise = provider.async();
    promise.then((config: IAppConfig) => {
      if (!config) {
        return;
      }
      const App = provider.createApp(params);
      provider.runApp(App, config);
    }).catch((err: Error) => {
      console.error(err.message);
      const { fallbackUI, afterCatch } = app.getErrorBoundary() || {};
      if (typeof afterCatch === 'function') {
        afterCatch(err.message, err.stack);
      }
      if (!fallbackUI) {
        return;
      }
      provider.runApp(fallbackUI, {});
    });
  });
}
