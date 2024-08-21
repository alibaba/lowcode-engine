import { createDecorator, Disposable, Events, IInstantiationService } from '@alilc/lowcode-shared';
import { defaultWindowState, IEditWindow, IWindowConfiguration } from './window';
import { Schemas, URI, extname } from '../common';
import { EditWindow } from './windowImpl';
import { IFileService } from '../file';
import { Extensions, Registry } from '../extension/registry';
import { IContentEditorRegistry } from '../contentEditor/contentEditorRegistry';

export interface IOpenConfiguration {
  readonly urisToOpen: IWindowOpenable[];

  readonly forceNewWindow?: boolean;

  /**
   * Specifies if the file should be only be opened
   * if it exists.
   */
  readonly openOnlyIfExists?: boolean;

  addMode?: boolean;
}

export interface IWindowOpenable {
  label?: string;
  readonly fileUri: URI;
}

export interface IWindowService {
  readonly onDidOpenWindow: Events.Event<IEditWindow>;
  // readonly onDidChangeFullScreen: Events.Event<{ window: IEditWindow; fullscreen: boolean }>;
  // readonly onDidDestroyWindow: Events.Event<IEditWindow>;

  open(openConfig: IOpenConfiguration): Promise<IEditWindow[]>;

  sendToFocused(channel: string, ...args: any[]): void;
  sendToOpeningWindow(channel: string, ...args: any[]): void;
  sendToAll(channel: string, payload?: any, windowIdsToIgnore?: number[]): void;

  getWindows(): IEditWindow[];
  getWindowCount(): number;

  getLastActiveWindow(): IEditWindow | undefined;

  getWindowById(windowId: number): IEditWindow | undefined;
}

export const IWindowService = createDecorator<IWindowService>('windowService');

export class WindowService extends Disposable implements IWindowService {
  private _onDidOpenWindow = this._addDispose(new Events.Emitter<IEditWindow>());
  onDidOpenWindow = this._onDidOpenWindow.event;

  private readonly windows = new Map<number, IEditWindow>();

  constructor(
    @IInstantiationService private readonly instantiationService: IInstantiationService,
    @IFileService private readonly fileService: IFileService,
  ) {
    super();
  }

  getWindows(): IEditWindow[] {
    return [...this.windows.values()];
  }

  getWindowCount(): number {
    return this.windows.size;
  }

  getWindowById(windowId: number): IEditWindow | undefined {
    return this.windows.get(windowId);
  }

  getLastActiveWindow(): IEditWindow | undefined {
    let lastFocusedWindow: IEditWindow | undefined = undefined;
    let maxLastFocusTime = Number.MIN_VALUE;

    const windows = this.getWindows();
    for (const window of windows) {
      if (window.lastFocusTime > maxLastFocusTime) {
        maxLastFocusTime = window.lastFocusTime;
        lastFocusedWindow = window;
      }
    }

    return lastFocusedWindow;
  }

  async open(openConfig: IOpenConfiguration): Promise<IEditWindow[]> {
    return this._doOpen(openConfig);
  }

  private async _doOpen(openConfig: IOpenConfiguration): Promise<IEditWindow[]> {
    const usedWindows: IEditWindow[] = [];
    const { urisToOpen, openOnlyIfExists } = openConfig;

    for (const item of urisToOpen) {
      const fs = this.fileService.getProvider(Schemas.file)!;

      let exists = false;
      try {
        await fs.access(item.fileUri);
        exists = true;
      } catch {
        if (openOnlyIfExists) continue;
      }

      const fileExt = extname(item.fileUri.path);
      const registeredContentType = Registry.as<IContentEditorRegistry>(Extensions.ContentEditor).getContentTypeByExt(
        fileExt,
      );

      if (registeredContentType) {
        const config: IWindowConfiguration = {
          fileToOpenOrCreate: {
            fileUri: item.fileUri,
            exists,
            options: {},
          },
          contentType: registeredContentType,
        };
        const window = await this._openInEditWindow(config);

        usedWindows.push(window);
      }
    }

    return usedWindows;
  }

  private async _openInEditWindow(config: IWindowConfiguration): Promise<IEditWindow> {
    const newWindow = this.instantiationService.createInstance(EditWindow, defaultWindowState());

    this.windows.set(newWindow.id, newWindow);

    // Indicate new window via event
    this._onDidOpenWindow.notify(newWindow);

    newWindow.load(config);

    newWindow.onDidDestroy(() => {
      this.windows.delete(newWindow.id);
    });

    return newWindow;
  }

  sendToAll(channel: string, payload?: any, windowIdsToIgnore?: number[]): void {}

  sendToFocused(channel: string, ...args: any[]): void {
    const focusedWindow = this.getLastActiveWindow();
    focusedWindow?.sendWhenReady(channel, ...args);
  }

  sendToOpeningWindow(channel: string, ...args: any[]): void {}
}
