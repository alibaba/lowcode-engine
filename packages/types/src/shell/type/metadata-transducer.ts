import { IPublicTypeTransformedComponentMetadata } from './';


export interface IPublicTypeMetadataTransducer {
  (prev: IPublicTypeTransformedComponentMetadata): IPublicTypeTransformedComponentMetadata;
  /**
   * 0 - 9   system
   * 10 - 99 builtin-plugin
   * 100 -   app & plugin
   */
  level?: number;
  /**
   * use to replace TODO
   */
  id?: string;
}
