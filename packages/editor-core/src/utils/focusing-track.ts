
class FocusingManager {
  deploy() {

  }
  send(e: MouseEvent | KeyboardEvent) {

  }
  addModalCheck() {

  }
  create(config: FocusableConfig) {

  }
  activeItem() {

  }
  suspenceItem() {

  }
}

export interface FocusableConfig {
  range: HTMLElement | ((e: MouseEvent) => boolean);
  modal?: boolean;
  onEsc?: () => void;
  onBlur?: () => void;
}

class Focusable {
  readonly isModal: boolean;
  constructor(private manager: FocusingManager, { range, modal }: FocusableConfig) {
    this.isModal = modal == null ? false : modal;

  }
  checkRange(e: MouseEvent) {

  }
  active() {
    this.manager.activeItem(this);
  }
  suspence() {
    this.manager.suspenceItem(this);
  }
  purge() {

  }
}
