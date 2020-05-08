import { debug, ComponentMeta } from './otter-core';
import { IMaterialParsedModel, IMaterialScanModel } from './types';

const log = debug.extend('mat');

export default async function(
  matScanModel: IMaterialScanModel,
  matParsedModels: IMaterialParsedModel[],
): Promise<ComponentMeta[]> {
  const containerList = [];
  for (const matParsedModel of matParsedModels) {
    // TODO 可以开放扩展点让上层使用者指定导出哪些组件或者不导出哪些组件
    // 默认排除掉 defaultExportName 为空的组件
    if (!matParsedModel.componentName) {
      log('skip');
      continue;
    }
    // 组装 manifest
    const manifest: any = await genManifest(matScanModel, matParsedModel);

    containerList.push(manifest);
  }

  return containerList;
}

/**
 * 生成 manifest
 *
 * @param {IMaterialParsedModel} matParsedModel
 * @returns {Promise<
 *     manifestObj: ComponentMeta, // 组件描述
 *   >}
 * @memberof LocalGenerator
 */
export async function genManifest(
  matScanModel: IMaterialScanModel,
  matParsedModel: IMaterialParsedModel,
): Promise<ComponentMeta> {
  const manifestObj: Partial<ComponentMeta> = {
    componentName: matParsedModel.componentName,
    title: matScanModel.pkgName,
    docUrl: '',
    screenshot: '',
    npm: {
      package: matScanModel.pkgName,
      version: matScanModel.pkgVersion,
      exportName: matParsedModel.meta?.exportName || matParsedModel.componentName,
      main: matScanModel.mainFilePath,
      destructuring: matParsedModel.meta?.exportName !== 'default',
      subName: matParsedModel.meta?.subName || '',
    },
  };

  // 填充 props
  manifestObj.props = matParsedModel.props;
  // 执行扩展点
  return manifestObj as ComponentMeta;
}
