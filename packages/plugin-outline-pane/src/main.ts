import { computed, makeObservable, obx } from '@alilc/lowcode-editor-core';
import {
  Designer,
  ISensor,
  LocateEvent,
  isDragNodeObject,
  isDragAnyObject,
  DragObject,
  Scroller,
  ScrollTarget,
  IScrollable,
  DropLocation,
  isLocationChildrenDetail,
  LocationChildrenDetail,
  LocationDetailType,
  ParentalNode,
  contains,
  Node,
} from '@alilc/lowcode-designer';
import { uniqueId } from '@alilc/lowcode-utils';
import { IEditor } from '@alilc/lowcode-types';
import TreeNode from './tree-node';
import { IndentTrack } from './helper/indent-track';
import DwellTimer from './helper/dwell-timer';
import { Backup } from './views/backup-pane';
import { ITreeBoard, TreeMaster, getTreeMaster } from './tree-master';

export class OutlineMain implements ISensor, ITreeBoard, IScrollable {
  private _designer?: Designer;

  @obx.ref private _master?: TreeMaster;

  get master() {
    return this._master;
  }

  @computed get currentTree() {
    return this._master?.currentTree;
  }

  readonly id = uniqueId('outline');

  @obx.ref _visible = false;

  get visible() {
    return this._visible;
  }

  readonly editor: IEditor;

  readonly at: string | symbol;

  constructor(editor: IEditor, at: string | symbol) {
    makeObservable(this);
    this.editor = editor;
    this.at = at;
    let inited = false;
    const setup = async () => {
      if (inited) {
        return false;
      }
      inited = true;
      const designer = await editor.onceGot('designer');
      this.setupDesigner(designer);
    };

    if (at === Backup) {
      setup();
    } else {
      editor.on('skeleton.panel.show', (key: string) => {
        if (key === at) {
          setup();
          this._visible = true;
        }
      });
      editor.on('skeleton.panel.hide', (key: string) => {
        if (key === at) {
          this._visible = false;
        }
      });
    }
  }

  /**
   * @see ISensor
   */
  fixEvent(e: LocateEvent): LocateEvent {
    if (e.fixed) {
      return e;
    }

    const notMyEvent = e.originalEvent.view?.document !== document;

    if (!e.target || notMyEvent) {
      e.target = document.elementFromPoint(e.canvasX!, e.canvasY!);
    }

    // documentModel : 目标文档
    e.documentModel = this._designer?.currentDocument;

    // 事件已订正
    e.fixed = true;
    return e;
  }

  private indentTrack = new IndentTrack();

  private dwell = new DwellTimer((target, event) => {
    const { document } = target;
    const { designer } = document;
    let index: any;
    let focus: any;
    let valid = true;
    if (target.hasSlots()) {
      index = null;
      focus = { type: 'slots' };
    } else {
      index = 0;
      valid = document.checkNesting(target, event.dragObject as any);
    }
    designer.createLocation({
      target,
      source: this.id,
      event,
      detail: {
        type: LocationDetailType.Children,
        index,
        focus,
        valid,
      },
    });
  });

