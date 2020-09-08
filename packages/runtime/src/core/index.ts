import Container, { ILayoutOptions, IErrorBoundaryConfig } from './container';
import Provider from './provider';
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

  registerErrorBoundary(config: IErrorBoundaryConfig) {
    this.container.registerErrorBoundary(config);
  }

  getLayout(componentName: string) {
    return this.container.getLayout(componentName);
  }

  getRenderer(): any {
    return this.container.getRenderer();
  }

  getLoading(): any {
    return this.container.getLoading();
  }

  getErrorBoundary(): IErrorBoundaryConfig {
    return this.container.getErrorBoundary();
  }

  getProvider(id?: string): Provider | undefined {
    return this.container.getProvider(id);
  }
}

export default new App();
