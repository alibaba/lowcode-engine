import { obx, computed, TitleContent } from '../../../../../globals';
import { uniqueId } from '../../../../../utils/unique-id';
import Node from './node';
import { intl } from '../../../locale';

export default class ExclusiveGroup {
  readonly isExclusiveGroup = true;
  readonly id = uniqueId('cond-grp');
  @obx.val readonly children: Node[] = [];

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
    this.title = title || {
      type: 'i18n',
      intl: intl('Condition Group'),
    };
  }
}

export function isExclusiveGroup(obj: any): obj is ExclusiveGroup {
  return obj && obj.isExclusiveGroup;
}