  /**
   * @see ISensor
   */
  locate(e: LocateEvent): DropLocation | undefined | null {
    this.sensing = true;
    this.scroller?.scrolling(e);
    const { globalY, dragObject } = e;
    const { nodes } = dragObject;

    const tree = this._master?.currentTree;
    if (!tree || !tree.root || !this._shell) {
      return null;
    }

    const operationalNodes = nodes?.filter((node: any) => {
      const onMoveHook = node.componentMeta?.getMetadata().configure?.advanced?.callbacks?.onMoveHook;
      const canMove = onMoveHook && typeof onMoveHook === 'function' ? onMoveHook(node) : true;

      return canMove;
    });

    if (!operationalNodes || operationalNodes.length === 0) {
      return;
    }

    const { document } = tree;
    const { designer } = document;
    const pos = getPosFromEvent(e, this._shell);
    const irect = this.getInsertionRect();
    const originLoc = document.dropLocation;

    const componentMeta = e.dragObject.nodes ? e.dragObject.nodes[0].componentMeta : null;
    if (e.dragObject.type === 'node' && componentMeta && componentMeta.isModal) {
      return designer.createLocation({
        target: document.focusNode,
        detail: {
          type: LocationDetailType.Children,
          index: 0,
          valid: true,
        },
        source: this.id,
        event: e,
      });
    }

    if (originLoc && ((pos && pos === 'unchanged') || (irect && globalY >= irect.top && globalY <= irect.bottom))) {
      const loc = originLoc.clone(e);
      const indented = this.indentTrack.getIndentParent(originLoc, loc);
      if (indented) {
        const [parent, index] = indented;
        if (checkRecursion(parent, dragObject)) {
          if (tree.getTreeNode(parent).expanded) {
            this.dwell.reset();
            return designer.createLocation({
              target: parent,
              source: this.id,
              event: e,
              detail: {
                type: LocationDetailType.Children,
                index,
                valid: document.checkNesting(parent, e.dragObject as any),
              },
            });
          }

          (originLoc.detail as LocationChildrenDetail).focus = {
            type: 'node',
            node: parent,
          };
          // focus try expand go on
          this.dwell.focus(parent, e);
        } else {
          this.dwell.reset();
        }
      // FIXME: recreate new location
      } else if ((originLoc.detail as LocationChildrenDetail).near) {
        (originLoc.detail as LocationChildrenDetail).near = undefined;
        this.dwell.reset();
      }
      return;
    }

    this.indentTrack.reset();

    if (pos && pos !== 'unchanged') {
      let treeNode = tree.getTreeNodeById(pos.nodeId);
      if (treeNode) {
        let { focusSlots } = pos;
        let { node } = treeNode;
        if (isDragNodeObject(dragObject)) {
          const newNodes = operationalNodes;
          let i = newNodes.length;
          let p: any = node;
          while (i-- > 0) {
            if (contains(newNodes[i], p)) {
              p = newNodes[i].parent;
            }
          }
          if (p !== node) {
            node = p || document.focusNode;
            treeNode = tree.getTreeNode(node);
            focusSlots = false;
          }
        }

        if (focusSlots) {
          this.dwell.reset();
          return designer.createLocation({
            target: node as ParentalNode,
            source: this.id,
            event: e,
            detail: {
              type: LocationDetailType.Children,
              index: null,
              valid: false,
              focus: { type: 'slots' },
            },
          });
        }

        if (!treeNode.isRoot()) {
          const loc = this.getNear(treeNode, e);
          this.dwell.tryFocus(loc);
          return loc;
        }
      }
    }

    const loc = this.drillLocate(tree.root, e);
    this.dwell.tryFocus(loc);
    return loc;
  }

  private getNear(treeNode: TreeNode, e: LocateEvent, index?: number, rect?: DOMRect) {
    const { document } = treeNode.tree;
    const { designer } = document;
    const { globalY, dragObject } = e;
    // TODO: check dragObject is anyData
    const { node, expanded } = treeNode;
    if (!rect) {
      rect = this.getTreeNodeRect(treeNode);
      if (!rect) {
        return null;
      }
    }
    if (index == null) {
      index = node.index;
    }

    if (node.isSlot()) {
      // 是个插槽根节点
      if (!treeNode.isContainer() && !treeNode.hasSlots()) {
        return designer.createLocation({
          target: node.parent!,
          source: this.id,
          event: e,
          detail: {
            type: LocationDetailType.Children,
            index: null,
            near: { node, pos: 'replace' },
            valid: true, // TODO: future validation the slot limit
          },
        });
      }
      const loc1 = this.drillLocate(treeNode, e);
      if (loc1) {
        return loc1;
      }

      return designer.createLocation({
        target: node.parent!,
        source: this.id,
        event: e,
        detail: {
          type: LocationDetailType.Children,
          index: null,
          valid: false,
          focus: { type: 'slots' },
        },
      });
    }

    let focusNode: Node | undefined;
    // focus
    if (!expanded && (treeNode.isContainer() || treeNode.hasSlots())) {
      focusNode = node;
    }

    // before
    const titleRect = this.getTreeTitleRect(treeNode) || rect;
    if (globalY < titleRect.top + titleRect.height / 2) {
      return designer.createLocation({
        target: node.parent!,
        source: this.id,
        event: e,
        detail: {
          type: LocationDetailType.Children,
          index,
          valid: document.checkNesting(node.parent!, dragObject as any),
          near: { node, pos: 'before' },
          focus: checkRecursion(focusNode, dragObject) ? { type: 'node', node: focusNode } : undefined,
        },
      });
    }

    if (globalY > titleRect.bottom) {
      focusNode = undefined;
    }

    if (expanded) {
      // drill
      const loc = this.drillLocate(treeNode, e);
      if (loc) {
        return loc;
      }
    }

    // after
    return designer.createLocation({
      target: node.parent!,
      source: this.id,
      event: e,
      detail: {
        type: LocationDetailType.Children,
        index: index + 1,
        valid: document.checkNesting(node.parent!, dragObject as any),
        near: { node, pos: 'after' },
        focus: checkRecursion(focusNode, dragObject) ? { type: 'node', node: focusNode } : undefined,
      },
    });
  }

