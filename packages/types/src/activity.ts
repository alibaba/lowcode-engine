import { NodeSchema } from './schema';

export enum ActivityType {
  'ADDED' = 'added',
  'DELETED' = 'deleted',
  'MODIFIED' = 'modified',
  'COMPOSITE' = 'composite',
}

export interface IActivityPayload {
  schema: NodeSchema;
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

export type ActivityData = {
  type: ActivityType;
  payload: IActivityPayload;
};
