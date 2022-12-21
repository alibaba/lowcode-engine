import { IPublicTypeNodeSchema } from './shell/type/node-schema';
import { IPublicTypeNodeData } from './shell/type/node-data';

export type NodeDataType = IPublicTypeNodeData | IPublicTypeNodeData[];
/**
 * Slot schema 描述
 */
export interface SlotSchema extends IPublicTypeNodeSchema {
  componentName: 'Slot';
  name?: string;
  title?: string;
  params?: string[];
  props?: {
    slotTitle?: string;
    slotName?: string;
    slotParams?: string[];
  };
  children?: IPublicTypeNodeSchema[];
}
