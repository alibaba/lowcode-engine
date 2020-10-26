import set from 'lodash.set';
import cloneDeep from 'lodash.clonedeep';
import '../fixtures/window';
import { Project } from '../../src/project/project';
// import { Node } from '../../../src/document/node/node';
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
    it('基本的节点模型初始化，模型导出', () => {
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

    describe('节点新增（insertNode）', () => {
      let project;
      beforeEach(() => {
        project = new Project(designer, {
          componentsTree: [
            formSchema,
          ],
        });
        project.open();
      });
      it.only('场景一：插入 NodeSchema', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const { nodesMap } = currentDocument;
        const formNode = nodesMap.get('node_k1ow3cbq');
        currentDocument?.insertNode(formNode, {
          componentName: 'TextInput',
          id: 'nodeschema-id1',
          props: {
            propA: 'haha',
            propB: 3
          }
        });
        expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
        expect(nodesMap.size).toBe(ids.length + 1);
      });

      it.only('场景一：插入 NodeSchema，有 children', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const { nodesMap } = currentDocument;
        const formNode = nodesMap.get('node_k1ow3cbq');
        currentDocument?.insertNode(formNode, {
          componentName: 'TextInput',
          id: 'nodeschema-id1',
          props: {
            propA: 'haha',
            propB: 3
          }
        });
        expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
        expect(nodesMap.size).toBe(ids.length + 1);
      });

      it.only('场景一：插入 NodeSchema，id 与现有 schema 重复', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const { nodesMap } = currentDocument;
        const formNode = nodesMap.get('node_k1ow3cbq');
        currentDocument?.insertNode(formNode, {
          componentName: 'TextInput',
          id: 'nodeschema-id1',
          props: {
            propA: 'haha',
            propB: 3
          }
        });
        expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
        expect(nodesMap.size).toBe(ids.length + 1);
      });

      it.only('场景一：插入 NodeSchema，id 与现有 schema 重复，但关闭了 id 检测器', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const { nodesMap } = currentDocument;
        const formNode = nodesMap.get('node_k1ow3cbq');
        currentDocument?.insertNode(formNode, {
          componentName: 'TextInput',
          id: 'nodeschema-id1',
          props: {
            propA: 'haha',
            propB: 3
          }
        });
        expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
        expect(nodesMap.size).toBe(ids.length + 1);
      });

      it('场景二：插入 Node 实例', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const { nodesMap } = currentDocument;
        const formNode = nodesMap.get('node_k1ow3cbq');
        const inputNode = currentDocument?.createNode({
          componentName: 'TextInput',
          id: 'nodeschema-id2',
          props: {
            propA: 'haha',
            propB: 3
          }
        });
        expect(inputNode.id).toBe('nodeschema-id2');
        currentDocument?.insertNode(formNode, inputNode);
        expect(nodesMap.get('nodeschema-id2').componentName).toBe('TextInput');
        expect(nodesMap.size).toBe(ids.length + 1);
      });

      it('场景二：插入 JSExpression', () => {});
    });

  })

  it('block ❌ | component ❌ | slot ✅', () => {
    const formSchemaWithSlot = set(cloneDeep(formSchema), 'children[0].children[0].props.title.type', 'JSSlot');
    const project = new Project(designer, {
      componentsTree: [
        formSchemaWithSlot,
      ],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap } = currentDocument;
    const ids = getIdsFromSchema(formSchema);
    // 目前每个 slot 会新增 1 + children.length 个节点
    const expectedNodeCnt = ids.length + 2;
    expect(nodesMap.size).toBe(expectedNodeCnt);
    // PageHeader
    expect(nodesMap.get('node_k1ow3cbd').slots).toHaveLength(1);
  });
});