import { writeFile } from 'fs-extra';
import { IComponentMaterial } from '../otter-core';

/**
 * 配置 manifest（物料化场景下可以使用此扩展点）
 * - 扩展点名称：mat:config:manifest
 * - 对应 Studio 所处状态：进入 就绪态 前
 *
 * @export
 * @param {{
 *   manifestObj: IComponentMaterial,
 *   manifestFilePath: string,
 * }} params
 * @returns {Promise<{
 *   manifestJS: string,
 *   manifestFilePath: string,
 *   manifestObj: IComponentMaterial,
 * }>}
 */
export default async function matConfigManifest(params: {
  manifestObj: IComponentMaterial;
  manifestFilePath: string;
}): Promise<{
  manifestJSON: string;
  manifestFilePath: string;
  manifestObj: IComponentMaterial;
}> {
  const manifestJSON = JSON.stringify(params.manifestObj);

  await writeFile(params.manifestFilePath, manifestJSON);

  return Promise.resolve({
    manifestJSON,
    manifestObj: params.manifestObj,
    manifestFilePath: params.manifestFilePath,
  });
}
