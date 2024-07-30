export class Node<T> {
  readonly incoming = new Map<string, Node<T>>();
  readonly outgoing = new Map<string, Node<T>>();

  constructor(
    readonly key: string,
    readonly data: T,
  ) {}
}

/**
 * 有向图
 */
export class Graph<T> {
  private readonly _nodes = new Map<string, Node<T>>();

  constructor(private readonly _hashFn: (element: T) => string) {}

  roots(): Node<T>[] {
    const ret: Node<T>[] = [];
    for (const node of this._nodes.values()) {
      if (node.outgoing.size === 0) {
        ret.push(node);
      }
    }
    return ret;
  }

  insertEdge(from: T, to: T): void {
    const fromNode = this.lookupOrInsertNode(from);
    const toNode = this.lookupOrInsertNode(to);

    fromNode.outgoing.set(toNode.key, toNode);
    toNode.incoming.set(fromNode.key, fromNode);
  }

  removeNode(data: T): void {
    const key = this._hashFn(data);
    this._nodes.delete(key);
    for (const node of this._nodes.values()) {
      node.outgoing.delete(key);
      node.incoming.delete(key);
    }
  }

  lookupOrInsertNode(data: T): Node<T> {
    const key = this._hashFn(data);
    let node = this._nodes.get(key);

    if (!node) {
      node = new Node(key, data);
      this._nodes.set(key, node);
    }

    return node;
  }

  lookup(data: T): Node<T> | undefined {
    return this._nodes.get(this._hashFn(data));
  }

  isEmpty(): boolean {
    return this._nodes.size === 0;
  }

  toString(): string {
    const data: string[] = [];
    for (const [key, value] of this._nodes) {
      data.push(
        `${key}\n\t(-> incoming)[${[...value.incoming.keys()].join(', ')}]\n\t(outgoing ->)[${[...value.outgoing.keys()].join(',')}]\n`,
      );
    }
    return data.join('\n');
  }

  /**
   * 暴力搜索，仅用于排查故障
   */
  findCycleSlow() {
    for (const [id, node] of this._nodes) {
      const seen = new Set<string>([id]);
      const res = this._findCycle(node, seen);
      if (res) {
        return res;
      }
    }
    return undefined;
  }

  private _findCycle(node: Node<T>, seen: Set<string>): string | undefined {
    for (const [id, outgoing] of node.outgoing) {
      if (seen.has(id)) {
        return [...seen, id].join(' -> ');
      }
      seen.add(id);
      const value = this._findCycle(outgoing, seen);
      if (value) {
        return value;
      }
      seen.delete(id);
    }
    return undefined;
  }
}

export class CyclicDependencyError extends Error {
  constructor(graph: Graph<any>) {
    super('cyclic dependency between services');
    this.message =
      graph.findCycleSlow() ?? `UNABLE to detect cycle, dumping graph: \n${graph.toString()}`;
  }
}
