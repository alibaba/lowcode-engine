import { writeFile } from 'fs-extra';
import { IMaterialinManifest } from '../otter-core';

/**
 * 配置 manifest（物料化场景下可以使用此扩展点）
 * - 扩展点名称：mat:config:manifest
 * - 对应 Studio 所处状态：进入 就绪态 前
 *
 * @export
 * @param {{
 *   manifestObj: IMaterialinManifest,
 *   manifestFilePath: string,
 * }} params
 * @returns {Promise<{
 *   manifestJS: string,
 *   manifestFilePath: string,
 *   manifestObj: IMaterialinManifest,
 * }>}
 */
export default async function matConfigManifest(params: {
  manifestObj: IMaterialinManifest;
  manifestFilePath: string;
}): Promise<{
  manifestJS: string;
  manifestFilePath: string;
  manifestObj: IMaterialinManifest;
}> {
  const manifestJS = `export default ${JSON.stringify(params.manifestObj)}`;

  await writeFile(params.manifestFilePath, manifestJS);

  return Promise.resolve({
    manifestJS,
    manifestObj: params.manifestObj,
    manifestFilePath: params.manifestFilePath,
  });
}
