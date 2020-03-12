import { ComponentClass } from 'react';

class Trunk {
  private renderer: ComponentClass | null = null;
  private layouts: { [key: string]: ComponentClass } = {};

  public registerRenderer(renderer: ComponentClass): any {
    this.renderer = renderer;
  }

  public registerLayout(componentName: string, Layout: ComponentClass): any {
    if (!componentName || !Layout) {
      return;
    }
    this.layouts[componentName] = Layout;
  }

  public getLayout(componentName: string) {
    if (!componentName) {
      return;
    }
    return this.layouts[componentName];
  }

  public getRenderer(): ComponentClass | null {
    return this.renderer;
  }
}

export default new Trunk();
