import { type Event } from '@alilc/lowcode-shared';
import { IEditWindow, IOpenConfiguration } from './window';

export interface IWindowService {
  readonly onDidOpenWindow: Event<IEditWindow>;
  readonly onDidSignalReadyWindow: Event<IEditWindow>;
  readonly onDidChangeFullScreen: Event<{ window: IEditWindow; fullscreen: boolean }>;
  readonly onDidDestroyWindow: Event<IEditWindow>;

  open(openConfig: IOpenConfiguration): Promise<IEditWindow[]>;

  sendToFocused(channel: string, ...args: any[]): void;
  sendToOpeningWindow(channel: string, ...args: any[]): void;
  sendToAll(channel: string, payload?: any, windowIdsToIgnore?: number[]): void;

  getWindows(): IEditWindow[];
  getWindowCount(): number;

  getFocusedWindow(): IEditWindow | undefined;
  getLastActiveWindow(): IEditWindow | undefined;

  getWindowById(windowId: number): IEditWindow | undefined;
}

export class WindowService implements IWindowService {
  private readonly windows = new Map<number, IEditWindow>();

  getWindows(): IEditWindow[] {
    return [...this.windows.values()];
  }

  getWindowCount(): number {
    return this.windows.size;
  }

  getFocusedWindow(): IEditWindow | undefined {
    return this.getWindows().find((w) => w.focused);
  }

  getLastActiveWindow(): IEditWindow | undefined {
    return this.getWindows().find((w) => w.lastActive);
  }
}
