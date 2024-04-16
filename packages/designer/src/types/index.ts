export type NodeRemoveOptions = {
  suppressRemoveEvent?: boolean;
};

export enum EDITOR_EVENT {
  NODE_CHILDREN_CHANGE = 'node.children.change',

  NODE_VISIBLE_CHANGE = 'node.visible.change',
}
