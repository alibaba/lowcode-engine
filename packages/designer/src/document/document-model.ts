import { computed, obx } from '@ali/lowcode-editor-core';
import { NodeData, isJSExpression, isDOMText, NodeSchema, isNodeSchema, RootSchema, PageSchema } from '@ali/lowcode-types';
import { EventEmitter } from 'events';
import { Project } from '../project';
import { ISimulatorHost } from '../simulator';
import { ComponentMeta } from '../component-meta';
import { isDragNodeDataObject, DragNodeObject, DragNodeDataObject, DropLocation, Designer } from '../designer';
import { Node, insertChildren, insertChild, isNode, RootNode, ParentalNode } from './node/node';
import { Selection } from './selection';
import { History } from './history';
import { TransformStage, ModalNodesManager } from './node';
import { uniqueId } from '@ali/lowcode-utils';

export type GetDataType<T, NodeType> = T extends undefined
  ? NodeType extends {
    schema: infer R;
  }
    ? R
    : any
  : T;

export interface ComponentMap {
  componentName: string;
  package: string;
  version?: string;
  destructuring?: boolean;
  exportName?: string;
  subName?: string;
}

export class DocumentModel {
  /**
   * 根节点 类型有：Page/Component/Block
   */
  rootNode: RootNode | null;

  /**
   * 文档编号
   */
  id: string = uniqueId('doc');

  /**
   * 选区控制
   */
  readonly selection: Selection = new Selection(this);

  /**
   * 操作记录控制
   */
  readonly history: History;

  /**
   * 模态节点管理
   */
  readonly modalNodesManager: ModalNodesManager;

  private _nodesMap = new Map<string, Node>();

  readonly project: Project;

  readonly designer: Designer;

  @obx.val private nodes = new Set<Node>();

  private seqId = 0;

  private _simulator?: ISimulatorHost;

  private emitter: EventEmitter;

  private rootNodeVisitorMap: { [visitorName: string]: any } = {};

  /**
   * @deprecated
   */
  private _addons: { [key: string]: { exportData: () => any; isProp: boolean;} } = {};

  /**
   * 模拟器
   */
  get simulator(): ISimulatorHost | null {
    return this.project.simulator;
  }

  get nodesMap(): Map<string, Node> {
    return this._nodesMap;
  }

  get fileName(): string {
    return this.rootNode?.getExtraProp('fileName')?.getAsString() || this.id;
  }

  set fileName(fileName: string) {
    this.rootNode?.getExtraProp('fileName', true)?.setValue(fileName);
  }

  private _modalNode?: ParentalNode;

  private _blank?: boolean;

  private inited = false;

  constructor(project: Project, schema?: RootSchema) {
    /*
    // TODO
    // use special purge process
    autorun(() => {
      console.info(this.willPurgeSpace);
    }, true);
    */
    this.project = project;
    this.designer = this.project?.designer;
    this.emitter = new EventEmitter();

    if (!schema) {
      this._blank = true;
    }

    // 兼容 vision
    this.id = project.getSchema()?.id || this.id;

    this.rootNode = this.createNode<RootNode>(
      schema || {
        componentName: 'Page',
        id: 'root',
        fileName: '',
      },
    );

    this.history = new History(
      () => this.export(TransformStage.Serilize),
      (schema) => this.import(schema as RootSchema, true),
    );
    this.setupListenActiveNodes();
    this.modalNodesManager = new ModalNodesManager(this);
    this.inited = true;
  }

  @obx.val private willPurgeSpace: Node[] = [];

  get modalNode() {
    return this._modalNode;
  }

  get currentRoot() {
    return this.modalNode || this.rootNode;
  }

  addWillPurge(node: Node) {
    this.willPurgeSpace.push(node);
  }

  removeWillPurge(node: Node) {
    const i = this.willPurgeSpace.indexOf(node);
    if (i > -1) {
      this.willPurgeSpace.splice(i, 1);
    }
  }

  @computed isBlank() {
    return this._blank && !this.isModified();
  }

  /**
   * 生成唯一id
   */
  nextId(possibleId: string | undefined) {
    let id = possibleId;
    while (!id || this.nodesMap.get(id)) {
      id = `node_${(String(this.id).slice(-10) + (++this.seqId).toString(36)).toLocaleLowerCase()}`;
    }

    return id;
  }

