import { set, cloneDeep } from 'lodash-es';
import '../../fixtures/window';
import { Project } from '../../../src/project/project';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import { getIdsFromSchema } from '../../utils';

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

describe('节点模型删除测试', () => {
  it('删除叶子节点', () => {
    const project = new Project(designer, {
      componentsTree: [formSchema],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap } = currentDocument;
    const ids = getIdsFromSchema(formSchema);
    const originalNodeCnt = ids.length;
    expect(nodesMap.size).toBe(originalNodeCnt);

    currentDocument?.removeNode('node_k1ow3cbn');
    // Button#1
    expect(nodesMap.size).toBe(originalNodeCnt - 1);

    currentDocument?.removeNode(nodesMap.get('node_k1ow3cbp'));
    // Button#2
    expect(nodesMap.size).toBe(originalNodeCnt - 2);

    currentDocument?.removeNode('unexisting_node');
    expect(nodesMap.size).toBe(originalNodeCnt - 2);
  });

  it('删除叶子节点，带有 slot', () => {
    const formSchemaWithSlot = set(
      cloneDeep(formSchema),
      'children[1].children[0].children[2].children[1].props.greeting.type',
      'JSSlot',
    );
    const project = new Project(designer, {
      componentsTree: [formSchemaWithSlot],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap } = currentDocument;
    const ids = getIdsFromSchema(formSchema);
    const originalNodeCnt = ids.length + 2;
    expect(nodesMap.size).toBe(originalNodeCnt);

    currentDocument?.removeNode('node_k1ow3cbp');
    // Button + Slot + Text
    expect(nodesMap.size).toBe(originalNodeCnt - 3);
  });

  it('删除分支节点', () => {
    const project = new Project(designer, {
      componentsTree: [formSchema],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap } = currentDocument;
    const ids = getIdsFromSchema(formSchema);
    const originalNodeCnt = ids.length;
    expect(nodesMap.size).toBe(originalNodeCnt);

    currentDocument?.removeNode('node_k1ow3cbo');
    // Div + 2 * Button
    expect(nodesMap.size).toBe(originalNodeCnt - 3);
  });

  it('删除分支节点，带有 slot', () => {
    const formSchemaWithSlot = set(
      cloneDeep(formSchema),
      'children[1].children[0].children[2].children[1].props.greeting.type',
      'JSSlot',
    );
    const project = new Project(designer, {
      componentsTree: [formSchemaWithSlot],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap } = currentDocument;
    const ids = getIdsFromSchema(formSchema);
    const originalNodeCnt = ids.length + 2;
    expect(nodesMap.size).toBe(originalNodeCnt);

    currentDocument?.removeNode('node_k1ow3cbo');
    // Div + 2 * Button + Slot + Text
    expect(nodesMap.size).toBe(originalNodeCnt - 5);
  });
});
