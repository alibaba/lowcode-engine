/**
 * 获取打包后的 bundle 文件（物料化场景下可以使用此扩展点）
 * - 扩展点名称：mat:build:bundle
 * - 对应 Studio 所处状态：进入 就绪态 前
 *
 * @export
 * @param {{
 *   bundleJS: string, // bundle 文件内容
 *   bundleObj: {[key: string]: any} // bundle 对象
 * }} params
 * @returns {Promise<void>}
 */
export default function matBuildBundle(params: {
  bundleJS: string; // bundle 文件内容
  bundleObj: { [key: string]: any }; // bundle 对象
}): Promise<void> {
  return Promise.resolve();
}
