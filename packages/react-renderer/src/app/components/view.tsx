import { AppContext } from '../context';
import { type App } from '../app';
import { getOrCreateComponent, reactiveStateFactory } from '../../runtime';
import { RouterView } from './routerView';
import { RouteOutlet } from './route';
import { type WrapperComponent, type Outlet } from '../boosts';

export const createAppView = (app: App, wrappers: WrapperComponent[], Outlet: Outlet | null) => {
  return function ApplicationView() {
    let element = (
      <RouterView router={app.router}>{Outlet ? <Outlet /> : <RouteOutlet />}</RouterView>
    );

    const layoutConfig = app.schema.get<any>('config.layout');

    if (layoutConfig) {
      const componentName = layoutConfig.componentName;
      const {
        stateCreator = reactiveStateFactory,
        dataSourceCreator,
        ...otherOptions
      } = app.options.component ?? {};

      const Layout = getOrCreateComponent(componentName, app.codeRuntime, app.components, {
        displayName: componentName,
        modelOptions: {
          stateCreator,
          dataSourceCreator,
        },
        ...otherOptions,
      });

      if (Layout) {
        const layoutProps: any = layoutConfig.props ?? {};
        element = <Layout {...layoutProps}>{element}</Layout>;
      }
    }

    if (wrappers.length > 0) {
      element = wrappers.reduce((preElement, CurrentWrapper) => {
        return <CurrentWrapper>{preElement}</CurrentWrapper>;
      }, element);
    }

    return <AppContext.Provider value={app}>{element}</AppContext.Provider>;
  };
};
