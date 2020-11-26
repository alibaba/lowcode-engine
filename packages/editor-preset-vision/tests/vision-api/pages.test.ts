import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import formSchema from '../fixtures/schema/form';
import VisualEngine, { Prototype } from '../../src';
import { Editor } from '@ali/lowcode-editor-core';
import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';
import divPrototypeConfig from '../fixtures/prototype/div-vision';

const pageSchema = { componentsTree: [formSchema] };

describe('VisualEngine.Pages 相关 API 测试', () => {
  afterEach(() => {
    VisualEngine.Pages.unload();
  });
  describe('addPage 系列', () => {
    it('基本的节点模型初始化，初始化传入 schema', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema)!;
      expect(doc).toBeTruthy();
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(doc.nodesMap.size).toBe(expectedNodeCnt);
    });
    it('基本的节点模型初始化，初始化传入 schema，带有 slot', () => {
      const formSchemaWithSlot = set(cloneDeep(formSchema), 'children[0].children[0].props.title', {
        type: 'JSBlock',
        value: {
          componentName: 'Slot',
          children: [
            {
              componentName: 'Text',
              id: 'node_k1ow3cbf',
              props: {
                showTitle: false,
                behavior: 'NORMAL',
                content: {
                  type: 'variable',
                  value: {
                    use: 'zh_CN',
                    en_US: 'Title',
                    zh_CN: '个人信息',
                    type: 'i18n',
                  },
                  variable: 'state.title',
                },
                __style__: {},
                fieldId: 'text_k1ow3h1j',
                maxLine: 0,
              },
              condition: true,
            },
          ],
          props: {
            slotTitle: '标题区域',
            slotName: 'title',
          },
        },
      });
      const doc = VisualEngine.Pages.addPage({ componentsTree: [formSchemaWithSlot] })!;
      expect(doc).toBeTruthy();
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      // slot 会多出（1 + N）个节点
      expect(doc.nodesMap.size).toBe(expectedNodeCnt + 2);
    });
    it('基本的节点模型初始化，初始化传入 schema，构造 prototype', () => {
      const proto = new Prototype(divPrototypeConfig);
      const doc = VisualEngine.Pages.addPage(pageSchema)!;
      expect(doc).toBeTruthy();
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(doc.nodesMap.size).toBe(expectedNodeCnt);
    });
    it('导出 schema', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema)!;
      expect(doc).toBeTruthy();
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const exportedData = doc.toData();
      expect(exportedData).toHaveProperty('componentsMap');
      expect(exportedData).toHaveProperty('componentsTree');
      expect(exportedData.componentsTree).toHaveLength(1);
      const exportedSchema = exportedData.componentsTree[0];
      expect(getIdsFromSchema(exportedSchema).length).toBe(expectedNodeCnt);
    });
  });
  describe('removePage 系列', () => {
    it('removePage', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema)!;
      expect(doc).toBeTruthy();
      expect(VisualEngine.Pages.documents).toHaveLength(1);
      VisualEngine.Pages.removePage(doc);
      expect(VisualEngine.Pages.documents).toHaveLength(0);
    });
  });
  describe('getPage 系列', () => {
    it('getPage', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema);
      const anotherFormSchema = set(cloneDeep(formSchema), 'id', 'page');
      const doc2 = VisualEngine.Pages.addPage({ componentsTree: [anotherFormSchema] });
      expect(VisualEngine.Pages.getPage(0)).toBe(doc);
      expect(VisualEngine.Pages.getPage((_doc) => _doc.rootNode.id === 'page')).toBe(doc2);
    });
  });
  describe('setPages 系列', () => {
    it('setPages componentsTree 只有一个元素', () => {
      VisualEngine.Pages.setPages([pageSchema]);
      const { currentDocument } = VisualEngine.Pages;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const exportedData = currentDocument.toData();
      expect(exportedData).toHaveProperty('componentsMap');
      expect(exportedData).toHaveProperty('componentsTree');
      expect(exportedData.componentsTree).toHaveLength(1);
      const exportedSchema = exportedData.componentsTree[0];
      expect(getIdsFromSchema(exportedSchema).length).toBe(expectedNodeCnt);
    });
  });
  describe('setCurrentPage / getCurrentPage / currentPage / currentDocument 系列', () => {
    it('getCurrentPage', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema)!;
      expect(doc).toBeTruthy();
      expect(doc).toBe(VisualEngine.Pages.getCurrentPage());
      expect(doc).toBe(VisualEngine.Pages.currentDocument);
      expect(doc).toBe(VisualEngine.Pages.currentPage);
    });
    it('setCurrentPage', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema);
      expect(doc).toBe(VisualEngine.Pages.currentDocument);
      const anotherFormSchema = set(cloneDeep(formSchema), 'id', 'page');
      const doc2 = VisualEngine.Pages.addPage({ componentsTree: [anotherFormSchema] });
      expect(doc2).toBe(VisualEngine.Pages.currentDocument);
      VisualEngine.Pages.setCurrentPage(doc);
      expect(doc).toBe(VisualEngine.Pages.currentDocument);
    });
  });
  describe('onCurrentPageChange 系列', () => {
    it('多次切换', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema);
      const anotherFormSchema = set(cloneDeep(formSchema), 'id', 'page');
      const doc2 = VisualEngine.Pages.addPage({ componentsTree: [anotherFormSchema] });
      const docChangeHandler = jest.fn();
      VisualEngine.Pages.onCurrentDocumentChange(docChangeHandler);
      VisualEngine.Pages.setCurrentPage(doc);
      expect(docChangeHandler).toHaveBeenCalledTimes(1);
      expect(docChangeHandler).toHaveBeenLastCalledWith(doc);

      VisualEngine.Pages.setCurrentPage(doc2);
      expect(docChangeHandler).toHaveBeenCalledTimes(2);
      expect(docChangeHandler).toHaveBeenLastCalledWith(doc2);
    });
  });
  describe('toData 系列', () => {
    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      const doc = VisualEngine.Pages.addPage(pageSchema);
      const anotherFormSchema = set(cloneDeep(formSchema), 'id', 'page');
      const doc2 = VisualEngine.Pages.addPage({ componentsTree: [anotherFormSchema] });
      const dataList = VisualEngine.Pages.toData();
      expect(dataList.length).toBe(2);
      expect(dataList[0]).toHaveProperty('componentsMap');
      expect(dataList[0]).toHaveProperty('componentsTree');
      expect(dataList[0].componentsTree).toHaveLength(1);
      expect(dataList[0].componentsTree[0].id).toBe('node_k1ow3cb9');
      expect(dataList[1]).toHaveProperty('componentsMap');
      expect(dataList[1]).toHaveProperty('componentsTree');
      expect(dataList[1].componentsTree).toHaveLength(1);
      expect(dataList[1].componentsTree[0].id).toBe('page');
    });
  });
});
