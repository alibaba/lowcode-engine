import type { PageSchema, PageContainerSchema } from '@alilc/runtime-shared';
import { useAppContext } from '../context/app';
import { createComponent } from '../api/createComponent';
import { PAGE_EVENTS } from '../events';

export interface OutletProps {
  pageSchema: PageSchema;
  componentsTree?: PageContainerSchema | undefined;

  [key: string]: any;
}

export default function Outlet({ pageSchema, componentsTree }: OutletProps) {
  const { schema, config, packageManager, appScope, boosts } = useAppContext();
  const { type = 'lowCode' } = pageSchema;

  if (type === 'lowCode' && componentsTree) {
    const componentsMap = schema.getComponentsMaps();
    const componentsRecord =
      packageManager.getComponentsNameRecord<any>(componentsMap);

    const LowCodeComponent = createComponent({
      supCodeScope: appScope,
      dataSourceCreator: config.get('dataSourceCreator'),
      componentsTree,
      componentsRecord,

      beforeNodeCreateComponent(node) {
        boosts.hooks.call(PAGE_EVENTS.COMPONENT_BEFORE_NODE_CREATE, node);
      },
      nodeCreatedComponent(result) {
        boosts.hooks.call(PAGE_EVENTS.COMPONENT_NODE_CREATED, result);
      },
      nodeComponentRefAttached(node, instance) {
        boosts.hooks.call(
          PAGE_EVENTS.COMPONENT_NODE_REF_ATTACHED,
          node,
          instance
        );
      },
    });

    return <LowCodeComponent />;
  }

  return null;
}
