import { IPublicTypeNodeSchema } from './shell';

export enum ActivityType {
  ADDED = 'added',
  DELETED = 'deleted',
  MODIFIED = 'modified',
  COMPOSITE = 'composite',
}

interface IActivityPayload {
  schema: IPublicTypeNodeSchema;
  location?: {
    parent: {
      nodeId: string;
      index: number;
    };
  };
  prop: any;
  oldValue: any;
  newValue: any;
}
