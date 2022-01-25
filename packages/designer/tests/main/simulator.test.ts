import '../fixtures/window';
import { isSimulatorHost } from '../../src/simulator';

it('isSimulatorHost', () => {
  expect(isSimulatorHost({ isSimulator: true })).toBeTruthy();
  expect(isSimulatorHost({ a: 1 })).toBeFalsy();
});
