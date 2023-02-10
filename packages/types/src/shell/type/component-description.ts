import { IPublicTypeComponentMetadata, IPublicTypeReference } from './';

/**
 * 本地物料描述
 */

export interface IPublicTypeComponentDescription extends IPublicTypeComponentMetadata {
  /**
   * @todo 待补充文档 @jinchan
   */
  keywords: string[];
  /**
   * 替代 npm 字段的升级版本
   */
  reference?: IPublicTypeReference;
}
