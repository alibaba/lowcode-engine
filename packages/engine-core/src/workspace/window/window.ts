import { type Event } from '@alilc/lowcode-shared';
import { URI } from '../../common/uri';

export interface IEditWindow {
  // readonly onWillLoad: Event<ILoadEvent>;
  readonly onDidSignalReady: Event<void>;
  readonly onDidDestroy: Event<void>;

  readonly onDidClose: Event<void>;

  readonly id: number;

  readonly config: IWindowConfiguration | undefined;

  readonly isReady: boolean;
  ready(): Promise<IEditWindow>;

  load(config: IWindowConfiguration, options?: { isReload?: boolean }): void;
  reload(): void;
}

export interface IWindowConfiguration {
  filesToOpenOrCreate?: IPath[];
}

export interface IPath<T = any> {
  /**
   * Optional editor options to apply in the file
   */
  readonly options?: T;

  /**
   * The file path to open within the instance
   */
  fileUri?: URI;

  /**
   * Specifies if the file should be only be opened
   * if it exists.
   */
  readonly openOnlyIfExists?: boolean;
}

export const enum WindowMode {
  Maximized,
  Normal,
  Fullscreen,
  Custom,
}

export interface IWindowState {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  mode?: WindowMode;
  zoomLevel?: number;
  readonly display?: number;
}

export interface IOpenConfiguration {
  readonly urisToOpen?: IWindowOpenable[];
  readonly preferNewWindow?: boolean;
  readonly forceNewWindow?: boolean;
  readonly forceNewTabbedWindow?: boolean;
  readonly forceReuseWindow?: boolean;
  readonly forceEmpty?: boolean;
}

export interface IBaseWindowOpenable {
  label?: string;
}

export interface IFolderToOpen extends IBaseWindowOpenable {
  readonly folderUri: URI;
}

export interface IFileToOpen extends IBaseWindowOpenable {
  readonly fileUri: URI;
}

export type IWindowOpenable = IFolderToOpen | IFileToOpen;
