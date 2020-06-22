import Container, { ILayoutOptions } from './container';
import { IProvider } from './provider';
import runApp from './runApp';

class App {
  private container: Container;

  constructor() {
    this.container = new Container();
  }

  run() {
    runApp();
  }

  registerRenderer(renderer: any): any {
    this.container.registerRenderer(renderer);
  }

  registerLayout(Layout: any, options: ILayoutOptions): any {
    this.container.registerLayout(Layout, options);
  }

  registerLoading(component: any) {
    this.container.registerLoading(component);
  }

  registerProvider(CustomProvider: any) {
    this.container.registerProvider(CustomProvider);
  }

  getLayout(componentName: string) {
    return this.container.getLayout(componentName);
  }

  getRenderer(): any | null {
    return this.container.getRenderer();
  }

  getLoading(): any | null {
    return this.container.getLoading();
  }

  getProvider(): IProvider {
    return this.container.getProvider();
  }
}

export default new App();
