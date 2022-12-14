import '../fixtures/window';
import { Editor, engineConfig } from '@alilc/lowcode-editor-core';
import { LowCodePluginManager } from '../../src/plugin/plugin-manager';
import { ILowCodePluginContext } from '@alilc/lowcode-types';
import { ILowCodePluginManager } from '../../src/plugin/plugin-types';

const editor = new Editor();
const contextApiAssembler = {
  assembleApis(){
    // mock set apis
  }
};

describe('plugin 测试', () => {
  let pluginManager: ILowCodePluginManager;
  beforeEach(() => {
    pluginManager = new LowCodePluginManager(contextApiAssembler).toProxy();
  });
  afterEach(() => {
    pluginManager.dispose();
  });

  it('注册插件，插件参数生成函数能被调用，且能拿到正确的 ctx ', () => {
    const mockFn = jest.fn();
    const creator2 = (ctx: ILowCodePluginContext) => {
      mockFn(ctx);
      return {
        init: jest.fn(),
      };
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);

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
    const creator2 = (ctx: ILowCodePluginContext) => {
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
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
    await pluginManager.init();
    expect(pluginManager.size).toBe(1);
    expect(pluginManager.has('demo1')).toBeTruthy();
    expect(pluginManager.get('demo1')!.isInited()).toBeTruthy();
    expect(pluginManager.demo1).toBeTruthy();
    expect(pluginManager.demo1.x).toBe(1);
    expect(pluginManager.demo1.y).toBe(2);
    expect(pluginManager.demo1.z).toBeUndefined();
    expect(mockFn).toHaveBeenCalled();
  });

  it('注册插件，调用 setDisabled 方法', async () => {
    const mockFn = jest.fn();
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    creator2.pluginName = 'demo1';

    pluginManager.register(creator2);
    await pluginManager.init();
    expect(pluginManager.demo1).toBeTruthy();
    pluginManager.setDisabled('demo1', true);
    expect(pluginManager.demo1).toBeUndefined();
  });

  it('注册插件，调用 plugin.setDisabled 方法', async () => {
    const mockFn = jest.fn();
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    creator2.pluginName = 'demo1';

    pluginManager.register(creator2);
    await pluginManager.init();
    expect(pluginManager.demo1).toBeTruthy();
    pluginManager.get('demo1').setDisabled();
    expect(pluginManager.demo1).toBeUndefined();
  });

  it('删除插件，调用插件 destroy 方法', async () => {
    const mockFn = jest.fn();
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {
        init: jest.fn(),
        destroy: mockFn,
      };
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);

    await pluginManager.init();
    await pluginManager.delete('demo1');
    expect(mockFn).toHaveBeenCalled();
    await pluginManager.delete('non-existing');
  });

  describe('dependencies 依赖', () => {
    it('dependencies 依赖', async () => {
      const mockFn = jest.fn();
      const creator21 = (ctx: ILowCodePluginContext) => {
        return {
          init: () => mockFn('demo1'),
        };
      };
      creator21.pluginName = 'demo1';
      creator21.meta = {
        dependencies: ['demo2'],
      };
      pluginManager.register(creator21);
      const creator22 = (ctx: ILowCodePluginContext) => {
        return {
          init: () => mockFn('demo2'),
        };
      };
      creator22.pluginName = 'demo2';
      pluginManager.register(creator22);

      await pluginManager.init();
      expect(mockFn).toHaveBeenNthCalledWith(1, 'demo2');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'demo1');
    });

    it('dependencies 依赖 - string', async () => {
      const mockFn = jest.fn();
      const creator21 = (ctx: ILowCodePluginContext) => {
        return {
          init: () => mockFn('demo1'),
        };
      };
      creator21.pluginName = 'demo1';
      creator21.meta = {
        dependencies: 'demo2',
      };
      pluginManager.register(creator21);
      const creator22 = (ctx: ILowCodePluginContext) => {
        return {
          init: () => mockFn('demo2'),
        };
      };
      creator22.pluginName = 'demo2';
      pluginManager.register(creator22);

      await pluginManager.init();
      expect(mockFn).toHaveBeenNthCalledWith(1, 'demo2');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'demo1');
    });

    it('dependencies 依赖 - 兼容 dep', async () => {
      const mockFn = jest.fn();
      const creator21 = (ctx: ILowCodePluginContext) => {
        return {
          dep: ['demo4'],
          init: () => mockFn('demo3'),
        };
      };
      creator21.pluginName = 'demo3';
      pluginManager.register(creator21);
      const creator22 = (ctx: ILowCodePluginContext) => {
        return {
          init: () => mockFn('demo4'),
        };
      };
      creator22.pluginName = 'demo4';
      pluginManager.register(creator22);

      await pluginManager.init();
      expect(mockFn).toHaveBeenNthCalledWith(1, 'demo4');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'demo3');
    });

    it('dependencies 依赖 - 兼容 dep & string', async () => {
      const mockFn = jest.fn();
      const creator21 = (ctx: ILowCodePluginContext) => {
        return {
          dep: 'demo4',
          init: () => mockFn('demo3'),
        };
      };
      creator21.pluginName = 'demo3';
      pluginManager.register(creator21);
      const creator22 = (ctx: ILowCodePluginContext) => {
        return {
          init: () => mockFn('demo4'),
        };
      };
      creator22.pluginName = 'demo4';
      pluginManager.register(creator22);

      await pluginManager.init();
      expect(mockFn).toHaveBeenNthCalledWith(1, 'demo4');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'demo3');
    });
  });

  it('version 依赖', async () => {
    const mockFn = jest.fn();
    const creator21 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo1'),
      };
    };
    creator21.pluginName = 'demo1';
    creator21.meta = {
      engines: {
        lowcodeEngine: '^1.1.0',
      },
    };
    engineConfig.set('ENGINE_VERSION', '1.0.1');

    console.log('version: ', engineConfig.get('ENGINE_VERSION'));
    // not match should skip
    pluginManager.register(creator21).catch((e) => {
      expect(e).toEqual(
        new Error(
          'plugin demo1 skipped, engine check failed, current engine version is 1.0.1, meta.engines.lowcodeEngine is ^1.1.0',
        ),
      );
    });

    expect(pluginManager.plugins.length).toBe(0);

    const creator22 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo2'),
      };
    };
    creator22.pluginName = 'demo2';
    creator22.meta = {
      engines: {
        lowcodeEngine: '^1.0.1',
      },
    };

    engineConfig.set('ENGINE_VERSION', '1.0.3');
    pluginManager.register(creator22);
    expect(pluginManager.plugins.length).toBe(1);

    const creator23 = (ctx: ILowCodePluginContext) => {
      return {
        init: () => mockFn('demo3'),
      };
    };
    creator23.pluginName = 'demo3';
    creator23.meta = {
      engines: {
        lowcodeEngine: '1.x',
      },
    };
    engineConfig.set('ENGINE_VERSION', '1.1.1');
    pluginManager.register(creator23);
    expect(pluginManager.plugins.length).toBe(2);
  });

  it('autoInit 功能', async () => {
    const mockFn = jest.fn();
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {
        init: mockFn,
      };
    };
    creator2.pluginName = 'demo1';
    await pluginManager.register(creator2, { autoInit: true });
    expect(mockFn).toHaveBeenCalled();
  });

  it('插件不会重复 init，除非强制重新 init', async () => {
    const mockFn = jest.fn();
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {
        name: 'demo1',
        init: mockFn,
      };
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
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
    pluginManager.register(mockPlugin).catch((e) => {
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
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {};
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
    await pluginManager.init();
    const plugin = pluginManager.get('demo1')!;

    const off = plugin.on('haha', mockFn);
    plugin.emit('haha', 1, 2, 3);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, 2, 3);

    off();
    plugin.emit('haha', 1, 2, 3);
    expect(mockFn).toHaveBeenCalledTimes(1);

    plugin.removeAllListeners('haha');
    plugin.emit('haha', 1, 2, 3);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('dispose 方法', async () => {
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {};
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
    await pluginManager.init();
    const plugin = pluginManager.get('demo1')!;
    await plugin.dispose();

    expect(pluginManager.has('demo1')).toBeFalsy();
  });

  it('getAll 方法', async () => {
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {};
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
    await pluginManager.init();

    expect(pluginManager.getAll()).toHaveLength(1);
  });

  it('getPluginPreference 方法 - null', async () => {
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {};
    };
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
    await pluginManager.init();

    expect(pluginManager.getPluginPreference()).toBeNull();
  });

  it('getPluginPreference 方法', async () => {
    const creator2 = (ctx: ILowCodePluginContext) => {
      return {};
    };
    const preference = new Map();
    preference.set('demo1', { a: 1, b: 2 });
    creator2.pluginName = 'demo1';
    pluginManager.register(creator2);
    await pluginManager.init(preference);

    expect(pluginManager.getPluginPreference('demo1')).toEqual({ a: 1, b: 2 });
  });

  it('注册插件，调用插件 init 方法并传入 preference，可以成功获取', async () => {
    const mockFn = jest.fn();
    const mockFnForCtx = jest.fn();
    const mockFnForCtx2 = jest.fn();
    const mockPreference = new Map();
    mockPreference.set('demo1', {
      key1: 'value for key1',
      key2: false,
      key3: 123,
      key5: 'value for key5, but declared, should not work',
    });

    const creator2 = (ctx: ILowCodePluginContext) => {
      mockFnForCtx(ctx);
      return {
        init: jest.fn(),
      };
    };
    creator2.pluginName = 'demo1';
    creator2.meta = {
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
    };
    const creator22 = (ctx: ILowCodePluginContext) => {
      mockFnForCtx2(ctx);
      return {
        init: jest.fn(),
      };
    };
    creator22.pluginName = 'demo2';
    creator22.meta = {
      preferenceDeclaration: {
        title: 'demo1的的参数定义',
        properties: [
          {
            key: 'key1',
            type: 'string',
            description: 'this is description for key1',
          },
        ],
      },
    };
    pluginManager.register(creator2);
    pluginManager.register(creator22);
    expect(mockFnForCtx).toHaveBeenCalledTimes(1);

    await pluginManager.init(mockPreference);
    // creator2 only get excuted once
    expect(mockFnForCtx).toHaveBeenCalledTimes(1);

    const [expectedCtx, expectedOptions] = mockFnForCtx.mock.calls[0];
    expect(expectedCtx).toHaveProperty('preference');

    // test normal case
    expect(expectedCtx.preference.getPreferenceValue('key1', 'default')).toBe('value for key1');

    // test default value logic
    expect(expectedCtx.preference.getPreferenceValue('key4', 'default for key4')).toBe(
      'default for key4',
    );

    // test undeclared key
    expect(expectedCtx.preference.getPreferenceValue('key5', 'default for key5')).toBeUndefined();

    // no preference defined
    const [expectedCtx2] = mockFnForCtx2.mock.calls[0];
    expect(expectedCtx2.preference.getPreferenceValue('key1')).toBeUndefined();
  });

  it('注册插件，没有填写 pluginName，默认值为 anonymous', async () => {
    const mockFn = jest.fn();

    const creator2 = (ctx: ILowCodePluginContext) => {
      return {
        name: 'xxx',
        init: () => mockFn('anonymous'),
      };
    };
    await pluginManager.register(creator2);
    expect(pluginManager.get('anonymous')).toBeUndefined();
  });

  it('自定义/扩展 plugin context', async () => {
    const mockFn = jest.fn();
    const mockFn2 = jest.fn();

    const creator2 = (ctx: ILowCodePluginContext) => {
      mockFn2(ctx);
      return {
        init: () => mockFn('anonymous'),
      };
    };
    creator2.pluginName = 'yyy';
    editor.set('enhancePluginContextHook', (originalContext) => {
      originalContext.newProp = 1;
    });
    await pluginManager.register(creator2);
    const [expectedCtx] = mockFn2.mock.calls[0];
    expect(expectedCtx).toHaveProperty('newProp');
  });
});
