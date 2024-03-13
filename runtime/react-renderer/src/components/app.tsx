import { AppContext, type AppContextObject } from '../context/app';
import { createComponent } from '../api/createComponent';
import Route from './route';

export default function App({ context }: { context: AppContextObject }) {
  const { schema, config, renderer, packageManager, appScope } = context;
  const appWrappers = renderer.getAppWrappers();
  const wrappers = renderer.getRouteWrappers();

  function getLayoutComponent() {
    const layoutName = schema.getByPath('config.layout.componentName');

    if (layoutName) {
      const Component: any = packageManager.getComponent(layoutName);

      if (Component?.devMode === 'lowCode') {
        const componentsMap = schema.getComponentsMaps();
        const componentsRecord =
          packageManager.getComponentsNameRecord<any>(componentsMap);

        const Layout = createComponent({
          componentsTree: Component.schema,
          componentsRecord,

          dataSourceCreator: config.get('dataSourceCreator'),
          supCodeScope: appScope,
        });

        return Layout;
      }

      return Component;
    }
  }

  const Layout = getLayoutComponent();

  let element = <Route />;

  if (wrappers.length > 0) {
    element = wrappers.reduce((preElement, CurrentWrapper) => {
      return <CurrentWrapper>{preElement}</CurrentWrapper>;
    }, element);
  }

  if (Layout) {
    const layoutProps = schema.getByPath('config.layout.props') ?? {};
    element = <Layout {...layoutProps}>{element}</Layout>;
  }

  if (appWrappers.length > 0) {
    element = appWrappers.reduce((preElement, CurrentWrapper) => {
      return <CurrentWrapper>{preElement}</CurrentWrapper>;
    }, element);
  }

  return <AppContext.Provider value={context}>{element}</AppContext.Provider>;
}
