import { useRenderContext } from '../context/render';
import { getComponentByName } from '../runtime';
import Route from './route';
import { rendererExtends } from '../plugin';

export default function App() {
  const renderContext = useRenderContext();
  const { schema } = renderContext;
  const appWrappers = rendererExtends.getAppWrappers();
  const wrappers = rendererExtends.getRouteWrappers();

  let element = <Route />;

  if (wrappers.length > 0) {
    element = wrappers.reduce((preElement, CurrentWrapper) => {
      return <CurrentWrapper>{preElement}</CurrentWrapper>;
    }, element);
  }

  const layoutConfig = schema.get('config')?.layout;

  if (layoutConfig) {
    const componentName = layoutConfig.componentName as string;
    const Layout = getComponentByName(componentName, renderContext);

    if (Layout) {
      const layoutProps: any = layoutConfig.props ?? {};
      element = <Layout {...layoutProps}>{element}</Layout>;
    }
  }

  if (appWrappers.length > 0) {
    element = appWrappers.reduce((preElement, CurrentWrapper) => {
      return <CurrentWrapper>{preElement}</CurrentWrapper>;
    }, element);
  }

  return element;
}
