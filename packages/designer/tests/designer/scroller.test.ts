import '../fixtures/window';
import { set } from '../utils';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import { ScrollTarget, Scroller } from '../../src/designer/scroller';
import {
  isRootNode,
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

describe('Scroller 测试', () => {
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

  function getMockWindow() {
    let scrollX = 0;
    let scrollY = 0;
    const mockWindow = {
      scrollTo(x, y) {
        if (typeof x === 'number') {
          scrollX = x;
          scrollY = y;
        } else {
          scrollX = x.left;
          scrollY = x.top;
        }
      },
      get scrollX() { return scrollX; },
      get scrollY() { return scrollY; },
      scrollHeight: 1000,
      scrollWidth: 500,
      document: {},
      nodeType: Node.ELEMENT_NODE,
    }
    return mockWindow;
  }

  describe('ScrollTarget 测试', () => {
    it('constructor', () => {
      const win = getMockWindow();
      const target = new ScrollTarget(win);
      expect(target.scrollWidth).toBe(500);
      expect(target.scrollHeight).toBe(1000);
      target.scrollToXY(50, 50);
      expect(target.left).toBe(50);
      expect(target.top).toBe(50);

      target.scrollTo({ left: 100, top: 100 });
      expect(target.left).toBe(100);
      expect(target.top).toBe(100);
      console.log(target.left, target.top, target.scrollHeight, target.scrollWidth);
    });

  });

  function mockRAF() {
    let rafCount = 0;
    window.requestAnimationFrame = (fn) => {
      if (rafCount++ < 2) {
        fn();
      } else {
        window.requestAnimationFrame = () => {};
      }
    };
  }
  describe('Scroller 测试', () => {
    it('scrollTarget: ScrollTarget', () => {
      const win = getMockWindow();
      const scrollTarget = new ScrollTarget(win);
      const scroller = new Scroller({ scrollTarget, bounds: { width: 50, height: 50, top: 50, bottom: 50, left: 50, right: 50 } });
      mockRAF();
      scroller.scrollTo({ left: 50, top: 50 });

      mockRAF();
      scroller.scrolling({ globalX: 100, globalY: 100 });
    })

    it('scrollTarget: ScrollTarget, same left / top', () => {
      const win = getMockWindow();
      const scrollTarget = new ScrollTarget(win);
      const scroller = new Scroller({ scrollTarget, bounds: { width: 50, height: 50, top: 50, bottom: 50, left: 50, right: 50 } });
      mockRAF();
      scrollTarget.scrollTo({ left: 50, top: 50 });
      scroller.scrollTo({ left: 50, top: 50 });

      mockRAF();
      scroller.scrolling({ globalX: 100, globalY: 100 });
    })

    it('scrollTarget: Element', () => {
      const win = getMockWindow();
      // const scrollTarget = new ScrollTarget(win);
      const scroller = new Scroller({ scrollTarget: win, bounds: { width: 50, height: 50, top: 50, bottom: 50, left: 50, right: 50 } });
      mockRAF();
      scroller.scrollTo({ left: 50, top: 50 });

      mockRAF();
      scroller.scrolling({ globalX: 100, globalY: 100 });
    })

    it('scrollTarget: null', () => {
      const win = getMockWindow();
      // const scrollTarget = new ScrollTarget(win);
      const scroller = new Scroller({ scrollTarget: null, bounds: { width: 50, height: 50, top: 50, bottom: 50, left: 50, right: 50 } });
      mockRAF();
      scroller.scrollTo({ left: 50, top: 50 });

      mockRAF();
      scroller.scrolling({ globalX: 100, globalY: 100 });
    })
  });
});
