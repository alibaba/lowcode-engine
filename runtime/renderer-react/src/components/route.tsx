import { usePageConfig } from '../context/router';
import { useAppContext } from '../context/app';
import RouteOutlet from './outlet';

export default function Route(props: any) {
  const { schema, renderer } = useAppContext();
  const pageConfig = usePageConfig();
  const Outlet = renderer.getOutlet() ?? RouteOutlet;

  if (Outlet && pageConfig) {
    let componentsTree;
    const { type = 'lowCode', mappingId } = pageConfig;

    if (type === 'lowCode') {
      componentsTree = schema.getComponentsTrees().find((item) => item.id === mappingId);
    }

    return <Outlet {...props} pageConfig={pageConfig} componentsTree={componentsTree} />;
  }

  return null;
}
