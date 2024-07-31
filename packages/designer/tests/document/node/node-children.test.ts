import '../../fixtures/window';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { DocumentModel } from '../../../src/document/document-model';
import {
  Node,
} from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import divMetadata from '../../fixtures/component-metadata/div';
import { shellModelFactory } from '../../../../engine/src/modules/shell-model-factory';

describe('NodeChildren 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor, shellModelFactory });
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

  it('export', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    expect(children.export().length).toBe(2);
  });

  it('export - Leaf', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    firstBtn.parent!.insertAfter({ componentName: 'Leaf', children: 'haha' });
    const { children } = firstBtn.parent!;

    expect(children.export().length).toBe(3);
    expect(children.export()[2]).toBe('haha');
  });

  it('import', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    children.import(children.export());

    expect(children.export().length).toBe(2);
  });

  it('delete', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const leafNode = doc.createNode({ componentName: 'Leaf', children: 'haha' });
    firstBtn.parent!.insertAfter(leafNode);
    const { children } = firstBtn.parent!;

    children.delete(leafNode);
    expect(children.export().length).toBe(2);
  });

  it('delete - 插入已有的节点', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    firstBtn.parent!.insertBefore(firstBtn, firstBtn);
    const { children } = firstBtn.parent!;

    expect(children.export().length).toBe(2);
  });

  it('purge / for of', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;
    children.purge();

    for (const child of children) {
      expect(child.isPurged).toBeTruthy();
    }

    // purge when children is purged
    children.purge();
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

  it('split add node and update node parent', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;
    const node = doc.createNode({ componentName: 'Button' });

    children.splice(0, 0, node);

    expect(node.parent).toBe(firstBtn.parent);
  })

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

  it('concat', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    const ret = children.concat([doc.createNode({ componentName: 'Button' })]);

    expect(ret.length).toBe(3);
  });

  it('reduce', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    const { children } = firstBtn.parent!;

    let ret = 0;
    ret = children.reduce((count, node) => {
      count = count + 1;
      return count;
    }, 0);

    expect(ret).toBe(2);
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

    // no remover && adder && sorter
    children.mergeChildren();
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
