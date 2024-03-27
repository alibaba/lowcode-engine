import '../fixtures/window';
import { getMockRenderer } from '../utils';
import { isSimulatorRenderer } from '../../src/builtin-simulator/renderer';

describe('renderer 测试', () => {
  it('renderer', () => {
    expect(isSimulatorRenderer(getMockRenderer())).toBeTruthy();
  });
});
