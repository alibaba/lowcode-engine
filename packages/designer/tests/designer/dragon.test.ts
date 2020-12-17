import '../fixtures/window';
import { set } from '../utils';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import {
  isRootNode,
  Node,
  isNode,
  comparePosition,
  contains,
  insertChild,
  insertChildren,
  PositionNO,
} from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import {
  Dragon,
  isDragNodeObject,
  isDragNodeDataObject,
  isDragAnyObject,
  isLocateEvent,
  DragObjectType,
  isShaken,
  setShaken,
} from '../../src/designer/dragon';
import formSchema from '../fixtures/schema/form';
import divMetadata from '../fixtures/component-metadata/div';
import formMetadata from '../fixtures/component-metadata/form';
import otherMeta from '../fixtures/component-metadata/other';
import pageMetadata from '../fixtures/component-metadata/page';
import { fireEvent } from '@testing-library/react';

describe('Dragon 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;
  let dragon: Dragon;

  beforeEach(() => {
    editor = new Editor();
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
    designer = new Designer({ editor });
    project = designer.project;
    doc = project.createDocument(formSchema);
    dragon = new Dragon(designer);
  });

  afterEach(() => {
    project.unload();
    project.mountSimulator(undefined);
    designer.purge();
    editor = null;
    designer = null;
    project = null;
    dragon = null;
  });

  it.skip('drag NodeData', () => {
    const dragStartMockedFn = jest.fn();
    const dragMockedFn = jest.fn();
    const dragEndMockedFn = jest.fn();

    dragon.onDragstart((e) => {
      console.log('start', e, e.originalEvent, e.originalEvent.clientX);
    });

    dragon.onDrag((e) => {
      console.log('drag', e, e.originalEvent, e.originalEvent.clientX);
    });

    dragon.onDragend((e) => {
      console.log('end', e, e.originalEvent);
    });

    dragon.boost(
      {
        type: DragObjectType.NodeData,
        data: [{ componentName: 'Button' }],
      },
      new Event('dragstart', { clientX: 100, clientY: 100 }),
    );

    fireEvent.dragOver(document, { clientX: 108, clientY: 108 });
    fireEvent.dragEnd(document, { clientX: 118, clientY: 118 });
  });

  it.skip('drag Node', () => {
    console.log(new MouseEvent('mousedown', { clientX: 1 }).clientX);
    // console.log(new Event('mousedown', { clientX: 1 }).clientX);
    // console.log(new Event('drag', { clientX: 1 }).clientX);
    // console.log(new CustomEvent('drag', { clientX: 1 }).clientX);
    console.log(document.createEvent('dragstart', { clientX: 1 }).clientX);
  });

  it('mouse NodeData', () => {
    const dragStartMockedFn = jest.fn();
    const dragMockedFn = jest.fn();
    const dragEndMockedFn = jest.fn();

    const offDragStart = dragon.onDragstart(dragStartMockedFn);

    const offDrag = dragon.onDrag(dragMockedFn);

    const offDragEnd = dragon.onDragend(dragEndMockedFn);

    dragon.boost(
      {
        type: DragObjectType.NodeData,
        data: [{ componentName: 'Button' }],
      },
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
    );

    fireEvent.mouseMove(document, { clientX: 108, clientY: 108 });
    fireEvent.mouseMove(document, { clientX: 110, clientY: 110 });
    fireEvent.mouseUp(document, { clientX: 118, clientY: 118 });

    expect(dragStartMockedFn).toHaveBeenCalledTimes(1);
    expect(dragMockedFn).toHaveBeenCalledTimes(2);
    expect(dragEndMockedFn).toHaveBeenCalledTimes(1);
  });

  it('mouse Node', () => {
    const dragStartMockedFn = jest.fn();
    const dragMockedFn = jest.fn();
    const dragEndMockedFn = jest.fn();

    const offDragStart = dragon.onDragstart(dragStartMockedFn);
    const offDrag = dragon.onDrag(dragMockedFn);
    const offDragEnd = dragon.onDragend(dragEndMockedFn);

    dragon.boost(
      {
        type: DragObjectType.Node,
        nodes: [doc.getNode('node_k1ow3cbn')],
      },
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
    );

    // mouseDown 模式正常不会触发 dragStart 事件，除非 shaken 型
    expect(dragStartMockedFn).not.toHaveBeenCalled();

    fireEvent.mouseMove(document, { clientX: 108, clientY: 108 });
    expect(dragStartMockedFn).toHaveBeenCalledTimes(1);
    expect(dragMockedFn).toHaveBeenCalledTimes(1);
    fireEvent.mouseMove(document, { clientX: 110, clientY: 110 });
    expect(dragMockedFn).toHaveBeenCalledTimes(2);
    expect(dragon.dragging).toBeTruthy();

    fireEvent.mouseUp(document, { clientX: 118, clientY: 118 });

    expect(dragEndMockedFn).toHaveBeenCalledTimes(1);

    offDragStart();
    offDrag();
    offDragEnd();
    dragMockedFn.mockClear();

    dragon.boost(
      {
        type: DragObjectType.Node,
        nodes: [doc.getNode('node_k1ow3cbn')],
      },
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
    );

    fireEvent.mouseMove(document, { clientX: 108, clientY: 108 });

    expect(dragMockedFn).not.toHaveBeenCalled();
  });

  it('mouse Node & esc', () => {
    const dragStartMockedFn = jest.fn();
    const dragMockedFn = jest.fn();
    const dragEndMockedFn = jest.fn();

    const offDragStart = dragon.onDragstart(dragStartMockedFn);
    const offDrag = dragon.onDrag(dragMockedFn);
    const offDragEnd = dragon.onDragend(dragEndMockedFn);

    dragon.boost(
      {
        type: DragObjectType.Node,
        nodes: [doc.getNode('node_k1ow3cbn')],
      },
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
    );

    fireEvent.keyDown(document, { keyCode: 27 });
    expect(dragon.designer.dropLocation).toBeUndefined();
  });

  it('mouse Node & copy', () => {
    const dragStartMockedFn = jest.fn();
    const dragMockedFn = jest.fn();
    const dragEndMockedFn = jest.fn();

    const offDragStart = dragon.onDragstart(dragStartMockedFn);
    const offDrag = dragon.onDrag(dragMockedFn);
    const offDragEnd = dragon.onDragend(dragEndMockedFn);

    dragon.boost(
      {
        type: DragObjectType.Node,
        nodes: [doc.getNode('node_k1ow3cbn')],
      },
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
    );

    const mockedFn1 = jest.fn();
    project.mountSimulator({ setCopyState: mockedFn1 });
    expect(dragon.getSimulators().size).toBe(1);
    fireEvent.keyDown(document, { ctrlKey: true });
    expect(mockedFn1).toHaveBeenCalled();
  });

  it('from', () => {
    const dragStartMockedFn = jest.fn();
    const dragMockedFn = jest.fn();
    const dragEndMockedFn = jest.fn();

    const offDragStart = dragon.onDragstart(dragStartMockedFn);
    const offDrag = dragon.onDrag(dragMockedFn);
    const offDragEnd = dragon.onDragend(dragEndMockedFn);
    const mockedBoostFn = jest
      .fn((e) => {
        return {
          type: DragObjectType.Node,
          nodes: [doc.getNode('node_k1ow3cbn')],
        };
      })
      .mockImplementationOnce(() => null);

    const offFrom = dragon.from(document, mockedBoostFn);

    // 无用 mouseDown，无效的按钮
    fireEvent.mouseDown(document, { button: 2 });
    expect(dragStartMockedFn).not.toHaveBeenCalled();

    // 无用 mouseDown，无效的 dragObject
    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    expect(dragStartMockedFn).not.toHaveBeenCalled();

    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    expect(dragStartMockedFn).not.toHaveBeenCalled();

    fireEvent.mouseMove(document, { clientX: 108, clientY: 108 });
    expect(dragStartMockedFn).toHaveBeenCalledTimes(1);
    expect(dragMockedFn).toHaveBeenCalledTimes(1);
    fireEvent.mouseMove(document, { clientX: 110, clientY: 110 });
    expect(dragMockedFn).toHaveBeenCalledTimes(2);
    expect(dragon.dragging).toBeTruthy();

    fireEvent.mouseUp(document, { clientX: 118, clientY: 118 });

    expect(dragEndMockedFn).toHaveBeenCalledTimes(1);

    offDragStart();
    offDrag();
    offDragEnd();
    dragMockedFn.mockClear();

    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    expect(dragMockedFn).not.toHaveBeenCalled();

    offFrom();
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    expect(dragMockedFn).not.toHaveBeenCalled();
  });

  it('addSensor / removeSensor', () => {
    const sensor = {};
    dragon.addSensor(sensor);
    expect(dragon.sensors.length).toBe(1);
    dragon.removeSensor(sensor);
    expect(dragon.sensors.length).toBe(0);
  });

  it('has sensor', () => {
    const mockedFn1 = jest.fn();
    const mockedDoc = document.createElement('iframe').contentWindow?.document;
    dragon.addSensor({
      fixEvent: () => {},
      locate: () => {},
      contentDocument: mockedDoc,
    });
    project.mountSimulator({
      setCopyState: mockedFn1,
      setNativeSelection: () => {},
      clearState: () => {},
      setDraggingState: () => {},
    });

    const mockedBoostFn = jest
      .fn((e) => {
        return {
          type: DragObjectType.Node,
          nodes: [doc.getNode('node_k1ow3cbn')],
        };
      })
      .mockImplementationOnce(() => null);

    const offFrom = dragon.from(document, mockedBoostFn);

    // TODO: 想办法 mock 一个 iframe.currentDocument
    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
  });
});

