import '../fixtures/window';
import { Editor, engineConfig } from '@alilc/lowcode-editor-core';
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

  it('注册插件，插件参数生成函数能被调用，且能拿到正确的 ctx ', () => {
    const mockFn = jest.fn();
    const creater = (ctx: ILowCodePluginContext) => {
      mockFn(ctx);
      return {
        init: jest.fn(),
      };
    };
    creater.pluginName = 'demo1';
    pluginManager.register(creater);

    const [expectedCtx] = mockFn.mock.calls[0];
    expect(expectedCtx).toHaveProperty('project');
    expect(expectedCtx).toHaveProperty('setters');
    expect(expectedCtx).toHaveProperty('material');
    expect(expectedCtx).toHaveProperty('hotkey');
    expect(expectedCtx).toHaveProperty('plugins');
    expect(expectedCtx).toHaveProperty('skeleton');
    expect(expectedCtx).toHaveProperty('logger');
    expect(expectedCtx).toHaveProperty('config');
    expect(expectedCtx).toHaveProperty('event');
    expect(expectedCtx).toHaveProperty('preference');
  });

  it('注册插件，调用插件 init 方法', async () => {
    const mockFn = jest.fn();
    const creater = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
        exports() {
          return {
            x: 1,
            y: 2,
          };
        },
      };
    };
    creater.pluginName = 'demo1';
    pluginManager.register(creater);
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
    const creater = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    creater.pluginName = 'demo1';

    pluginManager.register(creater);
    await pluginManager.init();
    expect(pluginManager.demo1).toBeTruthy();
    pluginManager.setDisabled('demo1', true);
    expect(pluginManager.demo1).toBeUndefined();
  });

  it('删除插件，调用插件 destroy 方法', async () => {
    const mockFn = jest.fn();
    const creater = (ctx: ILowCodePluginContext) => {
      return {
        init: jest.fn(),
        destroy: mockFn,
      };
    };
    creater.pluginName = 'demo1';
    pluginManager.register(creater);

    await pluginManager.init();
    await pluginManager.delete('demo1');
    expect(mockFn).toHaveBeenCalled();
    await pluginManager.delete('non-existing');
  });

  it('dep 依赖', async () => {
    const mockFn = jest.fn();
    const creater1 = (ctx: ILowCodePluginContext) => {
      return {
        // dep: ['demo2'],
        init: () => mockFn('demo1'),
      };
    };
    creater1.pluginName = 'demo1';
    creater1.meta = {
      dependencies: ['demo2'],
    };
    pluginManager.register(creater1);
    const creater2 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo2'),
      };
    };
    creater2.pluginName = 'demo2';
    pluginManager.register(creater2);

    await pluginManager.init();
    expect(mockFn).toHaveBeenNthCalledWith(1, 'demo2');
    expect(mockFn).toHaveBeenNthCalledWith(2, 'demo1');
  });

  it('version 依赖', async () => {
    const mockFn = jest.fn();
    const creater1 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo1'),
      };
    };
    creater1.pluginName = 'demo1';
    creater1.meta = {
      engines: {
        lowcodeEngine: '^1.1.0',
      }
    };
    engineConfig.set('ENGINE_VERSION', '1.0.1');
    
    console.log('version: ', engineConfig.get('ENGINE_VERSION'));
    // not match should skip
    pluginManager.register(creater1).catch(e => {
      expect(e).toEqual(new Error('plugin demo1 skipped, engine check failed, current engine version is 1.0.1, meta.engines.lowcodeEngine is ^1.1.0'));
    });

    expect(pluginManager.plugins.length).toBe(0);

    const creater2 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo2'),
      };
    };
    creater2.pluginName = 'demo2';
    creater2.meta = {
      engines: {
        lowcodeEngine: '^1.0.1',
      }
    };

    engineConfig.set('ENGINE_VERSION', '1.0.3');
    pluginManager.register(creater2);
    expect(pluginManager.plugins.length).toBe(1);

    const creater3 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo3'),
      };
    };
    creater3.pluginName = 'demo3';
    creater3.meta = {
      engines: {
        lowcodeEngine: '1.x',
      }
    };
    engineConfig.set('ENGINE_VERSION', '1.1.1');
    pluginManager.register(creater3);
    expect(pluginManager.plugins.length).toBe(2);
  });

  it('autoInit 功能', async () => {
    const mockFn = jest.fn();
    const creater = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    creater.pluginName = 'demo1';
    await pluginManager.register(creater, { autoInit: true });
    expect(mockFn).toHaveBeenCalled();
  });

  it('插件不会重复 init，除非强制重新 init', async () => {
    const mockFn = jest.fn();
    const creater = (ctx: ILowCodePluginContext) => {
      return {
        name: 'demo1',
        init: mockFn,
      };
    };
    creater.pluginName = 'demo1';
    pluginManager.register(creater);
    await pluginManager.init();
    expect(mockFn).toHaveBeenCalledTimes(1);

    pluginManager.get('demo1')!.init();
    expect(mockFn).toHaveBeenCalledTimes(1);

    pluginManager.get('demo1')!.init(true);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('默认情况不允许重复注册', async () => {
    const mockFn = jest.fn();
    const mockPlugin = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    mockPlugin.pluginName = 'demoDuplicated';
    pluginManager.register(mockPlugin);
    pluginManager.register(mockPlugin).catch(e => {
      expect(e).toEqual(new Error('Plugin with name demoDuplicated exists'));
    });
    await pluginManager.init();
  });

  it('插件增加 override 参数时可以重复注册', async () => {
    const mockFn = jest.fn();
    const mockPlugin = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    mockPlugin.pluginName = 'demoOverride';
    pluginManager.register(mockPlugin);
    pluginManager.register(mockPlugin, { override: true });
    await pluginManager.init();
  });

  it('插件增加 override 参数时可以重复注册, 被覆盖的如果已初始化，会被销毁', async () => {
    const mockInitFn = jest.fn();
    const mockDestroyFn = jest.fn();
    const mockPlugin = (ctx: ILowCodePluginContext) => {
      return {
        init: mockInitFn,
        destroy: mockDestroyFn,
      };
    };
    mockPlugin.pluginName = 'demoOverride';
    await pluginManager.register(mockPlugin, { autoInit: true });
    expect(mockInitFn).toHaveBeenCalledTimes(1);
    await pluginManager.register(mockPlugin, { override: true });
    expect(mockDestroyFn).toHaveBeenCalledTimes(1);
    await pluginManager.init();
  });

  it('内部事件机制', async () => {
    const mockFn = jest.fn();
    const creater = (ctx: ILowCodePluginContext) => {
      return {
      };
    }
    creater.pluginName = 'demo1';
    pluginManager.register(creater);
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
    const creater = (ctx: ILowCodePluginContext) => {
      return {
      };
    }
    creater.pluginName = 'demo1';
    pluginManager.register(creater);
    await pluginManager.init();
    const plugin = pluginManager.get('demo1')!;
    await plugin.dispose();

    expect(pluginManager.has('demo1')).toBeFalsy();
  });

  it('注册插件，调用插件 init 方法并传入preference，可以成功获取', async () => {
    const mockFn = jest.fn();
    const mockFnForCtx = jest.fn();
    const mockPreference = new Map();
    mockPreference.set('demo1',{
      key1: 'value for key1',
      key2: false,
      key3: 123,
      key5: 'value for key5, but declared, should not work'
    });
    mockPreference.set('demo2',{
      key1: 'value for demo2.key1',
      key2: false,
      key3: 123,
    });

    const creater = (ctx: ILowCodePluginContext) => {
      mockFnForCtx(ctx);
      return {
        init: jest.fn(),
      };
    };
    creater.pluginName = 'demo1';
    creater.meta = {
      preferenceDeclaration: {
        title: 'demo1的的参数定义',
        properties: [
          {
            key: 'key1',
            type: 'string',
            description: 'this is description for key1',
          },
          {
            key: 'key2',
            type: 'boolean',
            description: 'this is description for key2',
          },
          {
            key: 'key3',
            type: 'number',
            description: 'this is description for key3',
          },
          {
            key: 'key4',
            type: 'string',
            description: 'this is description for key4',
          },
        ],
      },
    }
    pluginManager.register(creater);
    expect(mockFnForCtx).toHaveBeenCalledTimes(1);
    await pluginManager.init(mockPreference);
    // creater only get excuted once
    expect(mockFnForCtx).toHaveBeenCalledTimes(1);
    
    const [expectedCtx, expectedOptions] = mockFnForCtx.mock.calls[0];
    expect(expectedCtx).toHaveProperty('preference');

    // test normal case
    expect(expectedCtx.preference.getPreferenceValue('key1', 'default')).toBe('value for key1');

    // test default value logic
    expect(expectedCtx.preference.getPreferenceValue('key4', 'default for key4')).toBe('default for key4');

    // test undeclared key
    expect(expectedCtx.preference.getPreferenceValue('key5', 'default for key5')).toBeUndefined();
  });
});
