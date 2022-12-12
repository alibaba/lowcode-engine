import { AssetsJson, ComponentDescription } from '@alilc/lowcode-types';

export function assetsTransform(assets: AssetsJson) {
  const { components, packages } = assets;
  const packageMaps = (packages || []).reduce((acc, cur) => {
    const key = (cur.id || cur.package) as string;
    acc[key] = cur;
    return acc;
  }, {} as any);
  components.forEach((componentDesc) => {
    let { devMode, schema, reference } = componentDesc as ComponentDescription;
    if ((devMode as string) === 'lowcode') {
      devMode = 'lowCode';
    } else if (devMode === 'proCode') {
      devMode = 'proCode';
    }
    if (devMode) {
      (componentDesc as ComponentDescription).devMode = devMode;
    }
    if (devMode === 'lowCode' && !schema && reference) {
      (componentDesc as ComponentDescription).schema = packageMaps[reference.id as string].schema;
    }
  });
  return assets;
}