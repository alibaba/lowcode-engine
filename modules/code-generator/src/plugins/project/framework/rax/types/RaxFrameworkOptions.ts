export type RaxFrameworkOptions = {
  /**
   * 默认的页面标题
   */
  title?: string;

  /**
   * 目标环境（默认是仅 web 环境）
   */
  targets?: Array<'web' | 'miniapp' | string>;

  /**
   * 小程序引擎选择，默认为运行时引擎。如需启用编译时引擎，则配置为 compile
   */
  miniAppBuildType?: MiniAppBuildType;

  /**
   * 构建配置
   */
  buildConfig?: {
    inlineStyle?: boolean | { forceEnableCSS: boolean };
    alias?: { [key: string]: string };
    publicPath?: string;
    devPublicPath?: string;
    sourceMap?: boolean | string;
    externals?: { [key: string]: string };
    hash?: boolean | string;
    polyfill?: string | false;
    minify?: boolean;
    outputDir?: string;
    proxy?: { [key: string]: string };
    devServer?: { [key: string]: unknown };
    browserslist?: string | { [key: string]: string };
    compileDependencies?: string[];
    miniapp?: { [key: string]: unknown };
    [key: string]: unknown;
  };

  /**
   * 数据源配置
   */
  datasourceConfig?: {
    /** 数据源引擎的版本 */
    engineVersion?: string;

    /** 数据源引擎的包名 */
    enginePackage?: string;

    /** 数据源 handlers 的版本 */
    handlersVersion?: {
      [key: string]: string;
    };

    /** 数据源 handlers 的包名 */
    handlersPackages?: {
      [key: string]: string;
    };
  };

  /** 包名 */
  packageName?: string;

  /** 版本 */
  packageVersion?: string;

  /** 全局样式文件的类型 */
  globalStylesFileType?: 'css' | 'scss' | 'less';

  /** 应用配置 */
  appConfig?: {
    /** 路由配置 */
    router?: {
      type?: 'browser' | 'hash' | string;
      basename?: string;
    };
  };

  // TODO: [p1]支持 MPA 模式？
};

export type MiniAppBuildType = 'compile' | 'runtime';
