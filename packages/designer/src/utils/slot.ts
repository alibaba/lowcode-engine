import { Node } from '../document/node/node';

export function includesSlot(node: Node, slotName: string | undefined): boolean {
  const { slots = [] } = node;
  return slots.some(slot => {
    return slotName && slotName === slot?.getExtraProp('name')?.getAsString();
  });
}
