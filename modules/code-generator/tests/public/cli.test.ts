import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const PROJECT_ROOT = path.resolve(__dirname, '../..');

describe('cli - lowcode-code-generator', () => {
  it('should works', () => {
    const res = spawnSync('node bin/lowcode-code-generator --solution icejs example-schema.json', {
      shell: true,
      stdio: 'pipe',
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
    });

    expect({
      status: res.status,
      stdout: res.stdout,
      stderr: res.stderr,
    }).toMatchInlineSnapshot(`
      Object {
        "status": 0,
        "stderr": "",
        "stdout": "",
      }
    `);

    expect(
      fs.existsSync(path.join(PROJECT_ROOT, 'generated/src/pages/Test/index.jsx')),
    ).toBeTruthy();
  });
});
