import { NodeData, isNodeSchema, obx, computed } from '@ali/lowcode-globals';
import { Node, ParentalNode } from './node';
import { ExportType } from './export-type';

export class NodeChildren {
  @obx.val private children: Node[];
  constructor(readonly owner: ParentalNode, data: NodeData | NodeData[]) {
    this.children = (Array.isArray(data) ? data : [data]).map(child => {
      return this.owner.document.createNode(child);
    });
  }

  interalInitParent() {
    this.children.forEach(child => child.internalSetParent(this.owner));
  }

  /**
   * 导出 schema
   */
  export(exportType: ExportType = ExportType.ForSave): NodeData[] {
    return this.children.map(node => {
      const data = node.export(exportType);
      if (node.isLeaf() && ExportType.ForSave === exportType) {
        // FIXME: filter empty
        return data.children as NodeData;
      }
      return data;
    });
  }

  import(data?: NodeData | NodeData[], checkId = false) {
    data = data ? (Array.isArray(data) ? data : [data]) : [];

    const originChildren = this.children.slice();
    this.children.forEach(child => child.internalSetParent(null));

    const children = new Array<Node>(data.length);
    for (let i = 0, l = data.length; i < l; i++) {
      const child = originChildren[i];
      const item = data[i];

      let node: Node | undefined;
      if (isNodeSchema(item) && !checkId && child && child.componentName === item.componentName) {
        node = child;
        node.import(item);
      } else {
        node = this.owner.document.createNode(item);
      }
      children[i] = node;
    }

    this.children = children;
    this.interalInitParent();
  }

  /**
   * 元素个数
   */
  @computed get size(): number {
    return this.children.length;
  }

  /**
   * 是否空
   */
  @computed isEmpty() {
    return this.size < 1;
  }

  @computed notEmpty() {
    return this.size > 0;
  }

  /**
   * 删除一个节点
   */
  delete(node: Node, purge = false): boolean {
    const i = this.children.indexOf(node);
    if (i < 0) {
      return false;
    }
    const deleted = this.children.splice(i, 1)[0];
    if (purge) {
      // should set parent null
      deleted.internalSetParent(null);
      deleted.purge();
    }
    return false;
  }

  /**
   * 插入一个节点，返回新长度
   */
  insert(node: Node, at?: number | null): void {
    const children = this.children;
    let index = at == null || at === -1 ? children.length : at;

    const i = children.indexOf(node);

    if (i < 0) {
      if (index < children.length) {
        children.splice(index, 0, node);
      } else {
        children.push(node);
      }
      node.internalSetParent(this.owner);
    } else {
      if (index > i) {
        index -= 1;
      }

      if (index === i) {
        return;
      }

      children.splice(i, 1);
      children.splice(index, 0, node);
    }

    // check condition group
    if (node.conditionGroup) {
      if (
        !(
          // just sort at condition group
          (
            (node.prevSibling && node.prevSibling.conditionGroup === node.conditionGroup) ||
            (node.nextSibling && node.nextSibling.conditionGroup === node.conditionGroup)
          )
        )
      ) {
        node.setConditionGroup(null);
      }
    }
    if (node.prevSibling && node.nextSibling) {
      const conditionGroup = node.prevSibling.conditionGroup;
      // insert at condition group
      if (conditionGroup && conditionGroup === node.nextSibling.conditionGroup) {
        node.setConditionGroup(conditionGroup);
      }
    }
  }

  /**
   * 取得节点索引编号
   */
  indexOf(node: Node): number {
    return this.children.indexOf(node);
  }

  /**
   * 根据索引获得节点
   */
  get(index: number): Node | null {
    return this.children[index] || null;
  }

  /**
   * 是否存在节点
   */
  has(node: Node) {
    return this.indexOf(node) > -1;
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: Node } } {
    let index = 0;
    const children = this.children;
    const length = children.length || 0;
    return {
      next() {
        if (index < length) {
          return {
            value: children[index++],
            done: false,
          };
        }
        return {
          value: undefined as any,
          done: true,
        };
      },
    };
  }

  /**
   * 遍历
   */
  forEach(fn: (item: Node, index: number) => void): void {
    this.children.forEach((child, index) => {
      return fn(child, index);
    });
  }

  /**
   * 遍历
   */
  map<T>(fn: (item: Node, index: number) => T): T[] | null {
    return this.children.map((child, index) => {
      return fn(child, index);
    });
  }

  private purged = false;
  /**
   * 回收销毁
   */
  purge() {
    if (this.purged) {
      return;
    }
    this.purged = true;
    this.children.forEach(child => child.purge());
  }
}
