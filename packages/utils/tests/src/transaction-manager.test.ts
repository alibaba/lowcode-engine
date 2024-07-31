import { transactionManager } from '../../src/transaction-manager';
import { IPublicEnumTransitionType } from '@alilc/lowcode-types';

const type = IPublicEnumTransitionType.REPAINT;

describe('TransactionManager', () => {
  let fn1: jest.Mock;
  let fn2: jest.Mock;

  beforeEach(() => {
    fn1 = jest.fn();
    fn2 = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('executeTransaction should emit startTransaction and endTransaction events', () => {
    const startTransactionSpy = jest.spyOn(transactionManager.emitter, 'emit');
    const endTransactionSpy = jest.spyOn(transactionManager.emitter, 'emit');

    transactionManager.executeTransaction(() => {
      // Perform some action within the transaction
    });

    expect(startTransactionSpy).toHaveBeenCalledWith(`[${type}]startTransaction`);
    expect(endTransactionSpy).toHaveBeenCalledWith(`[${type}]endTransaction`);
  });

  test('onStartTransaction should register the provided function for startTransaction event', () => {
    const offSpy = jest.spyOn(transactionManager.emitter, 'off');

    const offFunction = transactionManager.onStartTransaction(fn1);

    expect(transactionManager.emitter.listenerCount(`[${type}]startTransaction`)).toBe(1);
    expect(offSpy).not.toHaveBeenCalled();

    offFunction();

    expect(transactionManager.emitter.listenerCount(`[${type}]startTransaction`)).toBe(0);
    expect(offSpy).toHaveBeenCalledWith(`[${type}]startTransaction`, fn1);
  });

  test('onEndTransaction should register the provided function for endTransaction event', () => {
    const offSpy = jest.spyOn(transactionManager.emitter, 'off');

    const offFunction = transactionManager.onEndTransaction(fn2);

    expect(transactionManager.emitter.listenerCount(`[${type}]endTransaction`)).toBe(1);
    expect(offSpy).not.toHaveBeenCalled();

    offFunction();

    expect(transactionManager.emitter.listenerCount(`[${type}]endTransaction`)).toBe(0);
    expect(offSpy).toHaveBeenCalledWith(`[${type}]endTransaction`, fn2);
  });
});
