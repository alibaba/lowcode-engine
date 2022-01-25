import { obx, computed, makeObservable } from '@alilc/lowcode-editor-core';
import { uniqueId } from '@alilc/lowcode-utils';
import { TitleContent } from '@alilc/lowcode-types';
import { Node } from './node';
import { intl } from '../../locale';

// modals assoc x-hide value, initial: check is Modal, yes will put it in modals, cross levels
// if-else-if assoc conditionGroup value, should be the same level, and siblings, need renderEngine support
export class ExclusiveGroup {
  readonly isExclusiveGroup = true;

  readonly id = uniqueId('exclusive');

  @obx.shallow readonly children: Node[] = [];

  @obx private visibleIndex = 0;

  @computed get document() {
    return this.visibleNode.document;
  }

  @computed get zLevel() {
    return this.visibleNode.zLevel;
  }

  @computed get length() {
    return this.children.length;
  }

  @computed get visibleNode(): Node {
    return this.children[this.visibleIndex];
  }

  @computed get firstNode(): Node {
    return this.children[0]!;
  }

  get index() {
    return this.firstNode.index;
  }

  add(node: Node) {
    if (node.nextSibling && node.nextSibling.conditionGroup === this) {
      const i = this.children.indexOf(node.nextSibling);
      this.children.splice(i, 0, node);
    } else {
      this.children.push(node);
    }
  }

  remove(node: Node) {
    const i = this.children.indexOf(node);
    if (i > -1) {
      this.children.splice(i, 1);
      if (this.visibleIndex > i) {
        this.visibleIndex -= 1;
      } else if (this.visibleIndex >= this.children.length) {
        this.visibleIndex = this.children.length - 1;
      }
    }
  }

  setVisible(node: Node) {
    const i = this.children.indexOf(node);
    if (i > -1) {
      this.visibleIndex = i;
    }
  }

  isVisible(node: Node) {
    const i = this.children.indexOf(node);
    return i === this.visibleIndex;
  }

  readonly title: TitleContent;

  constructor(readonly name: string, title?: TitleContent) {
    makeObservable(this);
    this.title = title || {
      type: 'i18n',
      intl: intl('Condition Group'),
    };
  }
}

export function isExclusiveGroup(obj: any): obj is ExclusiveGroup {
  return obj && obj.isExclusiveGroup;
}
