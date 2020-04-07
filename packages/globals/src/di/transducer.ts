import { TransformedComponentMetadata } from '../types';

export type MetadataTransducer = (prev: TransformedComponentMetadata) => TransformedComponentMetadata;
const metadataTransducers: MetadataTransducer[] = [];

export function registerMetadataTransducer(transducer: MetadataTransducer) {
  metadataTransducers.push(transducer);
}

export function getRegisteredMetadataTransducers(): MetadataTransducer[] {
  return metadataTransducers;
}
