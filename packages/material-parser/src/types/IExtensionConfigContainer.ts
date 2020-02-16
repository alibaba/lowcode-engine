/**
 * 扩展点：配置 container
 * （物料化场景）
 */
type IExtensionConfigContainer = (params: {
  filePath: string; // container 文件默认路径
  fileContent: string; // container 文件内容
}) => Promise<{
  filePath: string;
  fileContent: string;
}>;

export default IExtensionConfigContainer;
