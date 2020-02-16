/**
 * 编译器 - 用于编译并打包生成 bundle.js
 * @interface ICompiler
 */
interface ICompiler {
  /**
   * 编译
   * @param {{ [key: string]: any }} config webpack 配置文件
   * @returns {Promise<void>}
   * @memberof ICompiler
   */
  compile(config: { [key: string]: any }): Promise<void>;
}

export default ICompiler;
