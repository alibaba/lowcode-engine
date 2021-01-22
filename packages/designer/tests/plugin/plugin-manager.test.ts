import '../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { LowCodePluginManager } from '../../src/plugin/plugin-manager';
import { ILowCodePluginContext, ILowCodePluginManager } from '../../src/plugin/plugin-types';

const editor = new Editor();

describe('plugin 测试', () => {
  let pluginManager: ILowCodePluginManager;
  beforeEach(() => {
    pluginManager = new LowCodePluginManager(editor).toProxy();
  });
  afterEach(() => {
    pluginManager.dispose();
  });

  it('注册插件，插件参数生成函数能被调用，且能拿到正确的 ctx / options', () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      mockFn(ctx, options);
      return {
        name: 'demo1',
      };
    }, { test: 1 });

    const [expectedCtx, expectedOptions] = mockFn.mock.calls[0];
    expect(expectedCtx).toHaveProperty('designer');
    expect(expectedCtx).toHaveProperty('designerCabin');
    expect(expectedCtx).toHaveProperty('editor');
    expect(expectedCtx).toHaveProperty('hotkey');
    expect(expectedCtx).toHaveProperty('plugins');
    expect(expectedCtx).toHaveProperty('skeleton');
    expect(expectedCtx).toHaveProperty('logger');
    expect(expectedOptions).toEqual({ test: 1 });
  });

  it('注册插件，调用插件 init 方法', async () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
        init: mockFn,
        exports() {
          return {
            x: 1,
            y: 2,
          }
        }
      };
    }, { test: 1 });
    await pluginManager.init();
    expect(pluginManager.size).toBe(1);
    expect(pluginManager.has('demo1')).toBeTruthy();
    expect(pluginManager.get('demo1')!.isInited()).toBeTruthy();
    expect(pluginManager.demo1).toBeTruthy();
    expect(pluginManager.demo1.x).toBe(1);
    expect(pluginManager.demo1.y).toBe(2);
    expect(mockFn).toHaveBeenCalled();
  });

  it('注册插件，调用 setDisabled 方法', async () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
        init: mockFn,
      };
    }, { test: 1 });
    await pluginManager.init();
    expect(pluginManager.demo1).toBeTruthy();
    pluginManager.setDisabled('demo1', true);
    expect(pluginManager.demo1).toBeUndefined();
  });

  it('删除插件，调用插件 destory 方法', async () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
        destroy: mockFn,
      };
    }, { test: 1 });
    await pluginManager.init();
    await pluginManager.delete('demo1');
    expect(mockFn).toHaveBeenCalled();
    await pluginManager.delete('non-existing');
  });

  it('dep 依赖', async () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
        dep: ['demo2'],
        init: () => mockFn('demo1'),
      };
    });
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo2',
        init: () => mockFn('demo2'),
      };
    });

    await pluginManager.init();
    expect(mockFn).toHaveBeenNthCalledWith(1, 'demo2');
    expect(mockFn).toHaveBeenNthCalledWith(2, 'demo1');
  });

  it('autoInit 功能', async () => {
    const mockFn = jest.fn();
    await pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
        init: mockFn,
      };
    }, { test: 1 }, { autoInit: true });
    expect(mockFn).toHaveBeenCalled();
  });

  it('插件不会重复 init，除非强制重新 init', async () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
        init: mockFn,
      };
    }, { test: 1 });
    await pluginManager.init();
    expect(mockFn).toHaveBeenCalledTimes(1);

    pluginManager.get('demo1')!.init();
    expect(mockFn).toHaveBeenCalledTimes(1);

    pluginManager.get('demo1')!.init(true);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('内部事件机制', async () => {
    const mockFn = jest.fn();
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
      };
    }, { test: 1 });
    await pluginManager.init();
    const plugin = pluginManager.get('demo1')!;

    plugin.on('haha', mockFn);
    plugin.emit('haha', 1, 2, 3);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, 2, 3);

    plugin.removeAllListeners('haha');
    plugin.emit('haha', 1, 2, 3);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('dispose 方法', async () => {
    pluginManager.register((ctx: ILowCodePluginContext, options: any) => {
      return {
        name: 'demo1',
      };
    }, { test: 1 });
    await pluginManager.init();
    const plugin = pluginManager.get('demo1')!;
    await plugin.dispose();

    expect(pluginManager.has('demo1')).toBeFalsy();
  })
});