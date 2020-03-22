import { computed, obx, TitleContent } from '../../globals';
import Node from '../../designer/src/designer/document/node/node';
import DocumentModel from '../../designer/src/designer/document/document-model';
import { isLocationChildrenDetail } from '../../designer/src/designer/helper/location';
import Designer from '../../designer/src/designer/designer';
import { Tree } from './tree';

export interface Title {
  label: string;
  icon?: string;
  actions?: any;
}

export default class TreeNode {
  get id(): string {
    return this.node.id;
  }

  /**
   * 是否可以展开
   */
  @computed get expandable(): boolean {
    return this.hasChildren() || this.isSlotContainer() || this.dropIndex != null;
  }

  /**
   * 插入"线"位置信息
   */
  @computed get dropIndex(): number | null {
    const loc = this.node.document.dropLocation;
    return loc && this.isResponseDropping() && isLocationChildrenDetail(loc.detail) ? loc.detail.index : null;
  }

  @computed get depth(): number {
    return this.node.zLevel;
  }

  /**
   * 是否是响应投放区
   */
  @computed isResponseDropping(): boolean {
    const loc = this.node.document.dropLocation;
    if (!loc) {
      return false;
    }
    return loc.target === this.node;
  }

  /**
   * 默认为折叠状态
   * 在初始化根节点时，设置为展开状态
   */
  @obx.ref private _expanded = false;
  get expanded(): boolean {
    return this.expandable && this._expanded;
  }

  set expanded(value: boolean) {
    this._expanded = value;
  }

  @computed get hovering() {
    return this.designer.hovering.current === this.node;
  }

  @computed get hidden(): boolean {
    return this.node.getExtraProp('hidden', false)?.getValue() === true;
  }

  @computed get ignored(): boolean {
    return this.node.getExtraProp('ignored', false)?.getValue() === true;
  }

  @computed get locked(): boolean {
    return this.node.getExtraProp('locked', false)?.getValue() === true;
  }

  @computed get selected(): boolean {
    // TODO: check is dragging
    const selection = this.document.selection;
    return selection.has(this.node.id);
  }

  @computed get title(): TitleContent {
    return this.node.title;
  }

  @computed get parent() {
    const parent = this.node.parent;
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
  isSlotContainer(): boolean {
    return this.node.isSlotContainer();
  }

  hasChildren(): boolean {
    return this.isContainer() && this.node.children?.notEmpty() ? true : false;
  }

  /*
  get xForValue() {
    const node = this.node;
    return isElementNode(node) && node.xforValue ? node.xforValue : null;
  }

  get flowHidden() {
    return (this.node as ElementNode).flowHidden;
  }

  get flowIndex() {
    return (this.node as ElementNode).flowIndex;
  }

  get conditionFlow() {
    return (this.node as ElementNode).conditionFlow;
  }

  hasXIf() {
    return hasConditionFlow(this.node);
  }

  hasXFor() {
    const node = this.node;
    return isElementNode(node) && node.xforFn;
  }
  */

  /**
   * 展开节点，支持依次展开父节点
   */
  expand(tryExpandParents: boolean = false) {
    // 这边不能直接使用 expanded，需要额外判断是否可以展开
    // 如果只使用 expanded，会漏掉不可以展开的情况，即在不可以展开的情况下，会触发展开
    if (this.expandable && !this._expanded) {
      this.expanded = true;
    }
    if (tryExpandParents) {
      this.expandParents();
    }
  }

  /**
   * 光标停留处理
   * 超过一定时间，展开节点
   */
  private dwellTimer: number | undefined;
  clearDwellTimer() {
    clearTimeout(this.dwellTimer);
    this.dwellTimer = undefined;
  }
  willExpand() {
    if (this.dwellTimer) {
      return;
    }
    this.clearDwellTimer();
    if (this.expanded) {
      return;
    }
    this.dwellTimer = setTimeout(() => {
      this.clearDwellTimer();
      this.expand(true);
    }, 400) as any;
  }

  expandParents() {
    let p = this.node.parent;
    while (p) {
      this.tree.getTreeNode(p).expanded = true;
      p = p.parent;
    }
  }

  private titleRef: HTMLDivElement | null = null;
  mount(ref: HTMLDivElement | null) {
    this.titleRef = ref;
  }

  computeRect() {
    let target = this.titleRef;
    if (!target) {
      const nodeId = this.id;
      target = window.document.querySelector(`div[data-id="${nodeId}"]`);
    }
    return target && target.getBoundingClientRect();
  }

  select(isMulti: boolean) {
    const node = this.node;

    /*
    if (this.hasXIf()) {
      (node as ElementNode).setFlowVisible();
    }
    */

    const selection = node.document.selection;
    if (isMulti) {
      selection.add(node.id);
    } else {
      selection.select(node.id);
    }
  }

  readonly designer: Designer;
  readonly document: DocumentModel;
  constructor(readonly tree: Tree, readonly node: Node) {
    this.document = node.document;
    this.designer = this.document.designer;
  }
}
