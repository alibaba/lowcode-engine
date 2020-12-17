import { Detecting } from '../../src/designer/detecting';

it('Detecting 测试', () => {
  const detecting = new Detecting();

  expect(detecting.enable).toBeTruthy();

  const mockNode = { document };
  detecting.capture(mockNode);
  expect(detecting.current).toBe(mockNode);

  detecting.release(mockNode);
  expect(detecting.current).toBeNull();

  detecting.capture(mockNode);
  detecting.leave(document);
  expect(detecting.current).toBeNull();

  detecting.capture(mockNode);
  detecting.enable = false;
  expect(detecting.current).toBeNull();
});