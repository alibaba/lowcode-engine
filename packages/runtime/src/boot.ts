import { ComponentClass, FunctionComponent } from 'react';

type TComponent = ComponentClass | FunctionComponent;

class Trunk {
  private renderer: TComponent | null = null;
  private layouts: { [key: string]: TComponent } = {};
  private loading: TComponent | null = null;

  registerRenderer(renderer: TComponent): any {
    this.renderer = renderer;
  }

  registerLayout(componentName: string, Layout: TComponent): any {
    if (!componentName || !Layout) {
      return;
    }
    this.layouts[componentName] = Layout;
  }

  registerLoading(component: TComponent) {
    if (!component) {
      return;
    }
    this.loading = component;
  }

  getLayout(componentName: string) {
    if (!componentName) {
      return;
    }
    return this.layouts[componentName];
  }

  getRenderer(): TComponent | null {
    return this.renderer;
  }

  getLoading(): TComponent | null {
    return this.loading;
  }
}

export default new Trunk();
