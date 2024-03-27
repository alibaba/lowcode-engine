import { set, cloneDeep } from 'lodash-es';
import '../fixtures/window';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../src/project/project';
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
              return { configure: { advanced: null } };
            },
            get advanced() {
              return {};
            },
          };
        },
        transformProps(props) {
          return props;
        },
        createSettingEntry: mockCreateSettingEntry,
        postEvent() {},
      };
    }),
  };
});

let designer = null;
beforeAll(() => {
  designer = new Designer({});
  designer.editor = new Editor();
});

describe('schema 生成节点模型测试', () => {
  describe('block ❌ | component ❌ | slot ❌', () => {
    beforeEach(() => {
      mockCreateSettingEntry.mockClear();
    });

    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      const project = new Project(designer, {
        componentsTree: [formSchema],
      });
      project.open();
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(nodesMap.size).toBe(expectedNodeCnt);
      ids.forEach((id) => {
        expect(nodesMap.get(id).componentName).toBe(
          getNodeFromSchemaById(formSchema, id).componentName,
        );
      });

      const exportSchema = currentDocument?.export(1);
      expect(getIdsFromSchema(exportSchema).length).toBe(expectedNodeCnt);
      nodesMap.forEach((node) => {
        // 触发 getter
        node.settingEntry;
      });
      expect(mockCreateSettingEntry).toBeCalledTimes(expectedNodeCnt);
    });

    it('onSimulatorReady works', () => {
      const project = new Project(designer, {
        componentsTree: [formSchema],
      });
      project.open();
      expect(project).toBeTruthy();
      const mockCallback = jest.fn();
      const removeListener = project.onSimulatorReady(mockCallback);
      project.mountSimulator(undefined);
      expect(mockCallback).toBeCalled();
      removeListener();
    });

    it('open doc when doc is blank', () => {
      const project = new Project(designer);
      project.open();
      expect(project).toBeTruthy();
      const blankDoc = project.documents[0];
      expect(blankDoc).toBeTruthy();
      // 触发保存
      blankDoc.history.savePoint();
      expect(blankDoc.isModified()).toBeFalsy();
      expect(blankDoc.isBlank()).toBeTruthy();

      //二次打开doc，会使用前面那个
      const openedDoc = project.open();
      expect(openedDoc).toBe(blankDoc);
    });

    it('load schema with autoOpen === true', () => {
      const project = new Project(designer);
      expect(project).toBeTruthy();
      // trigger autoOpen case
      project.load(
        {
          componentsTree: [formSchema],
        },
        true,
      );
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(nodesMap.size).toBe(expectedNodeCnt);
      ids.forEach((id) => {
        expect(nodesMap.get(id).componentName).toBe(
          getNodeFromSchemaById(formSchema, id).componentName,
        );
      });

      const exportSchema = currentDocument?.export(1);
      expect(getIdsFromSchema(exportSchema).length).toBe(expectedNodeCnt);
      nodesMap.forEach((node) => {
        // 触发 getter
        node.settingEntry;
      });
      expect(mockCreateSettingEntry).toBeCalledTimes(expectedNodeCnt);
    });
    it('load schema with autoOpen === true, and config contains layout.props.tabBar.item', () => {
      const project = new Project(designer);
      expect(project).toBeTruthy();
      // trigger autoOpen case
      project.load(
        {
          componentsTree: [
            {
              ...formSchema,
              fileName: 'demoFile1',
            },
            {
              ...formSchema,
              fileName: 'demoFile2',
            },
          ],
          config: {
            layout: {
              props: {
                tabBar: {
                  items: [
                    {
                      path: '/demoFile2',
                    },
                  ],
                },
              },
            },
          },
        },
        true,
      );
      const { currentDocument } = project;
      expect(currentDocument.fileName).toBe('demoFile2');
    });

    it('load schema with autoOpen === true', () => {
      const project = new Project(designer);
      expect(project).toBeTruthy();
      // trigger autoOpen case
      project.load(
        {
          componentsTree: [
            {
              ...formSchema,
              fileName: 'demoFile1',
            },
            {
              ...formSchema,
              fileName: 'demoFile2',
            },
          ],
        },
        'demoFile2',
      );
      const { currentDocument } = project;
      expect(currentDocument.fileName).toBe('demoFile2');
    });

    it('setSchema works', () => {
      const project = new Project(designer);
      project.open();
      expect(project).toBeTruthy();
      project.setSchema({
        componentsTree: [
          {
            ...formSchema,
            fileName: 'demoFile1',
          },
        ],
      });
      const { currentDocument } = project;
      expect(currentDocument.fileName).toBe('demoFile1');
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
      ids.forEach((id) => {
        expect(nodesMap.get(id).componentName).toBe(
          getNodeFromSchemaById(formSchema, id).componentName,
        );
      });

      const exportSchema = currentDocument?.export(1);
      expect(getIdsFromSchema(exportSchema).length).toBe(expectedNodeCnt);
      nodesMap.forEach((node) => {
        // 触发 getter
        node.settingEntry;
      });
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

    it('get unknown document', () => {
      const project = new Project(designer);
      project.open(formSchema);
      expect(project).toBeTruthy();
      expect(project.getDocument('unknownId')).toBeNull();
    });

    it('get set i18n works', () => {
      const project = new Project(designer);
      project.open(formSchema);
      expect(project).toBeTruthy();

      project.i18n = formSchema.i18n;
      expect(project.i18n).toStrictEqual(formSchema.i18n);
      project.i18n = null;
      expect(project.i18n).toStrictEqual({});

      project.set('i18n', formSchema.i18n);
      expect(project.get('i18n')).toStrictEqual(formSchema.i18n);
      project.set('i18n', null);
      expect(project.get('i18n')).toStrictEqual({});
    });
  });

  describe('block ❌ | component ❌ | slot ✅', () => {
    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      const formSchemaWithSlot = set(
        cloneDeep(formSchema),
        'children[0].children[0].props.title.type',
        'JSSlot',
      );
      const project = new Project(designer, {
        componentsTree: [formSchemaWithSlot],
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

  describe.skip('多 document 测试', () => {});
});
