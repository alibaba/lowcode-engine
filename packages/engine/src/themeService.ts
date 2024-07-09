import { type Event, type EventListener, createDecorator, Provide } from '@alilc/lowcode-shared';

export interface ITheme {
  type: string;

  value: string;
}

export interface IThemeService {
  getTheme(): ITheme;

  onDidColorThemeChange: Event<[ITheme]>;
}

export const IThemeService = createDecorator<IThemeService>('themeService');

@Provide(IThemeService)
export class ThemeService implements IThemeService {
  private activeTheme: ITheme;

  getTheme(): ITheme {
    return this.activeTheme;
  }

  onDidColorThemeChange(listener: EventListener<[ITheme]>) {
    return () => {};
  }
}
