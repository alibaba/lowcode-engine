// @ts-nocheck
import '../../fixtures/window';
import { set } from '../../utils';
import {
  Editor,
  globalContext,
  Setters as InnerSetters,
} from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { Workspace as InnerWorkspace } from '@alilc/lowcode-workspace';
import { DocumentModel } from '../../../src/document/document-model';
import {
  isRootNode,
  Node,
  comparePosition,
  contains,
  PositionNO,
} from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import divMetadata from '../../fixtures/component-metadata/div';
import dialogMetadata from '../../fixtures/component-metadata/dialog';
import btnMetadata from '../../fixtures/component-metadata/button';
import formMetadata from '../../fixtures/component-metadata/form';
import pageMetadata from '../../fixtures/component-metadata/page';
import rootHeaderMetadata from '../../fixtures/component-metadata/root-header';
import rootContentMetadata from '../../fixtures/component-metadata/root-content';
import rootFooterMetadata from '../../fixtures/component-metadata/root-footer';
import { shellModelFactory } from '../../../../engine/src/modules/shell-model-factory';
import { isNode } from '@alilc/lowcode-utils';
import { Setters } from '@alilc/lowcode-shell';

describe('Node 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor, shellModelFactory });
    project = designer.project;
    doc = new DocumentModel(project, formSchema);
    editor.set('setters', new Setters(new InnerSetters()));
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
    !globalContext.has('workspace') && globalContext.register(new InnerWorkspace(), 'workspace');
  });

  afterEach(() => {
    project.unload();
    designer.purge();
    editor = null;
    designer = null;
    project = null;
  });

  it('condition group', () => {});

  it('getExtraProp / setExtraProp', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    expect(firstBtn.getExtraProp('non-existing', false)).toBeNull();

    firstBtn.setExtraProp('xxx', '1111');
    expect(firstBtn.getExtraProp('xxx', false).getValue()).toBe('1111');
  });

  it('import(leaf)', () => {
    const form = doc.getNode('node_k1ow3cbo');
    form.insert({ componentName: 'Leaf', children: '111' });

    const leaf = form.getChildren().get(2);
    expect(leaf.getPropValue('children')).toBe('111');

    leaf.import({ componentName: 'Leaf', children: '222' });
    expect(leaf.getPropValue('children')).toBe('222');

    leaf.import({ componentName: 'Leaf', children: { type: 'JSExpression', value: 'state.x' } });
    expect(leaf.getPropValue('children')).toEqual({ type: 'JSExpression', value: 'state.x' });
  });

  it('hasCondition', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    firstBtn.getExtraProp('condition')?.setValue(undefined);
    expect(firstBtn.hasCondition()).toBeFalsy();

    firstBtn.getExtraProp('condition')?.setValue(null);
    expect(firstBtn.hasCondition()).toBeFalsy();

    firstBtn.getExtraProp('condition')?.setValue(true);
    expect(firstBtn.hasCondition()).toBeFalsy();

    firstBtn.getExtraProp('condition')?.setValue('');
    expect(firstBtn.hasCondition()).toBeFalsy();

    firstBtn.getExtraProp('condition')?.setValue(1);
    expect(firstBtn.hasCondition()).toBeTruthy();

    firstBtn.getExtraProp('condition')?.setValue(false);
    expect(firstBtn.hasCondition()).toBeTruthy();
  });

  it('hasLoop', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    expect(firstBtn.hasLoop()).toBeFalsy();

    // 这里必须用 add，因为 hasLoop 实现的跳过了 stash
    firstBtn.props.add([1, 2], '___loop___');
    expect(firstBtn.hasLoop()).toBeTruthy();

    firstBtn.getExtraProp('loop')?.setValue({ type: 'JSExpression', value: 'state.a' });
    expect(firstBtn.hasLoop()).toBeTruthy();

    firstBtn.getExtraProp('loop')?.setValue(1);
    expect(firstBtn.hasLoop()).toBeFalsy();
  });

  describe('getSuitablePlace', () => {
    it('root，子节点中有容器节点', () => {
      designer.createComponentMeta(pageMetadata);
      designer.createComponentMeta(rootHeaderMetadata);
      designer.createComponentMeta(rootContentMetadata);
      designer.createComponentMeta(rootFooterMetadata);

      const rootHeaderMeta = designer.getComponentMeta('RootHeader');
      set(rootHeaderMeta, 'prototype.options.canDropIn', true);

      let o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.getNode('node_k1ow3cba'),
        ref: 1,
      });

      set(rootHeaderMeta, 'prototype.options.canDropIn', () => true);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.getNode('node_k1ow3cba'),
        ref: 1,
      });
    });

    it('root，直接子节点中无容器节点，自身支持放入子节点', () => {
      designer.createComponentMeta(pageMetadata);

      let o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);

      const pageMeta = designer.getComponentMeta('Page');
      set(pageMeta, 'prototype.options.canDropIn', () => true);

      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });

      set(pageMeta, 'prototype.options.canDropIn', undefined);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });

      set(pageMeta, 'prototype.options.canDropIn', true);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });
    });

    it('root，子节点中无容器节点，自己也不支持放入子节点', () => {
      designer.createComponentMeta(pageMetadata);

      let pageMeta = designer.getComponentMeta('Page');

      pageMeta = set(pageMeta, 'prototype.options.canDropIn', () => false);
      let o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toBeNull();

      set(pageMeta, 'prototype.options.canDropIn', false);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toBeNull();
    });

    it('放入模态节点', () => {
      designer.createComponentMeta(pageMetadata);
      designer.createComponentMeta(dialogMetadata);

      const dialog = doc.createNode({ componentName: 'Dialog' });

      const o = doc.rootNode?.getSuitablePlace(dialog, 1);
      expect(o.container).toBe(doc.rootNode);
      expect(o.ref).toBe(1);
    });

    it('包含 focusNode', () => {
      const o = doc.rootNode?.getSuitablePlace(doc.rootNode);
      expect(o.container).toBe(doc.rootNode);
    });

    it.skip('非 root 节点，不能放入子节点', () => {
      designer.createComponentMeta(formMetadata);
      designer.createComponentMeta(pageMetadata);

      // form 子节点以及自身都不能放入子节点
      const formMeta = designer.getComponentMeta('Form');
      set(formMeta, 'prototype.options.canDropIn', false);

      const pageMeta = designer.getComponentMeta('Page');
      set(pageMeta, 'prototype.options.canDropIn', () => true);

      const o = doc.getNode('form')!.getSuitablePlace(doc.getNode('node_k1ow3cbj'), { index: 1 });
      expect(o).toEqual({
        container: doc.rootNode,
        ref: { index: 1 },
      });
    });

    it('非 root 节点，能放入子节点', () => {
      designer.createComponentMeta(formMetadata);
      designer.createComponentMeta(pageMetadata);

      // form 子节点以及自身都不能放入子节点
      const formMeta = designer.getComponentMeta('Form');
      set(formMeta, 'prototype.options.canDropIn', true);

      const o = doc.getNode('form')!.getSuitablePlace(doc.getNode('node_k1ow3cbj'), 1);
      expect(o).toEqual({
        container: doc.getNode('form'),
        ref: 1,
      });
    });

    it('null', () => {
      expect(
        doc.rootNode?.getSuitablePlace.call({
          contains: () => false,
          isContainer: () => false,
          isRoot: () => false,
        }),
      ).toBeNull();
    });
  });

  it('removeChild / replaceWith / replaceChild', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const form = doc.getNode('node_k1ow3cbo');

    // 不符合条件的节点直接返回
    expect(firstBtn.replaceChild(form, { componentName: 'Button', props: { x: 1 } })).toBe(form);

    firstBtn.select();
    firstBtn.parent?.replaceChild(firstBtn, { componentName: 'Button', props: { x: 1 } });

    expect(firstBtn.parent?.getChildren()?.size).toBe(2);
    expect(firstBtn.parent?.getChildren()?.get(0)?.getPropValue('x')).toBe(1);

    const secondBtn = doc.getNode('node_k1ow3cbp')!;
    secondBtn.replaceWith({ componentName: 'Button', props: { y: 1 } });
    expect(firstBtn.parent?.getChildren()?.size).toBe(2);
    expect(firstBtn.parent?.getChildren()?.get(1)?.getPropValue('y')).toBe(1);
  });

  it('schema', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const schema = firstBtn.schema;
    schema.props.size = 'large';
    firstBtn.schema = schema;

    expect(firstBtn.getPropValue('size')).toBe('large');
  });

  describe('插入相关方法', () => {
    it('insertBefore / onChildrenChange', () => {
      const firstBtn = doc.getNode('node_k1ow3cbn')!;
      const secondBtn = doc.getNode('node_k1ow3cbp')!;
      const btnParent = firstBtn.parent!;
      const mockFn = jest.fn();
      const off = btnParent.onChildrenChange(mockFn);

      // Node 实例
      btnParent.insertBefore(new Node(doc, { componentName: 'Button', props: { a: 1 } }), firstBtn);
      expect(btnParent.children.get(0)?.getProps().export().props).toEqual({ a: 1 });
      expect(mockFn).toHaveBeenCalledTimes(1);

      // TODO: 暂时不支持，后面补上
      // // NodeSchema
      // btnParent.insertBefore({ componentName: 'Button', props: { b: 1 } }, firstBtn);
      // expect(btnParent.children.get(0)?.getProps().export().props).toEqual({ b: 1 });
      // expect(mockFn).toHaveBeenCalledTimes(2);

      // // getComponentName
      // btnParent.insertBefore({ getComponentName: () => 'Button', props: { c: 1 } }, firstBtn);
      // expect(btnParent.children.get(0)?.getProps().export().props).toEqual({ c: 1 });
      // expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('insertAfter / onChildrenChange', () => {
      const firstBtn = doc.getNode('node_k1ow3cbn')!;
      const secondBtn = doc.getNode('node_k1ow3cbp')!;
      const btnParent = firstBtn.parent!;
      const mockFn = jest.fn();
      const off = btnParent.onChildrenChange(mockFn);

      // Node 实例
      btnParent.insertAfter(new Node(doc, { componentName: 'Button', props: { a: 1 } }), firstBtn);
      expect(btnParent.children.get(1)?.getProps().export().props).toEqual({ a: 1 });
      expect(mockFn).toHaveBeenCalledTimes(1);

      // NodeSchema
      btnParent.insertAfter({ componentName: 'Button', props: { b: 1 } }, firstBtn);
      expect(btnParent.children.get(1)?.getProps().export().props).toEqual({ b: 1 });
      expect(mockFn).toHaveBeenCalledTimes(2);

      // getComponentName
      btnParent.insertAfter({ getComponentName: () => 'Button' }, firstBtn);
      expect(btnParent.children.get(1)?.getProps().export().props).toEqual({});
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  it('setVisible / getVisible / onVisibleChange', () => {
    const mockFn = jest.fn();
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const off = firstBtn.onVisibleChange(mockFn);
    firstBtn.setVisible(true);
    expect(firstBtn.getVisible()).toBeTruthy();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(true);

    firstBtn.setVisible(false);

    expect(firstBtn.getVisible()).toBeFalsy();
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith(false);

    off();
    mockFn.mockClear();
    firstBtn.setVisible(true);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('RGL / getRGL', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    firstBtn.isRGLContainer = true;
    expect(firstBtn.isRGLContainer).toBeTruthy();

    const rgl = firstBtn.getRGL();
    expect(rgl.isContainerNode).toBeFalsy();
    expect(rgl.isEmptyNode).toBeTruthy();
    expect(rgl.isRGLContainerNode).toBeTruthy();
    expect(rgl.isRGLNode).toBeFalsy();
    expect(rgl.isRGL).toBeTruthy();
  });

  it('onPropChange', () => {
    const mockFn = jest.fn();
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const off = firstBtn.onPropChange(mockFn);

    firstBtn.setPropValue('x', 1);
    expect(mockFn).toHaveBeenCalledTimes(1);
    firstBtn.setPropValue('x', 2);
    expect(mockFn).toHaveBeenCalledTimes(2);

    off();
    mockFn.mockClear();
    firstBtn.setPropValue('x', 3);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('addSlot / unlinkSlot / removeSlot', () => {});

  it('setProps', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const secondBtn = doc.getNode('node_k1ow3cbp')!;

    firstBtn.setProps(secondBtn.getProps());
    expect(firstBtn.getProps()).toBe(secondBtn.getProps());
  });

  it('advanced initials / autoruns', async () => {
    designer.createComponentMeta(pageMetadata);

    const pageMeta = designer.getComponentMeta('Page');
    const autorunMockFn = jest.fn();
    set(pageMeta, '_transformedMetadata.configure.advanced.autoruns', [
      { name: 'a', autorun: autorunMockFn },
    ]);
    const initialChildrenMockFn = jest.fn();
    set(pageMeta, '_transformedMetadata.configure.advanced.initialChildren', initialChildrenMockFn);
    doc.createNode({ componentName: 'Page', props: { a: 1 } });

    expect(autorunMockFn).toHaveBeenCalled();
    expect(initialChildrenMockFn).toHaveBeenCalled();

    set(pageMeta, '_transformedMetadata.configure.advanced.initialChildren', {});
    doc.createNode({ componentName: 'Page', props: { a: 1 } });
    expect(autorunMockFn).toHaveBeenCalledTimes(2);
  });

  it('isValidComponent', () => {
    designer.createComponentMeta(divMetadata);
    expect(doc.getNode('node_k1ow3cbo')?.isValidComponent()).toBeTruthy();
    expect(doc.getNode('form')?.isValidComponent()).toBeFalsy();
  });

  it('title', () => {
    designer.createComponentMeta(btnMetadata);
    const btn = doc.getNode('node_k1ow3cbn');
    // 从 componentMeta 中获取到 title 值
    expect(btn.title).toEqual({ type: 'i18n', 'zh-CN': '按钮', 'en-US': 'Button' } );
    // 从 extraProp 中获取值
    btn.setExtraProp('title', 'hello button');
    expect(btn.title).toBe('hello button');

    // btn.props.deleteKey('___title___');
    // 从 componentMeta descriptor 指向的 key 获取 title
    // btn.setPropValue('xTitle', 'title from descriptor')
    // expect(btn.title).toBe('title from descriptor');
  });

  it('isEmpty / getIndex / getIcon', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    // expect(firstBtn.children).toBeNull();
    expect(firstBtn.isEmpty()).toBeTruthy();
    expect(firstBtn.index).toBe(0);
    expect(firstBtn.getIndex()).toBe(0);
    expect(typeof firstBtn.getIcon()).toBe('function');
    expect(doc.getNode('page')!.index).toBe(-1);
  });

  it('schema / toData / export', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    expect(firstBtn.toData().componentName).toBe('Button');
  });

  it('internalSetParent / internalSetWillPurge', () => {
    const firstChild = doc.rootNode?.getChildren()?.get(0);
    firstChild?.internalSetParent(doc.rootNode);

    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    firstBtn.internalSetWillPurge();
    // expect(firstBtn.parent).();

    expect(firstBtn.hasSlots()).toBeFalsy();
  });

  it('prevSibling / nextSibling', () => {
    // no parent
    const page = doc.getNode('page');
    expect(page?.nextSibling).toBeNull();
    expect(page?.prevSibling).toBeNull();

    // normal
    const firstBtn = doc.getNode('node_k1ow3cbn');
    const secondBtn = doc.getNode('node_k1ow3cbp');
    expect(firstBtn?.nextSibling).toBe(secondBtn);
    expect(secondBtn?.prevSibling).toBe(firstBtn);
    expect(secondBtn?.nextSibling).toBeNull();

    // index < 0
    firstBtn?.parent?.removeChild(firstBtn);
    expect(firstBtn?.nextSibling).toBeNull();
    expect(firstBtn?.prevSibling).toBeNull();
  });

  it('toString', () => {
    expect(doc.rootNode.toString()).toBe('page');
  });

  it('lock', () => {
    const form = doc.getNode('node_k1ow3cbo');
    expect(form.isLocked).toBeFalsy();
    form.lock(true);
    expect(form.isLocked).toBeTruthy();
    form.lock(false);
    expect(form.isLocked).toBeFalsy();
    form.lock();
    expect(form.isLocked).toBeTruthy();
  });

  it('didDropIn / didDropOut', () => {
    const form = doc.getNode('node_k1ow3cbo');
    designer.createComponentMeta(divMetadata);
    designer.createComponentMeta(formMetadata);
    const callbacks = form.componentMeta.advanced.callbacks;
    const fn1 = callbacks.onNodeAdd = jest.fn();
    const fn2 = callbacks.onNodeRemove = jest.fn();
    const textField = doc.getNode('node_k1ow3cc9');
    form.didDropIn(textField);
    expect(fn1).toHaveBeenCalledWith(textField.internalToShellNode(), form.internalToShellNode());

    form.didDropOut(textField);
    expect(fn2).toHaveBeenCalledWith(textField.internalToShellNode(), form.internalToShellNode());
  });

  it('hover', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    firstBtn.hover(true);
    expect(doc.designer.detecting.current).toBe(firstBtn);
    firstBtn.hover(false);
    expect(doc.designer.detecting.current).toBeNull();
    firstBtn.hover();
    expect(doc.designer.detecting.current).toBe(firstBtn);
  });

  it('getRect', () => {
    const root = doc.rootNode!;
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    expect(root.getRect()).toBeNull();
    expect(firstBtn.getRect()).toBeNull();

    doc.project.mountSimulator({
      computeRect: () => ({ x: 2, y: 2 }),
      viewport: {
        contentBounds: { x: 1, y: 1 },
      },
    });

    expect(root.getRect()).toEqual({ x: 1, y: 1 });
    expect(firstBtn.getRect()).toEqual({ x: 2, y: 2 });
  });

  it('isRootNode / isRoot / isNode', () => {
    expect(isRootNode(doc.rootNode)).toBeTruthy();
    expect(isNode(doc.rootNode)).toBeTruthy();
  });

  it('contains / comparePosition', () => {
    const page = doc.getNode('page')!;
    const content = doc.getNode('node_k1ow3cbb')!;
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const secondBtn = doc.getNode('node_k1ow3cbp')!;
    const firstCard = doc.getNode('node_k1ow3cbj')!;
    expect(contains(firstBtn, firstBtn)).toBeTruthy();
    expect(contains(firstBtn, secondBtn)).toBeFalsy();
    expect(contains(firstBtn, page)).toBeFalsy();
    expect(contains(firstBtn, content)).toBeFalsy();
    expect(contains(firstCard, firstBtn)).toBeFalsy();

    expect(comparePosition(firstBtn, secondBtn)).toBe(PositionNO.BeforeOrAfter);
    expect(firstBtn.comparePosition(firstBtn)).toBe(PositionNO.TheSame);
    expect(comparePosition(firstBtn, firstBtn)).toBe(PositionNO.TheSame);
    expect(comparePosition(firstBtn, firstBtn.parent)).toBe(PositionNO.ContainedBy);
    expect(comparePosition(firstBtn.parent, firstBtn)).toBe(PositionNO.Contains);
    expect(comparePosition(firstCard, firstBtn)).toBe(PositionNO.BeforeOrAfter);
    expect(comparePosition(firstBtn, firstCard)).toBe(PositionNO.BeforeOrAfter);
  });

  it('getZLevelTop', () => {});
  it('propsData', () => {
    expect(new Node(doc, { componentName: 'Leaf' }).propsData).toBeNull();
    expect(new Node(doc, { componentName: 'Fragment' }).propsData).toBeNull();
  });

  describe('deprecated methods', () => {
    it('setStatus / getStatus', () => {
      const root = doc.rootNode!;
      root.setStatus('xxx', true);

      root.setStatus('locking', true);
      root.setStatus('pseudo', true);
      root.setStatus('inPlaceEditing', true);

      expect(root.getStatus('locking')).toBeTruthy();
      expect(root.getStatus('pseudo')).toBeTruthy();
      expect(root.getStatus('inPlaceEditing')).toBeTruthy();
      expect(root.getStatus()).toEqual({
        locking: true,
        pseudo: true,
        inPlaceEditing: true,
      });
    });

    it('getPage', () => {
      expect(doc.rootNode?.getPage()).toBe(doc);
    });

    it('getDOMNode', () => {
      const root = doc.rootNode!;
      const firstBtn = doc.getNode('node_k1ow3cbn')!;

      doc.project.mountSimulator({
        findDOMNodes: () => [{ x: 1, y: 1 }],
        getComponentInstances: (node) => {
          if (node.componentName === 'Page') {
            return [];
          }
          return [{}];
        },
      });

      expect(root.getDOMNode()).toBeUndefined();
      expect(firstBtn.getDOMNode()).toEqual({ x: 1, y: 1 });
    });

    it('registerAddon / getAddonData', () => {
      const page = doc.getNode('page')!;
      page.registerAddon('a', () => 'prop a');
      expect(page.getAddonData('a')).toBe('prop a');
      expect(page.getAddonData('b')).toBeUndefined();

      expect(page.export().a).toBe('prop a');
    });

    it('getPrototype / setPrototype', () => {
      const page = doc.getNode('page')!;
      page.setPrototype({ a: 1 });
      expect(page.getPrototype()).toEqual({ a: 1 });
    });
  });
});
