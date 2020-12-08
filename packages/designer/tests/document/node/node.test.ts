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
} from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import divMetadata from '../../fixtures/component-metadata/div';
import formMetadata from '../../fixtures/component-metadata/form';
import otherMeta from '../../fixtures/component-metadata/other';
import pageMetadata from '../../fixtures/component-metadata/page';
import rootHeaderMetadata from '../../fixtures/component-metadata/root-header';
import rootContentMetadata from '../../fixtures/component-metadata/root-content';
import rootFooterMetadata from '../../fixtures/component-metadata/root-footer';

describe('Node 方法测试', () => {
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

  it('condition / loop', () => {});

  describe('getSuitablePlace', () => {
    it('root，子节点中有容器节点', () => {
      designer.createComponentMeta(pageMetadata);
      designer.createComponentMeta(rootHeaderMetadata);
      designer.createComponentMeta(rootContentMetadata);
      designer.createComponentMeta(rootFooterMetadata);

      const rootHeaderMeta = designer.getComponentMeta('RootHeader');
      set(rootHeaderMeta, 'prototype.options.canDropIn', true);

      let o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.getNode('node_k1ow3cba'),
        ref: 1,
      });

      set(rootHeaderMeta, 'prototype.options.canDropIn', () => true);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.getNode('node_k1ow3cba'),
        ref: 1,
      });
    });

    it('root，直接子节点中无容器节点，自身支持放入子节点', () => {
      designer.createComponentMeta(pageMetadata);

      let o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);

      const pageMeta = designer.getComponentMeta('Page');
      set(pageMeta, 'prototype.options.canDropIn', () => true);

      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });

      set(pageMeta, 'prototype.options.canDropIn', undefined);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });

      set(pageMeta, 'prototype.options.canDropIn', true);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });
    });

    it('root，子节点中无容器节点，自己也不支持放入子节点', () => {
      designer.createComponentMeta(pageMetadata);

      let pageMeta = designer.getComponentMeta('Page');

      pageMeta = set(pageMeta, 'prototype.options.canDropIn', () => false);
      let o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toBeNull();

      set(pageMeta, 'prototype.options.canDropIn', false);
      o = doc.rootNode?.getSuitablePlace(doc.getNode('form'), 1);
      expect(o).toBeNull();
    });

    it('非 root 节点，不能放入子节点', () => {
      designer.createComponentMeta(formMetadata);
      designer.createComponentMeta(pageMetadata);

      // form 子节点以及自身都不能放入子节点
      const formMeta = designer.getComponentMeta('Form');
      set(formMeta, 'prototype.options.canDropIn', false);

      const pageMeta = designer.getComponentMeta('Page');
      set(pageMeta, 'prototype.options.canDropIn', () => true);

      const o = doc.getNode('form')!.getSuitablePlace(doc.getNode('node_k1ow3cbj'), 1);
      expect(o).toEqual({
        container: doc.rootNode,
        ref: 1,
      });
    });

    it('非 root 节点，能放入子节点', () => {
      designer.createComponentMeta(formMetadata);
      designer.createComponentMeta(pageMetadata);

      // form 子节点以及自身都不能放入子节点
      const formMeta = designer.getComponentMeta('Form');
      set(formMeta, 'prototype.options.canDropIn', true);

      const o = doc.getNode('form')!.getSuitablePlace(doc.getNode('node_k1ow3cbj'), 1);
      expect(o).toEqual({
        container: doc.getNode('form'),
        ref: 1,
      });
    });

    it('null', () => {
      expect(
        doc.rootNode?.getSuitablePlace.call({ isContainer: () => false, isRoot: () => false }),
      ).toBeNull();
    });
  });

  it('removeChild / replaceWith / replaceChild / insert / insertBefore / insertAfter / onChildrenChange / mergeChildren', () => {});

  it('setVisible / getVisible / onVisibleChange', () => {});

  it('setProps', () => {});

  it('isValidComponent', () => {
    designer.createComponentMeta(divMetadata);
    expect(doc.getNode('node_k1ow3cbo')?.isValidComponent()).toBeTruthy();
    expect(doc.getNode('form')?.isValidComponent()).toBeFalsy();
  });

  it('isEmpty / getIndex', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn')!;
    expect(firstBtn.isEmpty()).toBeTruthy();
    expect(firstBtn.index).toBe(0);
    expect(firstBtn.getIndex()).toBe(0);
  });

  it('schema / toData / export', () => {});

  it('prevSibling / nextSibling', () => {
    const firstBtn = doc.getNode('node_k1ow3cbn');
    const secondBtn = doc.getNode('node_k1ow3cbp');
    expect(firstBtn?.nextSibling).toBe(secondBtn);
    expect(secondBtn?.prevSibling).toBe(firstBtn);
    expect(secondBtn?.nextSibling).toBeNull();
  });

  it('toString', () => {
    expect(doc.rootNode.toString()).toBe('page');
  });

  it('isRootNode / isRoot / isNode', () => {
    expect(isRootNode(doc.rootNode)).toBeTruthy();
    expect(isNode(doc.rootNode)).toBeTruthy();
  });

  it('contains / comparePosition', () => {});

  it('getZLevelTop', () => {});

  describe.skip('deprecated methods', () => {
    it('setStatus / getStatus', () => {});

    it('getPage', () => {
      expect(doc.rootNode?.getPage()).toBe(doc);
    });
    it('getDOMNode', () => {});
    it('registerAddon / getAddonData', () => {});
    it('getPrototype / setPrototype', () => {});
  });
});
