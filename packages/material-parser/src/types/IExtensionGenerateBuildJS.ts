/**
 * 扩展点：生成 build 文件
 * （物料化场景）
 */
type IExtensionGenerateBuildJS = (params: {
  buildFilePath: string; // 文件默认路径
  buildFileContent: string; // 文件内容
}) => Promise<{
  buildFilePath: string;
  buildFileContent: string;
}>;

export default IExtensionGenerateBuildJS;
