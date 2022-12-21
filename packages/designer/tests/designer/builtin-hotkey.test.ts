import '../fixtures/window';
import {
  Editor,
  globalContext,
  Hotkey as InnerHotkey,
} from '@alilc/lowcode-editor-core';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import { fireEvent } from '@testing-library/react';
import { isInLiveEditing, builtinHotkey } from '../../../engine/src/inner-plugins/builtin-hotkey';
import { shellModelFactory } from '../../../engine/src/modules/shell-model-factory';
import { ILowCodePluginContextPrivate, LowCodePluginManager } from '@alilc/lowcode-designer';
import { IPublicApiPlugins } from '@alilc/lowcode-types';
import { Logger, Project } from '@alilc/lowcode-shell';
import { Workspace } from '@alilc/lowcode-workspace';

const editor = new Editor();
const workspace = new Workspace();

let designer: Designer;

describe('error scenarios', () => {
  it('edtior not registered', () => {
    expect(isInLiveEditing()).toBeUndefined();
  });
});

// keyCode 对应表：https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
// hotkey 模块底层用的 keyCode，所以还不能用 key / code 测试
describe('快捷键测试', () => {
  let pluginManager: LowCodePluginManager;
  let project: any = {};
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      const hotkey: any = new InnerHotkey();
      const logger = new Logger({ level: 'warn', bizName: 'common' });
      const contextApiAssembler = {
        assembleApis(context: ILowCodePluginContextPrivate){
          context.plugins = pluginManager as IPublicApiPlugins;
          context.hotkey = hotkey;
          context.logger = logger;
          context.project = project;
        }
      };
      pluginManager = new LowCodePluginManager(contextApiAssembler).toProxy();
      pluginManager.register(builtinHotkey);
      globalContext.register(editor, Editor);
      globalContext.register(editor, 'editor');
      globalContext.register(workspace, 'workspace');
      pluginManager.init().then(() => {
        resolve({});
      });
    })
  });
  afterAll(() => {
    pluginManager.dispose();
  });
  beforeEach(() => {
    designer = new Designer({ editor, shellModelFactory });
    editor.set('designer', designer);
    designer.project.open(formSchema);
    project.__proto__ = new Project(designer.project);
  });
  afterEach(() => {
    designer = null;
  });

  it('right', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbj')!;
    firstCardNode.select();

    fireEvent.keyDown(document, { keyCode: 39 });

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbl')).toBeTruthy();
  });

  it('left', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbl')!;
    firstCardNode.select();

    fireEvent.keyDown(document, { keyCode: 37 });

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbj')).toBeTruthy();
  });

  it('down', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbl')!;
    firstCardNode.select();

    fireEvent.keyDown(document, { keyCode: 40 });

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbo')).toBeTruthy();
  });

  it('up', () => {
    const secondCardNode = designer.currentDocument?.getNode('node_k1ow3cbm')!;
    secondCardNode.select();

    fireEvent.keyDown(document, { keyCode: 38 });

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbl')).toBeTruthy();
  });

  // 跟右侧节点调换位置
  it('option + right', () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    firstButtonNode.select();

    fireEvent.keyDown(document, { keyCode: 39, altKey: true });

    expect(firstButtonNode.prevSibling?.getId()).toBe('node_k1ow3cbp');
  });

  // 跟左侧节点调换位置
  it('option + left', () => {
    const secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    secondButtonNode.select();

    fireEvent.keyDown(document, { keyCode: 37, altKey: true });

    expect(secondButtonNode.nextSibling?.getId()).toBe('node_k1ow3cbn');
  });

  // 向父级移动该节点
  it('option + up', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    fireEvent.keyDown(document, { keyCode: 38, altKey: true });
  });

  // 将节点移入到兄弟节点中
  it('option + up', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    fireEvent.keyDown(document, { keyCode: 40, altKey: true });
  });

  // 撤销
  it('command + z', async () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    let secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;

    // 等待第一个 session 结束
    await new Promise(resolve => setTimeout(resolve, 1000));

    firstButtonNode.remove();
    expect(secondButtonNode.getParent()?.children.size).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 1000));

    fireEvent.keyDown(document, { keyCode: 90, metaKey: true });

    // 重新获取一次节点，因为 documentModel.import 是全画布刷新
    secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    expect(secondButtonNode.getParent()?.children.size).toBe(2);
  });

  // 重做
  it('command + y', async () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    let secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;

    // 等待第一个 session 结束
    await new Promise(resolve => setTimeout(resolve, 1000));

    firstButtonNode.remove();
    expect(secondButtonNode.getParent()?.children.size).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 1000));

    fireEvent.keyDown(document, { keyCode: 90, metaKey: true });

    // 重新获取一次节点，因为 documentModel.import 是全画布刷新
    secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    expect(secondButtonNode.getParent()?.children.size).toBe(2);

    await new Promise(resolve => setTimeout(resolve, 1000));

    fireEvent.keyDown(document, { keyCode: 89, metaKey: true });

    // 重新获取一次节点，因为 documentModel.import 是全画布刷新
    secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    expect(secondButtonNode.getParent()?.children.size).toBe(1);
  });

  it('command + c', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    fireEvent.keyDown(document, { keyCode: 67, metaKey: true });
  });

  it('command + v', async () => {
    const secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    secondButtonNode.select();

    fireEvent.keyDown(document, { keyCode: 67, metaKey: true });

    fireEvent.keyDown(document, { keyCode: 86, metaKey: true });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // clipboard 异步，先注释
    // expect(secondButtonNode.getParent()?.children.size).toBe(3);
  });

  // 撤销所有选中
  it('escape', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    expect(designer.currentSelection!.selected.includes('node_k1ow3cbp')).toBeTruthy();

    fireEvent.keyDown(document, { keyCode: 27 });

    expect(designer.currentSelection!.selected.length).toBe(0);
  });

  // 删除节点
  it('delete', () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    const secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstButtonNode.select();

    expect(secondButtonNode.prevSibling.id).toBe('node_k1ow3cbn');

    fireEvent.keyDown(document, { keyCode: 46 });

    expect(secondButtonNode.prevSibling).toBeNull();
  });


  describe('非正常分支', () => {
    it('liveEditing mode', () => {
      designer.project.mountSimulator({
        liveEditing: {
          editing: {},
        },
      });
      editor.set('designer', designer);
      designer.currentDocument?.selection.select('page');
      // nothing happened
      fireEvent.keyDown(document, { keyCode: 39 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 37 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 40 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 38 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 39, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 37, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 40, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 38, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 90, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 89, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 67, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 86, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 27 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(document, { keyCode: 46 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');
    });

    it('isFormEvent: true', () => {
      const inputDOMNode = document.createElement('INPUT');
      document.body.appendChild(inputDOMNode);
      designer.currentDocument?.selection.select('page');
      // nothing happened

      fireEvent.keyDown(inputDOMNode, { keyCode: 39 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 37 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 40 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 38 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 39, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 37, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 40, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 38, altKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 90, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 89, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 67, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 86, metaKey: true });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 27 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');

      fireEvent.keyDown(inputDOMNode, { keyCode: 46 });
      expect(designer.currentDocument?.selection.selected[0]).toBe('page');
    });

    it('doc is null', () => {
      designer.currentDocument?.selection.select('page');
      designer.project.documents = [];

      fireEvent.keyDown(document, { keyCode: 39 });

      fireEvent.keyDown(document, { keyCode: 37 });

      fireEvent.keyDown(document, { keyCode: 40 });

      fireEvent.keyDown(document, { keyCode: 38 });

      fireEvent.keyDown(document, { keyCode: 39, altKey: true });

      fireEvent.keyDown(document, { keyCode: 37, altKey: true });

      fireEvent.keyDown(document, { keyCode: 40, altKey: true });

      fireEvent.keyDown(document, { keyCode: 38, altKey: true });

      fireEvent.keyDown(document, { keyCode: 90, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 89, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 67, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 86, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 27 });

      fireEvent.keyDown(document, { keyCode: 46 });
    });

    it('selected is []', () => {
      fireEvent.keyDown(document, { keyCode: 39 });

      fireEvent.keyDown(document, { keyCode: 37 });

      fireEvent.keyDown(document, { keyCode: 40 });

      fireEvent.keyDown(document, { keyCode: 38 });

      fireEvent.keyDown(document, { keyCode: 39, altKey: true });

      fireEvent.keyDown(document, { keyCode: 37, altKey: true });

      fireEvent.keyDown(document, { keyCode: 40, altKey: true });

      fireEvent.keyDown(document, { keyCode: 38, altKey: true });

      fireEvent.keyDown(document, { keyCode: 90, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 89, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 67, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 86, metaKey: true });

      fireEvent.keyDown(document, { keyCode: 27 });

      fireEvent.keyDown(document, { keyCode: 46 });
    });
  });
});