import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import bus from '../../src/bus';
import { editor } from '../../src/editor';

describe('bus 测试', () => {
  afterEach(() => {
    bus.unsub('evt1');
  });
  it('sub / pub 测试', () => {
    const mockFn1 = jest.fn();
    const off1 = bus.sub('evt1', mockFn1);

    const evtData = { a: 1 };
    bus.pub('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);

    off1();

    bus.pub('evt1', evtData);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
  });

  it('on / emit 测试', () => {
    const mockFn1 = jest.fn();
    const off1 = bus.on('evt1', mockFn1);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);

    off1();

    bus.emit('evt1', evtData);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
  });

  it('once / emit 测试', () => {
    const mockFn1 = jest.fn();
    bus.once('evt1', mockFn1);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);

    bus.emit('evt1', evtData);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
  });

  it('once / emit 测试，调用解绑函数', () => {
    const mockFn1 = jest.fn();
    const off1 = bus.once('evt1', mockFn1);

    off1();

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).not.toHaveBeenCalled();
  });

  it('removeListener 测试', () => {
    const mockFn1 = jest.fn();
    bus.on('evt1', mockFn1);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);

    bus.removeListener('evt1', mockFn1);
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
  });

  it('unsub 测试 - 只有一个 handler', () => {
    const mockFn1 = jest.fn();
    bus.on('evt1', mockFn1);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);

    bus.unsub('evt1', mockFn1);
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
  });

  it('unsub 测试 - 只 unsub 一个 handler', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    bus.on('evt1', mockFn1);
    bus.on('evt1', mockFn2);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledWith(evtData);

    bus.unsub('evt1', mockFn1);
    const evtData2 = { a: 2 };
    bus.emit('evt1', evtData2);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(2);
    expect(mockFn2).toHaveBeenLastCalledWith(evtData2);
  });

  it('unsub 测试 - 多个 handler', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    bus.on('evt1', mockFn1);
    bus.on('evt1', mockFn2);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledWith(evtData);

    bus.unsub('evt1');
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledWith(evtData);
  });

  it('off 测试 - 只有一个 handler', () => {
    const mockFn1 = jest.fn();
    bus.on('evt1', mockFn1);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);

    bus.off('evt1', mockFn1);
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
  });

  it('off 测试 - 只 off 一个 handler', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    bus.on('evt1', mockFn1);
    bus.on('evt1', mockFn2);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledWith(evtData);

    bus.off('evt1', mockFn1);
    const evtData2 = { a: 2 };
    bus.emit('evt1', evtData2);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(2);
    expect(mockFn2).toHaveBeenLastCalledWith(evtData2);
  });

  it('off 测试 - 多个 handler', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    bus.on('evt1', mockFn1);
    bus.on('evt1', mockFn2);

    const evtData = { a: 1 };
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledWith(evtData);

    bus.off('evt1');
    bus.emit('evt1', evtData);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn1).toHaveBeenCalledWith(evtData);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledWith(evtData);
  });

  it('简单测试（dummy）', () => {
    bus.getEmitter();
  });

  describe('editor 事件转发', () => {
    const fwdEvtMap = {
      've.hotkey.callback.call': 'hotkey.callback.call',
      've.history.back': 'history.back',
      've.history.forward': 'history.forward',
      'node.prop.change': 'node.prop.change',
    };

    Object.keys(fwdEvtMap).forEach(veEventName => {
      it(`${veEventName} 测试`, () => {
        const mockFn1 = jest.fn();
        const evtData1 = { a: 1 };
        bus.on(veEventName, mockFn1);

        editor.emit(fwdEvtMap[veEventName], evtData1);

        expect(mockFn1).toHaveBeenCalledTimes(1);
        expect(mockFn1).toHaveBeenCalledWith(evtData1);
      });
    });
  });
});
