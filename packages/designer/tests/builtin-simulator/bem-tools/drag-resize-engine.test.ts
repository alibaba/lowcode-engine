import '../../fixtures/window';
import { set } from '../../utils';
import { Editor, globalContext } from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { DocumentModel } from '../../../src/document/document-model';
import { Designer } from '../../../src/designer/designer';
import DragResizeEngine from '../../../src/builtin-simulator/bem-tools/drag-resize-engine';
import formSchema from '../../fixtures/schema/form';
import divMetadata from '../../fixtures/component-metadata/div';
import formMetadata from '../../fixtures/component-metadata/form';
import otherMeta from '../../fixtures/component-metadata/other';
import pageMetadata from '../../fixtures/component-metadata/page';
import { fireEvent, createEvent } from '@testing-library/react';
import { create } from 'lodash';

describe('DragResizeEngine 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;
  let resizeEngine: DragResizeEngine;

  beforeAll(() => {
    editor = new Editor();
    !globalContext.has(Editor) && globalContext.register(editor, Editor);
  });

  beforeEach(() => {
    designer = new Designer({ editor });
    project = designer.project;
    doc = project.createDocument(formSchema);
    doc.open();
    resizeEngine = new DragResizeEngine(designer);
  });

  afterEach(() => {
    project.unload();
    project.mountSimulator(undefined);
    designer.purge();
    resizeEngine = null;
    designer = null;
    project = null;
  });

  it('from', () => {
    const resizeStartMockFn = jest.fn();
    const resizeMockFn = jest.fn();
    const resizeEndMockFn = jest.fn();

    const offResizeStart = resizeEngine.onResizeStart(resizeStartMockFn);
    const offResize = resizeEngine.onResize(resizeMockFn);
    const offResizeEnd = resizeEngine.onResizeEnd(resizeEndMockFn);
    const boostedNode = doc.getNode('node_k1ow3cbn');
    const mockedBoostFn = jest
      .fn((e) => {
        return boostedNode;
      });

    // do nothing
    const noop = resizeEngine.from();
    noop();

    const offFrom = resizeEngine.from(document, 'e', mockedBoostFn);

    const mouseDownEvt = createEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    fireEvent(document, mouseDownEvt);

    expect(resizeStartMockFn).toHaveBeenCalledTimes(1);
    expect(resizeStartMockFn.mock.calls[0][0]).toBe(mouseDownEvt);
    expect(resizeStartMockFn.mock.calls[0][1]).toBe('e');
    expect(resizeStartMockFn.mock.calls[0][2]).toBe(boostedNode);
    expect(resizeEngine.isDragResizing()).toBeTruthy();

    const mouseMoveEvt1 = createEvent.mouseMove(document, { clientX: 108, clientY: 108 });
    fireEvent(document, mouseMoveEvt1);
    expect(resizeMockFn).toHaveBeenCalledTimes(1);
    expect(resizeMockFn.mock.calls[0][0]).toBe(mouseMoveEvt1);
    expect(resizeMockFn.mock.calls[0][1]).toBe('e');
    expect(resizeMockFn.mock.calls[0][2]).toBe(boostedNode);
    expect(resizeMockFn.mock.calls[0][3]).toBe(8);
    expect(resizeMockFn.mock.calls[0][4]).toBe(8);

    const mouseMoveEvt2 = createEvent.mouseMove(document, { clientX: 110, clientY: 110 }, 10, 10);
    fireEvent(document, mouseMoveEvt2);
    expect(resizeMockFn).toHaveBeenCalledTimes(2);
    expect(resizeMockFn.mock.calls[1][0]).toBe(mouseMoveEvt2);
    expect(resizeMockFn.mock.calls[1][1]).toBe('e');
    expect(resizeMockFn.mock.calls[1][2]).toBe(boostedNode);
    expect(resizeMockFn.mock.calls[1][3]).toBe(10);
    expect(resizeMockFn.mock.calls[1][4]).toBe(10);

    const mouseUpEvt = createEvent.mouseUp(document, { clientX: 118, clientY: 118 });
    fireEvent(document, mouseUpEvt);

    expect(resizeEndMockFn).toHaveBeenCalledTimes(1);
    expect(resizeEndMockFn.mock.calls[0][0]).toBe(mouseUpEvt);
    expect(resizeEndMockFn.mock.calls[0][1]).toBe('e');
    expect(resizeEndMockFn.mock.calls[0][2]).toBe(boostedNode);
    expect(resizeEngine.isDragResizing()).toBeFalsy();

    offResizeStart();
    offResize();
    offResizeEnd();
    resizeStartMockFn.mockClear();
    resizeMockFn.mockClear();

    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    expect(resizeMockFn).not.toHaveBeenCalled();

    offFrom();
    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    expect(resizeStartMockFn).not.toHaveBeenCalled();
  });

  it('has sensor', () => {
    const mockedDoc = document.createElement('iframe').contentWindow?.document;
    project.mountSimulator({
      sensorAvailable: true,
      contentDocument: document,
    });

    const mockedBoostFn = jest
      .fn((e) => {
        return doc.getNode('node_k1ow3cbn');
      });

    const offFrom = resizeEngine.from(document, 'e', mockedBoostFn);

    // TODO: 想办法 mock 一个 iframe.currentDocument
    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
  });
});
