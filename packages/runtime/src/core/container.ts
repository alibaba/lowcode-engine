import { ReactType } from 'react';
import Provider from './provider';

export interface ILayoutOptions {
  componentName?: string;
  props?: any;
}

export default class Container {
  private renderer: ReactType | null = null;
  private layouts: { [key: string]: ReactType } = {};
  private loading: ReactType | null = null;
  private provider: any;

  registerRenderer(renderer: ReactType): any {
    this.renderer = renderer;
  }

  registerLayout(Layout: ReactType, options: ILayoutOptions): any {
    if (!options) {
      return;
    }
    const { componentName } = options;
    if (!componentName || !Layout) {
      return;
    }
    this.layouts[componentName] = Layout;
  }

  registerLoading(component: ReactType) {
    if (!component) {
      return;
    }
    this.loading = component;
  }

  registerProvider(CustomProvider: any) {
    if (Provider.isPrototypeOf(CustomProvider)) {
      this.provider = new CustomProvider();
    } else {
      const identifier = (CustomProvider && CustomProvider.name) || 'registered Provider';
      throw new Error(`${identifier} is not a child class of Provider`);
    }
  }

  getLayout(componentName: string) {
    if (!componentName) {
      return;
    }
    return this.layouts[componentName];
  }

  getRenderer(): ReactType | null {
    return this.renderer;
  }

  getLoading(): ReactType | null {
    return this.loading;
  }

  getProvider() {
    return this.provider;
  }
}
