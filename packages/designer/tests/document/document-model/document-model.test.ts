import '../../fixtures/window';
window.matchMedia('width=600px');
import { DocumentModel } from '../../../src/document/document-model';
// const { DocumentModel } = require('../../../src/document/document-model');
// const { Node } = require('../__mocks__/node');

describe.skip('basic utility', () => {
  test('delegateMethod - useOriginMethodName', () => {

    const node = new DocumentModel({}, {
      componentName: 'Component',
    });
    console.log(node);
    expect(1).toBe(1);
  });
});
