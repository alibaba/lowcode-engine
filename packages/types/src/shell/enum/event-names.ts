/**
 * 所有公开可用的事件名定义
 * All public event names
 * names should be like 'namespace.modelName.whatHappened'
 *
 */
// eslint-disable-next-line no-shadow
export enum IPublicEnumEventNames {
  DOCUMENT_IMPORT_SCHEMA = 'shell.document.importSchema',
  DOCUMENT_FOCUS_NODE_CHANGED = 'shell.document.focusNodeChanged',
  SKELETON_PANEL_SHOW = 'skeleton.panel.show',
  SKELETON_PANEL_HIDE = 'skeleton.panel.hide',
  DESIGNER_DOCUMENT_REMOVE = 'designer.document.remove',
  DOCUMENT_DROPLOCATION_CHANGED = 'document.dropLocation.changed',
}