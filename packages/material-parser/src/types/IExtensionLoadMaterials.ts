import { IMaterialinSchema } from '../otter-core';

/**
 * 扩展点：加载物料（物料接入场景）
 *
 * @interface IExtensionLoadMaterials
 */
type IExtensionLoadMaterials = (
  pkgNameList: string[],
) => Promise<IMaterialinSchema[]>;

export default IExtensionLoadMaterials;
