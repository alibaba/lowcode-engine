import '../fixtures/window';
import { getMockWindow, getMockElement, delay } from '../utils';
import { Editor, globalContext } from '@alilc/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import Viewport from '../../src/builtin-simulator/viewport';
import { Designer } from '../../src/designer/designer';
import { shellModelFactory } from '../../../engine/src/modules/shell-model-factory';


describe('Viewport 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;
  let viewport: Viewport;
  let viewportElem;

  beforeAll(() => {
    editor = new Editor();
    !globalContext.has(Editor) && globalContext.register(editor, Editor);

    window.DOMRect = class {
      constructor(top, left, width, height) {
        return { top, left, width, height };
      }
    };
  });

  beforeEach(() => {
    designer = new Designer({ editor, shellModelFactory });
    project = designer.project;
    // doc = project.createDocument(formSchema);
  });

  afterEach(() => {
    project.unload();
    // project.mountSimulator(undefined);
    designer.purge();
    designer = null;
    project = null;
    viewport = null;
  });

  it('基本函数测试', async () => {
    const rect = {
      width: 500,
      height: 500,
      top: 100,
      bottom: 500,
      left: 100,
      right: 500,
    };
    viewportElem = getMockElement('div', rect);
    viewport = new Viewport();
    viewport.mount();
    expect(viewport.viewportElement).toBeUndefined();
    expect(viewport.width).toBe(1000);
    expect(viewport.height).toBe(600);
    expect(viewport.toGlobalPoint({ left: 0, top: 0 })).toEqual({ left: 0, top: 0 });
    expect(viewport.toLocalPoint({ left: 0, top: 0 })).toEqual({ left: 0, top: 0 });

    viewport.mount(viewportElem);
    expect(viewport.viewportElement).toBe(viewportElem);

    expect(viewport.bounds).toEqual(rect);
    expect(viewport.contentBounds).toEqual({ top: 0, left: 0, width: 500, height: 500 });
    expect(viewport.rect).toEqual(rect);

    expect(viewport.width).toBe(500);
    expect(viewport.contentWidth).toBe('100%');
    expect(viewport.height).toBe(500);
    expect(viewport.contentHeight).toBe('100%');

    await delay(100);
    viewportElem.setWidth(300);
    viewport.width = 300;
    expect(viewport.width).toBe(300);

    await delay(100);
    viewportElem.setHeight(300);
    viewport.height = 300;
    expect(viewport.height).toBe(300);

    viewport.contentWidth = 200;
    expect(viewport.contentWidth).toBe(200);

    viewport.contentHeight = 200;
    expect(viewport.contentHeight).toBe(200);
  });

  it('scale', () => {
    const rect = {
      width: 500,
      height: 500,
      top: 100,
      bottom: 500,
      left: 100,
      right: 500,
    };
    viewportElem = getMockElement('div', rect);
    viewport = new Viewport();
    viewport.mount(viewportElem);

    expect(viewport.scale).toBe(1);
    viewport.scale = 2;
    expect(viewport.scale).toBe(2);

    expect(viewport.contentWidth).toBe(500 / 2);
    expect(viewport.contentHeight).toBe(500 / 2);

    viewport.width = 300;
    viewportElem.setWidth(300);
    expect(viewport.contentWidth).toBe(300 / 2);

    viewport.height = 300;
    viewportElem.setHeight(300);
    expect(viewport.contentHeight).toBe(300 / 2);

    expect(() => { viewport.scale = NaN; }).toThrow();
    expect(() => { viewport.scale = -1; }).toThrow();
  });

  it('setScrollTarget / scrollTarget / scrolling', async () => {
    const rect = {
      width: 500,
      height: 500,
      top: 100,
      bottom: 500,
      left: 100,
      right: 500,
    };
    viewportElem = getMockElement('div', rect);
    viewport = new Viewport();
    viewport.mount(viewportElem);

    const mockWindow = getMockWindow();
    viewport.setScrollTarget(mockWindow);
    // TODO: 待 mock
    viewport.scrollTarget;
    // expect(viewport.scrollTarget).toBe(mockWindow);

    // mock scrollTarget
    // viewport._scrollTarget = { left: 0, top: 0 };
    // viewport._scrollTarget.left = 123;
    // viewport._scrollTarget.top = 1234;
    mockWindow.triggerEventListener('scroll');
    expect(viewport.scrolling).toBeTruthy();
    // TODO: 待 mock
    viewport.scrollX;
    viewport.scrollY;
    // expect(viewport.scrollX).toBe(123);
    // expect(viewport.scrollY).toBe(1234);
    await delay(100);
    expect(viewport.scrolling).toBeFalsy();

    mockWindow.triggerEventListener('resize');
  });

  it('toGlobalPoint / toLocalPoint', () => {
    const rect = {
      width: 500,
      height: 500,
      top: 100,
      bottom: 500,
      left: 100,
      right: 500,
    };
    viewportElem = getMockElement('div', rect);
    viewport = new Viewport();
    viewport.mount(viewportElem);

    expect(viewport.toGlobalPoint({ clientX: 100, clientY: 100 })).toEqual({ clientX: 200, clientY: 200 });
    expect(viewport.toLocalPoint({ clientX: 200, clientY: 200 })).toEqual({ clientX: 100, clientY: 100 });

    viewport.scale = 2;
    expect(viewport.toGlobalPoint({ clientX: 100, clientY: 100 })).toEqual({ clientX: 300, clientY: 300 });
    expect(viewport.toLocalPoint({ clientX: 300, clientY: 300 })).toEqual({ clientX: 100, clientY: 100 });
  });
});
