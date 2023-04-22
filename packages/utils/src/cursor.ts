import './cursor.css';

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

  addState(state: string) {
    if (!this.states.has(state)) {
      this.states.add(state);
      document.documentElement.classList.add(`lc-cursor-${state}`);
    }
  }

  private removeState(state: string) {
    if (this.states.has(state)) {
      this.states.delete(state);
      document.documentElement.classList.remove(`lc-cursor-${state}`);
    }
  }
}

export const cursor = new Cursor();
