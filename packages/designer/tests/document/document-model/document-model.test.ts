import '../../fixtures/window';
import { DocumentModel, isDocumentModel, isPageSchema } from '../../../src/document/document-model';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import divMeta from '../../fixtures/component-metadata/div';
import formMeta from '../../fixtures/component-metadata/form';
import otherMeta from '../../fixtures/component-metadata/other';
import pageMeta from '../../fixtures/component-metadata/page';
// const { DocumentModel } = require('../../../src/document/document-model');
// const { Node } = require('../__mocks__/node');

describe('document-model 测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor });
    project = designer.project;
  });

  it('empty schema', () => {
    const doc = new DocumentModel(project);
    expect(doc.rootNode.id).toBe('root');
    expect(doc.currentRoot).toBe(doc.rootNode);
    expect(doc.root).toBe(doc.rootNode);
    expect(doc.modalNode).toBeUndefined();
    expect(doc.isBlank()).toBeTruthy();
    expect(doc.schema).toEqual({
      componentName: 'Page',
      condition: true,
      conditionGroup: '',
      hidden: false,
      isLocked: false,
      loop: undefined,
      title: '',
      id: 'root',
      fileName: '',
      props: {},
    });
  });

  it('各种方法测试', () => {
    const doc = new DocumentModel(project, formSchema);
    const mockNode = { id: 1 };
    doc.addWillPurge(mockNode);
    expect(doc.willPurgeSpace).toHaveLength(1);
    doc.removeWillPurge(mockNode);
    expect(doc.willPurgeSpace).toHaveLength(0);

    expect(doc.toData()).toMatchSnapshot();

    // 测试插入已存在的 id，id 将会被重置
    const formParentNode = doc.getNode('form').parent;
    doc.insertNode(formParentNode, { id: 'form', componentName: 'Form' });
    expect(formParentNode.children.get(formParentNode.children.size - 1).id).not.toBe('form');

    doc.internalRemoveAndPurgeNode({ id: 'mockId' });

    // internalSetDropLocation
    doc.internalSetDropLocation({ a: 1 });
    expect(doc.dropLocation).toEqual({ a: 1 });

    // wrapWith
    // none-selected
    doc.wrapWith({ componentName: 'Wrap' });
    doc.selection.select('form');
    doc.wrapWith({ componentName: 'Wrap' });
    expect(doc.getNode('form').parent.componentName).toBe('Wrap');
    expect(doc.wrapWith({ componentName: 'Leaf' })).toBeNull();

    // fileName
    expect(doc.fileName).toBeTruthy();
    doc.fileName = 'fileName';
    expect(doc.fileName).toBe('fileName');

    expect(doc.getNodeSchema(doc.getNode('form'))).toMatchSnapshot();

    // TODO:
    // expect(doc.simulatorProps).toMatchSnapshot();

    const mockSimulator = {
      isSimulator: true,
      getComponent() {
        return 'haha';
      },
      setSuspense() {},
    };
    doc.project.mountSimulator(mockSimulator);
    expect(doc.simulator).toEqual(mockSimulator);
    expect(doc.getComponent('Div')).toBe('haha');

    expect(doc.opened).toBeFalsy();
    expect(doc.isModified).toBeTruthy();
    expect(doc.suspensed).toBeTruthy();

    doc.open();
    expect(doc.opened).toBeTruthy();
    expect(doc.actived).toBeTruthy();
    expect(doc.isModified).toBeTruthy();
    expect(doc.suspensed).toBeFalsy();

    doc.suspense();
    doc.activate();
    doc.close();
    doc.remove();

    const offReady = doc.onReady(() => {});
    offReady();

    expect(doc.history).toBe(doc.getHistory());
  });

  it('focusNode - using drillDown', () => {
    const doc = new DocumentModel(project, formSchema);
    expect(doc.focusNode.id).toBe('page');

    doc.drillDown(doc.getNode('node_k1ow3cbb'));
    expect(doc.focusNode.id).toBe('node_k1ow3cbb');
  });

  it('focusNode - using drillDown & import', () => {
    const doc = new DocumentModel(project, formSchema);
    expect(doc.focusNode.id).toBe('page');

    doc.drillDown(doc.getNode('node_k1ow3cbb'));
    doc.import(formSchema);
    expect(doc.focusNode.id).toBe('node_k1ow3cbb');
  });

  it('focusNode - using focusNodeSelector', () => {
    const doc = new DocumentModel(project, formSchema);
    editor.set('focusNodeSelector', (rootNode) => {
      return rootNode.children.get(1);
    });
    expect(doc.focusNode.id).toBe('node_k1ow3cbb');
  });

  it('getNodeCount', () => {
    const doc = new DocumentModel(project);
    // using default schema, only one node
    expect(doc.getNodeCount()).toBe(1);
  });

  it('getNodeSchema', () => {
    const doc = new DocumentModel(project, formSchema);
    expect(doc.getNodeSchema('page').id).toBe('page');
  });

  it('export - with __isTopFixed__', () => {
    formSchema.children[1].props.__isTopFixed__ = true;
    const doc = new DocumentModel(project, formSchema);

    const schema = doc.export();
    expect(schema.children).toHaveLength(3);
    expect(schema.children[0].componentName).toBe('RootContent');
    expect(schema.children[1].componentName).toBe('RootHeader');
    expect(schema.children[2].componentName).toBe('RootFooter');
  });

  describe('createNode', () => {
    it('same id && componentName', () => {
      const doc = new DocumentModel(project, formSchema);
      const node = doc.createNode({
        componentName: 'RootFooter',
        id: 'node_k1ow3cbc',
        props: {},
        condition: true,
      });
      expect(node.parent).toBeNull();
    });

    it('same id && different componentName', () => {
      const doc = new DocumentModel(project, formSchema);
      const originalNode = doc.getNode('node_k1ow3cbc');
      const node = doc.createNode({
        componentName: 'RootFooter2',
        id: 'node_k1ow3cbc',
        props: {},
        condition: true,
      });
      // expect(originalNode.parent).toBeNull();
      expect(node.id).not.toBe('node_k1ow3cbc');
    });
  });

  it('setSuspense', () => {
    const doc = new DocumentModel(project, formSchema);
    expect(doc.opened).toBeFalsy();
    doc.setSuspense(false);
  });

  it('registerAddon / getAddonData / exportAddonData', () => {
    const doc = new DocumentModel(project);
    expect(doc.getAddonData('a')).toBeUndefined();

    doc.registerAddon('a', () => 'addon a');
    doc.registerAddon('a', () => 'modified addon a');
    doc.registerAddon('b', () => 'addon b');
    doc.registerAddon('c', () => null);

    ['id', 'layout', 'params'].forEach((name) => {
      expect(() => doc.registerAddon(name, () => {})).toThrow();
    });

    expect(doc.getAddonData('a')).toBe('modified addon a');
    expect(doc.getAddonData('b')).toBe('addon b');

    expect(doc.exportAddonData()).toEqual({
      a: 'modified addon a',
      b: 'addon b',
    });
  });

  it('checkNesting / checkDropTarget / checkNestingUp / checkNestingDown', () => {
    designer.createComponentMeta(pageMeta);
    designer.createComponentMeta(formMeta);
    const doc = new DocumentModel(project, formSchema);

    expect(
      doc.checkDropTarget(doc.getNode('page'), { type: 'node', nodes: [doc.getNode('form')] }),
    ).toBeTruthy();
    expect(
      doc.checkDropTarget(doc.getNode('page'), {
        type: 'nodedata',
        data: { componentName: 'Form' },
      }),
    ).toBeTruthy();

    expect(
      doc.checkNesting(doc.getNode('page'), { type: 'node', nodes: [doc.getNode('form')] }),
    ).toBeTruthy();
    expect(
      doc.checkNesting(doc.getNode('page'), {
        type: 'nodedata',
        data: { componentName: 'Form' },
      }),
    ).toBeTruthy();

    expect(doc.checkNestingUp(doc.getNode('page'), null)).toBeTruthy();
  });

  it('getComponentsMap', () => {
    designer.createComponentMeta(divMeta);
    designer.createComponentMeta(otherMeta);
    const doc = new DocumentModel(project, formSchema);
    const comps = doc.getComponentsMap(['Other']);
    expect(comps.find(comp => comp.componentName === 'Div')).toEqual(
      { componentName: 'Div', package: '@ali/vc-div' }
    );
    expect(comps.find(comp => comp.componentName === 'Other')).toEqual(
      { componentName: 'Other', package: '@ali/vc-other' }
    );
    expect(comps.find(comp => comp.componentName === 'Page')).toEqual(
      { componentName: 'Page', devMode: 'lowCode' }
    );

    const comps2 = doc.getComponentsMap(['Div']);
  });

  it('acceptRootNodeVisitor / getRootNodeVisitor', () => {
    designer.createComponentMeta(divMeta);
    designer.createComponentMeta(otherMeta);
    const doc = new DocumentModel(project, formSchema);
    const ret = doc.acceptRootNodeVisitor('getPageId', (root) => {
      return 'page';
    });
    expect(ret).toBe('page');
    expect(doc.getRootNodeVisitor('getPageId')).toBe('page');

    // expect(doc.getComponentsMap(['Other'])).toEqual([
    //   { componentName: 'Div', package: '@ali/vc-div' },
    //   { componentName: 'Other', package: '@ali/vc-other' },
    // ]);
  });

  it('deprecated methods', () => {
    const doc = new DocumentModel(project, formSchema);
    doc.refresh();
    doc.onRefresh();
  });
});

it('isDocumentModel', () => {
  expect(isDocumentModel({ rootNode: {} })).toBeTruthy();
});

it('isPageSchema', () => {
  expect(isPageSchema({ componentName: 'Page' })).toBeTruthy();
});
