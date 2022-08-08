import { Detecting } from '../../src/designer/detecting';

it('Detecting 测试', () => {
  const fn = jest.fn();
  const detecting = new Detecting();
  detecting.onDetectingChange(fn);

  expect(detecting.enable).toBeTruthy();

  const mockNode = { document };
  detecting.capture(mockNode);
  expect(fn).toHaveBeenCalledWith(detecting.current);
  expect(detecting.current).toBe(mockNode);

  detecting.release({});
  detecting.release(mockNode);
  expect(detecting.current).toBeNull();

  detecting.capture(mockNode);
  detecting.leave(document);
  expect(detecting.current).toBeNull();

  detecting.capture(mockNode);
  detecting.enable = false;
  expect(detecting.current).toBeNull();
});