  private drillLocate(treeNode: TreeNode, e: LocateEvent): DropLocation | null {
    const { document } = treeNode.tree;
    const { designer } = document;
    const { dragObject, globalY } = e;

    if (!checkRecursion(treeNode.node, dragObject)) {
      return null;
    }

    if (isDragAnyObject(dragObject)) {
      // TODO: future
      return null;
    }

    const container = treeNode.node as ParentalNode;
    const detail: LocationChildrenDetail = {
      type: LocationDetailType.Children,
    };
    const locationData: any = {
      target: container,
      detail,
      source: this.id,
      event: e,
    };
    const isSlotContainer = treeNode.hasSlots();
    const isContainer = treeNode.isContainer();

    if (container.isSlot() && !treeNode.expanded) {
      // 未展开，直接定位到内部第一个节点
      if (isSlotContainer) {
        detail.index = null;
        detail.focus = { type: 'slots' };
        detail.valid = false;
      } else {
        detail.index = 0;
        detail.valid = document.checkNesting(container, dragObject);
      }
    }

    let items: TreeNode[] | null = null;
    let slotsRect: DOMRect | undefined;
    let focusSlots = false;
    // isSlotContainer
    if (isSlotContainer) {
      slotsRect = this.getTreeSlotsRect(treeNode);
      if (slotsRect) {
        if (globalY <= slotsRect.bottom) {
          focusSlots = true;
          items = treeNode.slots;
        } else if (!isContainer) {
          // 不在 slots 范围，又不是 container 的情况，高亮 slots 区
          detail.index = null;
          detail.focus = { type: 'slots' };
          detail.valid = false;
          return designer.createLocation(locationData);
        }
      }
    }

    if (!items && isContainer) {
      items = treeNode.children;
    }

    if (!items) {
      return null;
    }

    const l = items.length;
    let index = 0;
    let before = l < 1;
    let current: TreeNode | undefined;
    let currentIndex = index;
    for (; index < l; index++) {
      current = items[index];
      currentIndex = index;
      const rect = this.getTreeNodeRect(current);
      if (!rect) {
        continue;
      }

      // rect
      if (globalY < rect.top) {
        before = true;
        break;
      }

      if (globalY > rect.bottom) {
        continue;
      }

      const loc = this.getNear(current, e, index, rect);
      if (loc) {
        return loc;
      }
    }

    if (focusSlots) {
      detail.focus = { type: 'slots' };
      detail.valid = false;
      detail.index = null;
    } else {
      if (current) {
        detail.index = before ? currentIndex : currentIndex + 1;
        detail.near = { node: current.node, pos: before ? 'before' : 'after' };
      } else {
        detail.index = l;
      }
      detail.valid = document.checkNesting(container, dragObject);
    }

    return designer.createLocation(locationData);
  }

  /**
   * @see ISensor
   */
  isEnter(e: LocateEvent): boolean {
    if (!this._shell) {
      return false;
    }
    const rect = this._shell.getBoundingClientRect();
    return e.globalY >= rect.top && e.globalY <= rect.bottom && e.globalX >= rect.left && e.globalX <= rect.right;
  }

  private tryScrollAgain: number | null = null;

