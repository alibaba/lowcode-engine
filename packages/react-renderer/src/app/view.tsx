import { useRenderContext } from './context';
import { getComponentByName } from '../runtime/component';
import { extension } from './extension';

export function ApplicationView() {
  const renderContext = useRenderContext();
  const { schema } = renderContext;
  const appWrappers = extension.getAppWrappers();
  const Outlet = extension.getOutlet();

  if (!Outlet) return null;

  let element = <Outlet />;

  const layoutConfig = schema.get('config')?.layout;

  if (layoutConfig) {
    const componentName = layoutConfig.componentName;
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
