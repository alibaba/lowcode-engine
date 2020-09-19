import Provider from './provider';

export interface ILayoutOptions {
  componentName?: string;
  props?: any;
}

export interface IErrorBoundaryConfig {
  fallbackUI: any;
  afterCatch?: (...rest: any) => any
}

export default class Container {
  private renderer: any = null;

  private layouts: { [key: string]: { content: any; props: any } } = {};

  private loading: any = null;

  private errorBoundary: IErrorBoundaryConfig = { fallbackUI: () => '', afterCatch: () => {} };

  private providers: { [key: string]: Provider; } = {};

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

  registerErrorBoundary(config: IErrorBoundaryConfig) {
    if (!config) {
      return;
    }
    this.errorBoundary = config;
  }

  registerProvider(CustomProvider: any) {
    try {
      const p = new CustomProvider();
      this.providers[p.getContainerId()] = p;
    } catch (error) {
      console.error(error.message);
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

  getErrorBoundary(): any {
    return this.errorBoundary;
  }

  getProvider(id?: string) {
    if (!id) {
      for (const key in this.providers) {
        if (Object.prototype.hasOwnProperty.call(this.providers, key)) {
          return this.providers[key];
        }
      }
    } else {
      return this.providers[id];
    }
  }
}
