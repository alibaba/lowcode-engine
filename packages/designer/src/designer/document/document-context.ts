import Project from '../project';
import { RootSchema, NodeData, isDOMText, isJSExpression } from '../schema';

export default class DocumentContext {
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
  readonly history: History = new History(this);
  /**
   * 根节点 类型有：Page/Component/Block
   */
  readonly root: Root;
  /**
   * 模拟器
   */
  simulator?: SimulatorInterface;

  private nodesMap = new Map<string, INode>();
  private nodes = new Set<INode>();
  private seqId = 0;

  constructor(readonly project: Project, schema: RootSchema) {
    this.id = uniqueId('doc');
    this.root = new Root(this, viewData);
  }

  /**
   * 根据 id 获取节点
   */
  getNode(id: string): Node | null {
    return this.nodesMap.get(id) || null;
  }

  /**
   * 根据 schema 创建一个节点
   */
  createNode(data: NodeData): Node {
    let schema: any;
    if (isDOMText(data)) {
      schema = {
        componentName: '#text',
        children: data,
      };
    } else if (isJSExpression(data)) {
      schema = {
        componentName: '#expression',
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
  insertNode(parent: Node, thing: Node | Schema, at?: number | null, copy?: boolean): Node;
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
    if (!node || !node.parent) {
      return;
    }
    this.nodesMap.delete(id);
    this.nodes.delete(node);
    node.parent.removeChild(node);
  }
  /**
   * 导出 schema 数据
   */
  getSchema(): Schema {
    return this.root.getSchema();
  }
  /**
   * 导出节点 Schema
   */
  getNodeSchema(id: string): Schema | null {
    const node = this.getNode(id);
    if (node) {
      return node.getSchema();
    }
    return null;
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
  /**
   * 激活当前文档
   */
  active(): void {}
  /**
   * 不激活
   */
  suspense(): void {}
  /**
   * 销毁
   */
  destroy(): void {}

  /**
   * 是否已修改
   */
  isModified() {
    return !this.history.isSavePoint();
  }

  /**
   * 生成唯一id
   */
  nextId() {
    return (++this.seqId).toString(36).toLocaleLowerCase();
  }

  getComponent(tagName: string): any {
    return this.simulator!.getCurrentComponent(tagName);
  }
}
