import { type IDisposable, type Events } from '@alilc/lowcode-shared';
import { URI } from '../common';
import { IWorkspaceIdentifier } from '../workspace';

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

export const defaultWindowState = function (mode = WindowMode.Normal): IWindowState {
  return {
    width: 1024,
    height: 768,
    mode,
  };
};

export interface IEditOptions {}

export interface IPath<T = IEditOptions> {
  /**
   * The file path to open within the instance
   */
  readonly fileUri: URI;

  /**
   * A hint that the file exists. if true, the
   * file exists, if false it does not. with
   * `undefined` the state is unknown.
   */
  readonly exists: boolean;

  /**
   * Optional editor options to apply in the file
   */
  options?: T;
}

export interface IWindowConfiguration {
  fileToOpenOrCreate: IPath;

  workspace?: IWorkspaceIdentifier;

  contentType: string;
}

export interface IEditWindow extends IDisposable {
  readonly onWillLoad: Events.Event<void>;
  readonly onDidSignalReady: Events.Event<void>;
  readonly onDidDestroy: Events.Event<void>;
  readonly onDidClose: Events.Event<void>;

  readonly id: number;

  readonly config: IWindowConfiguration | undefined;

  readonly lastFocusTime: number;
  focus(): void;

  readonly isReady: boolean;
  ready(): Promise<IEditWindow>;

  load(config: IWindowConfiguration, options?: { isReload?: boolean }): Promise<void>;
  reload(): Promise<void>;

  close(): void;
  destory(): Promise<void>;

  sendWhenReady(channel: string, ...args: any[]): void;
}
