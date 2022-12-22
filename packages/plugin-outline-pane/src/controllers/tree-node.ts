import {
  IPublicTypeTitleContent,
  IPublicTypeLocationChildrenDetail,
  IPublicModelNode,
  IPublicModelPluginContext,
} from '@alilc/lowcode-types';
import { isI18nData, isLocationChildrenDetail } from '@alilc/lowcode-utils';
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
  readonly pluginContext: IPublicModelPluginContext;
  onFilterResultChanged: () => void;

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
  get dropDetail(): IPublicTypeLocationChildrenDetail | undefined | null {
    const loc = this.pluginContext.project.getCurrentDocument()?.dropLocation;
    return loc && this.isResponseDropping() && isLocationChildrenDetail(loc.detail) ? loc.detail : null;
  }

  get depth(): number {
    return this.node.zLevel;
  }

  isRoot(includeOriginalRoot = false) {
    const rootNode = this.pluginContext.project.getCurrentDocument()?.root;
    return this.tree.root === this || (includeOriginalRoot && rootNode === this.node);
  }

  /**
   * 是否是响应投放区
   */
  isResponseDropping(): boolean {
    const loc = this.pluginContext.project.getCurrentDocument()?.dropLocation;
    if (!loc) {
      return false;
    }
    return loc.target?.id === this.id;
  }

  isFocusingNode(): boolean {
    const loc = this.pluginContext.project.getCurrentDocument()?.dropLocation;
    if (!loc) {
      return false;
    }
    return (
      isLocationChildrenDetail(loc.detail) && loc.detail.focus?.type === 'node' && loc.detail?.focus?.node.id === this.id
    );
  }

  /**
   * 默认为折叠状态
   * 在初始化根节点时，设置为展开状态
   */
  private _expanded = false;

  get expanded(): boolean {
    return this.isRoot(true) || (this.expandable && this._expanded);
  }

  setExpanded(value: boolean) {
    this._expanded = value;
    this.pluginContext.pluginEvent.emit('tree-node.expandedChanged', { expanded: value, nodeId: this.id });
  }

  get detecting() {
    const doc = this.pluginContext.project.currentDocument;
    return doc?.isDetectingNode(this.node);
  }

  get hidden(): boolean {
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
    this.pluginContext.pluginEvent.emit('tree-node.hiddenChanged', { hidden: flag, nodeId: this.id });
  }

  get locked(): boolean {
    return this.node.isLocked;
  }

  setLocked(flag: boolean) {
    this.node.lock(flag);
    this.pluginContext.pluginEvent.emit('tree-node.lockedChanged', { locked: flag, nodeId: this.id });
  }

  get selected(): boolean {
    // TODO: check is dragging
    const selection = this.pluginContext.project.getCurrentDocument()?.selection;
    if (!selection) {
      return false;
    }
    return selection?.has(this.node.id);
  }

  get title(): IPublicTypeTitleContent {
    return this.node.title;
  }

  get titleLabel() {
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
      const currentLocale = this.pluginContext.getLocale();
      const currentTitle = title[currentLocale];
      return currentTitle;
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
    this.pluginContext.pluginEvent.emit('tree-node.titleLabelChanged', { titleLabel: label, nodeId: this.id });
  }

  get icon() {
    return this.node.componentMeta.icon;
  }

  get parent(): TreeNode | null {
    const { parent } = this.node;
    if (parent) {
      return this.tree.getTreeNode(parent);
    }
    return null;
  }

  get slots(): TreeNode[] {
    // todo: shallowEqual
    return this.node.slots.map((node) => this.tree.getTreeNode(node));
  }

  get children(): TreeNode[] | null {
    return this.node.children?.map((node) => this.tree.getTreeNode(node)) || null;
  }

  /**
   * 是否是容器，允许子节点拖入
   */
  isContainer(): boolean {
    return this.node.isContainerNode;
  }

  /**
   * 判断是否有"插槽"
   */
  hasSlots(): boolean {
    return this.node.hasSlots();
  }

  hasChildren(): boolean {
    return !!(this.isContainer() && this.node.children?.notEmptyNode);
  }

  select(isMulti: boolean) {
    const { node } = this;

    const selection = this.pluginContext.project.getCurrentDocument()?.selection;
    if (isMulti) {
      selection?.add(node.id);
    } else {
      selection?.select(node.id);
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

  private _node: IPublicModelNode;

  get node(): IPublicModelNode {
    return this._node;
  }

  readonly tree: Tree;

  constructor(tree: Tree, node: IPublicModelNode, pluginContext: IPublicModelPluginContext) {
    this.tree = tree;
    this.pluginContext = pluginContext;
    this._node = node;
  }

  setNode(node: IPublicModelNode) {
    if (this._node !== node) {
      this._node = node;
    }
  }

  private _filterResult: FilterResult = {
    filterWorking: false,
    matchChild: false,
    matchSelf: false,
    keywords: '',
  };

  get filterReult(): FilterResult {
    return this._filterResult;
  }

  setFilterReult(val: FilterResult) {
    this._filterResult = val;
    if (this.onFilterResultChanged) {
      this.onFilterResultChanged();
    }
  }
}
