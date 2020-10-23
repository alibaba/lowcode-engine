import { EventEmitter } from 'events';
import { autorun, Reaction, untracked, globalContext, Editor } from '@ali/lowcode-editor-core';
import { NodeSchema } from '@ali/lowcode-types';

// TODO: cache to localStorage

export interface Serialization<T = any> {
  serialize(data: NodeSchema): T;
  unserialize(data: T): NodeSchema;
}

let currentSerializion: Serialization<any> = {
  serialize(data: NodeSchema): string {
    return JSON.stringify(data);
  },
  unserialize(data: string) {
    return JSON.parse(data);
  },
};

export function setSerialization(serializion: Serialization) {
  currentSerializion = serializion;
}

export class History {
  private session: Session;

  private records: Session[];

  private point = 0;

  private emitter = new EventEmitter();

  private obx: Reaction;

  private justWokeup = false;

  constructor(logger: () => any, private redoer: (data: NodeSchema) => void, private timeGap: number = 1000) {
    this.session = new Session(0, null, this.timeGap);
    this.records = [this.session];

    this.obx = autorun(() => {
      const data = logger();
      if (this.justWokeup) {
        this.justWokeup = false;
        return;
      }
      untracked(() => {
        const log = currentSerializion.serialize(data);
        if (this.session.cursor === 0 && this.session.isActive()) {
          // first log
          this.session.log(log);
          this.session.end();
        } else if (this.session) {
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
        }
      });
    }, true).$obx;
  }

  get hotData() {
    return this.session.data;
  }

  isSavePoint(): boolean {
    return this.point !== this.session.cursor;
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

    this.obx.sleep();
    try {
      this.redoer(currentSerializion.unserialize(hotData));
      this.emitter.emit('cursor', hotData);
    } catch (e) {
      //
    }

    this.justWokeup = true;
    this.obx.wakeup();
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

  private activedTimer: any;

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
    return this.activedTimer != null;
  }

  end() {
    if (this.isActive()) {
      this.clearTimer();
      console.info('session end');
    }
  }

  private setTimer() {
    this.clearTimer();
    this.activedTimer = setTimeout(() => this.end(), this.timeGap);
  }

  private clearTimer() {
    if (this.activedTimer) {
      clearTimeout(this.activedTimer);
    }
    this.activedTimer = null;
  }
}
