/**
 * 扩展点：获取打包后的 bundle 文件
 * （物料化场景）
 */
type IExtensionBuildBundle = (params: {
  bundleJS: string; // bundle 文件内容
  bundleObj: { [key: string]: any }; // bundle 对象
}) => Promise<void>;

export default IExtensionBuildBundle;
