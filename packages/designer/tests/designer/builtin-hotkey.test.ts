import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../fixtures/window';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { Designer } from '../../src/designer/designer';
import { Project } from '../../src/project/project';
import formSchema from '../fixtures/schema/form';
import '../../src/designer/builtin-hotkey';

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

    let event = new KeyboardEvent('keydown', { keyCode: 39 });
    document.dispatchEvent(event);

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbl')).toBeTruthy();
  });

  it('left', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbl')!;
    firstCardNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 37 });
    document.dispatchEvent(event);

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbj')).toBeTruthy();
  });

  it('down', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbl')!;
    firstCardNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 40 });
    document.dispatchEvent(event);

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbo')).toBeTruthy();
  });

  it('up', () => {
    const secondCardNode = designer.currentDocument?.getNode('node_k1ow3cbm')!;
    secondCardNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 38 });
    document.dispatchEvent(event);

    expect(designer.currentSelection?.selected.includes('node_k1ow3cbl')).toBeTruthy();
  });

  // 跟右侧节点调换位置
  it('option + right', () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    firstButtonNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 39, altKey: true });
    document.dispatchEvent(event);

    expect(firstButtonNode.prevSibling?.getId()).toBe('node_k1ow3cbp');
  });

  // 跟左侧节点调换位置
  it('option + left', () => {
    const secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    secondButtonNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 37, altKey: true });
    document.dispatchEvent(event);

    expect(secondButtonNode.nextSibling?.getId()).toBe('node_k1ow3cbn');
  });

  // 向父级移动该节点
  it('option + up', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 38, altKey: true });
    document.dispatchEvent(event);
  });

  // 将节点移入到兄弟节点中
  it('option + up', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 40, altKey: true });
    document.dispatchEvent(event);
  });

  // 撤销
  it('command + z', async () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    let secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;

    firstButtonNode.remove();
    expect(secondButtonNode.getParent()?.children.size).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 1000));

    let event = new KeyboardEvent('keydown', { keyCode: 90, metaKey: true });
    document.dispatchEvent(event);

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

    let event = new KeyboardEvent('keydown', { keyCode: 90, metaKey: true });
    document.dispatchEvent(event);

    // 重新获取一次节点，因为 documentModel.import 是全画布刷新
    secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    expect(secondButtonNode.getParent()?.children.size).toBe(2);

    await new Promise(resolve => setTimeout(resolve, 1000));

    event = new KeyboardEvent('keydown', { keyCode: 89, metaKey: true });
    document.dispatchEvent(event);

    // 重新获取一次节点，因为 documentModel.import 是全画布刷新
    secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    expect(secondButtonNode.getParent()?.children.size).toBe(1);
  });

  it('command + c', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 67, metaKey: true });
    document.dispatchEvent(event);
  });

  it('command + v', async () => {
    const secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    secondButtonNode.select();

    let event = new KeyboardEvent('keydown', { keyCode: 67, metaKey: true });
    document.dispatchEvent(event);

    event = new KeyboardEvent('keydown', { keyCode: 86, metaKey: true });
    document.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // clipboard 异步，先注释
    // expect(secondButtonNode.getParent()?.children.size).toBe(3);
  });

  // 撤销所有选中
  it('escape', () => {
    const firstCardNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstCardNode.select();

    expect(designer.currentSelection!.selected.includes('node_k1ow3cbp')).toBeTruthy();

    let event = new KeyboardEvent('keydown', { keyCode: 27 });
    document.dispatchEvent(event);

    expect(designer.currentSelection!.selected.length).toBe(0);
  });

  // 删除节点
  it('delete', () => {
    const firstButtonNode = designer.currentDocument?.getNode('node_k1ow3cbn')!;
    const secondButtonNode = designer.currentDocument?.getNode('node_k1ow3cbp')!;
    firstButtonNode.select();

    expect(secondButtonNode.prevSibling.id).toBe('node_k1ow3cbn');

    let event = new KeyboardEvent('keydown', { keyCode: 46 });
    document.dispatchEvent(event);

    expect(secondButtonNode.prevSibling).toBeNull();
  });
});
