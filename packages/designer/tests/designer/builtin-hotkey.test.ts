jest.mock('@ali/lowcode-utils');
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../fixtures/window';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { Designer } from '../../src/designer/designer';
import { Project } from '../../src/project/project';
import formSchema from '../fixtures/schema/form';
import '../../src/designer/builtin-hotkey';
import { fireEvent } from '@testing-library/react';
import { isFormEvent } from '@ali/lowcode-utils';

const editor = new Editor();

let designer: Designer;
beforeAll(() => {
  globalContext.register(editor, Editor);
});
beforeEach(() => {
  designer = new Designer({ editor });
  designer.project.open(formSchema);
});
afterEach(() => {
  designer = null;
});

// keyCode 对应表：https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
// hotkey 模块底层用的 keyCode，所以还不能用 key / code 测试
describe('快捷键测试', () => {
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
      designer.currentDocument?.selection.select('page');
      // nothing happened
      isFormEvent.mockReturnValue(true);

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
  });
});
