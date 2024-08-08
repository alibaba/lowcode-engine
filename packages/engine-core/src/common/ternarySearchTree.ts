import { CharCode } from './charCode';
import { compareSubstring, compareSubstringIgnoreCase } from './strings';

export interface IKeyIterator<K> {
  reset(key: K): this;
  next(): this;

  hasNext(): boolean;
  compare(a: string): number;
  value(): string;
}

export class PathIterator implements IKeyIterator<string> {
  private _value!: string;
  private _valueLen!: number;
  private _from!: number;
  private _to!: number;

  constructor(private readonly _caseSensitive: boolean = true) {}

  reset(key: string): this {
    this._from = 0;
    this._to = 0;
    this._value = key;
    this._valueLen = key.length;

    for (let pos = key.length - 1; pos >= 0; pos--, this._valueLen--) {
      const ch = this._value.charCodeAt(pos);
      if (!(ch === CharCode.Slash)) {
        break;
      }
    }

    return this.next();
  }

  next(): this {
    this._from = this._to;

    let justSeps = true;
    for (; this._to < this._valueLen; this._to++) {
      const ch = this._value.charCodeAt(this._to);
      if (ch === CharCode.Slash) {
        if (justSeps) {
          this._from++;
        } else {
          break;
        }
      } else {
        justSeps = false;
      }
    }

    return this;
  }

  hasNext(): boolean {
    return this._to < this._valueLen;
  }

  compare(a: string): number {
    return this._caseSensitive
      ? compareSubstring(a, this._value, 0, a.length, this._from, this._to)
      : compareSubstringIgnoreCase(a, this._value, 0, a.length, this._from, this._to);
  }

  value(): string {
    return this._value.substring(this._from, this._to);
  }
}

class TernarySearchTreeNode<K, V> {
  height: number = 1;
  segment!: string;
  value: V | undefined;
  key: K | undefined;
  left: TernarySearchTreeNode<K, V> | undefined;
  mid: TernarySearchTreeNode<K, V> | undefined;
  right: TernarySearchTreeNode<K, V> | undefined;

  isEmpty(): boolean {
    return !this.left && !this.mid && !this.right && !this.value;
  }

  rotateLeft() {
    const tmp = this.right!;
    this.right = tmp.left;
    tmp.left = this;
    this.updateHeight();
    tmp.updateHeight();
    return tmp;
  }

  rotateRight() {
    const tmp = this.left!;
    this.left = tmp.right;
    tmp.right = this;
    this.updateHeight();
    tmp.updateHeight();
    return tmp;
  }

  updateHeight() {
    this.height = 1 + Math.max(this.heightLeft, this.heightRight);
  }

  balanceFactor() {
    return this.heightRight - this.heightLeft;
  }

  get heightLeft() {
    return this.left?.height ?? 0;
  }

  get heightRight() {
    return this.right?.height ?? 0;
  }
}

const enum Dir {
  Left = -1,
  Mid = 0,
  Right = 1,
}

/**
 * TST的应用场景包括但不限于搜索引擎、代码检查、自动补全等功能，尤其适用于大量字符串查询的场景 。
 * 例如，在实现搜索框智能提示功能时，TST可以高效地进行前缀匹配，快速给出用户可能的输入选项 。
 */
export class TernarySearchTree<K, V> {
  static forPaths<E>(ignorePathCasing = false): TernarySearchTree<string, E> {
    return new TernarySearchTree<string, E>(new PathIterator(ignorePathCasing));
  }

  private _iter: IKeyIterator<K>;

  private _root: TernarySearchTreeNode<K, V> | undefined;

  constructor(segments: IKeyIterator<K>) {
    this._iter = segments;
  }

  clear() {
    this._root = undefined;
  }

  set(key: K, element: V): V | undefined {
    const iter = this._iter.reset(key);

    if (!this._root) {
      this._root = new TernarySearchTreeNode<K, V>();
      this._root.segment = iter.value();
    }

    const stack: [Dir, TernarySearchTreeNode<K, V>][] = [];

    let node: TernarySearchTreeNode<K, V> = this._root;
    while (true) {
      const val = iter.compare(node.segment);

      if (val > 0) {
        // left
        if (!node.left) {
          node.left = new TernarySearchTreeNode<K, V>();
          node.left.segment = iter.value();
        }
        stack.push([Dir.Left, node]);
        node = node.left;
      } else if (val < 0) {
        // right
        if (!node.right) {
          node.right = new TernarySearchTreeNode<K, V>();
          node.right.segment = iter.value();
        }
        stack.push([Dir.Right, node]);
        node = node.right;
      } else if (iter.hasNext()) {
        // mid
        iter.next();
        if (!node.mid) {
          node.mid = new TernarySearchTreeNode<K, V>();
          node.mid.segment = iter.value();
        }
        stack.push([Dir.Mid, node]);
        node = node.mid;
      } else {
        break;
      }
    }

    // set value
    const oldElement = node.value;
    node.value = element;
    node.key = key;

    // balance
    for (let i = stack.length - 1; i >= 0; i--) {
      const node = stack[i][1];

      node.updateHeight();
      const bf = node.balanceFactor();

      if (bf < -1 || bf > 1) {
        // needs rotate
        const d1 = stack[i][0];
        const d2 = stack[i + 1][0];

        if (d1 === Dir.Right && d2 === Dir.Right) {
          //right, right -> rotate left
          stack[i][1] = node.rotateLeft();
        } else if (d1 === Dir.Left && d2 === Dir.Left) {
          // left, left -> rotate right
          stack[i][1] = node.rotateRight();
        } else if (d1 === Dir.Right && d2 === Dir.Left) {
          // right, left -> double rotate right, left
          node.right = stack[i + 1][1] = stack[i + 1][1].rotateRight();
          stack[i][1] = node.rotateLeft();
        } else if (d1 === Dir.Left && d2 === Dir.Right) {
          // left, right -> double rotate left, right
          node.left = stack[i + 1][1] = stack[i + 1][1].rotateLeft();
          stack[i][1] = node.rotateRight();
        } else {
          throw new Error();
        }

        // patch path to parent
        if (i > 0) {
          switch (stack[i - 1][0]) {
            case Dir.Left:
              stack[i - 1][1].left = stack[i][1];
              break;
            case Dir.Right:
              stack[i - 1][1].right = stack[i][1];
              break;
            case Dir.Mid:
              stack[i - 1][1].mid = stack[i][1];
              break;
          }
        } else {
          this._root = stack[0][1];
        }
      }
    }

    return oldElement;
  }

  get(key: K): V | undefined {
    return this._getNode(key)?.value;
  }

  private _getNode(key: K) {
    const iter = this._iter.reset(key);
    let node = this._root;
    while (node) {
      const val = iter.compare(node.segment);
      if (val > 0) {
        // left
        node = node.left;
      } else if (val < 0) {
        // right
        node = node.right;
      } else if (iter.hasNext()) {
        // mid
        iter.next();
        node = node.mid;
      } else {
        break;
      }
    }
    return node;
  }

  findSubstr(key: K): V | undefined {
    const iter = this._iter.reset(key);

    let node = this._root;
    let candidate: V | undefined = undefined;
    while (node) {
      const val = iter.compare(node.segment);
      if (val > 0) {
        node = node.left;
      } else if (val < 0) {
        node = node.right;
      } else if (iter.hasNext()) {
        iter.next();

        candidate = node.value || candidate;
        node = node.mid;
      } else {
        break;
      }
    }

    return node?.value ?? candidate;
  }
}
