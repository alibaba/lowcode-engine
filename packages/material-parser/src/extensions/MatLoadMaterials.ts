import { IMaterialinSchema } from '../otter-core';

/**
 * 加载物料（物料接入场景下可以使用此扩展点）
 * - 扩展点名称：mat:config:load
 * - 对应 Studio 所处状态：进入 就绪态 前
 *
 * @export
 * @param {string[]} pkgNameList
 * @returns {Promise<IMaterialinSchema[]>}
 */
export default function matLoadMaterials(
  pkgNameList: string[],
): Promise<IMaterialinSchema[]> {
  return Promise.resolve([]);
}
