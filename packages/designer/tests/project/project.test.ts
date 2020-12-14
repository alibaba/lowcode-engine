import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { DocumentModel } from '../../src/document/document-model';
import { Node } from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';

const mockCreateSettingEntry = jest.fn();
jest.mock('../../src/designer/designer', () => {
  return {
    Designer: jest.fn().mockImplementation(() => {
      return {
        getComponentMeta() {
          return {
            getMetadata() {
              return { experimental: null };
            },
          };
        },
        transformProps(props) { return props; },
        createSettingEntry: mockCreateSettingEntry,
        postEvent() {},
      };
    }),
  };
});

let designer = null;
beforeAll(() => {
  designer = new Designer({});
});

describe('schema 生成节点模型测试', () => {
  describe('block ❌ | component ❌ | slot ❌', () => {
    beforeEach(() => {
      mockCreateSettingEntry.mockClear();
    });

    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      const project = new Project(designer, {
        componentsTree: [
          formSchema,
        ],
      });
      project.open();
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(nodesMap.size).toBe(expectedNodeCnt);
      ids.forEach(id => {
        expect(nodesMap.get(id).componentName).toBe(getNodeFromSchemaById(formSchema, id).componentName);
      });

      const exportSchema = currentDocument?.export(1);
      expect(getIdsFromSchema(exportSchema).length).toBe(expectedNodeCnt);
      expect(mockCreateSettingEntry).toBeCalledTimes(expectedNodeCnt);
    });

    it('基本的节点模型初始化，模型导出，project.open 传入 schema', () => {
      const project = new Project(designer);
      project.open(formSchema);
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(nodesMap.size).toBe(expectedNodeCnt);
      ids.forEach(id => {
        expect(nodesMap.get(id).componentName).toBe(getNodeFromSchemaById(formSchema, id).componentName);
      });

      const exportSchema = currentDocument?.export(1);
      expect(getIdsFromSchema(exportSchema).length).toBe(expectedNodeCnt);
      expect(mockCreateSettingEntry).toBeCalledTimes(expectedNodeCnt);
    });

    it('project 卸载所有 document - unload()', () => {
      const project = new Project(designer);
      project.open(formSchema);
      expect(project).toBeTruthy();
      const { currentDocument, documents } = project;

      expect(documents).toHaveLength(1);
      expect(currentDocument).toBe(documents[0]);

      project.unload();

      expect(documents).toHaveLength(0);
    });

    it('project 卸载指定 document - removeDocument()', () => {
      const project = new Project(designer);
      project.open(formSchema);
      expect(project).toBeTruthy();
      const { currentDocument, documents } = project;

      expect(documents).toHaveLength(1);
      expect(currentDocument).toBe(documents[0]);

      project.removeDocument(currentDocument);

      expect(documents).toHaveLength(0);
    });
  });

  describe('block ❌ | component ❌ | slot ✅', () => {
    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      const formSchemaWithSlot = set(cloneDeep(formSchema), 'children[0].children[0].props.title.type', 'JSSlot');
      const project = new Project(designer, {
        componentsTree: [
          formSchemaWithSlot,
        ],
      });
      project.open();
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument!;
      const ids = getIdsFromSchema(formSchema);
      // 目前每个 slot 会新增（1 + children.length）个节点
      const expectedNodeCnt = ids.length + 2;
      expect(nodesMap.size).toBe(expectedNodeCnt);
      // PageHeader
      expect(nodesMap.get('node_k1ow3cbd').slots).toHaveLength(1);
    });
  });

  describe.skip('多 document 测试', () => {

  });
});
