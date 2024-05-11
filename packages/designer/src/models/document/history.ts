import { type EventDisposable, createEventBus, reaction, type Signal } from '@alilc/lowcode-shared';
import { isNil } from 'lodash-es';

export interface Serializer<K, T = string> {
  serialize(data: K): T;
  unserialize(data: T): K;
}

interface HistoryOptions<T> {
  /**
   * 数据序列化函数，用于将数据转换为字符串
   */
  serializier?: Serializer<T>;
  /**
   * 闲置时间阈值，用于确定何时结束当前会话并开始新的会话
   */
  idleTimeThreshold?: number;
}

interface HistoryHooks<T> {
  state: (state: number) => void;
  cursor: (data: T) => void;
}

// 默认的序列化器和反序列化器
const defaultSerializer: Serializer<any> = {
  serialize: (data) => JSON.stringify(data),
  unserialize: (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error unserialize data:', error);
      return null;
    }
  },
};

/**
 * `History`类用于管理历史记录，支持撤销和重做操作。可根据目标数据，响应式的生成历史的状态管理
 * @template T 泛型参数，代表历史记录的数据类型
 */
export class History<T> {
  #currentSession: Session;
  #allSessions: Session[];

  #serializier: Serializer<T>;
  #eventBus = createEventBus<HistoryHooks<T>>('History');

  // 书签，用于标记特定的保存点
  #bookmark = 0;
  // 指示历史记录是否暂停的标志
  #isPaused = false;
  // 闲置时间阈值，用于确定何时结束当前会话并开始新的会话
  #idleTimeThreshold: number;

  /**
   * @param dataProvider 数据提供者函数，用于获取当前的数据状态
   * @param onRedo 重做操作的处理函数
   */
  constructor(
    signal: Signal<T>,
    private onRedo: (data: T) => void,
    options?: HistoryOptions<T>,
  ) {
    this.#serializier = options?.serializier ?? defaultSerializer;
    this.#idleTimeThreshold = options?.idleTimeThreshold ?? 1000;

    this.#currentSession = new Session(0, null, this.#idleTimeThreshold);
    this.#allSessions = [this.#currentSession];

    reaction(
      signal,
      (value) => {
        if (this.#isPaused || isNil(value)) return; // 如果处于“暂停”状态，立即返回不执行后续逻辑

        const log = this.#serializier.serialize(value);
        if (this.#currentSession.data === log) return; // 不记录未发生变化的数据

        if (this.#currentSession.isActive()) {
          this.#currentSession.updateData(log); // 如果当前会话处于活跃状态，记录数据变化
        } else {
          this.#endSessionAndStartNewOne(log); // 如果当前会话已结束，结束当前的并启动新的会话
        }
      },
      { immediate: true }, // 初始化时立即执行副作用
    );
  }

  #endSessionAndStartNewOne(log: string) {
    this.#currentSession.end();

    const lastState = this.#getState();
    const newCursor = this.#currentSession.cursor + 1;
    const newSession = new Session(newCursor, log, this.#idleTimeThreshold);

    // 更新当前会话和记录数组
    this.#currentSession = newSession;
    this.#allSessions.splice(newCursor, this.#allSessions.length - newCursor, newSession);

    // 如果状态发生变化，发出状态变更事件
    const currentState = this.#getState();
    if (currentState !== lastState) {
      this.#eventBus.emit('state', currentState);
    }
  }

  get activeData() {
    return this.#currentSession.data;
  }

  #pauseRecording() {
    this.#isPaused = true;
  }
  #resumeRecording() {
    this.#isPaused = false;
  }

