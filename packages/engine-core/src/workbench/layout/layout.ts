import { Extensions, Registry } from '../../extension/extension';
import { IWidgetRegistry } from '../widget/widgetRegistry';

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
    Registry.as<IWidgetRegistry<View>>(Extensions.Widget).onDidRegister(() => {});
  }

  registerPart(part: LayoutParts): void {}
}
