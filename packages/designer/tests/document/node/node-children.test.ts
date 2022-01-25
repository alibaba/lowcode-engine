import '../../fixtures/window';
import { set, delayObxTick, delay } from '../../utils';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { DocumentModel } from '../../../src/document/document-model';
import {
  isRootNode,
  Node,
  isNode,
  comparePosition,
  contains,
  insertChild,
  insertChildren,
  PositionNO,
} from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import divMetadata from '../../fixtures/component-metadata/div';
import buttonMetadata from '../../fixtures/component-metadata/button';
import formMetadata from '../../fixtures/component-metadata/form';
import otherMeta from '../../fixtures/component-metadata/other';
import pageMetadata from '../../fixtures/component-metadata/page';
import rootHeaderMetadata from '../../fixtures/component-metadata/root-header';
import rootContentMetadata from '../../fixtures/component-metadata/root-content';
import rootFooterMetadata from '../../fixtures/component-metadata/root-footer';


describe('NodeChildren 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor });
    project = designer.project;
    doc = new DocumentModel(project, formSchema);
  });

  afterEach(() => {
    project.unload();
    designer.purge();
    editor = null;
    designer = null;
    project = null;
  });

  it('isEmpty / notEmpty', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const secondBtn = doc.getNode('node_k1ow3cbp')!;
    const { children } = firstBtn.parent!;

    expect(children.isEmpty()).toBeFalsy();
    expect(children.notEmpty()).toBeTruthy();
    expect(firstBtn.children.notEmpty()).toBeFalsy();
    expect(firstBtn.children.isEmpty()).toBeTruthy();
  });

  it('purge / for of', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;
    children.purge();

    for (const child of children) {
      expect(child.isPurged).toBeTruthy();
    }
  });

  it('splice', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;
    children.splice(0, 1);

    expect(children.size).toBe(1);
    expect(children.length).toBe(1);

    children.splice(0, 0, doc.createNode({ componentName: 'Button' }));
    expect(children.size).toBe(2);
    expect(children.length).toBe(2);
  });

  it('map', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    const newMap = children.map((item) => item);

    newMap?.forEach((item) => {
      expect(item.componentName).toBe('Button');
    });
  });

  it('forEach', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    children.forEach((item) => {
      expect(item.componentName).toBe('Button');
    });
  });

  it('some', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    children.some((item) => {
      return expect(item.componentName).toBe('Button');
    });
  });

  it('every', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    children.every((item) => {
      return expect(item.componentName).toBe('Button');
    });
  });

  it('filter', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    children
      .filter((item) => item.componentName === 'Button')
      .forEach((item) => {
        expect(item.componentName).toBe('Button');
      });
  });

  it('find', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    const found = children.find((item) => item.componentName === 'Button');

    expect(found?.componentName).toBe('Button');
  });

  it('mergeChildren', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    const changeMockFn = jest.fn();
    const offChange = children.onChange(changeMockFn);
    const rmMockFn = jest.fn((item) => {
      if (item.index === 1) return true;
      return false;
    });
    const addMockFn = jest.fn((children) => {
      return [{ componentName: 'Button' }, { componentName: 'Button' }];
    });
    const sortMockFn = jest.fn((a, b) => {
      return a > b ? 1 : -1;
    });
    children.mergeChildren(rmMockFn, addMockFn, sortMockFn);

    expect(children.size).toBe(3);
    expect(changeMockFn).toHaveBeenCalled();
    offChange();
  });

  it('insert / onInsert', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    const mockFn = jest.fn();
    const off = children.onInsert(mockFn);

    children.insert(new Node(doc, { componentName: 'Button' }));
    expect(mockFn).toHaveBeenCalledTimes(1);
    off();
    children.insert(new Node(doc, { componentName: 'Button' }));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('reportModified', () => {
    const divMeta = designer.createComponentMeta(divMetadata);
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    const modifiedMockFn = jest.fn();
    divMeta.getMetadata = () => {
      return { configure: { advanced: { callbacks: { onSubtreeModified: modifiedMockFn } } } };
    };

    children.reportModified(null);
    children.reportModified(doc.rootNode);

    children.reportModified(firstBtn, firstBtn.parent);
    expect(modifiedMockFn).toHaveBeenCalled();
  });
});
