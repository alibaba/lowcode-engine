import { useMemo } from 'react';
import { useRendererContext } from '../api/context';
import { OutletProps } from '../app/boosts';
import { useRouteLocation } from './context';
import { createComponentBySchema } from '../runtime/schema';

export function RouteOutlet(props: OutletProps) {
  const context = useRendererContext();
  const location = useRouteLocation();
  const { schema, packageManager } = context;

  const pageConfig = useMemo(() => {
    const pages = schema.get('pages') ?? [];
    const matched = location.matched[location.matched.length - 1];

    if (matched) {
      const page = pages.find((item) => matched.page === item.mappingId);
      return page;
    }

    return undefined;
  }, [location]);

  if (pageConfig?.type === 'lowCode') {
    // 在页面渲染时重新获取 componentsMap
    // 因为 componentsMap 可能在路由跳转之前懒加载新的页面 schema
    const componentsMap = schema.get('componentsMap');
    packageManager.resolveComponentMaps(componentsMap);

    const LowCodeComponent = createComponentBySchema(pageConfig.mappingId, {
      displayName: pageConfig.id,
      modelOptions: {
        metadata: pageConfig,
      },
    });

    return <LowCodeComponent {...props} />;
  }

  return null;
}
