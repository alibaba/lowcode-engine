import '../../fixtures/window';
import { parseMetadata } from '../../../src/builtin-simulator/utils/parse-metadata';

describe('parseMetadata', () => {
  it('parseMetadata', async () => {
    const md1 = parseMetadata('Div');
    const md2 = parseMetadata({ componentName: 'Div' });
  });
  it('LowcodeTypes.shape', async () => {
    const result = (window as any).PropTypes.shape()
    expect(result).toBeDefined();
  });
});
