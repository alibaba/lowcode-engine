import '../fixtures/window';
import { parseMetadata } from '../../src/builtin-simulator/utils/parse-metadata';

describe('parseMetadata', () => {
  it('parseMetadata', async () => {
    console.log(parseMetadata('Div'))
    console.log(parseMetadata({ componentName: 'Div' }));
  });
});