import { run } from '../src/cli';

describe('cli', () => {
  // standalone 模式下不需要测试 cli
  if (process.env.TEST_TARGET === 'standalone') {
    it('should ignore', () => {
      expect(true).toBe(true);
    });
    return;
  }

  it('should works for the default example-schema.json', async () => {
    const res = await run(['example-schema.json'], {
      solution: 'icejs',
      output: './demo',
    });
    expect(res).toBe(0);
  });

  it('should works for the default example-schema.json5', async () => {
    const res = await run(['example-schema.json5'], {
      solution: 'icejs',
      output: './demo',
    });
    expect(res).toBe(0);
  });

  it('should returns error for no schema file', async () => {
    const res = await run([], {
      solution: 'icejs',
      output: './demo',
    });

    expect(res).not.toBe(0);
  });

  it('should returns error for to many schema files', async () => {
    const res = await run(['example-schema.json', 'example-schema.json5'], {
      solution: 'icejs',
    });
    expect(res).not.toBe(0);
  });
});
