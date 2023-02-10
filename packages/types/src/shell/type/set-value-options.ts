import { IPublicEnumPropValueChangedType } from '../enum';

export interface IPublicTypeSetValueOptions {
  disableMutator?: boolean;
  type?: IPublicEnumPropValueChangedType;
  fromSetHotValue?: boolean;
}
