import { IPublicTypeNodeSchema } from './shell';

export enum ActivityType {
  'ADDED' = 'added',
  'DELETED' = 'deleted',
  'MODIFIED' = 'modified',
  'COMPOSITE' = 'composite',
}

export interface IActivityPayload {
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

export type ActivityData = {
  type: ActivityType;
  payload: IActivityPayload;
};
