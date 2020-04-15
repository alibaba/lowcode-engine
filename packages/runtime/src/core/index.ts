import { ReactType } from 'react';
import Container, { ILayoutOptions } from './container';
import run from './run';

class App {
  private container: Container;

  constructor() {
    this.container = new Container();
  }

  run() {
    run();
  }

  registerRenderer(renderer: ReactType): any {
    this.container.registerRenderer(renderer);
  }

  registerLayout(Layout: ReactType, options: ILayoutOptions): any {
    this.container.registerLayout(Layout, options);
  }

  registerLoading(component: ReactType) {
    this.container.registerLoading(component);
  }

  registerProvider(CustomProvider: any) {
    this.container.registerProvider(CustomProvider);
  }

  getLayout(componentName: string) {
    return this.container.getLayout(componentName);
  }

  getRenderer(): ReactType | null {
    return this.container.getRenderer();
  }

  getLoading(): ReactType | null {
    return this.container.getLoading();
  }

  getProvider() {
    return this.container.getProvider();
  }
}

export default new App();