  go(position: number) {
    if (this.#currentSession.cursor === position) return;

    const session = this.#allSessions.find((item) => item.cursor === position);
    if (!session || !session.data) return;

    this.#pauseRecording();

    try {
      this.onRedo(this.#serializier.unserialize(session.data));
      this.#eventBus.emit('cursor', session.data);
    } catch (e) {
      console.error(e);
    }

    this.#resumeRecording();

    this.#currentSession = session;
    this.#eventBus.emit('state', this.#getState());
  }

  back() {
    if (this.#currentSession.cursor === 0) return;

    this.go(this.#currentSession.cursor - 1);
  }

  forward() {
    if (this.#currentSession.cursor === this.#allSessions.length - 1) return;

    this.go(this.#currentSession.cursor + 1);
  }

  /**
   * 获取 state，判断当前是否为「可回退」、「可前进」的状态
   * get flags in number which indicat current change state
   *
   *  |    1     |     1    |    1     |
   *  | -------- | -------- | -------- |
   *  | modified | redoable | undoable |
   * eg.
   *  7 means : modified && redoable && undoable
   *  5 means : modified && undoable
   */
  #getState(): number {
    const { cursor } = this.#currentSession;
    let state = 7;
    // undoable ?
    if (cursor <= 0) {
      state -= 1;
    }
    // redoable ?
    if (cursor >= this.#allSessions.length - 1) {
      state -= 2;
    }
    // modified ?
    if (this.#bookmark === cursor) {
      state -= 4;
    }
    return state;
  }

  /**
   * 保存当前状态
   * do save current change as a record in history
   */
  savePoint() {
    if (!this.#currentSession) {
      return;
    }
    this.#currentSession.end();
    this.#bookmark = this.#currentSession.cursor;
    this.#eventBus.emit('state', this.#getState());
  }

  /**
   * 当前是否是「保存点」，即是否有状态变更但未保存
   * check if there is unsaved change for history
   */
  isSavePoint(): boolean {
    return this.#bookmark !== this.#currentSession.cursor;
  }

  onStateChange(listener: HistoryHooks<T>['state']): EventDisposable {
    this.#eventBus.on('state', listener);
    return () => {
      this.#eventBus.off('state', listener);
    };
  }

  onChangeCursor(listener: HistoryHooks<T>['cursor']): EventDisposable {
    this.#eventBus.on('cursor', listener);
    return () => {
      this.#eventBus.off('cursor', listener);
    };
  }

  destroy() {
    this.#eventBus.removeAllHooks();
    this.#allSessions = [];
  }
}

/**
 * 会话类，用于管理具有生命周期的数据。
 */
class Session {
  #data: string | null; // 会话存储的数据。
  #activeTimer: ReturnType<typeof setTimeout> | undefined; // 活跃状态的计时器。

  /**
   * 构造函数。
   * @param cursor 用于标识会话的游标，一般代表会话的序号或状态标识。
   * @param initialData 会话初始数据。
   * @param timeGap 会话活跃状态持续时间，默认1000毫秒。
   */
  constructor(
    readonly cursor: number,
    initialData: string | null,
    private timeGap: number = 1000,
  ) {
    this.initializeTimer(); // 初始化时设置计时器。
    this.updateData(initialData); // 记录初始数据。
  }

  /**
   * 获取当前会话数据。
   * @returns 当前会话存储的数据。
   */
  get data() {
    return this.#data;
  }

  /**
   * 更新会话数据并重新设置计时器。
   * @param newData 新数据。
   */
  updateData(newData: string | null) {
    if (!this.isActive()) return;

    this.#data = newData;
    this.resetTimer();
  }

  /**
   * 检查会话是否活跃。
   * @returns 如果会话活跃返回true，否则返回false。
   */
  isActive() {
    return this.#activeTimer !== undefined;
  }

  /**
   * 结束会话，清除计时器。
   */
  end() {
    if (this.isActive()) {
      this.clearTimer();
    }
  }

  /**
   * 设置计时器，计时结束后会话自动结束。
   */
  initializeTimer() {
    this.clearTimer();
    this.#activeTimer = setTimeout(() => this.end(), this.timeGap);
  }

  /**
   * 清除计时器，并将活跃计时器设为undefined。
   */
  clearTimer() {
    if (this.#activeTimer) {
      clearTimeout(this.#activeTimer);
    }
    this.#activeTimer = undefined;
  }

  /**
   * 重置计时器，保持会话活跃状态。
   */
  resetTimer() {
    this.initializeTimer();
  }
}
