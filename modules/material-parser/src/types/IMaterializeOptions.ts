import { Expand } from './Basic';
import { DSLType } from './DSLType';
/**
 * 通用入料配置项
 * @interface IMaterializeCommonOptions
 */
export interface IMaterializeCommonOptions {
  /**
   * 当 accesser=online 时，配置要使用的 npm client，如：tnpm、cnpm、yarn、npm
   */
  npmClient?: string;
  /**
   * 当前dsl类型，可选值包括'react' | 'rax'
   */
  dslType?: DSLType;
}

/**
 * 本地入料配置项
 * @interface IMaterializeOnlineOptions
 */
export interface IMaterializeLocalOptions extends IMaterializeCommonOptions {
  /**
   * 接入渠道
   * （local：表示本地物料工作台方式接入，online：表示在线 npm 包接入）
   * @type {('local' | 'online')}
   * @memberof IMaterializeOptions
   */
  accesser: 'local';

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
}

/**
 * 在线入料配置项
 * @interface IMaterializeOnlineOptions
 */
export interface IMaterializeOnlineCommonOptions {
  /**
   * 接入渠道
   * （local：表示本地物料工作台方式接入，online：表示在线 npm 包接入）
   * @type {('local' | 'online')}
   * @memberof IMaterializeOptions
   */
  accesser: 'online';
  /**
   * 临时工作目录，用来存放下载的npm包，可为绝对路径或相对路径
   */
  tempDir?: string;
}

/**
 * 只通过entry指定包名&版本号，无需内部路径
 */
export interface IMaterializeOnlineEntryOptions {
  /**
   * npm包名&版本号，此时无需指定内部路径，会从package.json自动解析
   * 形如：
   *   包名&版本号：@ali/demo-material@0.0.1
   */
  entry: string;
}

export interface IMaterializeOnlinePackageAndVersionOptions {
  /**
   * npm包内部相对路径
   * 形如：
   *   相对路径：lib/index.js
   */
  entry?: string;

  /**
   * npm包名
   * 形如:
   *   react-color
   */
  name: string;

  /**
   * npm包版本号
   * 形如:
   *   latest/1.0.0/1.x.0
   * @default latest
   */
  version?: string;
}

export type IMaterializeOnlineOptions = Expand<
  IMaterializeCommonOptions &
    IMaterializeOnlineCommonOptions &
    (IMaterializeOnlineEntryOptions | IMaterializeOnlinePackageAndVersionOptions)
>;
/**
 * 入料配置项
 * @interface IMaterializeOptions
 */
export type IMaterializeOptions = Expand<IMaterializeLocalOptions | IMaterializeOnlineOptions>;

export type IInternalMaterializeOptions = Expand<
  IMaterializeOptions & {
    root: string;
  }
>;
