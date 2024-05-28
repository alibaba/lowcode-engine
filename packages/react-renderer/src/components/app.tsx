import { isLowCodeComponentSchema } from '@alilc/lowcode-shared';
import { useRenderContext } from '../context/render';
import { createComponentBySchema, ReactComponent } from '../runtime';
import Route from './route';
import { rendererExtends } from '../plugin';

export default function App() {
  const { schema, packageManager } = useRenderContext();
  const appWrappers = rendererExtends.getAppWrappers();
  const wrappers = rendererExtends.getRouteWrappers();

  function getLayoutComponent() {
    const config = schema.get('config');
    const componentName = config?.layout?.componentName as string;

    if (componentName) {
      const Component = packageManager.getComponent<ReactComponent>(componentName);

      if (isLowCodeComponentSchema(Component)) {
        return createComponentBySchema(Component.schema, {
          displayName: componentName,
        });
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
    const layoutProps: any = schema.get('config')?.layout?.props ?? {};
    element = <Layout {...layoutProps}>{element}</Layout>;
  }

  if (appWrappers.length > 0) {
    element = appWrappers.reduce((preElement, CurrentWrapper) => {
      return <CurrentWrapper>{preElement}</CurrentWrapper>;
    }, element);
  }

  return element;
}
