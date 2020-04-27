/**
 * Storage the const variables
 */

 /**
  * Global
  */
export const VERSION = '5.3.0';

/**
 * schema version defined in alibaba
 */
export const ALI_SCHEMA_VERSION = '1.0.0';

export const VE_EVENTS = {
  /**
   * node props to be dynamically replaced
   * @event props the new props object been replaced
   */
  VE_NODE_CREATED: 've.node.created',
  VE_NODE_DESTROY: 've.node.destroyed',
  VE_NODE_PROPS_REPLACE: 've.node.props.replaced',
  // copy / clone node
  VE_OVERLAY_ACTION_CLONE_NODE: 've.overlay.cloneElement',
  // remove / delete node
  VE_OVERLAY_ACTION_REMOVE_NODE: 've.overlay.removeElement',
  // one page successfully mount on the DOM
  VE_PAGE_PAGE_READY: 've.page.pageReady',
};

export const VE_HOOKS = {
  // a decorator function
  VE_NODE_PROPS_DECORATOR: 've.leaf.props.decorator',
  // a remove callback function
  VE_NODE_REMOVE_HELPER: 've.outline.actions.removeHelper',
  /**
   * provide customization field
   */
  VE_SETTING_FIELD_PROVIDER: 've.settingField.provider',
  /**
   * VariableSetter for variable mode of a specified prop
   */
  VE_SETTING_FIELD_VARIABLE_SETTER: 've.settingField.variableSetter',
};
