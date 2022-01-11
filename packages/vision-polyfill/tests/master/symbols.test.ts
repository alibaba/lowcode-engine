import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import symbols from '../../src/symbols';

describe('symbols 测试', () => {
  it('API', () => {
    symbols.create('abc');
    symbols.create('abc');
    symbols.get('abc');
  });
});
