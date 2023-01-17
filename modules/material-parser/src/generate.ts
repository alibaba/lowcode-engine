import * as path from 'path';
import { debug, ComponentMeta } from './core';
import { IMaterialParsedModel, IMaterialScanModel, IInternalMaterializeOptions } from './types';

const log = debug.extend('gen');

export default async function (
  matScanModel: IMaterialScanModel,
  matParsedModels: IMaterialParsedModel[],
  options: IInternalMaterializeOptions,
): Promise<ComponentMeta[]> {
  const containerList = [];
  for (const matParsedModel of matParsedModels) {
    // 默认排除掉 defaultExportName 为空的组件
    if (!matParsedModel.componentName) {
      log('skip');
      continue;
    }
    // 组装 manifest
    const manifest: any = await genManifest(matScanModel, matParsedModel, options);

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
  options: IInternalMaterializeOptions,
): Promise<ComponentMeta> {
  const manifestObj: Partial<ComponentMeta> = {
    componentName: matParsedModel.componentName,
    title: matParsedModel.meta?.title || matScanModel.pkgName,
    docUrl: matParsedModel.meta?.docUrl || '',
    screenshot: matParsedModel.meta?.screenshot || '',
    devMode: 'proCode', // 需要入料的组件都是源码模式，低代码组件在平台上即可直接生成描述
    npm: {
      package: matScanModel.pkgName,
      version: matScanModel.pkgVersion,
      exportName: matParsedModel.meta?.exportName || matParsedModel.componentName,
      main:
        options.root && path.isAbsolute(matScanModel.mainFilePath)
          ? path.relative(options.root, matScanModel.mainFilePath)
          : matScanModel.mainFilePath,
      destructuring: matParsedModel.meta?.exportName !== 'default',
      subName: matParsedModel.meta?.subName || '',
    },
  };

  // 填充 props
  manifestObj.props = matParsedModel.props;
  // 执行扩展点
  return manifestObj as ComponentMeta;
}
