export class FocusTracker {
  private actives: Focusable[] = [];

  private modals: Array<{ checkDown: (e: MouseEvent) => boolean; checkOpen: () => boolean }> = [];

  mount(win: Window) {
    const checkDown = (e: MouseEvent) => {
      if (this.checkModalDown(e)) {
        return;
      }
      const { first } = this;
      if (first && !first.internalCheckInRange(e)) {
        this.internalSuspenseItem(first);
        first.internalTriggerBlur();
      }
    };
    win.document.addEventListener('click', checkDown, true);
    return () => {
      win.document.removeEventListener('click', checkDown, true);
    };
  }

  get first() {
    return this.actives[0];
  }

  addModal(checkDown: (e: MouseEvent) => boolean, checkOpen: () => boolean) {
    this.modals.push({
      checkDown,
      checkOpen,
    });
  }

  private checkModalOpen(): boolean {
    return this.modals.some((item) => item.checkOpen());
  }

  private checkModalDown(e: MouseEvent): boolean {
    return this.modals.some((item) => item.checkDown(e));
  }

  execSave() {
    // has Modal return;
    if (this.checkModalOpen()) {
      return;
    }
    // catch
    if (this.first) {
      this.first.internalTriggerSave();
    }
  }

  execEsc() {
    const { first } = this;
    if (first) {
      this.internalSuspenseItem(first);
      first.internalTriggerEsc();
    }
  }

  create(config: FocusableConfig) {
    return new Focusable(this, config);
  }

  internalActiveItem(item: Focusable) {
    const first = this.actives[0];
    if (first === item) {
      return;
    }
    const i = this.actives.indexOf(item);
    if (i > -1) {
      this.actives.splice(i, 1);
    }
    this.actives.unshift(item);
    if (!item.isModal && first) {
      // trigger Blur
      first.internalTriggerBlur();
    }
    // trigger onActive
    item.internalTriggerActive();
  }

  internalSuspenseItem(item: Focusable) {
    const i = this.actives.indexOf(item);
    if (i > -1) {
      this.actives.splice(i, 1);
      this.first?.internalTriggerActive();
    }
  }
}

export interface FocusableConfig {
  range: HTMLElement | ((e: MouseEvent) => boolean);
  modal?: boolean; // 模态窗口级别
  onEsc?: () => void;
  onBlur?: () => void;
  onSave?: () => void;
  onActive?: () => void;
}

export class Focusable {
  readonly isModal: boolean;

  constructor(private tracker: FocusTracker, private config: FocusableConfig) {
    this.isModal = config.modal == null ? false : config.modal;
  }

  active() {
    this.tracker.internalActiveItem(this);
  }

  suspense() {
    this.tracker.internalSuspenseItem(this);
  }

  purge() {
    this.tracker.internalSuspenseItem(this);
  }

  internalCheckInRange(e: MouseEvent) {
    const { range } = this.config;
    if (!range) {
      return false;
    }
    if (typeof range === 'function') {
      return range(e);
    }
    return range.contains(e.target as HTMLElement);
  }

  internalTriggerBlur() {
    if (this.config.onBlur) {
      this.config.onBlur();
    }
  }

  internalTriggerSave() {
    if (this.config.onSave) {
      this.config.onSave();
      return true;
    }
    return false;
  }

  internalTriggerEsc() {
    if (this.config.onEsc) {
      this.config.onEsc();
    }
  }

  internalTriggerActive() {
    if (this.config.onActive) {
      this.config.onActive();
    }
  }
}
