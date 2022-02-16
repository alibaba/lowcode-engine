import '../fixtures/window';
import { ActiveTracker } from '../../src/designer/active-tracker';

it('ActiveTracker 测试，Node', () => {
  const tracker = new ActiveTracker();

  const mockFn = jest.fn();
  const mockNode = { isNode: true };
  const off = tracker.onChange(mockFn);

  tracker.track(mockNode);
  expect(mockFn).toHaveBeenCalledWith({ node: mockNode });

  expect(tracker.currentNode).toBe(mockNode);

  off();
  mockFn.mockClear();
  tracker.track(mockNode);
  expect(mockFn).not.toHaveBeenCalled();
});

it('ActiveTracker 测试，ActiveTarget', () => {
  const tracker = new ActiveTracker();

  const mockFn = jest.fn();
  const mockNode = { isNode: true };
  const off = tracker.onChange(mockFn);
  const mockTarget = { node: mockNode, detail: { isDetail: true }, instance: { isInstance: true } };

  tracker.track(mockTarget);
  expect(mockFn).toHaveBeenCalledWith(mockTarget);

  expect(tracker.currentNode).toBe(mockNode);
  expect(tracker.detail).toEqual({ isDetail: true });
  expect(tracker.instance).toEqual({ isInstance: true });

  off();
  mockFn.mockClear();
  tracker.track(mockNode);
  expect(mockFn).not.toHaveBeenCalled();
});
