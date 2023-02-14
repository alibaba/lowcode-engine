import { IPublicTypeComponentMetadata, IPublicTypeFieldConfig, IPublicTypeConfigure } from './';

/**
 * @todo 待补充文档
 */
export interface IPublicTypeTransformedComponentMetadata extends IPublicTypeComponentMetadata {
  configure: IPublicTypeConfigure & { combined?: IPublicTypeFieldConfig[] };
}