describe('导出的其他函数', () => {
  it('isDragNodeObject', () => {
    expect(isDragNodeObject({ type: DragObjectType.Node, nodes: [] })).toBeTruthy();
  });
  it('isDragNodeDataObject', () => {
    expect(isDragNodeDataObject({ type: DragObjectType.NodeData, data: [] })).toBeTruthy();
  });
  it('isDragAnyObject', () => {
    expect(isDragAnyObject()).toBeFalsy();
    expect(isDragAnyObject({ type: DragObjectType.Node, nodes: [] })).toBeFalsy();
    expect(isDragAnyObject({ type: DragObjectType.NodeData, data: [] })).toBeFalsy();
    expect(isDragAnyObject({ type: 'others', data: [] })).toBeTruthy();
  });
  it('isLocateEvent', () => {
    expect(isLocateEvent({ type: 'LocateEvent' })).toBeTruthy();
  });
  it('isShaken', () => {
    expect(
      isShaken(
        { clientX: 1, clientY: 1, target: {} },
        { clientX: 1, clientY: 1, target: { other: 1 } },
      ),
    ).toBeTruthy();
    expect(isShaken({ shaken: true })).toBeTruthy();
    expect(isShaken({ clientX: 1, clientY: 1 }, { clientX: 2, clientY: 2 })).toBeFalsy();
    expect(isShaken({ clientX: 1, clientY: 1 }, { clientX: 3, clientY: 5 })).toBeTruthy();
  });
  it('setShaken', () => {
    const e = {};
    setShaken(e);
    expect(isShaken(e)).toBeTruthy();
  });
});
