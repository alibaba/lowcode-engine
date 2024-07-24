export class LinkedListNode<E> {
  static readonly Undefined = new LinkedListNode<any>(undefined);

  current: E;
  next: LinkedListNode<E>;
  prev: LinkedListNode<E>;

  constructor(current: E) {
    this.current = current;
    this.next = LinkedListNode.Undefined;
    this.prev = LinkedListNode.Undefined;
  }
}

/**
 * Array Api Like LinkedList
 */
export class LinkedList<E> {
  private _first: LinkedListNode<E> = LinkedListNode.Undefined;
  private _last: LinkedListNode<E> = LinkedListNode.Undefined;
  private _size: number = 0;

  get length(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._first === LinkedListNode.Undefined;
  }

  clear(): void {
    let node = this._first;
    while (node !== LinkedListNode.Undefined) {
      const next = node.next;
      node.prev = LinkedListNode.Undefined;
      node.next = LinkedListNode.Undefined;
      node = next;
    }

    this._first = LinkedListNode.Undefined;
    this._last = LinkedListNode.Undefined;
    this._size = 0;
  }

  unshift(element: E): () => void {
    return this._insert(element, false);
  }

  push(element: E): () => void {
    return this._insert(element, true);
  }

  private _insert(element: E, atTheEnd: boolean): () => void {
    const newNode = new LinkedListNode(element);
    if (this._first === LinkedListNode.Undefined) {
      this._first = newNode;
      this._last = newNode;
    } else if (atTheEnd) {
      // push
      const oldLast = this._last;
      this._last = newNode;
      newNode.prev = oldLast;
      oldLast.next = newNode;
    } else {
      // unshift
      const oldFirst = this._first;
      this._first = newNode;
      newNode.next = oldFirst;
      oldFirst.prev = newNode;
    }
    this._size += 1;

    let didRemove = false;
    return () => {
      if (!didRemove) {
        didRemove = true;
        this._remove(newNode);
      }
    };
  }

  shift(): E | undefined {
    if (this._first === LinkedListNode.Undefined) {
      return undefined;
    } else {
      const res = this._first.current;
      this._remove(this._first);
      return res;
    }
  }

  pop(): E | undefined {
    if (this._last === LinkedListNode.Undefined) {
      return undefined;
    } else {
      const res = this._last.current;
      this._remove(this._last);
      return res;
    }
  }

  private _remove(node: LinkedListNode<E>): void {
    if (node.prev !== LinkedListNode.Undefined && node.next !== LinkedListNode.Undefined) {
      // middle
      const anchor = node.prev;
      anchor.next = node.next;
      node.next.prev = anchor;
    } else if (node.prev === LinkedListNode.Undefined && node.next === LinkedListNode.Undefined) {
      // only node
      this._first = LinkedListNode.Undefined;
      this._last = LinkedListNode.Undefined;
    } else if (node.next === LinkedListNode.Undefined) {
      // last
      this._last = this._last.prev!;
      this._last.next = LinkedListNode.Undefined;
    } else if (node.prev === LinkedListNode.Undefined) {
      // first
      this._first = this._first.next!;
      this._first.prev = LinkedListNode.Undefined;
    }

    // done
    this._size -= 1;
  }

  *[Symbol.iterator](): Iterator<E> {
    let node = this._first;
    while (node !== LinkedListNode.Undefined) {
      yield node.current;
      node = node.next;
    }
  }
}
