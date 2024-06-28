import { useRendererContext } from '../api/context';
import { getComponentByName } from '../runtime/schema';
import { boosts } from './boosts';

export function ApplicationView() {
  const rendererContext = useRendererContext();
  const { schema } = rendererContext;
  const appWrappers = boosts.getAppWrappers();
  const Outlet = boosts.getOutlet();

  if (!Outlet) return null;

  let element = <Outlet />;

  const layoutConfig = schema.get('config')?.layout;

  if (layoutConfig) {
    const componentName = layoutConfig.componentName;
    const Layout = getComponentByName(componentName, rendererContext);

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
