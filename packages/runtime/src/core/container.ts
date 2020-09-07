import Provider from './provider';

export interface ILayoutOptions {
  componentName?: string;
  props?: any;
}

export default class Container {
  private renderer: any = null;

  private layouts: { [key: string]: { content: any; props: any } } = {};

  private loading: any = null;

  private provider: any;

  registerRenderer(renderer: any): any {
    this.renderer = renderer;
  }

  registerLayout(Layout: any, options: ILayoutOptions): any {
    if (!options) {
      return;
    }
    const { componentName, props = {} } = options;
    if (!componentName || !Layout) {
      return;
    }
    this.layouts[componentName] = { content: Layout, props };
  }

  registerLoading(component: any) {
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

  getRenderer(): any {
    return this.renderer;
  }

  getLoading(): any {
    return this.loading;
  }

  getProvider() {
    return this.provider;
  }
}
