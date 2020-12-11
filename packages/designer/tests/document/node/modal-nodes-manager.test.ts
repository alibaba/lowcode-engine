import '../../fixtures/window';
import { set } from '../../utils';
import { Editor } from '@ali/lowcode-editor-core';
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
import formSchema from '../../fixtures/schema/form-with-modal';
import divMetadata from '../../fixtures/component-metadata/div';
import dlgMetadata from '../../fixtures/component-metadata/dialog';
import buttonMetadata from '../../fixtures/component-metadata/button';
import formMetadata from '../../fixtures/component-metadata/form';
import otherMeta from '../../fixtures/component-metadata/other';
import pageMetadata from '../../fixtures/component-metadata/page';
import rootHeaderMetadata from '../../fixtures/component-metadata/root-header';
import rootContentMetadata from '../../fixtures/component-metadata/root-content';
import rootFooterMetadata from '../../fixtures/component-metadata/root-footer';
import { delayObxTick, delay } from '../../utils';

describe('ModalNodesManager 方法测试', () => {
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

    const newNode = new Node(doc, { componentName: 'Dialog' })
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
  });
});
