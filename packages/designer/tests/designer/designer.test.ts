import '../fixtures/window';
import { Editor, globalContext, Setters } from '@alilc/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import { Designer } from '../../src/designer/designer';
import { Dragon } from '../../src/designer/dragon';
// import { TransformStage } from '../../src/document/node/transform-stage';
import formSchema from '../fixtures/schema/form';
import buttonMetadata from '../fixtures/component-metadata/button';
import pageMetadata from '../fixtures/component-metadata/page';
import divMetadata from '../fixtures/component-metadata/div';
import { delayObxTick } from '../utils';
import { fireEvent } from '@testing-library/react';
import { IPublicEnumDragObjectType, IPublicEnumTransformStage } from '@alilc/lowcode-types';
import { shellModelFactory } from '../../../engine/src/modules/shell-model-factory';

const mockNode = {
  internalToShellNode() {
    return 'mockNode';
  },
};

describe('Designer 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;
  let dragon: Dragon;

  beforeAll(() => {
    editor = new Editor();
    const setters = new Setters();
    editor.set('setters', setters);
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
  });

  beforeEach(() => {
    designer = new Designer({ editor, shellModelFactory });
    project = designer.project;
    doc = project.createDocument(formSchema);
    dragon = new Dragon(designer);
  });

  afterEach(() => {
    project.unload();
    project.mountSimulator(undefined);
    designer.purge();
    designer = null;
    project = null;
    dragon = null;
  });

  describe('onDragstart / onDrag / onDragend', () => {
    it('IPublicEnumDragObjectType.Node', () => {
      const dragStartMockFn = jest.fn();
      const dragMockFn = jest.fn();
      const dragEndMockFn = jest.fn();
      const dragStartMockFn2 = jest.fn();
      const dragMockFn2 = jest.fn();
      const dragEndMockFn2 = jest.fn();

      const designer = new Designer({
        editor,
        shellModelFactory,
        onDragstart: dragStartMockFn,
        onDrag: dragMockFn,
        onDragend: dragEndMockFn,
      });
      editor.on('designer.dragstart', dragStartMockFn2);
      editor.on('designer.drag', dragMockFn2);
      editor.on('designer.dragend', dragEndMockFn2);
      const { dragon } = designer;

      dragon.boost(
        {
          type: IPublicEnumDragObjectType.Node,
          nodes: [doc.getNode('node_k1ow3cbn')],
        },
        new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
      );

      fireEvent.mouseMove(document, { clientX: 108, clientY: 108 });
      expect(dragStartMockFn).toHaveBeenCalledTimes(1);
      expect(dragStartMockFn2).toHaveBeenCalledTimes(1);
      expect(dragMockFn).toHaveBeenCalledTimes(1);
      expect(dragMockFn2).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(document, { clientX: 110, clientY: 110 });
      expect(dragMockFn).toHaveBeenCalledTimes(2);
      expect(dragMockFn2).toHaveBeenCalledTimes(2);

      setMockDropLocation();
      fireEvent.mouseUp(document, { clientX: 118, clientY: 118 });

      expect(dragEndMockFn).toHaveBeenCalledTimes(1);
      expect(dragEndMockFn2).toHaveBeenCalledTimes(1);

      function setMockDropLocation() {
        const mockTarget = {
          document: doc,
          children: {
            get(x) {
              return x;
            },
            insert() {},
            internalInsert() {},
          },
        };
        const mockDetail = { type: 'Children', index: 1, near: { node: { x: 1 } } };
        const mockSource = {};
        const mockEvent = { type: 'LocateEvent', nodes: [] };

        return designer.createLocation({
          target: mockTarget,
          detail: mockDetail,
          source: mockSource,
          event: mockEvent,
        });
      }
    });

    it('IPublicEnumDragObjectType.NodeData', () => {
      const dragStartMockFn = jest.fn();
      const dragMockFn = jest.fn();
      const dragEndMockFn = jest.fn();
      const dragStartMockFn2 = jest.fn();
      const dragMockFn2 = jest.fn();
      const dragEndMockFn2 = jest.fn();

      const designer = new Designer({
        editor,
        shellModelFactory,
        onDragstart: dragStartMockFn,
        onDrag: dragMockFn,
        onDragend: dragEndMockFn,
      });
      editor.on('designer.dragstart', dragStartMockFn2);
      editor.on('designer.drag', dragMockFn2);
      editor.on('designer.dragend', dragEndMockFn2);
      const { dragon } = designer;

      dragon.boost(
        {
          type: IPublicEnumDragObjectType.NodeData,
          data: [{
            componentName: 'Button',
          }],
        },
        new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
      );

      fireEvent.mouseMove(document, { clientX: 108, clientY: 108 });
      expect(dragStartMockFn).toHaveBeenCalledTimes(1);
      expect(dragStartMockFn2).toHaveBeenCalledTimes(1);
      expect(dragMockFn).toHaveBeenCalledTimes(1);
      expect(dragMockFn2).toHaveBeenCalledTimes(1);

      fireEvent.mouseMove(document, { clientX: 110, clientY: 110 });
      expect(dragMockFn).toHaveBeenCalledTimes(2);
      expect(dragMockFn2).toHaveBeenCalledTimes(2);

      setMockDropLocation();
      fireEvent.mouseUp(document, { clientX: 118, clientY: 118 });

      expect(dragEndMockFn).toHaveBeenCalledTimes(1);
      expect(dragEndMockFn2).toHaveBeenCalledTimes(1);

      function setMockDropLocation() {
        const mockTarget = {
          document: doc,
          children: {
            get(x) {
              return x;
            },
            insert() {},
            internalInsert() {},
          },
        };
        const mockDetail = { type: 'Children', index: 1, near: { node: { x: 1 } } };
        const mockSource = {};
        const mockEvent = { type: 'LocateEvent', nodes: [] };

        return designer.createLocation({
          target: mockTarget,
          detail: mockDetail,
          source: mockSource,
          event: mockEvent,
        });
      }
    });
  });

  it('addPropsReducer / transformProps', () => {
    // 没有相应的 reducer
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Init)).toEqual({ num: 1 });
    // props 是数组
    expect(designer.transformProps([{ num: 1 }], mockNode, IPublicEnumTransformStage.Init)).toEqual([{ num: 1 }]);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Init);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Init);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Clone);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Serilize);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Render);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Save);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, IPublicEnumTransformStage.Upgrade);

    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Init)).toEqual({ num: 3 });
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Clone)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Serilize)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Render)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Save)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Upgrade)).toEqual({ num: 2 });

    designer.addPropsReducer((props, node) => {
      throw new Error('calculate error');
    }, IPublicEnumTransformStage.Upgrade);
    expect(designer.transformProps({ num: 1 }, mockNode, IPublicEnumTransformStage.Upgrade)).toEqual({ num: 2 });
  });

  it('setProps', () => {
    // 第一次设置 props
    const initialProps = {
      simulatorComponent: { isSimulatorComp: true },
      simulatorProps: { designMode: 'design' },
      suspensed: true,
      componentMetadatas: [buttonMetadata, divMetadata],
    };
    designer = new Designer({
      editor,
      shellModelFactory,
      ...initialProps,
     });

    expect(designer.simulatorComponent).toEqual({ isSimulatorComp: true });
    expect(designer.simulatorProps).toEqual({ designMode: 'design' });
    expect(designer.suspensed).toBeTruthy();
    expect((designer as any)._componentMetasMap.has('Div')).toBeTruthy();
    expect((designer as any)._componentMetasMap.has('Button')).toBeTruthy();
    const { editor: editorFromDesigner, shellModelFactory: shellModelFactoryFromDesigner, ...others } = (designer as any).props;
    expect(others).toEqual(initialProps);
    expect(designer.get('simulatorProps')).toEqual({ designMode: 'design' });
    expect(designer.get('suspensed')).toBeTruthy();
    expect(designer.get('xxx')).toBeUndefined();

    // 第二次设置 props
    const updatedProps = {
      simulatorComponent: { isSimulatorComp2: true },
      simulatorProps: { designMode: 'live' },
      suspensed: false,
      componentMetadatas: [buttonMetadata],
    };
    designer.setProps(updatedProps);

    expect(designer.simulatorComponent).toEqual({ isSimulatorComp2: true });
    expect(designer.simulatorProps).toEqual({ designMode: 'live' });
    expect(designer.suspensed).toBeFalsy();
    expect((designer as any)._componentMetasMap.has('Button')).toBeTruthy();
    expect((designer as any)._componentMetasMap.has('Div')).toBeTruthy();
    const { editor: editorFromDesigner2, shellModelFactory: shellModelFactoryFromDesigner2,  ...others2 } = (designer as any).props;
    expect(others2).toEqual(updatedProps);

    // 第三次设置 props，跟第二次值一样，for 覆盖率测试
    const updatedProps2 = updatedProps;
    designer.setProps(updatedProps2);

    expect(designer.simulatorComponent).toEqual({ isSimulatorComp2: true });
    expect(designer.simulatorProps).toEqual({ designMode: 'live' });
    expect(designer.suspensed).toBeFalsy();
    expect((designer as any)._componentMetasMap.has('Button')).toBeTruthy();
    expect((designer as any)._componentMetasMap.has('Div')).toBeTruthy();
    const { editor: editorFromDesigner3, shellModelFactory: shellModelFactoryFromDesigner3, ...others3 } = (designer as any).props;
    expect(others3).toEqual(updatedProps);
  });

  describe('getSuitableInsertion', () => {
    it('没有 currentDocument', () => {
      project.unload();
      expect(designer.getSuitableInsertion({})).toBeNull();
    });

    it('有选中节点，isContainer && 允许放子节点', () => {
      designer.createComponentMeta(divMetadata);
      designer.createComponentMeta(buttonMetadata);
      designer.currentSelection?.select('node_k1ow3cbo');
      const { target, index } = designer.getSuitableInsertion(
        doc.createNode({ componentName: 'Button' }),
      );
      expect(target).toBe(doc.getNode('node_k1ow3cbo'));
      expect(index).toBeUndefined();
    });

    it('有选中节点，不是 isContainer', () => {
      designer.createComponentMeta(divMetadata);
      designer.createComponentMeta(buttonMetadata);
      designer.currentSelection?.select('node_k1ow3cbn');
      const { target, index } = designer.getSuitableInsertion(
        doc.createNode({ componentName: 'Button' }),
      );
      expect(target).toBe(doc.getNode('node_k1ow3cbo'));
      expect(index).toBe(1);
    });

    it('无选中节点', () => {
      designer.createComponentMeta(pageMetadata);
      const { target, index } = designer.getSuitableInsertion(
        doc.createNode({ componentName: 'Button' }),
      );
      expect(target).toBe(doc.getNode('page'));
      expect(index).toBeUndefined();
    });
  });

  it('getComponentMetasMap', () => {
    designer.createComponentMeta({
      componentName: 'Div',
      title: '容器',
      docUrl: 'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
      devMode: 'procode',
      tags: ['布局'],
    });

    expect(designer.getComponentMetasMap().get('Div')).not.toBeUndefined();
  });

  it('refreshComponentMetasMap', () => {
    designer.createComponentMeta({
      componentName: 'Div',
      title: '容器',
      docUrl: 'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
      devMode: 'procode',
      tags: ['布局'],
    });

    const originalMetasMap = designer.getComponentMetasMap();
    designer.refreshComponentMetasMap();

    expect(originalMetasMap).not.toBe(designer.getComponentMetasMap());
  });

  describe('loadIncrementalAssets', () => {
    it('components && packages', async () => {
      editor.set('assets', { components: [], packages: [] });
      const fn = jest.fn();

      project.mountSimulator({
        setupComponents: fn,
      });
      await designer.loadIncrementalAssets({
        components: [{
          componentName: 'Div2',
          title: '容器',
          docUrl: 'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
          devMode: 'proCode',
          tags: ['布局'],
        }],
        packages: [],
      });

      const comps = editor.get('assets').components;
      expect(comps).toHaveLength(1);
      expect(fn).toHaveBeenCalled();
    });

    it('no components && packages', async () => {
      editor.set('assets', { components: [], packages: [] });
      const fn = jest.fn();

      project.mountSimulator({
        setupComponents: fn,
      });
      await designer.loadIncrementalAssets({});

      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('createLocation / clearLocation', () => {
    const mockTarget = {
      document: doc,
      children: {
        get(x) {
          return x;
        },
        insert() {},
        internalInsert() {},
      },
    };
    const mockDetail = { type: 'Children', index: 1, near: { node: { x: 1 } } };
    const mockSource = {};
    const mockEvent = { type: 'LocateEvent', nodes: [] };

    const loc = designer.createLocation({
      target: mockTarget,
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    expect(designer.dropLocation).toBe(loc);

    const doc2 = project.createDocument({ componentName: 'Page' });
    designer.createLocation({
      target: {
        document: doc2,
        children: {
          get(x) {
            return x;
          },
          insert() {},
          internalInsert() {},
        },
      },
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    designer.clearLocation();
    expect(designer.dropLocation).toBeUndefined();
  });

  it('autorun', async () => {
    const mockFn = jest.fn();
    designer.autorun(() => {
      mockFn();
    }, true);

    await delayObxTick();

    expect(mockFn).toHaveBeenCalled();
  });

  it('suspensed', () => {
    designer.suspensed = true;
    expect(designer.suspensed).toBeTruthy();
    designer.suspensed = false;
    expect(designer.suspensed).toBeFalsy();
  });

  it('schema', () => {
    // TODO: matchSnapshot
    designer.schema;
    designer.setSchema({
      componentsTree: [
        {
          componentName: 'Page',
          props: {},
        },
      ],
    });
  });

  it('createOffsetObserver / clearOobxList / touchOffsetObserver', () => {
    project.mountSimulator({
      computeComponentInstanceRect() {},
    });
    designer.createOffsetObserver({ node: doc.getNode('page'), instance: {} });
    expect(designer.oobxList).toHaveLength(1);
    designer.createOffsetObserver({ node: doc.getNode('page'), instance: {} });
    expect(designer.oobxList).toHaveLength(2);

    designer.clearOobxList(true);
    expect(designer.oobxList).toHaveLength(0);

    const obx = designer.createOffsetObserver({ node: doc.getNode('page'), instance: {} });
    obx.pid = 'xxx';
    obx.compute = () => {};
    expect(designer.oobxList).toHaveLength(1);

    designer.touchOffsetObserver();
    expect(designer.oobxList).toHaveLength(1);
  });
});
