import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import { VisualEngineContext } from '../../src/context';
import { autorun } from '@ali/lowcode-editor-core';

describe('VisualEngineContext 测试', () => {
  it('registerManager | getManager', () => {
    const ctx = new VisualEngineContext();

    ctx.registerManager({
      mgr1: {},
    });
    ctx.registerManager('mgr2', {});
    expect(ctx.getManager('mgr1')).toEqual({});
  });

  it('registerModule | getModule', () => {
    const ctx = new VisualEngineContext();

    ctx.registerModule({
      mod1: {},
    });
    ctx.registerModule('mod2', {});
    expect(ctx.getModule('mod1')).toEqual({});
  });

  it('use | getPlugin', () => {
    const ctx = new VisualEngineContext();

    ctx.use('plugin1', { plugin: 1 });
    ctx.registerManager({
      mgr1: { manager: 1 },
    });
    ctx.registerModule({
      mod1: { mod: 1 },
    });
    expect(ctx.getPlugin('plugin1')).toEqual({ plugin: 1 });
    expect(ctx.getPlugin('mgr1')).toEqual({ manager: 1 });
    expect(ctx.getPlugin('mod1')).toEqual({ mod: 1 });
    expect(ctx.getPlugin()).toBeUndefined;

    ctx.use('ve.settingField.variableSetter', {});
  });

  it('registerTreePane | getModule', () => {
    const ctx = new VisualEngineContext();

    ctx.registerTreePane({ pane: 1 }, { core: 2 });
    expect(ctx.getModule('TreePane')).toEqual({ pane: 1 });
    expect(ctx.getModule('TreeCore')).toEqual({ core: 2 });
  });

  it('registerDynamicSetterProvider', () => {
    const ctx = new VisualEngineContext();

    ctx.registerDynamicSetterProvider({});
    expect(ctx.getPlugin('ve.plugin.setterProvider')).toEqual({});
    ctx.registerDynamicSetterProvider();
  });
});
