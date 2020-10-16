import '../../fixtures/window';
import { DocumentModel } from '../../../src/document/document-model';
import { Node } from '../../../src/document/node/node';
// import { Node2 } from './__mocks__/node';

jest.mock('../../../src/document/document-model', () => {
  return {
    DocumentModel: jest.fn().mockImplementation(() => {
      return {
        project: {
          designer: { createSettingEntry() {}, transformProps() {} },
          getSchema() {},
        },
        nextId() {},
      };
    }),
  };
});

describe('basic utility', () => {
  test('delegateMethod - useOriginMethodName', () => {
    const dm = new DocumentModel({} as any, {} as any);
    console.log(dm.nextId);
    const node = new Node(dm, { componentName: 'Leaf' });
    console.log(node);
    expect(1).toBe(1);
  });
});
