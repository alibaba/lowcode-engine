import '../fixtures/window';
import { Editor, globalContext } from '@alilc/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import { Designer } from '../../src/designer/designer';
import { Dragon, DragObjectType } from '../../src/designer/dragon';
import { TransformStage } from '../../src/document/node/transform-stage';
import formSchema from '../fixtures/schema/form';
import buttonMetadata from '../fixtures/component-metadata/button';
import pageMetadata from '../fixtures/component-metadata/page';
import divMetadata from '../fixtures/component-metadata/div';
import { delayObxTick } from '../utils';
import { fireEvent } from '@testing-library/react';

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
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
  });

  beforeEach(() => {
    designer = new Designer({ editor });
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
    it('DragObjectType.Node', () => {
      const dragStartMockFn = jest.fn();
      const dragMockFn = jest.fn();
      const dragEndMockFn = jest.fn();
      const dragStartMockFn2 = jest.fn();
      const dragMockFn2 = jest.fn();
      const dragEndMockFn2 = jest.fn();

      const designer = new Designer({
        editor,
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
          type: DragObjectType.Node,
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

    it('DragObjectType.NodeData', () => {
      const dragStartMockFn = jest.fn();
      const dragMockFn = jest.fn();
      const dragEndMockFn = jest.fn();
      const dragStartMockFn2 = jest.fn();
      const dragMockFn2 = jest.fn();
      const dragEndMockFn2 = jest.fn();

      const designer = new Designer({
        editor,
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
          type: DragObjectType.NodeData,
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
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Init)).toEqual({ num: 1 });
    // props 是数组
    expect(designer.transformProps([{ num: 1 }], mockNode, TransformStage.Init)).toEqual([{ num: 1 }]);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Init);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Init);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Clone);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Serilize);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Render);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Save);

    designer.addPropsReducer((props, node) => {
      props.num += 1;
      return props;
    }, TransformStage.Upgrade);

    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Init)).toEqual({ num: 3 });
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Clone)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Serilize)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Render)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Save)).toEqual({ num: 2 });
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Upgrade)).toEqual({ num: 2 });

    designer.addPropsReducer((props, node) => {
      throw new Error('calculate error');
    }, TransformStage.Upgrade);
    expect(designer.transformProps({ num: 1 }, mockNode, TransformStage.Upgrade)).toEqual({ num: 2 });
  });

  it('setProps', () => {
    // 第一次设置 props
    const initialProps = {
      simulatorComponent: { isSimulatorComp: true },
      simulatorProps: { designMode: 'design' },
      suspensed: true,
      componentMetadatas: [buttonMetadata, divMetadata],
    };
    designer = new Designer({ editor, ...initialProps });

    expect(designer.simulatorComponent).toEqual({ isSimulatorComp: true });
    expect(designer.simulatorProps).toEqual({ designMode: 'design' });
    expect(designer.suspensed).toBeTruthy();
    expect(designer._componentMetasMap.has('Div')).toBeTruthy();
    expect(designer._componentMetasMap.has('Button')).toBeTruthy();
    const { editor: editorFromDesigner, ...others } = designer.props;
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
    expect(designer._componentMetasMap.has('Button')).toBeTruthy();
    expect(designer._componentMetasMap.has('Div')).toBeTruthy();
    const { editor: editorFromDesigner2, ...others2 } = designer.props;
    expect(others2).toEqual(updatedProps);
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

  it('createLocation / clearLocation', () => {
    const mockTarget = {
      document: doc,
      children: {
        get(x) {
          return x;
        },
        insert() {},
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
