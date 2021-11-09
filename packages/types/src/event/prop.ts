export interface ChangeOptions {
  key?: string | number;
  prop?: any;
  node: Node;
  newValue: any;
  oldValue: any;
}

/**
 * Node Prop 变化事件
 * @Deprecated Please Replace With InnerPropChange
 */
export const Change = 'node.prop.change';

/** Node Prop 变化事件 */
export const InnerChange = 'node.innerProp.change';