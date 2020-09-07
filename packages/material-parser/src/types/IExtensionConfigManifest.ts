import { ComponentMeta } from '../core';
/**
 * 扩展点：配置 manifest
 * （物料化场景）
 */
type IExtensionConfigManifest = (params: {
  manifestObj: ComponentMeta; // manifest 配置对象
  manifestFilePath: string; // manifest 文件默认路径
}) => Promise<{
  manifestJSON: string; // manifest 文件内容
  manifestFilePath: string; // manifest 文件路径
  manifestObj: ComponentMeta; // manifest 文件对象
}>;

export default IExtensionConfigManifest;
