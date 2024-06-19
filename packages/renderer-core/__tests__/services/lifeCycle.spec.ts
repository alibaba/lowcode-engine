import { describe, it, expect } from 'vitest';
import { LifeCycleService, LifecyclePhase } from '../../src/services/lifeCycleService';

const sleep = () => new Promise((r) => setTimeout(r, 500));

describe('LifeCycleService', () => {
  it('it works', async () => {
    let result = '';
    const lifeCycle = new LifeCycleService();

    lifeCycle.when(LifecyclePhase.Ready).then(() => {
      result += '1';
    });
    lifeCycle.when(LifecyclePhase.Ready).finally(() => {
      result += '2';
    });
    lifeCycle.when(LifecyclePhase.AfterInitPackageLoad).then(() => {
      result += '3';
    });
    lifeCycle.when(LifecyclePhase.AfterInitPackageLoad).finally(() => {
      result += '4';
    });

    lifeCycle.phase = LifecyclePhase.Ready;

    await sleep();

    expect(result).toEqual('12');

    lifeCycle.phase = LifecyclePhase.AfterInitPackageLoad;

    await sleep();

    expect(result).toEqual('1234');
  });
});
