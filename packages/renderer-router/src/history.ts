import { useEvent } from '@alilc/renderer-core';

export type HistoryState = History['state'];
export type HistoryLocation = string;

export enum NavigationType {
  pop = 'pop',
  push = 'push',
}

export enum NavigationDirection {
  back = 'back',
  forward = 'forward',
  unknown = '',
}

export type NavigationInformation = {
  type: NavigationType;
  direction: NavigationDirection;
  delta: number;
};

export type NavigationCallback = (
  to: HistoryLocation,
  from: HistoryLocation,
  info: NavigationInformation,
) => void;

/**
 * history router 的内部实现，用于包裹一层 window.history 的行为
 */
export interface RouterHistory {
  /**
   * 基础路径。
   * eg: sub-folder 是 example.com/sub-folder 中的 base path
   */
  readonly base: string;
  /** current location */
  readonly location: HistoryLocation;
  /** current state */
  readonly state: HistoryState;

  /**
   * 导航到新的 location，类似于 history 的 pushState 方法
   * @param to 需要导航到的 location
   * @param data 可选，新的 state {@link HistoryState}
   */
  push(to: HistoryLocation, data?: HistoryState): void;

  /**
   * 修改当前的 location，类似于 history 的 replaceState 方法
   * @param to 需要设置的 location
   * @param data 可选，新的 state {@link HistoryState}
   */
  replace(to: HistoryLocation, data?: HistoryState): void;

  /**
   * 载入到会话历史中的某一特定页面，通过与当前页面相对位置来标志 (当前页面的相对位置标志为 0). 如 window.history.go
   * @param delta - 页面个数，如果 delta > 0 则前进，如果 delta < 0 则后退
   * @param triggerListeners - 是否触发 history 监听器
   */
  go(delta: number, triggerListeners?: boolean): void;

  /**
   * 生成 location 对应的 href
   * @param location
   * @returns
   */
  createHref(location: HistoryLocation): string;

  /**
   * 为 history 添加前进或后退的监听事件
   * @param callback - 监听器
   * @returns 返回一个移除该监听器的回调
   */
  listen(callback: NavigationCallback): () => void;

  /**
   * 销毁，清除所有的 history 监听事件
   */
  destroy(): void;
}

type RouterHistoryState = HistoryState & {
  back: HistoryLocation | null;
  current: HistoryLocation;
  forward: HistoryLocation | null;
  position: number;
  replaced: boolean;
};

function buildState(
  back: HistoryLocation | null,
  current: HistoryLocation,
  forward: HistoryLocation | null,
  replaced = false,
  position = window.history.length,
): RouterHistoryState {
  return {
    name: '__ROUTER_STATE__',
    back,
    current,
    forward,
    replaced,
    position,
  };
}

export function createBrowserHistory(base?: string): RouterHistory {
  const finalBase = normalizeBase(base);
  const { history, location } = window;

  let currentLocation: HistoryLocation = createCurrentLocation(finalBase, location);
  let historyState: RouterHistoryState = history.state;

  if (!historyState) {
    doDomHistoryEvent(currentLocation, buildState(null, currentLocation, null, true), true);
  }

  function doDomHistoryEvent(to: HistoryLocation, state: RouterHistoryState, replace: boolean) {
    // 处理 hash 情况下的 url
    const hashIndex = finalBase.indexOf('#');
    const url =
      hashIndex > -1
        ? finalBase.slice(hashIndex) + to
        : location.protocol + '//' + location.host + finalBase + to;

    try {
      history[replace ? 'replaceState' : 'pushState'](state, '', url);
      historyState = state;
    } catch (err) {
      console.error(err);
    }
  }

  function replace(to: HistoryLocation, data?: HistoryState) {
    const state = Object.assign(
      {},
      history.state,
      buildState(historyState.back, to, historyState.forward, true),
      data,
      { position: historyState.position },
    );

    doDomHistoryEvent(to, state, true);
    currentLocation = to;
  }

  function push(to: HistoryLocation, data?: HistoryState) {
    const currentState: RouterHistoryState = Object.assign({}, historyState, history.state, {
      forward: to,
    });

    // 防止当前浏览器的 state 被修改先 replace 一次
    // 将上次的state 的 forward 修改为 to
    doDomHistoryEvent(currentState.current, currentState, true);

    const state = Object.assign(
      {},
      buildState(currentLocation, to, null),
      { position: currentState.position + 1 },
      data,
    );

    doDomHistoryEvent(to, state, false);
    currentLocation = to;
  }

  let listeners = useEvent<NavigationCallback>();
  let teardowns = useEvent<() => void>();

  let pauseState: HistoryLocation | null = null;

  /**
   * popState 事件监听器
   * popstate 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者在 JavaScript 中调用 history.back() 方法）。
   * 即，在同一文档的两个历史记录条目之间导航会触发该事件。
   * @param event.state - https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
   */
  function onPopState({ state }: PopStateEvent) {
    const to = createCurrentLocation(finalBase, location);
    const from: HistoryLocation = currentLocation;
    const fromState: RouterHistoryState = historyState;
    let delta = 0;

    if (state) {
      currentLocation = to;
      historyState = state;

      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }

    for (const listener of listeners.list()) {
      listener(currentLocation, from, {
        delta,
        type: NavigationType.pop,
        direction: delta
          ? delta > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown,
      });
    }
  }

  function pauseListeners() {
    pauseState = currentLocation;
  }

  function go(delta: number, triggerListeners = true) {
    if (!triggerListeners) pauseListeners();
    history.go(delta);
  }

  window.addEventListener('popstate', onPopState);

  function listen(listener: NavigationCallback) {
    const teardown = listeners.add(listener);
    teardowns.add(teardown);

    return teardown;
  }

  function destroy() {
    listeners.clear();

    for (const teardown of teardowns.list()) {
      teardown();
    }
    teardowns.clear();

    window.removeEventListener('popstate', onPopState);
  }

  return {
    get base() {
      return finalBase;
    },
    get location() {
      return currentLocation;
    },
    get state() {
      return historyState;
    },

    createHref(location) {
      const BEFORE_HASH_RE = /^[^#]+#/;
      return finalBase.replace(BEFORE_HASH_RE, '#') + location;
    },

    push,
    replace,
    go,

    listen,
    destroy,
  };
}

function normalizeBase(base?: string) {
  if (!base) {
    // strip full URL origin
    base = document.baseURI.replace(/^\w+:\/\/[^\/]+/, '');
  }

  // 处理边界问题 确保是一个浏览器路径 如 /xxx #/xxx
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base;

  // 去除末尾斜杆 方便 base + fullPath 的处理
  return removeTrailingSlash(base);
}

const TRAILING_SLASH_RE = /\/$/;
export const removeTrailingSlash = (path: string) => path.replace(TRAILING_SLASH_RE, '');

function createCurrentLocation(base: string, location: Location) {
  const { pathname, search, hash } = location;
  // 处理 hash 相关逻辑
  // hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
  const hashPos = base.indexOf('#');
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    // prepend the starting slash to hash so the url starts with /#
    if (pathFromHash[0] !== '/') pathFromHash = '/' + pathFromHash;

    return stripBase(pathFromHash, '');
  }

  const path = stripBase(pathname, base);

  return path + search + hash;
}

