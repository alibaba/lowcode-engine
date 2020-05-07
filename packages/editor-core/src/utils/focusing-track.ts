import { hotkey } from '../hotkey';

class FocusingManager {
  deploy() {
    // in
    hotkey.bind('esc', () => {
      // do esc
    });
    hotkey.bind(['command + s', 'ctrl + s'], () => {
      // do save
      // do esc
    });
  }
  private actives: Focusable[] = [];
  send(e: MouseEvent) {
    // if keyborad event check is esc or
  }
  addModalCheck(check) {

  }
  create(config: FocusableConfig) {

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
  }
  internalSuspenceItem(item: Focusable) {
    const i = this.actives.indexOf(item);
    if (i > -1) {
      this.actives.splice(i, 1);
    }
  }
}

export interface FocusableConfig {
  range: HTMLElement | ((e: MouseEvent) => boolean);
  modal?: boolean;
  onEsc?: () => void;
  onBlur?: () => void;
  onSave?: () => void;
}

class Focusable {
  readonly isModal: boolean;
  constructor(private manager: FocusingManager, private config: FocusableConfig) {
    this.isModal = config.modal == null ? false : config.modal;
  }
  active() {
    this.manager.internalActiveItem(this);
  }
  suspence() {
    this.manager.internalSuspenceItem(this);
  }
  purge() {
    this.manager.internalSuspenceItem(this);
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
    }
  }
  internalTriggerEsc() {
    if (this.config.onEsc) {
      this.config.onEsc();
    }
  }
}
