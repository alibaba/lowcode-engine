import ResourceConsumer from '../../src/builtin-simulator/resource-consumer';
import { delayObxTick, delay } from '../utils';

it('ResourceConsumer 测试，先消费再监听', async () => {
  const con = new ResourceConsumer(() => ({ a: 1, b: 2}));

  const mockFn = jest.fn();
  con.consume((data) => {
    mockFn(data);
  });

  await delay(1000);

  expect(mockFn).toHaveBeenCalledWith({ a: 1, b: 2 });
  con.consume(() => {});

  await con.waitFirstConsume();

  con.dispose();
});

it('ResourceConsumer 测试，先消费再监听，isSimulatorRenderer', async () => {
  const mockFn = jest.fn();
  const con = new ResourceConsumer(() => ({ a: 1, b: 2}), () => {
    const o = { a: 3, b: 4 };
    mockFn(o)
    return o;
  });

  con.consume({ isSimulatorRenderer: true });

  await delay(1000);

  expect(mockFn).toHaveBeenCalledWith({ a: 3, b: 4 });
  con.consume(() => {});

  await con.waitFirstConsume();
});

it('ResourceConsumer 测试，先消费再监听，isSimulatorRenderer，没有 consume', async () => {
  const mockFn = jest.fn();
  const con = new ResourceConsumer(() => ({ a: 1, b: 2}));

  con.consume({ isSimulatorRenderer: true });
});

it('ResourceConsumer 测试，先监听再消费', async () => {
  const con = new ResourceConsumer(() => ({ a: 1, b: 2}));

  con.waitFirstConsume();

  const mockFn = jest.fn();
  con.consume((data) => {
    mockFn(data);
  });

  await delay(1000);

  expect(mockFn).toHaveBeenCalledWith({ a: 1, b: 2 });
});