  /**
   * 根据 id 获取节点
   */
  getNode(id: string): Node | null {
    return this._nodesMap.get(id) || null;
  }

  /**
   * 是否存在节点
   */
  hasNode(id: string): boolean {
    const node = this.getNode(id);
    return node ? !node.isPurged : false;
  }

  @obx.val private activeNodes?: Node[];

  /**
   * 根据 schema 创建一个节点
   */
  createNode<T extends Node = Node, C = undefined>(data: GetDataType<C, T>): T {
    let schema: any;
    if (isDOMText(data) || isJSExpression(data)) {
      schema = {
        componentName: 'Leaf',
        children: data,
      };
    } else {
      schema = data;
    }

    let node: Node | null = null;
    if (this.inited) {
      schema.id = null;
    }
    if (schema.id) {
      node = this.getNode(schema.id);
      if (node && node.componentName === schema.componentName) {
        if (node.parent) {
          node.internalSetParent(null, false);
          // will move to another position
          // todo: this.activeNodes?.push(node);
        }
        node.import(schema, true);
      } else if (node) {
        node = null;
      }
    }
    if (!node) {
      node = new Node(this, schema);
      // will add
      // todo: this.activeNodes?.push(node);
    }

    const origin = this._nodesMap.get(node.id);
    if (origin && origin !== node) {
      // almost will not go here, ensure the id is unique
      origin.internalSetWillPurge();
    }

    this._nodesMap.set(node.id, node);
    this.nodes.add(node);

    this.emitter.emit('nodecreate', node);
    return node as any;
  }

  public destroyNode(node: Node) {
    this.emitter.emit('nodedestroy', node);
  }

  /**
   * 插入一个节点
   */
  insertNode(parent: ParentalNode, thing: Node | NodeData, at?: number | null, copy?: boolean): Node {
    return insertChild(parent, thing, at, copy);
  }

  /**
   * 插入多个节点
   */
  insertNodes(parent: ParentalNode, thing: Node[] | NodeData[], at?: number | null, copy?: boolean) {
    return insertChildren(parent, thing, at, copy);
  }

  /**
   * 移除一个节点
   */
  removeNode(idOrNode: string | Node) {
    let id: string;
    let node: Node | null;
    if (typeof idOrNode === 'string') {
      id = idOrNode;
      node = this.getNode(id);
    } else {
      node = idOrNode;
      id = node.id;
    }
    if (!node) {
      return;
    }
    this.internalRemoveAndPurgeNode(node, true);
  }

  /**
   * 内部方法，请勿调用
   */
  internalRemoveAndPurgeNode(node: Node, useMutator = false) {
    if (!this.nodes.has(node)) {
      return;
    }
    node.remove(useMutator);
  }

  unlinkNode(node: Node) {
    this.nodes.delete(node);
    this._nodesMap.delete(node.id);
  }

  @obx.ref private _dropLocation: DropLocation | null = null;

  /**
   * 内部方法，请勿调用
   */
  internalSetDropLocation(loc: DropLocation | null) {
    this._dropLocation = loc;
  }

  /**
   * 投放插入位置标记
   */
  get dropLocation() {
    return this._dropLocation;
  }

  /**
   * 包裹当前选区中的节点
   */
  wrapWith(schema: NodeSchema): Node | null {
    const nodes = this.selection.getTopNodes();
    if (nodes.length < 1) {
      return null;
    }
    const wrapper = this.createNode(schema);
    if (wrapper.isParental()) {
      const first = nodes[0];
      // TODO: check nesting rules x 2
      insertChild(first.parent!, wrapper, first.index);
      insertChildren(wrapper, nodes);
      this.selection.select(wrapper.id);
      return wrapper;
    }

    this.removeNode(wrapper);
    return null;
  }

  /**
   * 导出 schema 数据
   */
  get schema(): RootSchema {
    return this.rootNode?.schema as any;
  }

  import(schema: RootSchema, checkId = false) {
    // TODO: 暂时用饱和式删除，原因是 Slot 节点并不是树节点，无法正常递归删除
    this.nodes.forEach(node => {
      this.internalRemoveAndPurgeNode(node, true);
    });
    // foreachReverse(this.rootNode?.children, (node: Node) => {
    //   this.internalRemoveAndPurgeNode(node, true);
    // });
    this.rootNode?.import(schema as any, checkId);
    // todo: select added and active track added
  }