/**
 * 从 location.pathname 中剥离 base 路径，不区分大小写
 */
export function stripBase(pathname: string, base: string): string {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) {
    return pathname;
  }
  return pathname.slice(base.length) || '/';
}

/**
 * 创建一个 hash history。
 * 用于没有 host (e.g. `file://`)或不想要更改浏览器路径的 web 应用。
 * @param base - 可选，history 的基础路径。默认为 `location.pathname + location.search`
 */
export function createHashHistory(base?: string): RouterHistory {
  base = location.host ? base || location.pathname + location.search : '';
  // 允许用户在中间提供一个“#”，如 “/base/#/app”
  if (!base.includes('#')) base += '#';

  if (!base.endsWith('#/') && !base.endsWith('#')) {
    console.warn(
      `A hash base must end with a "#":\n"${base}" should be "${base.replace(/#.*$/, '#')}".`,
    );
  }

  return createBrowserHistory(base);
}

/**
 * 创建一个基于内存的 history
 */
export function createMemoryHistory(base = ''): RouterHistory {
  const finalBase = normalizeBase(base);

  let position = 0;
  let historyStack: {
    location: HistoryLocation;
    state: RouterHistoryState;
  }[] = [{ location: '', state: buildState(null, '', null, false, position) }];

  function pushStack(location: HistoryLocation, state: RouterHistoryState) {
    if (position !== historyStack.length) {
      // we are in the middle, we remove everything from here in the queue
      historyStack.splice(position);
    }

    historyStack.push({ location, state });
  }

  const listeners = useEvent<NavigationCallback>();

  function triggerListeners(
    to: HistoryLocation,
    from: HistoryLocation,
    { direction, delta }: Pick<NavigationInformation, 'direction' | 'delta'>,
  ): void {
    const info: NavigationInformation = {
      direction,
      delta,
      type: NavigationType.pop,
    };
    for (const callback of listeners.list()) {
      callback(to, from, info);
    }
  }

  return {
    get base() {
      return finalBase;
    },
    get state() {
      return historyStack[position].state;
    },
    get location() {
      return historyStack[position].location;
    },

    createHref(location) {
      const BEFORE_HASH_RE = /^[^#]+#/;
      return finalBase.replace(BEFORE_HASH_RE, '#') + location;
    },

    replace(to, data) {
      const state = Object.assign(
        {},
        historyStack[position].state,
        {
          current: to,
        },
        data,
        { position },
      );

      // remove current entry and decrement position
      historyStack.splice(position, 1);

      pushStack(to, state);
    },

    push(to, data) {
      const prevState = Object.assign({}, historyStack[position].state, {
        forward: to,
      });

      historyStack.splice(position, 1);
      pushStack(prevState.current, prevState);

      const currentState = Object.assign({}, buildState(prevState.current, to, null, false), data, {
        position: ++position,
      });

      pushStack(to, currentState);
    },
    go(delta, shouldTriggerListeners = true) {
      const from = this.location;
      const direction: NavigationDirection =
        delta < 0 ? NavigationDirection.back : NavigationDirection.forward;

      position = Math.max(0, Math.min(position + delta, historyStack.length - 1));

      if (shouldTriggerListeners) {
        triggerListeners(this.location, from, {
          direction,
          delta,
        });
      }
    },

    listen: listeners.add,
    destroy() {
      listeners.clear();
      position = 0;
      historyStack = [{ location: '', state: buildState(null, '', null, false, position) }];
    },
  };
}
