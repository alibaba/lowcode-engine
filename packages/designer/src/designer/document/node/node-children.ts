import Node, { NodeParent } from './node';
import { NodeData } from '../../schema';
import { obx, computed } from '@recore/obx';

export default class NodeChildren {
  @obx.val private children: Node[];
  constructor(readonly owner: NodeParent, childrenData: NodeData | NodeData[]) {
    this.children = (Array.isArray(childrenData) ? childrenData : [childrenData]).map(child => {
      const node = this.owner.document.createNode(child);
      node.internalSetParent(this.owner);
      return node;
    });
  }

  /**
   * 导出 schema
   * @param serialize 序列化，加 id 标识符，用于储存为操作记录
   */
  exportSchema(serialize = false): NodeData[] {
    return this.children.map(node => node.exportSchema(serialize));
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

  /*
  // 用于数据重新灌入
  merge() {
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
  */

  /**
   * 删除一个节点
   */
  delete(node: Node, purge: boolean = false): boolean {
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
    node.conditionGroup = null;
    if (node.prevSibling && node.nextSibling) {
      const conditionGroup = node.prevSibling.conditionGroup;
      if (conditionGroup && conditionGroup === node.nextSibling.conditionGroup) {
        node.conditionGroup = conditionGroup;
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
