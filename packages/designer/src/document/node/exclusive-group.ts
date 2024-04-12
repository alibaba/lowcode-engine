import { observable, computed, makeObservable } from '@alilc/lowcode-editor-core';
import { uniqueId } from '@alilc/lowcode-utils';
import { IPublicTypeTitleContent, IPublicModelExclusiveGroup } from '@alilc/lowcode-types';
import type { INode } from './node';
import { intl } from '../../locale';

export interface IExclusiveGroup extends IPublicModelExclusiveGroup<INode> {
  readonly name: string;

  get index(): number | undefined;

  remove(node: INode): void;

  add(node: INode): void;

  isVisible(node: INode): boolean;

  get length(): number;

  get visibleNode(): INode;
}

// modals assoc x-hide value, initial: check is Modal, yes will put it in modals, cross levels
// if-else-if assoc conditionGroup value, should be the same level,
// and siblings, need renderEngine support
export class ExclusiveGroup implements IExclusiveGroup {
  readonly isExclusiveGroup = true;

  readonly id = uniqueId('exclusive');

  readonly title: IPublicTypeTitleContent;

  @observable.shallow readonly children: INode[] = [];

  @observable private visibleIndex = 0;

  @computed get document() {
    return this.visibleNode.document;
  }

  @computed get zLevel() {
    return this.visibleNode.zLevel;
  }

  @computed get length() {
    return this.children.length;
  }

  @computed get visibleNode(): INode {
    return this.children[this.visibleIndex];
  }

  @computed get firstNode(): INode {
    return this.children[0]!;
  }

  get index() {
    return this.firstNode.index;
  }

  constructor(readonly name: string, title?: IPublicTypeTitleContent) {
    makeObservable(this);
    this.title = title || {
      type: 'i18n',
      intl: intl('Condition Group'),
    };
  }

  add(node: INode) {
    if (node.nextSibling && node.nextSibling.conditionGroup?.id === this.id) {
      const i = this.children.indexOf(node.nextSibling);
      this.children.splice(i, 0, node);
    } else {
      this.children.push(node);
    }
  }

  remove(node: INode) {
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

  setVisible(node: INode) {
    const i = this.children.indexOf(node);
    if (i > -1) {
      this.visibleIndex = i;
    }
  }

  isVisible(node: INode) {
    const i = this.children.indexOf(node);
    return i === this.visibleIndex;
  }
}

export function isExclusiveGroup(obj: any): obj is ExclusiveGroup {
  return obj && obj.isExclusiveGroup;
}
