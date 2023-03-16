/* eslint-disable no-param-reassign */
import { IPublicTypeAssetsJson, IPublicTypeComponentDescription, IPublicTypeProjectSchema, IPublicTypePackage, IPublicTypeRemoteComponentDescription } from '@alilc/lowcode-types';

// TODO: 该转换逻辑未来需要消化掉
export function assetsTransform(assets: IPublicTypeAssetsJson) {
  const { components, packages } = assets;
  const packageMaps = (packages || []).reduce((acc: Record<string, IPublicTypePackage>, cur: IPublicTypePackage) => {
    const key = cur.id || cur.package || '';
    acc[key] = cur;
    return acc;
  }, {} as any);
  components.forEach((componentDesc: IPublicTypeComponentDescription | IPublicTypeRemoteComponentDescription) => {
    let { devMode, schema, reference } = componentDesc;
    if ((devMode as string) === 'lowcode') {
      devMode = 'lowCode';
    } else if (devMode === 'proCode') {
      devMode = 'proCode';
    }
    if (devMode) {
      componentDesc.devMode = devMode;
    }
    let schemaTmp = schema;
    if (devMode === 'lowCode' && !schema && reference) {
      const referenceId = reference.id || '';
      schemaTmp = packageMaps[referenceId].schema;
    }
    /**
     * 背景见issue：https://github.com/alibaba/lowcode-engine/issues/1735
     * 这里主要是为了兼容低代码组件的 schema，在资产包协议中，规定 低代码组件 schema 应该包含了 componentsTree、componentsMap 等外层结构，但是在引擎核心层只支持 componentsTree[0] 这层 NodeSchema 结构，所以先 follow 协议，
     * 在资产包中先支持包含 componentsTree、componentsMap 的 schema 结构，然后在这里转换成引擎核心支持的 NodeSchema 结构。
     * 未来，引擎核心层应该需要支持包含 componentsTree、componentsMap 等字段这种完备的结构。
     **/ 
    if (Array.isArray((schemaTmp as any)?.componentsTree)) {
      componentDesc.schema = (schemaTmp as any)?.componentsTree[0];
    }
  });
  return assets;
}