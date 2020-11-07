import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import VisualEngine, {
  designer,
  editor,
  skeleton,
  /**
   * VE.Popup
   */
  Popup,
  /**
   * VE Utils
   */
  utils,
  I18nUtil,
  Hotkey,
  Env,
  monitor,
  /* pub/sub 集线器 */
  Bus,
  /* 事件 */
  EVENTS,
  /* 修饰方法 */
  HOOKS,
  Exchange,
  context,
  /**
   * VE.init
   *
   * Initialized the whole VisualEngine UI
   */
  init,
  ui,
  Panes,
  modules,
  Trunk,
  Prototype,
  Bundle,
  Pages,
  DragEngine,
  Viewport,
  Version,
  Project,
  logger,
  Symbols,
} from '../../src';
import { Editor } from '@ali/lowcode-editor-core';

describe('API 多种导出场景测试', () => {
  it('window.VisualEngine 和 npm 导出 API 测试', () => {
    expect(VisualEngine).toBe(window.VisualEngine);
  });

  it('npm 导出 API 对比测试', () => {
    expect(VisualEngine.designer).toBe(designer);
    expect(VisualEngine.editor).toBe(editor);
    expect(VisualEngine.skeleton).toBe(skeleton);
    expect(VisualEngine.Popup).toBe(Popup);
    expect(VisualEngine.utils).toBe(utils);
    expect(VisualEngine.I18nUtil).toBe(I18nUtil);
    expect(VisualEngine.Hotkey).toBe(Hotkey);
    expect(VisualEngine.Env).toBe(Env);
    expect(VisualEngine.monitor).toBe(monitor);
    expect(VisualEngine.Bus).toBe(Bus);
    expect(VisualEngine.EVENTS).toBe(EVENTS);
    expect(VisualEngine.HOOKS).toBe(HOOKS);
    expect(VisualEngine.Exchange).toBe(Exchange);
    expect(VisualEngine.context).toBe(context);
    expect(VisualEngine.init).toBe(init);
    expect(VisualEngine.ui).toBe(ui);
    expect(VisualEngine.Panes).toBe(Panes);
    expect(VisualEngine.modules).toBe(modules);
    expect(VisualEngine.Trunk).toBe(Trunk);
    expect(VisualEngine.Prototype).toBe(Prototype);
    expect(VisualEngine.Bundle).toBe(Bundle);
    expect(VisualEngine.DragEngine).toBe(DragEngine);
    expect(VisualEngine.Pages).toBe(Pages);
    expect(VisualEngine.Viewport).toBe(Viewport);
    expect(VisualEngine.Version).toBe(Version);
    expect(VisualEngine.Project).toBe(Project);
    expect(VisualEngine.logger).toBe(logger);
    expect(VisualEngine.Symbols).toBe(Symbols);
  });
});