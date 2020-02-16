import ExtensionName from './ExtensionName';
import IExtensionConfigManifest from './IExtensionConfigManifest';

/**
 * 物料化配置项
 * @interface IMaterializeOptions
 */
interface IMaterializeOptions {
  /**
   * 入口文件路径或包名
   * 形如：
   *  本地路径：/usr/project/src/container/DemoMaterial
   *  包名：@ali/demo-material@0.0.1
   */
  entry: string;

  /**
   * 接入渠道
   * （local：表示本地物料工作台方式接入，online：表示在线 npm 包接入）
   * @type {('local' | 'online')}
   * @memberof IMaterializeOptions
   */
  accesser: 'local' | 'online';

  /**
   * 是否为多组件透出场景
   * （true：表示多组件透出场景，false：表示单组件透出场景）
   * @type {boolean}
   * @memberof IMaterializeOptions
   */
  isExportedAsMultiple: boolean;

  /**
   * 当 accesser=local 时，需要通过此配置项指定当前工作目录，形如：/usr/.../demo-project
   * @type {string}
   * @memberof IMaterializeOptions
   */
  cwd?: string;

  /**
   * 扩展点
   */
  extensions?: {
    [ExtensionName.CONFIGMANIFEST]?: IExtensionConfigManifest;
  };

  /**
   * 当 accesser=online 时，配置要使用的 npm client，如：tnpm、cnpm、yarn、npm
   */
  npmClient?: string;
}

export default IMaterializeOptions;
