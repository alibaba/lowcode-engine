import { writeFile } from 'fs-extra';

/**
 * 处理 containerJS（物料化场景下可以使用此扩展点）
 * - 扩展点名称：mat:config:container
 * - 对应 Studio 所处状态：进入 就绪态 前
 *
 * @export
 * @param {{
 *   filePath: string,
 *   fileContent: string,
 * }} params
 * @returns {Promise<{
 *   filePath: string,
 *   fileContent: string,
 * }>}
 */
export default async function matConfigContainer(params: {
  filePath: string;
  fileContent: string;
}): Promise<{
  filePath: string;
  fileContent: string;
}> {
  await writeFile(params.filePath, params.fileContent);

  return {
    filePath: params.filePath,
    fileContent: params.fileContent,
  };
}
