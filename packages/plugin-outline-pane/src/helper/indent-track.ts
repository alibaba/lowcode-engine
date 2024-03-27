import { isLocationChildrenDetail } from '@alilc/lowcode-utils';
import { IPublicModelDropLocation, IPublicModelNode } from '@alilc/lowcode-types';

const IndentSensitive = 15;
export class IndentTrack {
  private indentStart: number | null = null;

  reset() {
    this.indentStart = null;
  }

  // eslint-disable-next-line max-len
  getIndentParent(
    lastLoc: IPublicModelDropLocation,
    loc: IPublicModelDropLocation,
  ): [IPublicModelNode, number | undefined] | null {
    if (
      lastLoc.target !== loc.target ||
      !isLocationChildrenDetail(lastLoc.detail) ||
      !isLocationChildrenDetail(loc.detail) ||
      (lastLoc as any).source !== (loc as any).source ||
      lastLoc.detail.index !== loc.detail.index ||
      loc.detail.index == null
    ) {
      this.indentStart = null;
      return null;
    }
    if (this.indentStart == null) {
      this.indentStart = lastLoc.event.globalX;
    }
    const delta = loc.event.globalX - this.indentStart;
    const indent = Math.floor(Math.abs(delta) / IndentSensitive);
    if (indent < 1) {
      return null;
    }
    this.indentStart = loc.event.globalX;
    const direction = delta < 0 ? 'left' : 'right';

    let parent: IPublicModelNode = loc.target as any;
    const { index } = loc.detail;

    if (direction === 'left') {
      if (!parent.parent || index < (parent.children?.size || 0) || parent.isSlotNode) {
        return null;
      }
      return [(parent as any).parent, parent.index! + 1];
    } else {
      if (index === 0) {
        return null;
      }
      parent = parent.children?.get(index - 1) as any;
      if (parent && parent.isContainerNode) {
        return [parent, parent.children?.size];
      }
    }

    return null;
  }
}
