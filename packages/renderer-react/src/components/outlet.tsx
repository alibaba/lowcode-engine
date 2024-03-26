import type { PageConfig, ComponentTree } from '@alilc/renderer-core';
import { useAppContext } from '../context/app';
import { createComponent } from '../component';

export interface OutletProps {
  pageConfig: PageConfig;
  componentsTree?: ComponentTree | undefined;

  [key: string]: any;
}

export default function Outlet({ pageSchema, componentsTree }: OutletProps) {
  const { schema, config, packageManager, appScope } = useAppContext();
  const { type = 'lowCode' } = pageSchema;

  if (type === 'lowCode' && componentsTree) {
    const componentsMap = schema.getComponentsMaps();
    const componentsRecord = packageManager.getComponentsNameRecord<any>(componentsMap);

    const LowCodeComponent = createComponent({
      supCodeScope: appScope,
      dataSourceCreator: config.get('dataSourceCreator'),
      componentsTree,
      componentsRecord,
      intl: appScope.value.intl,
    });

    return <LowCodeComponent />;
  }

  return null;
}
