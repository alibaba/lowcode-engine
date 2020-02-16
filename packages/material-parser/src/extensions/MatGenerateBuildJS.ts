/**
 * 生成 build 文件，可用于多组件导出场景（物料化场景下可以使用此扩展点）
 * - 扩展点名称：mat:generate:buildjs
 * - 对应 Studio 所处状态：进入 就绪态 前
 *
 * @export
 * @param {{
 *   buildFileContent: string; // build 文件内容
 *   buildFilePath: string; // build 文件默认路径
 * }} params
 * @returns {Promise<{
 *   buildFileContent: string;
 *   buildFilePath: string;
 * }>}
 */
export default function matGenerateBuildJS(params: {
  buildFileContent: string; // build 文件内容
  buildFilePath: string; // build 文件默认路径
}): Promise<{
  buildFileContent: string;
  buildFilePath: string;
}> {
  return Promise.resolve({
    buildFilePath: params.buildFilePath,
    buildFileContent: params.buildFileContent,
  });
}