  export(stage: TransformStage = TransformStage.Serilize) {
    return this.rootNode?.export(stage);
  }

  /**
   * 导出节点数据
   */
  getNodeSchema(id: string): NodeData | null {
    const node = this.getNode(id);
    if (node) {
      return node.schema;
    }
    return null;
  }

  /**
   * 是否已修改
   */
  isModified() {
    return !this.history.isSavePoint();
  }

  /**
   * 提供给模拟器的参数
   */
  @computed get simulatorProps(): object {
    let { simulatorProps } = this.designer;
    if (typeof simulatorProps === 'function') {
      simulatorProps = simulatorProps(this);
    }
    return {
      ...simulatorProps,
      documentContext: this,
      onMount: this.mountSimulator.bind(this),
    };
  }

  private mountSimulator(simulator: ISimulatorHost) {
    // TODO: 多设备 simulator 支持
    this._simulator = simulator;
    // TODO: emit simulator mounted
  }

  // FIXME: does needed?
  getComponent(componentName: string): any {
    return this.simulator!.getComponent(componentName);
  }

  getComponentMeta(componentName: string): ComponentMeta {
    return this.designer.getComponentMeta(
      componentName,
      () => this.simulator?.generateComponentMetadata(componentName) || null,
    );
  }

  @obx.ref private _opened = false;

  @obx.ref private _suspensed = false;

  /**
   * 是否不是激活的
   */
  get suspensed(): boolean {
    return this._suspensed || !this._opened;
  }

  /**
   * 与 suspensed 相反，是否是激活的，这个函数可能用的更多一点
   */
  get actived(): boolean {
    return !this._suspensed;
  }

  /**
   * 是否打开
   */
  get opened() {
    return this._opened;
  }

  /**
   * 切换激活，只有打开的才能激活
   * 不激活，打开之后切换到另外一个时发生，比如 tab 视图，切换到另外一个标签页
   */
  private setSuspense(flag: boolean) {
    if (!this._opened && !flag) {
      return;
    }
    this._suspensed = flag;
    this.simulator?.setSuspense(flag);
    if (!flag) {
      this.project.checkExclusive(this);
    }
  }

  suspense() {
    this.setSuspense(true);
  }

  active() {
    this.setSuspense(false);
  }

  /**
   * 打开，已载入，默认建立时就打开状态，除非手动关闭
   */
  open(): DocumentModel {
    const originState = this._opened;
    this._opened = true;
    if (originState === false) {
      this.designer.postEvent('document-open', this);
    }
    if (this._suspensed) {
      this.setSuspense(false);
    } else {
      this.project.checkExclusive(this);
    }
    return this;
  }

  /**
   * 关闭，相当于 sleep，仍然缓存，停止一切响应，如果有发生的变更没被保存，仍然需要去取数据保存
   */
  close(): void {
    this.setSuspense(true);
    this._opened = false;
  }

  /**
   * 从项目中移除
   */
  remove() {
    this.designer.postEvent('document.remove', { id: this.id });
    this.purge();
    this.project.removeDocument(this);
  }

  purge() {
    this.rootNode?.purge();
    this.nodes.clear();
    this._nodesMap.clear();
    this.rootNode = null;
  }

