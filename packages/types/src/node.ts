
export interface NodeStatus {
  locking: boolean;
  pseudo: boolean;
  inPlaceEditing: boolean;
}

export interface LeafNode extends Node {
  readonly children: null;
}
