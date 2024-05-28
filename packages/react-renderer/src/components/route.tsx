import { type Spec } from '@alilc/lowcode-shared';
import { useRenderContext } from '../context/render';
import { usePageConfig } from '../context/router';
import { rendererExtends } from '../plugin';
import { createComponentBySchema } from '../runtime';

export interface OutletProps {
  pageConfig: Spec.PageConfig;

  [key: string]: any;
}

export default function Route(props: any) {
  const pageConfig = usePageConfig();

  if (pageConfig) {
    const Outlet = rendererExtends.getOutlet() ?? RouteOutlet;

    return <Outlet {...props} pageConfig={pageConfig} />;
  }

  return null;
}

function RouteOutlet({ pageConfig }: OutletProps) {
  const context = useRenderContext();
  const { schema, packageManager } = context;
  const { type = 'lowCode', mappingId } = pageConfig;

  if (type === 'lowCode') {
    // 在页面渲染时重新获取 componentsMap
    // 因为 componentsMap 可能在路由跳转之前懒加载新的页面 schema
    const componentsMap = schema.get('componentsMap');
    packageManager.resolveComponentMaps(componentsMap);

    const LowCodeComponent = createComponentBySchema(mappingId, {
      displayName: pageConfig?.id,
    });

    return <LowCodeComponent />;
  }

  return null;
}
