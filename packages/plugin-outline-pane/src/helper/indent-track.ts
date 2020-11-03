import { DropLocation, ParentalNode, isLocationChildrenDetail } from '@ali/lowcode-designer';

const IndentSensitive = 15;
export class IndentTrack {
  private indentStart: number | null = null;

  reset() {
    this.indentStart = null;
  }

  getIndentParent(lastLoc: DropLocation, loc: DropLocation): [ParentalNode, number] | null {
    if (
      lastLoc.target !== loc.target ||
      !isLocationChildrenDetail(lastLoc.detail) ||
      !isLocationChildrenDetail(loc.detail) ||
      lastLoc.source !== loc.source ||
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

    let parent = loc.target;
    const { index } = loc.detail;

    if (direction === 'left') {
      if (!parent.parent || index < parent.children.size || parent.isSlot()) {
        return null;
      }
      return [(parent as any).parent, parent.index + 1];
    } else {
      if (index === 0) {
        return null;
      }
      parent = parent.children.get(index - 1) as any;
      if (parent && parent.isContainer()) {
        return [parent, parent.children.size];
      }
    }

    return null;
  }
}
