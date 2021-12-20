import type { NodeSchema, CompositeObject } from '@ali/lowcode-types';
import type { TComponentAnalyzer } from '../types';

import { handleSubNodes } from '../utils/schema';

export const componentAnalyzer: TComponentAnalyzer = (container) => {
  let hasRefAttr = false;
  const nodeValidator = (n: NodeSchema) => {
    if (n.props) {
      const props = n.props as CompositeObject;
      if (props.ref) {
        hasRefAttr = true;
      }
    }
  };

  nodeValidator(container);

  if (!hasRefAttr && container.children) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    handleSubNodes<void>(
      container.children,
      {
        node: nodeValidator,
      },
      {
        rerun: true,
      },
    );
  }

  return {
    isUsingRef: hasRefAttr,
  };
};
