import { type ComponentTree, type PageConfig } from '@alilc/lowcode-shared';
import { useMemo } from 'react';
import { useAppContext } from '../context';
import { OutletProps } from '../boosts';
import { useRouteLocation } from '../context';
import { createComponent } from '../../runtime/createComponent';
import { reactiveStateFactory } from '../reactiveState';

export function RouteOutlet(props: OutletProps) {
  const app = useAppContext();
  const location = useRouteLocation();
  const { schema, options } = app;

  const pageConfig = useMemo(() => {
    const pages = schema.get<PageConfig[]>('pages', []);
    const matched = location.matched[location.matched.length - 1];

    if (matched) {
      const page = pages.find((item) => matched.page === item.mappingId);
      return page;
    }

    return undefined;
  }, [location]);

  if (pageConfig?.type === 'lowCode') {
    const componentsTrees = schema.get<ComponentTree[]>('componentsTree', []);
    const target = componentsTrees.find((item) => item.id === pageConfig.mappingId);

    if (!target) return null;

    const {
      stateCreator = reactiveStateFactory,
      dataSourceCreator,
      ...otherOptions
    } = options.component ?? {};
    const LowCodeComponent = createComponent(target, app.codeRuntime, app.components, {
      displayName: pageConfig.id,
      modelOptions: {
        metadata: pageConfig,
        stateCreator,
        dataSourceCreator,
      },
      ...otherOptions,
    });

    return <LowCodeComponent {...props} />;
  }

  return null;
}
