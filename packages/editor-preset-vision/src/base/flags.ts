import domReady from 'domready';
import { EventEmitter } from 'events';

const Shells = ['iphone6'];

export class Flags {
  public emitter: EventEmitter;
  public flags: string[];
  public ready: boolean;
  public lastFlags: string[];
  public lastShell: string;

  private lastSimulatorDevice: string;

  constructor() {
    this.emitter = new EventEmitter();
    this.flags = ['design-mode'];

    domReady(() => {
      this.ready = true;
      this.applyFlags();
    });
  }

  public setDragMode(flag: boolean) {
    if (flag) {
      this.add('drag-mode');
    } else {
      this.remove('drag-mode');
    }
  }

  public setPreviewMode(flag: boolean) {
    if (flag) {
      this.add('preview-mode');
      this.remove('design-mode');
    } else {
      this.add('design-mode');
      this.remove('preview-mode');
    }
  }

  public setWithShell(shell: string) {
    if (shell === this.lastShell) {
      return;
    }
    if (this.lastShell) {
      this.remove(`with-${this.lastShell}shell`);
    }
    if (shell) {
      if (Shells.indexOf(shell) < 0) {
        shell = Shells[0];
      }
      this.add(`with-${shell}shell`);
      this.lastShell = shell;
    }
  }

  public setSimulator(device: string) {
    if (this.lastSimulatorDevice) {
      this.remove(`simulator-${this.lastSimulatorDevice}`);
    }
    if (device !== '' && device !== 'pc') {
      this.add(`simulator-${device}`);
    }
    this.lastSimulatorDevice = device;
  }

  public setHideSlate(flag: boolean) {
    if (this.has('slate-fixed')) {
      return;
    }
    if (flag) {
      this.add('hide-slate');
    } else {
      this.remove('hide-slate');
    }
  }

  public setSlateFixedMode(flag: boolean) {
    if (flag) {
      this.remove('hide-slate');
      this.add('slate-fixed');
    } else {
      this.remove('slate-fixed');
    }
  }

  public setSlateFullMode(flag: boolean) {
    if (flag) {
      this.add('slate-full-screen');
    } else {
      this.remove('slate-full-screen');
    }
  }

  public getFlags() {
    return this.flags;
  }

  public applyFlags(modifiedFlag?: string) {
    if (!this.ready) {
      return;
    }

    const doe = document.documentElement;
    if (this.lastFlags) {
      this.lastFlags.filter((flag: string) => this.flags.indexOf(flag) < 0).forEach((flag) => {
        doe.classList.remove(`engine-${flag}`);
      });
    }
    this.flags.forEach((flag) => {
      doe.classList.add(`engine-${flag}`);
    });

    this.lastFlags = this.flags.slice(0);
    this.emitter.emit('flagschange', this.flags, modifiedFlag);
  }

  public has(flag: string) {
    return this.flags.indexOf(flag) > -1;
  }

  public add(flag: string) {
    if (!this.has(flag)) {
      this.flags.push(flag);
      this.applyFlags(flag);
    }
  }

  public remove(flag: string) {
    const i = this.flags.indexOf(flag);
    if (i > -1) {
      this.flags.splice(i, 1);
      this.applyFlags(flag);
    }
  }

  public onFlagsChange(func: () => any) {
    this.emitter.on('flagschange', func);
    return () => {
      this.emitter.removeListener('flagschange', func);
    };
  }
}

export default new Flags();
