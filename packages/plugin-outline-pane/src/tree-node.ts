import { TitleContent, isI18nData } from '@alilc/lowcode-types';
import { computed, obx, intl, makeObservable, action } from '@alilc/lowcode-editor-core';
import { Node, DocumentModel, isLocationChildrenDetail, LocationChildrenDetail, Designer } from '@alilc/lowcode-designer';
import { Tree } from './tree';

/**
 * 大纲树过滤结果
 */
export interface FilterResult {
  // 过滤条件是否生效
  filterWorking: boolean;
  // 命中子节点
  matchChild: boolean;
  // 命中本节点
  matchSelf: boolean;
  // 关键字
  keywords: string;
}

export default class TreeNode {
  get id(): string {
    return this.node.id;
  }

  /**
   * 是否可以展开
   */
  get expandable(): boolean {
    if (this.locked) return false;
    return this.hasChildren() || this.hasSlots() || this.dropDetail?.index != null;
  }

  /**
   * 插入"线"位置信息
   */
  @computed get dropDetail(): LocationChildrenDetail | undefined | null {
    const loc = this.node.document.dropLocation;
    return loc && this.isResponseDropping() && isLocationChildrenDetail(loc.detail) ? loc.detail : null;
  }

  @computed get depth(): number {
    return this.node.zLevel;
  }

  isRoot(includeOriginalRoot = false) {
    return this.tree.root === this || (includeOriginalRoot && this.tree.document.rootNode === this.node);
  }

  /**
   * 是否是响应投放区
   */
  isResponseDropping(): boolean {
    const loc = this.node.document.dropLocation;
    if (!loc) {
      return false;
    }
    return loc.target === this.node;
  }

  isFocusingNode(): boolean {
    const loc = this.node.document.dropLocation;
    if (!loc) {
      return false;
    }
    return (
      isLocationChildrenDetail(loc.detail) && loc.detail.focus?.type === 'node' && loc.detail.focus.node === this.node
    );
  }

  /**
   * 默认为折叠状态
   * 在初始化根节点时，设置为展开状态
   */
  @obx.ref private _expanded = false;

  get expanded(): boolean {
    return this.isRoot(true) || (this.expandable && this._expanded);
  }

  setExpanded(value: boolean) {
    this._expanded = value;
  }

  @computed get detecting() {
    return this.designer.detecting.current === this.node;
  }

  @computed get hidden(): boolean {
    const cv = this.node.isConditionalVisible();
    if (cv == null) {
      return !this.node.getVisible();
    }
    return !cv;
  }

  setHidden(flag: boolean) {
    if (this.node.conditionGroup) {
      return;
    }
    this.node.setVisible(!flag);
  }

  @computed get locked(): boolean {
    return this.node.isLocked;
  }

  setLocked(flag: boolean) {
    this.node.lock(flag);
  }

  @computed get selected(): boolean {
    // TODO: check is dragging
    const { selection } = this.document;
    return selection.has(this.node.id);
  }

  @computed get title(): TitleContent {
    return this.node.title;
  }

  @computed get titleLabel() {
    let { title } = this;
    if (!title) {
      return '';
    }
    if ((title as any).label) {
      title = (title as any).label;
    }
    if (typeof title === 'string') {
      return title;
    }
    if (isI18nData(title)) {
      return intl(title) as string;
    }
    return this.node.componentName;
  }

  setTitleLabel(label: string) {
    const origLabel = this.titleLabel;
    if (label === origLabel) {
      return;
    }
    if (label === '') {
      this.node.getExtraProp('title', false)?.remove();
    } else {
      this.node.getExtraProp('title', true)?.setValue(label);
    }
  }

  get icon() {
    return this.node.componentMeta.icon;
  }

  @computed get parent(): TreeNode | null {
    const { parent } = this.node;
    if (parent) {
      return this.tree.getTreeNode(parent);
    }
    return null;
  }

  @computed get slots(): TreeNode[] {
    // todo: shallowEqual
    return this.node.slots.map((node) => this.tree.getTreeNode(node));
  }

  @computed get children(): TreeNode[] | null {
    return this.node.children?.map((node) => this.tree.getTreeNode(node)) || null;
  }

  /**
   * 是否是容器，允许子节点拖入
   */
  isContainer(): boolean {
    return this.node.isContainer();
  }

  /**
   * 判断是否有"插槽"
   */
  hasSlots(): boolean {
    return this.node.hasSlots();
  }

  hasChildren(): boolean {
    return !!(this.isContainer() && this.node.children?.notEmpty());
  }

  select(isMulti: boolean) {
    const { node } = this;

    const { selection } = node.document;
    if (isMulti) {
      selection.add(node.id);
    } else {
      selection.select(node.id);
    }
  }

  /**
   * 展开节点，支持依次展开父节点
   */
  expand(tryExpandParents = false) {
    // 这边不能直接使用 expanded，需要额外判断是否可以展开
    // 如果只使用 expanded，会漏掉不可以展开的情况，即在不可以展开的情况下，会触发展开
    if (this.expandable && !this._expanded) {
      this.setExpanded(true);
    }
    if (tryExpandParents) {
      this.expandParents();
    }
  }

  expandParents() {
    let p = this.node.parent;
    while (p) {
      this.tree.getTreeNode(p).setExpanded(true);
      p = p.parent;
    }
  }

  readonly designer: Designer;

  readonly document: DocumentModel;

  @obx.ref private _node: Node;

  get node() {
    return this._node;
  }

  readonly tree: Tree;

  constructor(tree: Tree, node: Node) {
    makeObservable(this);
    this.tree = tree;
    this.document = node.document;
    this.designer = this.document.designer;
    this._node = node;
  }

  @action
  setNode(node: Node) {
    if (this._node !== node) {
      this._node = node;
    }
  }

  @obx.ref private _filterResult: FilterResult = {
    filterWorking: false,
    matchChild: false,
    matchSelf: false,
    keywords: '',
  };

  get filterReult(): FilterResult {
    return this._filterResult;
  }

  @action
  setFilterReult(val: FilterResult) {
    this._filterResult = val;
  }
}
