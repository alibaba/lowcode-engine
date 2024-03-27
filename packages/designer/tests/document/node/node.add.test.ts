import { set, cloneDeep } from 'lodash-es';
import '../../fixtures/window';
import { Project, IProject } from '../../../src/project/project';
import { Node, INode } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import { getIdsFromSchema, getNodeFromSchemaById } from '../../utils';

const mockCreateSettingEntry = jest.fn();
jest.mock('../../../src/designer/designer', () => {
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
});

describe('schema 生成节点模型测试', () => {
  describe('block ❌ | component ❌ | slot ❌', () => {
    let project: IProject;
    beforeEach(() => {
      project = new Project(designer, {
        componentsTree: [formSchema],
      });
      project.open();
    });
    afterEach(() => {
      project.unload();
    });
    it('基本的节点模型初始化，模型导出', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const nodesMap = currentDocument?.nodesMap;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      expect(nodesMap?.size).toBe(expectedNodeCnt);
      ids.forEach((id) => {
        expect(nodesMap?.get(id)?.componentName).toBe(
          getNodeFromSchemaById(formSchema, id).componentName,
        );
      });

      const pageNode = currentDocument?.getNode('page');
      expect(pageNode?.getComponentName()).toBe('Page');
      expect(pageNode?.getIcon()).toBeUndefined();

      const exportSchema = currentDocument?.export(1);
      expect(getIdsFromSchema(exportSchema).length).toBe(expectedNodeCnt);
      nodesMap.forEach((node) => {
        // 触发 getter
        node.settingEntry;
      });
      expect(mockCreateSettingEntry).toBeCalledTimes(expectedNodeCnt);
    });

    it('基本的节点模型初始化，节点深度', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const getNode = currentDocument?.getNode.bind(currentDocument);

      const pageNode = getNode?.('page');
      const rootHeaderNode = getNode?.('node_k1ow3cba');
      const rootContentNode = getNode?.('node_k1ow3cbb');
      const rootFooterNode = getNode?.('node_k1ow3cbc');
      const formNode = getNode?.('form');
      const cardNode = getNode?.('node_k1ow3cbj');
      const cardContentNode = getNode?.('node_k1ow3cbk');
      const columnsLayoutNode = getNode?.('node_k1ow3cbw');
      const columnNode = getNode?.('node_k1ow3cbx');
      const textFieldNode = getNode?.('node_k1ow3cbz');

      expect(pageNode?.zLevel).toBe(0);
      expect(rootHeaderNode?.zLevel).toBe(1);
      expect(rootContentNode?.zLevel).toBe(1);
      expect(rootFooterNode?.zLevel).toBe(1);
      expect(formNode?.zLevel).toBe(2);
      expect(cardNode?.zLevel).toBe(3);
      expect(cardContentNode?.zLevel).toBe(4);
      expect(columnsLayoutNode?.zLevel).toBe(5);
      expect(columnNode?.zLevel).toBe(6);
      expect(textFieldNode?.zLevel).toBe(7);

      expect(textFieldNode?.getZLevelTop(7)).toEqual(textFieldNode);
      expect(textFieldNode?.getZLevelTop(6)).toEqual(columnNode);
      expect(textFieldNode?.getZLevelTop(5)).toEqual(columnsLayoutNode);
      expect(textFieldNode?.getZLevelTop(4)).toEqual(cardContentNode);
      expect(textFieldNode?.getZLevelTop(3)).toEqual(cardNode);
      expect(textFieldNode?.getZLevelTop(2)).toEqual(formNode);
      expect(textFieldNode?.getZLevelTop(1)).toEqual(rootContentNode);
      expect(textFieldNode?.getZLevelTop(0)).toEqual(pageNode);

      // 异常情况
      expect(textFieldNode?.getZLevelTop(8)).toBeNull();
      expect(textFieldNode?.getZLevelTop(-1)).toBeNull();
    });

    it('基本的节点模型初始化，节点父子、兄弟相关方法', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const getNode = currentDocument.getNode.bind(currentDocument);

      const pageNode = getNode('page');
      const rootHeaderNode = getNode('node_k1ow3cba');
      const rootContentNode = getNode('node_k1ow3cbb');
      const rootFooterNode = getNode('node_k1ow3cbc');
      const formNode = getNode('form');
      const cardNode = getNode('node_k1ow3cbj');
      const cardContentNode = getNode('node_k1ow3cbk');
      const columnsLayoutNode = getNode('node_k1ow3cbw');
      const columnNode = getNode('node_k1ow3cbx');
      const textFieldNode = getNode('node_k1ow3cbz');

      expect(pageNode?.index).toBe(-1);
      expect(pageNode?.children?.toString()).toBe('[object Array]');
      expect(pageNode?.children?.get(1)).toBe(rootContentNode);
      expect(pageNode?.getChildren()?.get(1)).toBe(rootContentNode);
      expect(pageNode?.getNode()).toBe(pageNode);

      expect(rootFooterNode?.index).toBe(2);

      expect(textFieldNode?.getParent()).toBe(columnNode);
      expect(columnNode?.getParent()).toBe(columnsLayoutNode);
      expect(columnsLayoutNode?.getParent()).toBe(cardContentNode);
      expect(cardContentNode?.getParent()).toBe(cardNode);
      expect(cardNode?.getParent()).toBe(formNode);
      expect(formNode?.getParent()).toBe(rootContentNode);
      expect(rootContentNode?.getParent()).toBe(pageNode);
      expect(rootContentNode?.prevSibling).toBe(rootHeaderNode);
      expect(rootContentNode?.nextSibling).toBe(rootFooterNode);

      expect(pageNode?.isRoot()).toBe(true);
      expect(pageNode?.contains(textFieldNode)).toBe(true);
      expect(textFieldNode?.getRoot()).toBe(pageNode);
      expect(columnNode?.getRoot()).toBe(pageNode);
      expect(columnsLayoutNode?.getRoot()).toBe(pageNode);
      expect(cardContentNode?.getRoot()).toBe(pageNode);
      expect(cardNode?.getRoot()).toBe(pageNode);
      expect(formNode?.getRoot()).toBe(pageNode);
      expect(rootContentNode?.getRoot()).toBe(pageNode);
    });

    it('基本的节点模型初始化，节点新建、删除等事件', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const getNode = currentDocument?.getNode.bind(currentDocument);
      const createNode = currentDocument?.createNode.bind(currentDocument);

      const pageNode = getNode?.('page');
      const nodeCreateHandler = jest.fn();
      const offCreate = currentDocument?.onNodeCreate(nodeCreateHandler);

      const node = createNode?.({
        componentName: 'TextInput',
        props: {
          propA: 'haha',
        },
      });
      pageNode && node && currentDocument?.insertNode(pageNode, node);

      expect(nodeCreateHandler).toHaveBeenCalledTimes(1);
      expect(nodeCreateHandler.mock.calls[0][0]).toBe(node);
      expect(nodeCreateHandler.mock.calls[0][0].componentName).toBe('TextInput');
      expect(nodeCreateHandler.mock.calls[0][0].getPropValue('propA')).toBe('haha');

      const nodeDestroyHandler = jest.fn();
      const offDestroy = currentDocument?.onNodeDestroy(nodeDestroyHandler);
      node?.remove();
      expect(nodeDestroyHandler).toHaveBeenCalledTimes(1);
      expect(nodeDestroyHandler.mock.calls[0][0]).toBe(node);
      expect(nodeDestroyHandler.mock.calls[0][0].componentName).toBe('TextInput');
      expect(nodeDestroyHandler.mock.calls[0][0].getPropValue('propA')).toBe('haha');

      offCreate();
      offDestroy();
    });

    it.skip('基本的节点模型初始化，节点插入等方法', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const getNode = currentDocument.getNode.bind(currentDocument);

      const formNode = getNode('form');
      const node1 = currentDocument.createNode({
        componentName: 'TextInput',
        props: {
          propA: 'haha',
        },
      });
      const node2 = currentDocument.createNode({
        componentName: 'TextInput',
        props: {
          propA: 'heihei',
        },
      });
      const node3 = currentDocument.createNode({
        componentName: 'TextInput',
        props: {
          propA: 'heihei2',
        },
      });
      const node4 = currentDocument.createNode({
        componentName: 'TextInput',
        props: {
          propA: 'heihei3',
        },
      });

      formNode?.insertBefore(node2);
      // formNode?.insertBefore(node1, node2);
      // formNode?.insertAfter(node3);
      // formNode?.insertAfter(node4, node3);

      expect(formNode?.children?.get(0)).toBe(node1);
      expect(formNode?.children?.get(1)).toBe(node2);
      // expect(formNode?.children?.get(5)).toBe(node3);
      // expect(formNode?.children?.get(6)).toBe(node4);
    });

    it('基本的节点模型初始化，节点其他方法', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const getNode = currentDocument.getNode.bind(currentDocument);

      const pageNode = getNode('page');
      expect(pageNode?.isPage()).toBe(true);
      expect(pageNode?.isComponent()).toBe(false);
      expect(pageNode?.isSlot()).toBe(false);
      expect(pageNode?.title).toBe("hey, i' a page!");
    });

    describe('节点新增（insertNode）', () => {
      let project: Project;
      beforeEach(() => {
        project = new Project(designer, {
          componentsTree: [formSchema],
        });
        project.open();
      });
      it('场景一：插入 NodeSchema，不指定 index', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const { nodesMap } = currentDocument;
        const formNode = nodesMap.get('form') as Node;
        const formNode2 = currentDocument?.getNode('form');
        expect(formNode).toEqual(formNode2);
        currentDocument?.insertNode(formNode, {
          componentName: 'TextInput',
          id: 'nodeschema-id1',
          props: {
            propA: 'haha',
            propB: 3,
          },
        });
        expect(nodesMap.size).toBe(ids.length + 1);
        expect(formNode.children?.length).toBe(4);
        const insertedNode = formNode.children.get(formNode.children.length - 1);
        expect(insertedNode.componentName).toBe('TextInput');
        expect(insertedNode.propsData).toEqual({
          propA: 'haha',
          propB: 3,
        });
        // TODO: 把 checkId 的 commit pick 过来
        // expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
      });

      it('场景一：插入 NodeSchema，指定 index: 0', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form');
        formNode &&
          currentDocument?.insertNode(
            formNode,
            {
              componentName: 'TextInput',
              id: 'nodeschema-id1',
              props: {
                propA: 'haha',
                propB: 3,
              },
            },
            0,
          );
        expect(nodesMap?.size).toBe(ids.length + 1);
        expect(formNode?.children?.length).toBe(4);
        const insertedNode = formNode?.children?.get(0);
        expect(insertedNode?.componentName).toBe('TextInput');
        expect(insertedNode?.propsData).toEqual({
          propA: 'haha',
          propB: 3,
        });
        // TODO: 把 checkId 的 commit pick 过来
        // expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
      });

      it('场景一：插入 NodeSchema，指定 index: 1', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form');
        formNode &&
          currentDocument?.insertNode(
            formNode,
            {
              componentName: 'TextInput',
              id: 'nodeschema-id1',
              props: {
                propA: 'haha',
                propB: 3,
              },
            },
            1,
          );
        expect(nodesMap?.size).toBe(ids.length + 1);
        expect(formNode?.children?.length).toBe(4);
        const insertedNode = formNode?.children?.get(1);
        expect(insertedNode?.componentName).toBe('TextInput');
        expect(insertedNode?.propsData).toEqual({
          propA: 'haha',
          propB: 3,
        });
        // TODO: 把 checkId 的 commit pick 过来
        // expect(nodesMap.get('nodeschema-id1').componentName).toBe('TextInput');
      });

      it('场景一：插入 NodeSchema，有 children', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form') as INode;
        currentDocument?.insertNode(formNode, {
          componentName: 'ParentNode',
          props: {
            propA: 'haha',
            propB: 3,
          },
          children: [
            {
              componentName: 'SubNode',
              props: {
                propA: 'haha',
                propB: 3,
              },
            },
            {
              componentName: 'SubNode2',
              props: {
                propA: 'haha',
                propB: 3,
              },
            },
          ],
        });
        expect(nodesMap?.size).toBe(ids.length + 3);
        expect(formNode.children?.length).toBe(4);
        expect(formNode.children?.get(3)?.componentName).toBe('ParentNode');
        expect(formNode.children?.get(3)?.children?.get(0)?.componentName).toBe('SubNode');
        expect(formNode.children?.get(3)?.children?.get(1)?.componentName).toBe('SubNode2');
      });

      it.skip('场景一：插入 NodeSchema，id 与现有 schema 里的 id 重复', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form');
        formNode &&
          currentDocument?.insertNode(formNode, {
            componentName: 'TextInput',
            id: 'nodeschema-id1',
            props: {
              propA: 'haha',
              propB: 3,
            },
          });
        expect(nodesMap?.get('nodeschema-id1')?.componentName).toBe('TextInput');
        expect(nodesMap?.size).toBe(ids.length + 1);
      });

      it.skip('场景一：插入 NodeSchema，id 与现有 schema 里的 id 重复，但关闭了 id 检测器', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form');
        formNode &&
          currentDocument?.insertNode(formNode, {
            componentName: 'TextInput',
            id: 'nodeschema-id1',
            props: {
              propA: 'haha',
              propB: 3,
            },
          });
        expect(nodesMap?.get('nodeschema-id1')?.componentName).toBe('TextInput');
        expect(nodesMap?.size).toBe(ids.length + 1);
      });

      it('场景二：插入 Node 实例', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form');
        const inputNode = currentDocument?.createNode({
          componentName: 'TextInput',
          id: 'nodeschema-id2',
          props: {
            propA: 'haha',
            propB: 3,
          },
        });
        formNode && currentDocument?.insertNode(formNode, inputNode);
        expect(formNode?.children?.get(3)?.componentName).toBe('TextInput');
        expect(nodesMap?.size).toBe(ids.length + 1);
      });

      it('场景三：插入 JSExpression', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form') as Node;
        currentDocument?.insertNode(formNode, {
          type: 'JSExpression',
          value: 'just a expression',
        });
        expect(nodesMap?.size).toBe(ids.length + 1);
        expect(formNode.children?.get(3)?.componentName).toBe('Leaf');
        // expect(formNode.children?.get(3)?.children).toEqual({
        //   type: 'JSExpression',
        //   value: 'just a expression'
        // });
      });
      it('场景四：插入 string', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form') as Node;
        currentDocument?.insertNode(formNode, 'just a string');
        expect(nodesMap?.size).toBe(ids.length + 1);
        expect(formNode.children?.get(3)?.componentName).toBe('Leaf');
        // expect(formNode.children?.get(3)?.children).toBe('just a string');
      });
    });

    describe('节点新增（insertNodes）', () => {
      let project: Project;
      beforeEach(() => {
        project = new Project(designer, {
          componentsTree: [formSchema],
        });
        project.open();
      });
      it('场景一：插入 NodeSchema，指定 index', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form') as Node;
        const formNode2 = currentDocument?.getNode('form');
        expect(formNode).toEqual(formNode2);
        currentDocument?.insertNodes(
          formNode,
          [
            {
              componentName: 'TextInput',
              props: {
                propA: 'haha2',
                propB: 3,
              },
            },
            {
              componentName: 'TextInput2',
              props: {
                propA: 'haha',
                propB: 3,
              },
            },
          ],
          1,
        );
        expect(nodesMap?.size).toBe(ids.length + 2);
        expect(formNode.children?.length).toBe(5);
        const insertedNode1 = formNode.children?.get(1);
        const insertedNode2 = formNode.children?.get(2);
        expect(insertedNode1?.componentName).toBe('TextInput');
        expect(insertedNode1?.propsData).toEqual({
          propA: 'haha2',
          propB: 3,
        });
        expect(insertedNode2?.componentName).toBe('TextInput2');
        expect(insertedNode2?.propsData).toEqual({
          propA: 'haha',
          propB: 3,
        });
      });

      it.only('场景二：插入 Node 实例，指定 index', () => {
        expect(project).toBeTruthy();
        const ids = getIdsFromSchema(formSchema);
        const { currentDocument } = project;
        const nodesMap = currentDocument?.nodesMap;
        const formNode = nodesMap?.get('form') as INode;
        const formNode2 = currentDocument?.getNode('form');
        expect(formNode).toEqual(formNode2);
        const createdNode1 = currentDocument?.createNode({
          componentName: 'TextInput',
          props: {
            propA: 'haha2',
            propB: 3,
          },
        });
        const createdNode2 = currentDocument?.createNode({
          componentName: 'TextInput2',
          props: {
            propA: 'haha',
            propB: 3,
          },
        });
        currentDocument?.insertNodes(formNode, [createdNode1, createdNode2], 1);
        expect(nodesMap?.size).toBe(ids.length + 2);
        expect(formNode.children?.length).toBe(5);
        const insertedNode1 = formNode.children?.get(1);
        const insertedNode2 = formNode.children?.get(2);
        expect(insertedNode1?.componentName).toBe('TextInput');
        expect(insertedNode1?.propsData).toEqual({
          propA: 'haha2',
          propB: 3,
        });
        expect(insertedNode2?.componentName).toBe('TextInput2');
        expect(insertedNode2?.propsData).toEqual({
          propA: 'haha',
          propB: 3,
        });
      });
    });
  });

  describe('block ❌ | component ❌ | slot ✅', () => {
    it('基本的 slot 创建', () => {
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
      const nodesMap = currentDocument?.nodesMap;
      const ids = getIdsFromSchema(formSchema);
      // 目前每个 slot 会新增（1 + children.length）个节点
      const expectedNodeCnt = ids.length + 2;
      expect(nodesMap?.size).toBe(expectedNodeCnt);
      // PageHeader
      expect(nodesMap?.get('node_k1ow3cbd')?.slots).toHaveLength(1);
    });
  });
});
