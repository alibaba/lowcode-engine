import { NodeSchema } from './schema';
import { IPublicModelNode } from './shell';

export interface DragAnyObject {
  type: string;
  [key: string]: any;
}

export interface DragNodeDataObject {
  type: DragObjectType.NodeData;
  data: NodeSchema | NodeSchema[];
  thumbnail?: string;
  description?: string;
  [extra: string]: any;
}

export type DragObject = DragNodeObject | DragNodeDataObject | DragAnyObject;

// eslint-disable-next-line no-shadow
export enum DragObjectType {
  // eslint-disable-next-line no-shadow
  Node = 'node',
  NodeData = 'nodedata',
}

export interface DragNodeObject {
  type: DragObjectType.Node;
  nodes: (Node | IPublicModelNode)[];
}