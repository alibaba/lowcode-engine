import Node, { NodeParent } from './node';
import { RootSchema } from '../../schema';
import DocumentModel from '../document-model';
import NodeChildren from './node-children';
import Props from './props/props';

/**
 * 根容器节点
 *
 * [Node Properties]
 *  componentName: Page/Block/Component
 *  props
 *  children
 *
 * [Root Container Extra Properties]
 *  fileName
 *  meta
 *  state
 *  defaultProps
 *  dataSource
 *  lifeCycles
 *  methods
 *  css
 *
 * [Directives **not used**]
 *  loop
 *  loopArgs
 *  condition
 *  ------- future support -----
 *  conditionGroup
 *  title
 *  ignore
 *  locked
 *  hidden
 */
export default class RootNode extends Node implements NodeParent {
  readonly isRootNode = true;
  get isNodeParent() {
    return true;
  }
  get index() {
    return 0;
  }
  get nextSibling() {
    return null;
  }
  get prevSibling() {
    return null;
  }
  get zLevel() {
    return 0;
  }
  get parent() {
    return null;
  }
  get children(): NodeChildren {
    return this._children as NodeChildren;
  }
  get props(): Props {
    return this._props as any;
  }
  internalSetParent(parent: null) {
    // empty
  }

  constructor(readonly document: DocumentModel, rootSchema: RootSchema) {
    super(document, rootSchema);
  }

  isPage() {
    return this.componentName === 'Page';
  }

  isComponent() {
    return this.componentName === 'Component';
  }

  isBlock() {
    return this.componentName === 'Block';
  }
}

export function isRootNode(node: any): node is RootNode {
  return node && node.isRootNode;
}
