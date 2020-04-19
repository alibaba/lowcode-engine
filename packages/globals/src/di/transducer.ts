import { TransformedComponentMetadata } from '../types';

export interface MetadataTransducer {
  (prev: TransformedComponentMetadata): TransformedComponentMetadata;
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
const metadataTransducers: MetadataTransducer[] = [];

export function registerMetadataTransducer(transducer: MetadataTransducer, level: number = 100, id?: string) {
  transducer.level = level;
  transducer.id = id;
  const i = metadataTransducers.findIndex(item => item.level != null && item.level > level);
  if (i < 0) {
    metadataTransducers.push(transducer);
  } else {
    metadataTransducers.splice(i, 0, transducer);
  }
}

export function getRegisteredMetadataTransducers(): MetadataTransducer[] {
  return metadataTransducers;
}
