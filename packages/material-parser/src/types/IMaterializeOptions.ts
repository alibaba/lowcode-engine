import ExtensionName from './ExtensionName';
import IExtensionConfigManifest from './IExtensionConfigManifest';

/**
 * 物料化配置项
 * @interface IMaterializeOptions
 */
interface IMaterializeOptions {
  /**
   * 组件文件(夹)路径或包名
   * 形如：
   *  本地路径：/usr/project/src/container/DemoMaterial
   *  包名：@ali/demo-material@0.0.1
   */
  entry: string;

  /**
   * 组件根目录，当entry为文件路径的时候，可以用root来指定根目录，当entry为文件夹时，root默认为entry
   * 形如：
   *  相对路径：./
   *  绝对路径：/usr/project/src/container/DemoMaterial
   */
  root?: string;

  /**
   * 接入渠道
   * （local：表示本地物料工作台方式接入，online：表示在线 npm 包接入）
   * @type {('local' | 'online')}
   * @memberof IMaterializeOptions
   */
  accesser: 'local' | 'online';

  /**
   * 当 accesser=online 时，配置要使用的 npm client，如：tnpm、cnpm、yarn、npm
   */
  npmClient?: string;
}

export default IMaterializeOptions;
