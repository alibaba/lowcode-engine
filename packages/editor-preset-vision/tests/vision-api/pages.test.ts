import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import VisualEngine from '../../src';
// import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';

// const mockCreateSettingEntry = jest.fn();
// jest.mock('../../src/designer/designer', () => {
//   return {
//     Designer: jest.fn().mockImplementation(() => {
//       return {
//         getComponentMeta() {
//           return {
//             getMetadata() {
//               return { experimental: null };
//             },
//           };
//         },
//         transformProps(props) { return props; },
//         createSettingEntry: mockCreateSettingEntry,
//         postEvent() {},
//       };
//     }),
//   };
// });



// let designer = null;
// beforeAll(() => {
//   designer = new Designer({});
// });

describe('schema 生成节点模型测试', () => {
  describe('block ❌ | component ❌ | slot ❌', () => {
    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      console.log(VisualEngine);

      console.log(VisualEngine.Pages.addPage(formSchema));
    });
  });
});