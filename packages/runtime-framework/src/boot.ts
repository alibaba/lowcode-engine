import { ComponentClass, FunctionComponent } from 'react';

type TComponent = ComponentClass | FunctionComponent;

class Trunk {
  private renderer: TComponent | null = null;
  private layouts: { [key: string]: TComponent } = {};
  private loading: TComponent | null = null;

  public registerRenderer(renderer: TComponent): any {
    this.renderer = renderer;
  }

  public registerLayout(componentName: string, Layout: TComponent): any {
    if (!componentName || !Layout) {
      return;
    }
    this.layouts[componentName] = Layout;
  }

  public registerLoading(component: TComponent) {
    if (!component) {
      return;
    }
    this.loading = component;
  }

  public getLayout(componentName: string) {
    if (!componentName) {
      return;
    }
    return this.layouts[componentName];
  }

  public getRenderer(): TComponent | null {
    return this.renderer;
  }

  public getLoading(): TComponent | null {
    return this.loading;
  }
}

export default new Trunk();
