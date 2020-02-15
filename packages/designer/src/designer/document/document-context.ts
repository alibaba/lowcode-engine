import Project from '../project';
import { RootSchema, NodeData, isDOMText, isJSExpression, NodeSchema } from '../schema';
import Node, { isNodeParent, insertChildren, insertChild, NodeParent } from './node/node';
import { Selection } from './selection';
import RootNode from './node/root-node';
import { SimulatorInterface } from '../simulator-interface';
import { computed } from '@recore/obx';

export default class DocumentContext {
  /**
   * 根节点 类型有：Page/Component/Block
   */
  readonly rootNode: RootNode;
  /**
   * 文档编号
   */
  readonly id: string;
  /**
   * 选区控制
   */
  readonly selection: Selection = new Selection(this);
  /**
   * 操作记录控制
   */
  // TODO
  // readonly history: History = new History(this);

  private nodesMap = new Map<string, Node>();
  private nodes = new Set<Node>();
  private seqId = 0;
  private _simulator?: SimulatorInterface;

  /**
   * 模拟器
   */
  get simulator(): SimulatorInterface | null {
    return this._simulator || null;
  }

  get fileName() {
    return this.rootNode.extras.get('fileName')?.value as string;
  }

  set fileName(fileName: string) {
    this.rootNode.extras.get('fileName', true).value = fileName;
  }

  constructor(readonly project: Project, schema: RootSchema) {
    this.rootNode = new RootNode(this, schema);
    this.id = this.rootNode.id;
  }

  /**
   * 生成唯一id
   */
  nextId() {
    return (++this.seqId).toString(36).toLocaleLowerCase();
  }

  /**
   * 根据 id 获取节点
   */
  getNode(id: string): Node | null {
    return this.nodesMap.get(id) || null;
  }

  /**
   * 是否存在节点
   */
  hasNode(id: string): boolean {
    const node = this.getNode(id);
    return node ? !node.isPurged : false;
  }

  /**
   * 根据 schema 创建一个节点
   */
  createNode(data: NodeData): Node {
    let schema: any;
    if (isDOMText(data) || isJSExpression(data)) {
      schema = {
        componentName: '#frag',
        children: data,
      };
    } else {
      schema = data;
    }
    const node = new Node(this, schema);
    this.nodesMap.set(node.id, node);
    this.nodes.add(node);
    return node;
  }

  /**
   * 插入一个节点
   */
  insertNode(parent: NodeParent, thing: Node | NodeData, at?: number | null, copy?: boolean): Node {
    return insertChild(parent, thing, at, copy);
  }

  /**
   * 插入多个节点
   */
  insertNodes(parent: NodeParent, thing: Node[] | NodeData[], at?: number | null, copy?: boolean) {
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
    this.internalRemoveAndPurgeNode(node);
  }

  /**
   * 内部方法，请勿调用
   */
  internalRemoveAndPurgeNode(node: Node) {
    if (!this.nodes.has(node)) {
      return;
    }
    this.nodesMap.delete(node.id);
    this.nodes.delete(node);
    node.remove();
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
    if (isNodeParent(wrapper)) {
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
  get schema(): NodeSchema {
    return this.rootNode.schema;
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
    // return !this.history.isSavePoint();
  }

  /**
   * 提供给模拟器的参数
   */
  @computed get simulatorProps(): object {
    let simulatorProps = this.project.simulatorProps;
    if (typeof simulatorProps === 'function') {
      simulatorProps = simulatorProps(this);
    }
    return {
      ...simulatorProps,
      documentContext: this,
      onMount: this.mountSimulator.bind(this),
    };
  }

  private mountSimulator(simulator: SimulatorInterface) {
    this._simulator = simulator;
    // TODO: emit simulator mounted
  }

  /**
   * 根据节点取得视图实例，在循环等场景会有多个，依赖 simulator 的接口
   */
  getViewInstance(node: Node): ViewInstance[] | null {
    if (this.simulator) {
      this.simulator.getViewInstance(node.id);
    }
    return null;
  }

  /**
   * 通过 DOM 节点获取节点，依赖 simulator 的接口
   */
  getNodeFromElement(target: Element | null): Node | null {
    if (!this.simulator || !target) {
      return null;
    }

    const id = this.simulator.getClosestNodeId(target);
    if (!id) {
      return null;
    }
    return this.getNode(id) as Node;
  }

  /**
   * 获得到的结果是一个数组
   * 表示一个实例对应多个外层 DOM 节点，依赖 simulator 的接口
   */
  getDOMNodes(viewInstance: ViewInstance): Array<Element | Text> | null {
    if (!this.simulator) {
      return null;
    }

    if (isElement(viewInstance)) {
      return [viewInstance];
    }

    return this.simulator.findDOMNodes(viewInstance);
  }

  getComponent(componentName: string): any {
    return this.simulator!.getCurrentComponent(componentName);
  }

  private _opened: boolean = true;
  private _suspensed: boolean = false;

  /**
   * 是否不是激活的
   */
  get suspensed(): boolean {
    return this._suspensed;
  }

  /**
   * 与 suspensed 相反，是否是激活的，这个函数可能用的更多一点
   */
  get actived(): boolean {
    return !this._suspensed;
  }

  /**
   * 切换激活，只有打开的才能激活
   * 不激活，打开之后切换到另外一个时发生，比如 tab 视图，切换到另外一个标签页
   */
  set suspensed(flag: boolean) {
    if (!this._opened && !flag) {
      return;
    }
    this._suspensed = flag;
  }

  /**
   * 打开，已载入，默认建立时就打开状态，除非手动关闭
   */
  open(): void {
    this._opened = true;
  }

  /**
   * 关闭，相当于 sleep，仍然缓存，停止一切响应，如果有发生的变更没被保存，仍然需要去取数据保存
   */
  close(): void {
    this.suspensed = true;
    this._opened = false;
  }

  /**
   * 从项目中移除
   */
  remove() {

  }
}
