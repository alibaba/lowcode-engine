import '../../fixtures/window';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { DocumentModel } from '../../../src/document/document-model';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form-with-modal';
import dlgMetadata from '../../fixtures/component-metadata/dialog';
import { getModalNodes } from '../../../src/document/node/modal-nodes-manager';

let editor: Editor;
let designer: Designer;
let project: Project;
let doc: DocumentModel;

beforeEach(() => {
  editor = new Editor();
  designer = new Designer({ editor });
  designer.createComponentMeta(dlgMetadata);
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

describe('ModalNodesManager 方法测试', () => {
  it('getModalNodes / getVisibleModalNode', () => {
    const mgr = doc.modalNodesManager;
    const nodes = mgr.getModalNodes();
    expect(nodes).toHaveLength(1);
    expect(nodes[0].componentName).toBe('Dialog');
    expect(mgr.getVisibleModalNode()).toBeFalsy();
  });

  it('setVisible / setInvisible / onVisibleChange', () => {
    const mgr = doc.modalNodesManager;
    const nodes = mgr.getModalNodes();

    const mockFn = jest.fn();
    const off = mgr.onVisibleChange(mockFn);

    mgr.setVisible(nodes[0]);
    expect(mockFn).toHaveBeenCalledTimes(2);

    mgr.setInvisible(nodes[0]);
    expect(mockFn).toHaveBeenCalledTimes(3);

    off();
  });

  it('addNode / removeNode', () => {
    const mgr = doc.modalNodesManager!;
    const nodes = mgr.getModalNodes();

    const nodesMockFn = jest.fn();
    const visibleMockFn = jest.fn();
    const off = mgr.onModalNodesChange(nodesMockFn);
    const offVisible = mgr.onVisibleChange(visibleMockFn);

    const newNode = new Node(doc, { componentName: 'Dialog' });
    mgr.addNode(newNode);
    expect(visibleMockFn).toHaveBeenCalledTimes(2);
    expect(nodesMockFn).toHaveBeenCalledTimes(1);

    mgr.setVisible(newNode);
    mgr.removeNode(newNode);

    expect(visibleMockFn).toHaveBeenCalledTimes(6);
    expect(nodesMockFn).toHaveBeenCalledTimes(2);

    off();
    offVisible();
    visibleMockFn.mockClear();
    nodesMockFn.mockClear();

    mgr.addNode(newNode);
    expect(visibleMockFn).not.toHaveBeenCalled();
    expect(nodesMockFn).not.toHaveBeenCalled();

    const newNode2 = new Node(doc, { componentName: 'Dialog' });
    mgr.addNode(newNode2);
    mgr.setInvisible(newNode2);
    mgr.removeNode(newNode2);

    const newNode3 = new Node(doc, { componentName: 'Dialog' });
    mgr.removeNode(newNode3);

    const newNode4 = new Node(doc, { componentName: 'Non-Modal' });
    mgr.removeNode(newNode4);

    const newNode5 = doc.createNode({ componentName: 'Non-Modal' });
    newNode5.remove(); // trigger node destroy
  });
});

describe('其他方法', () => {
  it('getModalNodes - null', () => {
    expect(getModalNodes()).toEqual([]);
  });

  it('getModalNodes - no children', () => {
    const node = doc.createNode({ componentName: 'Leaf', children: 'haha' });
    expect(getModalNodes(node)).toEqual([]);
  });
});