import { Node } from '@ali/lowcode-designer';

export function nodeTopFixedReducer(props: any, node: Node) {
  if (node.componentMeta.isTopFixed) {
    return {
      ...props,
      // experimental prop value
      __isTopFixed__: true,
    };
  }
  return props;
}
