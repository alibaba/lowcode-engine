import './cursor.less';
export class Cursor {
  private states = new Set<string>();

  setDragging(flag: boolean) {
    if (flag) {
      this.addState('dragging');
    } else {
      this.removeState('dragging');
    }
  }
  setXResizing(flag: boolean) {
    if (flag) {
      this.addState('x-resizing');
    } else {
      this.removeState('x-resizing');
    }
  }
  setYResizing(flag: boolean) {
    if (flag) {
      this.addState('y-resizing');
    } else {
      this.removeState('y-resizing');
    }
  }

  setCopy(flag: boolean) {
    if (flag) {
      this.addState('copy');
    } else {
      this.removeState('copy');
    }
  }

  isCopy() {
    return this.states.has('copy');
  }

  release() {
    for (const state of this.states) {
      this.removeState(state);
    }
  }

  private addState(state: string) {
    if (!this.states.has(state)) {
      this.states.add(state);
      document.documentElement.classList.add(`my-cursor-${state}`);
    }
  }

  private removeState(state: string) {
    if (this.states.has(state)) {
      this.states.delete(state);
      document.documentElement.classList.remove(`my-cursor-${state}`);
    }
  }
}

export default new Cursor();
