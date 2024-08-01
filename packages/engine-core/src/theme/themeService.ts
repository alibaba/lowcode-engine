import { Disposable, Events, type IDisposable, createDecorator } from '@alilc/lowcode-shared';
import { type ITheme } from './theme';

export interface IThemeService extends IDisposable {
  getTheme(): ITheme;

  onDidColorThemeChange: Events.Event<ITheme>;
}

export const IThemeService = createDecorator<IThemeService>('themeService');

export class ThemeService extends Disposable implements IThemeService {
  private _activeTheme: ITheme;

  private _onDidColorThemeChange = this._addDispose(new Events.Emitter<ITheme>());
  onDidColorThemeChange = this._onDidColorThemeChange.event;

  getTheme(): ITheme {
    return this._activeTheme;
  }
}
