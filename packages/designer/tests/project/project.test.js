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

describe('schema 渲染测试', () => {
  it('最简单的例子，练手用', () => {
    const project = new Project(designer, {
      componentsTree: [{
        componentName: 'Page',
        id: 'page_id',
        props: {
          name: 'haha',
        },
        children: [{
          componentName: 'Div',
          id: 'div_id',
          props: {
            name: 'div from haha',
          },
        }],
      }],
    });
    project.open();
    expect(project).toBeTruthy();
    const { currentDocument } = project;
    const { nodesMap } = currentDocument;
    // console.log(project.currentDocument.nodesMap.get('div_id').props.items);
    expect(nodesMap.has('page_id')).toBeTruthy;
    expect(nodesMap.has('div_id')).toBeTruthy;
    expect(mockCreateSettingEntry).toBeCalledTimes(2);
    // console.log(currentDocument.export(3));
  });

  it.only('普通场景，无 block / component，无 slot', () => {
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
    ids.forEach(id => {
      expect(nodesMap.get(id).componentName).toBe(getNodeFromSchemaById(formSchema, id).componentName);
    });
    // console.log(nodesMap.get('node_k1ow3cb9').componentName, getNodeFromSchemaById(formSchema, 'node_k1ow3cb9').componentName)
    console.log(nodesMap.size);
    // expect(nodesMap.has('page_id')).toBeTruthy;
    // expect(nodesMap.has('div_id')).toBeTruthy;
    // expect(mockCreateSettingEntry).toBeCalledTimes(2);
    // console.log(currentDocument.export(3));
  });

  it('普通场景，无 block / component，有 slot', () => {});
  it('普通场景，无 block / component，有 slot', () => {});
});