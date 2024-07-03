/**
 * TypeScript-ization estree-walker
 * fork from: https://github.com/Rich-Harris/estree-walker
 */

import { type PlainObject, type Spec } from '../types';

type Node = Spec.JSNode;

interface WalkerContext {
  skip: () => void;
  remove: () => void;
  replace: (node: Node) => void;
}

class WalkerBase {
  should_skip: boolean = false;

  should_remove: boolean = false;

  replacement: Node | null = null;

  context: WalkerContext;

  constructor() {
    this.context = {
      skip: () => (this.should_skip = true),
      remove: () => (this.should_remove = true),
      replace: (node) => (this.replacement = node),
    };
  }

  replace(
    parent: Node | null,
    prop: keyof Node | null | undefined,
    index: number | null | undefined,
    node: Node,
  ) {
    if (parent && prop) {
      if (index != null) {
        parent[prop][index] = node;
      } else {
        parent[prop] = node;
      }
    }
  }

  remove(
    parent: Node | null | undefined,
    prop: keyof Node | null | undefined,
    index: number | null | undefined,
  ) {
    if (parent && prop) {
      if (index !== null && index !== undefined) {
        parent[prop].splice(index, 1);
      } else {
        delete parent[prop];
      }
    }
  }
}

export type SyncWalkerHandler = (
  this: WalkerContext,
  node: Node,
  parent: Node | null,
  key: PropertyKey | undefined,
  index: number | undefined,
) => void;

export class SyncWalker extends WalkerBase {
  enter: SyncWalkerHandler | undefined;

  leave: SyncWalkerHandler | undefined;

  constructor(enter?: SyncWalkerHandler | undefined, leave?: SyncWalkerHandler | undefined) {
    super();

    this.enter = enter;
    this.leave = leave;
  }

  visit(
    node: Node,
    parent: Node | null,
    prop?: keyof Node | undefined,
    index?: number | undefined,
  ): Node | null {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip;
        const _should_remove = this.should_remove;
        const _replacement = this.replacement;
        this.should_skip = false;
        this.should_remove = false;
        this.replacement = null;

        this.enter.call(this.context, node, parent, prop, index);

        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }

        if (this.should_remove) {
          this.remove(parent, prop, index);
        }

        const skipped = this.should_skip;
        const removed = this.should_remove;

        this.should_skip = _should_skip;
        this.should_remove = _should_remove;
        this.replacement = _replacement;

        if (skipped) return node;
        if (removed) return null;
      }

      let key: keyof Node;

      for (key in node) {
        const value = node[key] as unknown;

        if (value && typeof value === 'object') {
          if (Array.isArray(value)) {
            const nodes = value as unknown[];
            for (let i = 0; i < nodes.length; i += 1) {
              const item = nodes[i];
              if (isNode(item)) {
                if (!this.visit(item, node, key, i)) {
                  // removed
                  i--;
                }
              }
            }
          } else if (isNode(value)) {
            this.visit(value, node, key, undefined);
          }
        }
      }

      if (this.leave) {
        const _replacement = this.replacement;
        const _should_remove = this.should_remove;
        this.replacement = null;
        this.should_remove = false;

        this.leave.call(this.context, node, parent, prop, index);

        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }

        if (this.should_remove) {
          this.remove(parent, prop, index);
        }

        const removed = this.should_remove;

        this.replacement = _replacement;
        this.should_remove = _should_remove;

        if (removed) return null;
      }
    }

    return node;
  }
}

/**
 * Ducktype a node.
 *
 * @param {unknown} value
 * @returns {value is Node}
 */
export function isNode(value: unknown): value is Node {
  return (
    value !== null && typeof value === 'object' && 'type' in value && typeof value.type === 'string'
  );
}

export function walk(
  ast: PlainObject,
  { enter, leave }: { enter?: SyncWalkerHandler; leave?: SyncWalkerHandler } = {},
) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast as any, null);
}
