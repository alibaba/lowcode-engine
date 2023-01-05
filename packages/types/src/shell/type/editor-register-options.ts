/**
 * duck-typed power-di
 *
 * @see https://www.npmjs.com/package/power-di
 */
export interface IPublicTypeEditorRegisterOptions {

  /**
   * default: true
   */
  singleton?: boolean;

  /**
   * if data a class, auto new a instance.
   * if data a function, auto run(lazy).
   *  default: true
   */
  autoNew?: boolean;
}
