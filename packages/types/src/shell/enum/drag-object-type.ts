// eslint-disable-next-line no-shadow
export enum IPublicEnumDragObjectType {
  // eslint-disable-next-line no-shadow
  Node = 'node',
  NodeData = 'nodedata',
}

/**
 * @deprecated use IPublicEnumDragObjectType instead
 */
export enum DragObjectType {
  Node = IPublicEnumDragObjectType.Node,
  NodeData = IPublicEnumDragObjectType.NodeData,
}