  /**
   * @see IScrollBoard
   */
  scrollToNode(treeNode: TreeNode, detail?: any, tryTimes = 0) {
    if (tryTimes < 1 && this.tryScrollAgain) {
      (window as any).cancelIdleCallback(this.tryScrollAgain);
      this.tryScrollAgain = null;
    }
    if (this.sensing || !this.bounds || !this.scroller || !this.scrollTarget) {
      // is a active sensor
      return;
    }

    let rect: ClientRect | undefined;
    if (detail && isLocationChildrenDetail(detail)) {
      rect = this.getInsertionRect();
    } else {
      rect = this.getTreeNodeRect(treeNode);
    }

    if (!rect) {
      if (tryTimes < 3) {
        this.tryScrollAgain = (window as any).requestIdleCallback(() => this.scrollToNode(treeNode, detail, tryTimes + 1));
      }
      return;
    }
    const { scrollHeight, top: scrollTop } = this.scrollTarget;
    const { height, top, bottom } = this.bounds;
    if (rect.top < top || rect.bottom > bottom) {
      const opt: any = {};
      opt.top = Math.min(rect.top + rect.height / 2 + scrollTop - top - height / 2, scrollHeight - height);
      if (rect.height >= height) {
        opt.top = Math.min(scrollTop + rect.top - top, opt.top);
      }
      this.scroller.scrollTo(opt);
    }
    // make tail scroll be sure
    if (tryTimes < 4) {
      this.tryScrollAgain = (window as any).requestIdleCallback(() => this.scrollToNode(treeNode, detail, 4));
    }
  }

  private sensing = false;

  /**
   * @see ISensor
   */
  deactiveSensor() {
    this.sensing = false;
    this.scroller?.cancel();
    this.dwell.reset();
    this.indentTrack.reset();
  }

  /**
   * @see IScrollable
   */
  get bounds(): DOMRect | null {
    if (!this._shell) {
      return null;
    }
    return this._shell.getBoundingClientRect();
  }

  private _scrollTarget?: ScrollTarget;

  /**
   * @see IScrollable
   */
  get scrollTarget() {
    return this._scrollTarget;
  }

  private scroller?: Scroller;

  private setupDesigner(designer: Designer) {
    this._designer = designer;
    this._master = getTreeMaster(designer);
    this._master.addBoard(this);
    designer.dragon.addSensor(this);
    this.scroller = designer.createScroller(this);
  }

  purge() {
    this._designer?.dragon.removeSensor(this);
    this._master?.removeBoard(this);
    // todo purge treeMaster if needed
  }

  private _sensorAvailable = false;

  /**
   * @see ISensor
   */
  get sensorAvailable() {
    return this._sensorAvailable;
  }

  private _shell: HTMLDivElement | null = null;

  mount(shell: HTMLDivElement | null) {
    if (this._shell === shell) {
      return;
    }
    this._shell = shell;
    if (shell) {
      this._scrollTarget = new ScrollTarget(shell);
      this._sensorAvailable = true;
    } else {
      this._scrollTarget = undefined;
      this._sensorAvailable = false;
    }
  }

  private getInsertionRect(): DOMRect | undefined {
    if (!this._shell) {
      return undefined;
    }
    return this._shell.querySelector('.insertion')?.getBoundingClientRect();
  }

  private getTreeNodeRect(treeNode: TreeNode): DOMRect | undefined {
    if (!this._shell) {
      return undefined;
    }
    return this._shell.querySelector(`.tree-node[data-id="${treeNode.id}"]`)?.getBoundingClientRect();
  }

  private getTreeTitleRect(treeNode: TreeNode): DOMRect | undefined {
    if (!this._shell) {
      return undefined;
    }
    return this._shell.querySelector(`.tree-node-title[data-id="${treeNode.id}"]`)?.getBoundingClientRect();
  }

  private getTreeSlotsRect(treeNode: TreeNode): DOMRect | undefined {
    if (!this._shell) {
      return undefined;
    }
    return this._shell.querySelector(`.tree-node-slots[data-id="${treeNode.id}"]`)?.getBoundingClientRect();
  }
}

function checkRecursion(parent: Node | undefined | null, dragObject: DragObject): parent is ParentalNode {
  if (!parent) {
    return false;
  }
  if (isDragNodeObject(dragObject)) {
    const { nodes } = dragObject;
    if (nodes.some((node) => node.contains(parent))) {
      return false;
    }
  }
  return true;
}

function getPosFromEvent(
  { target }: LocateEvent,
  stop: Element,
): null | 'unchanged' | { nodeId: string; focusSlots: boolean } {
  if (!target || !stop.contains(target)) {
    return null;
  }
  if (target.matches('.insertion')) {
    return 'unchanged';
  }
  target = target.closest('[data-id]');
  if (!target || !stop.contains(target)) {
    return null;
  }

  const nodeId = (target as HTMLDivElement).dataset.id!;
  return {
    focusSlots: target.matches('.tree-node-slots'),
    nodeId,
  };
}
