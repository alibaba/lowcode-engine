import { Spec } from '@alilc/lowcode-shared';

export interface NormalizedComponentNode extends Spec.ComponentNode {
  loopArgs: [string, string];
  props: Spec.ComponentNodeProps;
}

export function normalizeComponentNode(node: Spec.ComponentNode): NormalizedComponentNode {
  return {
    ...node,
    loopArgs: node.loopArgs ?? ['item', 'index'],
    props: node.props ?? {},
    condition: node.condition || node.condition === false ? node.condition : true,
  };
}
