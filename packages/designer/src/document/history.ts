import { EventEmitter } from 'events';
import { autorun, reaction, mobx, untracked, globalContext, Editor } from '@ali/lowcode-editor-core';
import { NodeSchema } from '@ali/lowcode-types';

// TODO: cache to localStorage

export interface Serialization<T = any> {
  serialize(data: NodeSchema): T;
  unserialize(data: T): NodeSchema;
}

let currentSerialization: Serialization<any> = {
  serialize(data: NodeSchema): string {
    return JSON.stringify(data);
  },
  unserialize(data: string) {
    return JSON.parse(data);
  },
};

export function setSerialization(serialization: Serialization) {
  currentSerialization = serialization;
}

export class History {
  private session: Session;

  private records: Session[];

  private point = 0;

  private emitter = new EventEmitter();

  private asleep = false;

  constructor(logger: () => any, private redoer: (data: NodeSchema) => void, private timeGap: number = 1000) {
    this.session = new Session(0, null, this.timeGap);
    this.records = [this.session];

    reaction(() => {
      return logger();
    }, (data) => {
      if (this.asleep) return;
      untracked(() => {
        const log = currentSerialization.serialize(data);
          if (this.session.isActive()) {
            this.session.log(log);
          } else {
            this.session.end();
            const lastState = this.getState();
            const cursor = this.session.cursor + 1;
            const session = new Session(cursor, log, this.timeGap);
            this.session = session;
            this.records.splice(cursor, this.records.length - cursor, session);
            const currentState = this.getState();
            if (currentState !== lastState) {
              this.emitter.emit('statechange', currentState);
            }
          }
        // }
      });
    }, { fireImmediately: true });
  }

  get hotData() {
    return this.session.data;
  }

  isSavePoint(): boolean {
    return this.point !== this.session.cursor;
  }

  private sleep() {
    this.asleep = true;
  }

  private wakeup() {
    this.asleep = false;
  }

  go(cursor: number) {
    this.session.end();

    const currentCursor = this.session.cursor;
    cursor = +cursor;
    if (cursor < 0) {
      cursor = 0;
    } else if (cursor >= this.records.length) {
      cursor = this.records.length - 1;
    }
    if (cursor === currentCursor) {
      return;
    }

    const session = this.records[cursor];
    const hotData = session.data;

    this.sleep();
    try {
      this.redoer(currentSerialization.unserialize(hotData));
      this.emitter.emit('cursor', hotData);
    } catch (e) {
      //
    }

    this.wakeup();
    this.session = session;

    this.emitter.emit('statechange', this.getState());
  }

  back() {
    if (!this.session) {
      return;
    }
    const cursor = this.session.cursor - 1;
    this.go(cursor);
    const editor = globalContext.get(Editor);
    if (!editor) {
      return;
    }
    editor.emit('history.back', cursor);
  }

  forward() {
    if (!this.session) {
      return;
    }
    const cursor = this.session.cursor + 1;
    this.go(cursor);
    const editor = globalContext.get(Editor);
    if (!editor) {
      return;
    }
    editor.emit('history.forward', cursor);
  }

  savePoint() {
    if (!this.session) {
      return;
    }
    this.session.end();
    this.point = this.session.cursor;
    this.emitter.emit('statechange', this.getState());
  }

  /**
   *  |    1     |     1    |    1     |
   *  | -------- | -------- | -------- |
   *  | modified | redoable | undoable |
   */
  getState(): number {
    const { cursor } = this.session;
    let state = 7;
    // undoable ?
    if (cursor <= 0) {
      state -= 1;
    }
    // redoable ?
    if (cursor >= this.records.length - 1) {
      state -= 2;
    }
    // modified ?
    if (this.point === cursor) {
      state -= 4;
    }
    return state;
  }

  onStateChange(func: () => any) {
    this.emitter.on('statechange', func);
    return () => {
      this.emitter.removeListener('statechange', func);
    };
  }

  onCursor(func: () => any) {
    this.emitter.on('cursor', func);
    return () => {
      this.emitter.removeListener('cursor', func);
    };
  }

  destroy() {
    this.emitter.removeAllListeners();
    this.records = [];
  }

  isModified() {
    return this.point !== this.session.cursor;
  }
}

class Session {
  private _data: any;

  private activeTimer: any;

  get data() {
    return this._data;
  }

  constructor(readonly cursor: number, data: any, private timeGap: number = 1000) {
    this.setTimer();
    this.log(data);
  }

  log(data: any) {
    if (!this.isActive()) {
      return;
    }
    this._data = data;
    this.setTimer();
  }

  isActive() {
    return this.activeTimer != null;
  }

  end() {
    if (this.isActive()) {
      this.clearTimer();
    }
  }

  private setTimer() {
    this.clearTimer();
    this.activeTimer = setTimeout(() => this.end(), this.timeGap);
  }

  private clearTimer() {
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
    }
    this.activeTimer = null;
  }
}
