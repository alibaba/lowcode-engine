import type { IExclusiveGroup } from '@alilc/lowcode-designer';
import { IPublicModelExclusiveGroup, IPublicModelNode } from '@alilc/lowcode-types';
import { conditionGroupSymbol, nodeSymbol } from '../symbols';
import { Node } from './node';

export class ConditionGroup implements IPublicModelExclusiveGroup {
  private [conditionGroupSymbol]: IExclusiveGroup | null;

  constructor(conditionGroup: IExclusiveGroup | null) {
    this[conditionGroupSymbol] = conditionGroup;
  }

  get id() {
    return this[conditionGroupSymbol]?.id;
  }

  get title() {
    return this[conditionGroupSymbol]?.title;
  }

  get firstNode() {
    return Node.create(this[conditionGroupSymbol]?.firstNode);
  }

  setVisible(node: IPublicModelNode) {
    this[conditionGroupSymbol]?.setVisible((node as any)[nodeSymbol] ? (node as any)[nodeSymbol] : node);
  }

  static create(conditionGroup: IExclusiveGroup | null) {
    if (!conditionGroup) {
      return null;
    }
    // @ts-ignore
    if (conditionGroup[conditionGroupSymbol]) {
      return (conditionGroup as any)[conditionGroupSymbol];
    }
    const shellConditionGroup = new ConditionGroup(conditionGroup);
    // @ts-ignore
    shellConditionGroup[conditionGroupSymbol] = shellConditionGroup;
    return shellConditionGroup;
  }
}
