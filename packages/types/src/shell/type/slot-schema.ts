import { IPublicTypeNodeData } from './node-data';
import { IPublicTypeNodeSchema } from './node-schema';

/**
 * Slot schema 描述
 */
export interface IPublicTypeSlotSchema extends IPublicTypeNodeSchema {
  componentName: 'Slot';
  name?: string;
  title?: string;
  params?: string[];
  props?: {
    slotTitle?: string;
    slotName?: string;
    slotParams?: string[];
  };
  children?: IPublicTypeNodeData[] | IPublicTypeNodeData;
}
