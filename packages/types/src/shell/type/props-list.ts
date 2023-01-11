import { IPublicTypeCompositeValue } from './';

export type IPublicTypePropsList = Array<{
  spread?: boolean;
  name?: string;
  value: IPublicTypeCompositeValue;
}>;
