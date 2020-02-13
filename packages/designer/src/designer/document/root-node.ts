import Node from './node';

/**
 * state
 * lifeCycles
 * fileName
 * meta
 * methods
 * dataSource
 * css
 * defaultProps
 */
export default class RootNode extends Node {
  readonly isRootNode = true;
  readonly index = 0;
  readonly props: object = {};
  readonly nextSibling = null;
  readonly prevSibling = null;
  readonly zLevel = 0;
  readonly parent = null;
  internalSetParent(parent: null) {}

  get viewData(): ViewData {
    return {
      file: this.file,
      children: this.nodeData,
    };
  }

  readonly fileName: string;
  readonly viewType: string;
  readonly viewVersion: string;

  get ready() {
    return this.document.ready;
  }

  get nodeData(): NodeData[] {
    if (!this.ready) {
      // TODO: add mocks data
      return this.childrenData;
    }
    const children = this.children;
    if (!children || children.length < 1) {
      return [];
    }
    return children.map(node => node.nodeData as NodeData);
  }

  private childrenData: NodeData[];
  private _children: INode[] | null = null;
  @obx.val get children(): INode[] {
    if (this._children) {
      return this._children;
    }
    if (!this.ready || this.purged) {
      return [];
    }
    const children = this.childrenData;
    /* eslint-disable */
    this._children = children
      ? untracked(() =>
          children.map(child => {
            const node = this.document.createNode(child);
            node.internalSetParent(this);
            return node;
          }),
        )
      : [];
    /* eslint-enable */
    return this._children;
  }

  get scope() {
    return this.mocks.scope;
  }

  constructor(readonly document: DocumentContext, { children, file, viewType, viewVersion }: ViewData) {
    this.file = file;
    this.viewType = viewType || '';
    this.viewVersion = viewVersion || '';

    const expr = getMockExpr(children);
    if (expr) {
      this.childrenData = children.slice(0, -1);
      this.mocksExpr = expr;
    } else {
      this.childrenData = children.slice();
    }
  }

  merge(schema: DocumentSchema) {
    for (let i = 0, l = data.length; i < l; i++) {
      const item = this.children[i];
      if (item && isMergeable(item) && item.tagName === data[i].tagName) {
        item.merge(data[i]);
      } else {
        if (item) {
          item.purge();
        }
        this.children[i] = this.document.createNode(data[i]);
        this.children[i].internalSetParent(this);
      }
    }
    if (this.children.length > data.length) {
      this.children.splice(data.length).forEach(child => child.purge());
    }
  }

  // todo:
  reuse() {}

  private purged = false;

  purge() {
    if (this.purged) {
      return;
    }
    this.purged = true;
    if (this._children) {
      this._children.forEach(child => child.purge());
    }
  }

  receiveViewData({ children }: ViewData) {
    this.merge(children);
    // this.selection.dispose();
  }
}

export function isRootNode(node: any): node is RootNode {
  return node && node.isRootNode;
}
