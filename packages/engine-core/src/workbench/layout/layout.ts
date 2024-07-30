import { WidgetRegistry } from '../widget/widgetRegistry';

export const enum LayoutParts {
  TopBar = 1,
  SideBar,
  BottomBar,
  ActionBar,
  Main,
  AuxiliaryPanel,
}

export interface ILayout {
  /**
   * Main container of the application.
   */
  mainContainer: HTMLElement;

  registerPart(part: LayoutParts): void;
}

export class Layout<View> implements ILayout {
  constructor(public mainContainer: HTMLElement) {
    WidgetRegistry.onDidRegister(() => {});
  }

  registerPart(part: LayoutParts): void {}
}
