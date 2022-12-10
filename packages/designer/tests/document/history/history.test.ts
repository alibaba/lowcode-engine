import '../../fixtures/window';
import { mobx, makeAutoObservable, globalContext, Editor } from '@alilc/lowcode-editor-core';
import { History } from '../../../src/document/history';
import { delay } from '../../utils/misc';

class Node {
  data: number;
  children: Node[] = [];

  constructor(data: number) {
    makeAutoObservable(this);
    this.data = data;
  }

  addNode(node: Node) {
    this.children.push(node);
  }

  toObject() {
    return {
      data: this.data,
      children: this.children.map((c) => c.toObject()),
    };
  }
}

let tree: Node = null;
beforeEach(() => {
  tree = new Node(1);
  tree.addNode(new Node(2));
});

afterEach(() => {
  tree = null;
});

describe('History', () => {
  beforeAll(() => {
    globalContext.register(new Editor(), Editor);
  });

  it('data function & records', async () => {
    const mockRedoFn = jest.fn();
    const mockDataFn = jest.fn();
    const history = new History<Node>(() => {
      const data = tree.toObject();
      mockDataFn(data);
      return data;
    }, mockRedoFn);

    expect(mockDataFn).toHaveBeenCalledTimes(1);
    expect(mockDataFn).toHaveBeenCalledWith({ data: 1, children: [{ data: 2, children: [] }] });
    expect(history.hotData).toMatchSnapshot();
    // @ts-ignore
    expect(history.session.cursor).toBe(0);
    // @ts-ignore
    expect(history.records).toHaveLength(1);

    tree.data = 3;
    expect(mockDataFn).toHaveBeenCalledTimes(2);
    expect(mockDataFn).toHaveBeenCalledWith({ data: 3, children: [{ data: 2, children: [] }] });
    expect(history.hotData).toMatchSnapshot();
    // @ts-ignore
    expect(history.session.cursor).toBe(0);
    // @ts-ignore
    expect(history.records).toHaveLength(1);

    // modify data after timeGap
    await delay(1200);
    tree.data = 5;
    expect(mockDataFn).toHaveBeenCalledTimes(3);
    expect(mockDataFn).toHaveBeenCalledWith({ data: 5, children: [{ data: 2, children: [] }] });
    expect(history.hotData).toMatchSnapshot();
    // @ts-ignore
    expect(history.session.cursor).toBe(1);
    // @ts-ignore
    expect(history.records).toHaveLength(2);

    history.setSerialization({
      serialize(data: Node): string {
        return JSON.stringify(data);
      },
      unserialize(data: string) {
        return JSON.parse(data);
      },
    });

    // modify data after timeGap
    await delay(1200);
    tree.data = 7;
    expect(mockDataFn).toHaveBeenCalledTimes(4);
    expect(mockDataFn).toHaveBeenCalledWith({ data: 7, children: [{ data: 2, children: [] }] });
    expect(history.hotData).toMatchSnapshot();
  });

  it('isSavePoint & savePoint', async () => {
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      () => {},
    );

    expect(history.isSavePoint()).toBeFalsy();
    expect(history.isModified()).toBeFalsy();

    await delay(1200);
    tree.data = 3;
    expect(history.isSavePoint()).toBeTruthy();

    history.savePoint();
    expect(history.isSavePoint()).toBeFalsy();
  });

  it('go & forward & back & onCursor', async () => {
    const mockRedoFn = jest.fn();
    const mockCursorFn = jest.fn();
    const mockStateFn = jest.fn();
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      (data) => {
        mockRedoFn(data);
      },
    );

    // undoable ❌ & redoable ❌ & modified ❌
    expect(history.getState()).toBe(0);

    await delay(1200);
    tree.data = 3;

    await delay(1200);
    tree.data = 5;

    await delay(1200);
    tree.data = 7;

    const dataCursor0 = { data: 1, children: [{ data: 2, children: [] }] };
    const dataCursor1 = { data: 3, children: [{ data: 2, children: [] }] };
    const dataCursor2 = { data: 5, children: [{ data: 2, children: [] }] };
    const dataCursor3 = { data: 7, children: [{ data: 2, children: [] }] };

    // redoable ❌
    expect(history.getState()).toBe(7 - 2);

    const off1 = history.onCursor(mockCursorFn);
    const off2 = history.onStateChange(mockStateFn);

    // @ts-ignore
    expect(history.records).toHaveLength(4);
    // @ts-ignore
    expect(history.session.cursor).toBe(3);

    // step 1
    history.back();
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      1,
      JSON.stringify(dataCursor2),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(1, 7);
    expect(mockRedoFn).toHaveBeenNthCalledWith(1, dataCursor2);

    // step 2
    history.back();
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      2,
      JSON.stringify(dataCursor1),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(2, 7);
    expect(mockRedoFn).toHaveBeenNthCalledWith(2, dataCursor1);

    // step 3
    history.back();
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      3,
      JSON.stringify(dataCursor0),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(3, 7 - 4 - 1);
    expect(mockRedoFn).toHaveBeenNthCalledWith(3, dataCursor0);

    // step 4
    history.forward();
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      4,
      JSON.stringify(dataCursor1),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(4, 7);
    expect(mockRedoFn).toHaveBeenNthCalledWith(4, dataCursor1);

    // step 5
    history.forward();
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      5,
      JSON.stringify(dataCursor2),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(5, 7);
    expect(mockRedoFn).toHaveBeenNthCalledWith(5, dataCursor2);

    // step 6
    history.go(3);
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      6,
      JSON.stringify(dataCursor3),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(6, 7 - 2);
    expect(mockRedoFn).toHaveBeenNthCalledWith(6, dataCursor3);

    // step 7
    history.go(0);
    expect(mockCursorFn).toHaveBeenNthCalledWith(
      7,
      JSON.stringify(dataCursor0),
    );
    expect(mockStateFn).toHaveBeenNthCalledWith(7, 7 - 4 - 1);
    expect(mockRedoFn).toHaveBeenNthCalledWith(7, dataCursor0);

    off1();
    off2();
    mockStateFn.mockClear();
    mockCursorFn.mockClear();
    history.go(1);
    expect(mockStateFn).not.toHaveBeenCalled();
    expect(mockCursorFn).not.toHaveBeenCalled();
  });

  it('go() - edge case of cursor', async () => {
    const mockRedoFn = jest.fn();
    const mockCursorFn = jest.fn();
    const mockStateFn = jest.fn();
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      (data) => {
        mockRedoFn(data);
      },
    );

    await delay(1200);
    tree.data = 3;

    await delay(1200);
    tree.data = 5;

    history.go(-1);
    // @ts-ignore
    expect(history.session.cursor).toBe(0);

    history.go(3);
    // @ts-ignore
    expect(history.session.cursor).toBe(2);
  });

  it('destroy()', async () => {
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      (data) => {
        mockRedoFn(data);
      },
    );

    history.destroy();
    // @ts-ignore
    expect(history.records).toHaveLength(0);
  });

  it('sleep & wakeup', async () => {
    const mockRedoFn = jest.fn();
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      (data) => {
        mockRedoFn(data);
      },
    );

    // @ts-ignore
    history.sleep();

    await delay(1200);
    tree.data = 3;
    // no record has been pushed into records because of history is asleep.
    // @ts-ignore
    expect(history.records).toHaveLength(1);

    // @ts-ignore
    history.wakeup();
    tree.data = 4;
    // @ts-ignore
    expect(history.records).toHaveLength(2);
  });
});

describe('History - errors', () => {
  beforeAll(() => {
    globalContext.replace(Editor, null);
  });

  it('no editor', () => {
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      (data) => {
      },
    );

    history.back();
    history.forward();
  });

  it('no session', () => {
    const history = new History<Node>(
      () => {
        const data = tree.toObject();
        return data;
      },
      (data) => {
      },
    );

    // @ts-ignore
    history.session = undefined;
    history.back();
    history.forward();
    history.savePoint();
  });
});