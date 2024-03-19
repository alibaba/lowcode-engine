import { usePageSchema } from '../context/router';
import { useAppContext } from '../context/app';

export default function Route(props: any) {
  const { schema, renderer } = useAppContext();
  const pageSchema = usePageSchema();
  const Outlet = renderer.getOutlet();

  if (Outlet && pageSchema) {
    let componentsTree;
    const { type = 'lowCode', treeId } = pageSchema;

    if (type === 'lowCode') {
      componentsTree = schema
        .getComponentsTrees()
        .find(item => item.id === treeId);
    }

    return (
      <Outlet
        {...props}
        pageSchema={pageSchema}
        componentsTree={componentsTree}
      />
    );
  }

  return null;
}
