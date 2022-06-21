import '../../fixtures/window';
import { Session } from '../../../src/document/history';
import { delay } from '../../utils/misc';

describe('Session', () => {
  it('constructor', () => {
    const session = new Session(1, { a: 1 });
    expect(session.cursor).toBe(1);
    expect(session.data).toEqual({ a: 1 });
    // @ts-ignore
    expect(session.timeGap).toBe(1000);
    expect(session.isActive()).toBeTruthy();
  });

  it('log()', () => {
    const session = new Session(1, { a: 1 });

    session.log({ a: 2 });
    session.log({ a: 3 });
    expect(session.data).toEqual({ a: 3 });
  });

  it('end()', () => {
    const session = new Session(1, { a: 1 });

    session.end();
    expect(session.isActive()).toBeFalsy();
    session.log({ a: 2 });
    // log is not possible if current session is inactive
    expect(session.data).toEqual({ a: 1 });
  });


  it('timeGap', async () => {
    const session = new Session(1, { a: 1 });

    expect(session.isActive()).toBeTruthy();
    await delay(1200);
    expect(session.isActive()).toBeFalsy();
    session.log({ a: 2 });
    // log is not possible if current session is inactive
    expect(session.data).toEqual({ a: 1 });
  });

  it('custom timeGap', async () => {
    const session = new Session(1, { a: 1 }, 2000);

    expect(session.isActive()).toBeTruthy();
    await delay(1200);
    expect(session.isActive()).toBeTruthy();
    await delay(1000);
    expect(session.isActive()).toBeFalsy();
    session.log({ a: 2 });
    // log is not possible if current session is inactive
    expect(session.data).toEqual({ a: 1 });
  });
});