  checkNesting(dropTarget: ParentalNode, dragObject: DragNodeObject | DragNodeDataObject): boolean {
    let items: Array<Node | NodeSchema>;
    if (isDragNodeDataObject(dragObject)) {
      items = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];
    } else {
      items = dragObject.nodes;
    }
    return items.every((item) => this.checkNestingDown(dropTarget, item));
  }

  checkDropTarget(dropTarget: ParentalNode, dragObject: DragNodeObject | DragNodeDataObject): boolean {
    let items: Array<Node | NodeSchema>;
    if (isDragNodeDataObject(dragObject)) {
      items = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];
    } else {
      items = dragObject.nodes;
    }
    return items.every((item) => this.checkNestingUp(dropTarget, item));
  }

  /**
   * 检查对象对父级的要求，涉及配置 parentWhitelist
   */
  checkNestingUp(parent: ParentalNode, obj: NodeSchema | Node): boolean {
    if (isNode(obj) || isNodeSchema(obj)) {
      const config = isNode(obj) ? obj.componentMeta : this.getComponentMeta(obj.componentName);
      if (config) {
        return config.checkNestingUp(obj, parent);
      }
    }

    return true;
  }

  /**
   * 检查投放位置对子级的要求，涉及配置 childWhitelist
   */
  checkNestingDown(parent: ParentalNode, obj: NodeSchema | Node): boolean {
    const config = parent.componentMeta;
    return config.checkNestingDown(parent, obj) && this.checkNestingUp(parent, obj);
  }

  // ======= compatibles for vision
  getRoot() {
    return this.rootNode;
  }

  // add toData
  toData(extraComps?: string[]) {
    const node = this.export(TransformStage.Save);
    const data = {
      componentsMap: this.getComponentsMap(extraComps),
      componentsTree: [node],
    };
    return data;
  }

  getHistory(): History {
    return this.history;
  }

  get root() {
    return this.rootNode;
  }

  /**
   * @deprecated
   */
  getAddonData(name: string) {
    const addon = this._addons[name];
    return addon?.exportData();
  }

  /**
   * @deprecated
   */
  registerAddon(name: string, exportData: any) {
    if (['id', 'params', 'layout'].indexOf(name) > -1) {
      throw new Error('addon name cannot be id, params, layout');
    }
    const i = this._addons?.findIndex((item) => item.name === name);
    if (i > -1) {
      this._addons?.splice(i, 1);
    }
    this._addons?.push({
      exportData,
      name,
    });
  }


  acceptRootNodeVisitor(
    visitorName = 'default',
    visitorFn: (node: RootNode) => any,
  ) {
    let visitorResult = {};
    if (!visitorName) {
      /* tslint:disable no-console */
      console.warn('Invalid or empty RootNodeVisitor name.');
    }
    try {
      visitorResult = visitorFn.call(this, this.rootNode);
      this.rootNodeVisitorMap[visitorName] = visitorResult;
    } catch (e) {
      console.error('RootNodeVisitor is not valid.');
    }
    return visitorResult;
  }

  getRootNodeVisitor(name: string) {
    return this.rootNodeVisitorMap[name];
  }

  getComponentsMap(extraComps?: string[]) {
    const componentsMap: ComponentMap[] = [];
    // 组件去重
    const map: any = {};
    for (const node of this._nodesMap.values()) {
      const { componentName } = node || {};
      if (!map[componentName] && node?.componentMeta?.npm?.package) {
        map[componentName] = true;
        componentsMap.push({
          componentName,
          package: node?.componentMeta?.npm?.package,
        });
      }
    }
    // 合并外界传入的自定义渲染的组件
    if (Array.isArray(extraComps)) {
      extraComps.forEach(c => {
        if (c && !map[c]) {
          const m = this.getComponentMeta(c);
          if (m && m.npm?.package) {
            componentsMap.push({
              componentName: c,
              package: m.npm?.package,
            });
          }
        }
      });
    }
    return componentsMap;
  }

  onNodeCreate(func: (node: Node) => void) {
    this.emitter.on('nodecreate', func);
    return () => {
      this.emitter.removeListener('nodecreate', func);
    };
  }

  onNodeDestroy(func: (node: Node) => void) {
    this.emitter.on('nodedestroy', func);
    return () => {
      this.emitter.removeListener('nodedestroy', func);
    };
  }

  /**
   * @deprecated
   */
  refresh() {
    console.warn('refresh method is deprecated');
  }

  /**
   * @deprecated
   */
  onRefresh(/* func: () => void */) {
    console.warn('onRefresh method is deprecated');
  }

  onReady(fn: Function) {
    this.designer.editor.on('document-open', fn);
    return () => {
      this.designer.editor.removeListener('document-open', fn);
    };
  }

  private setupListenActiveNodes() {
    // todo:
  }
}

export function isDocumentModel(obj: any): obj is DocumentModel {
  return obj && obj.rootNode;
}

export function isPageSchema(obj: any): obj is PageSchema {
  return obj?.componentName === 'Page';
}
