// eslint-disable-next-line no-shadow
export enum IPublicEnumPropValueChangedType {
  /**
   * normal set value
   */
  SET_VALUE = 'SET_VALUE',
  /**
   * value changed caused by sub-prop value change
   */
  SUB_VALUE_CHANGE = 'SUB_VALUE_CHANGE'
}

/**
 * @deprecated please use IPublicEnumPropValueChangedType
 */
export enum PROP_VALUE_CHANGED_TYPE {
  /**
   * normal set value
   */
  SET_VALUE = 'SET_VALUE',
  /**
   * value changed caused by sub-prop value change
   */
  SUB_VALUE_CHANGE = 'SUB_VALUE_CHANGE'
}
