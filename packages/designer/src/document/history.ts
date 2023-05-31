import { reaction, untracked, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import { IPublicTypeNodeSchema, IPublicModelHistory, IPublicTypeDisposable } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import { IDocumentModel } from '../designer';

const logger = new Logger({ level: 'warn', bizName: 'history' });

export interface Serialization<K = IPublicTypeNodeSchema, T = string> {
  serialize(data: K): T;
  unserialize(data: T): K;
}

export interface IHistory extends IPublicModelHistory {
  onStateChange(func: () => any): IPublicTypeDisposable;
}

export class History<T = IPublicTypeNodeSchema> implements IHistory {
  private session: Session;

  private records: Session[];

  private point = 0;

  private emitter: IEventBus = createModuleEventBus('History');

  private asleep = false;

  private currentSerialization: Serialization<T, string> = {
    serialize(data: T): string {
      return JSON.stringify(data);
    },
    unserialize(data: string) {
      return JSON.parse(data);
    },
  };

  get hotData() {
    return this.session.data;
  }

  private timeGap: number = 1000;

  constructor(
      dataFn: () => T | null,
      private redoer: (data: T) => void,
      private document?: IDocumentModel,
    ) {
    this.session = new Session(0, null, this.timeGap);
    this.records = [this.session];

    reaction((): any => {
      return dataFn();
    }, (data: T) => {
      if (this.asleep) return;
      untracked(() => {
        const log = this.currentSerialization.serialize(data);

        // do not record unchanged data
        if (this.session.data === log) {
          return;
        }

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
      });
    }, { fireImmediately: true });
  }

  setSerialization(serialization: Serialization<T, string>) {
    this.currentSerialization = serialization;
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

  go(originalCursor: number) {
    this.session.end();

    let cursor = originalCursor;
    cursor = +cursor;
    if (cursor < 0) {
      cursor = 0;
    } else if (cursor >= this.records.length) {
      cursor = this.records.length - 1;
    }

    const currentCursor = this.session.cursor;
    if (cursor === currentCursor) {
      return;
    }

    const session = this.records[cursor];
    const hotData = session.data;

    this.sleep();
    try {
      this.redoer(this.currentSerialization.unserialize(hotData));
      this.emitter.emit('cursor', hotData);
    } catch (e) /* istanbul ignore next */ {
      logger.error(e);
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
    const editor = this.document?.designer.editor;
    if (!editor) {
      return;
    }
    editor.eventBus.emit('history.back', cursor);
  }

  forward() {
    if (!this.session) {
      return;
    }
    const cursor = this.session.cursor + 1;
    this.go(cursor);
    const editor = this.document?.designer.editor;
    if (!editor) {
      return;
    }
    editor.eventBus.emit('history.forward', cursor);
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

  /**
   * 监听 state 变更事件
   * @param func
   * @returns
   */
  onChangeState(func: () => any): IPublicTypeDisposable {
    return this.onStateChange(func);
  }

  onStateChange(func: () => any): IPublicTypeDisposable {
    this.emitter.on('statechange', func);
    return () => {
      this.emitter.removeListener('statechange', func);
    };
  }

  /**
   * 监听历史记录游标位置变更事件
   * @param func
   * @returns
   */
  onChangeCursor(func: () => any): IPublicTypeDisposable {
    return this.onCursor(func);
  }

  onCursor(func: () => any): () => void {
    this.emitter.on('cursor', func);
    return () => {
      this.emitter.removeListener('cursor', func);
    };
  }

  destroy() {
    this.emitter.removeAllListeners();
    this.records = [];
  }

  /**
   *
   * @deprecated
   * @returns
   * @memberof History
   */
  isModified() {
    return this.isSavePoint();
  }
}

export class Session {
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
