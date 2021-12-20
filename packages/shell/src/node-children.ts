import {
  NodeChildren as InnerNodeChildren,
  Node as InnerNode,
} from '@ali/lowcode-designer';
import { NodeSchema } from '@ali/lowcode-types';
import Node from './node';
import { nodeSymbol, nodeChildrenSymbol } from './symbols';

export default class NodeChildren {
  private readonly [nodeChildrenSymbol]: InnerNodeChildren;

  constructor(nodeChildren: InnerNodeChildren) {
    this[nodeChildrenSymbol] = nodeChildren;
  }

  static create(nodeChldren: InnerNodeChildren | null) {
    if (!nodeChldren) return null;
    return new NodeChildren(nodeChldren);
  }

  get size() {
    return this[nodeChildrenSymbol].size;
  }

  isEmpty() {
    return this[nodeChildrenSymbol].isEmpty();
  }

  delete(node: Node) {
    return this[nodeChildrenSymbol].delete(node[nodeSymbol]);
  }

  insert(node: Node, at?: number | null | undefined, useMutator?: boolean) {
    return this[nodeChildrenSymbol].insert(node[nodeSymbol], at, useMutator);
  }

  indexOf(node: Node) {
    return this[nodeChildrenSymbol].indexOf(node[nodeSymbol]);
  }

  splice(start: number, deleteCount: number, node?: Node) {
    this[nodeChildrenSymbol].splice(start, deleteCount, node?.[nodeSymbol]);
  }

  get(index: number) {
    return this[nodeChildrenSymbol].get(index);
  }

  has(node: Node) {
    return this[nodeChildrenSymbol].has(node[nodeSymbol]);
  }

  forEach(fn: (node: Node, index: number) => void) {
    this[nodeChildrenSymbol].forEach((item: InnerNode<NodeSchema>, index: number) => {
      fn(Node.create(item)!, index);
    });
  }

  map<T>(fn: (node: Node, index: number) => T[]) {
    return this[nodeChildrenSymbol].map((item: InnerNode<NodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  every(fn: (node: Node, index: number) => boolean) {
    return this[nodeChildrenSymbol].every((item: InnerNode<NodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  some(fn: (node: Node, index: number) => boolean) {
    return this[nodeChildrenSymbol].some((item: InnerNode<NodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  filter(fn: (node: Node, index: number) => boolean) {
    return this[nodeChildrenSymbol]
      .filter((item: InnerNode<NodeSchema>, index: number) => {
        return fn(Node.create(item)!, index);
      })
      .map((item: InnerNode<NodeSchema>) => Node.create(item)!);
  }

  find(fn: (node: Node, index: number) => boolean) {
    return Node.create(
      this[nodeChildrenSymbol].find((item: InnerNode<NodeSchema>, index: number) => {
        return fn(Node.create(item)!, index);
      }),
    );
  }
}
