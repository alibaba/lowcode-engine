import ExtensionName from './ExtensionName';
import IExtensionLoadMaterials from './IExtensionLoadMaterials';

interface IMaterialInOptions {
  /**
   * 配置从哪些 CDN 加载组件
   * （当 channel=online 时生效）
   * 形如：
   *  https://unpkg.alibaba-inc.com/
   *  https://unpkg.com/
   *  https://cdn.jsdelivr.net/npm/
   */
  cdn?: string[];

  /**
   * 扩展点
   */
  extensions?: {
    [ExtensionName.LOADMATERIALS]?: IExtensionLoadMaterials;
  };
}

export default IMaterialInOptions;
