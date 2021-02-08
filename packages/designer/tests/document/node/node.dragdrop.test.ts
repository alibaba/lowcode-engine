import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../../fixtures/window';
import { Project } from '../../../src/project/project';
import { Node } from '../../../src/document/node/node';
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

describe.skip('节点拖拽测试', () => {
  describe('block ❌ | component ❌ | slot ❌', () => {
    it('修改普通属性，string | number', () => {
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
  });
});
