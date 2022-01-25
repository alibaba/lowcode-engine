import CodeGen from '../../../../src';
import { ResultDir } from '@alilc/lowcode-types';

describe('public/publisher/disk/disk', () => {
  // standalone 模式下没有 disk publisher
  if (process.env.TEST_TARGET === 'standalone') {
    it('should ignore', () => {
      expect(true).toBe(true);
    });
    return;
  }

  it('should works', async () => {
    const disk = CodeGen.publishers.disk({
      outputPath: 'demo-output',
      projectSlug: 'example-project',
    });

    const demoProject: ResultDir = {
      name: 'demo',
      dirs: [],
      files: [
        {
          name: 'package',
          ext: 'json',
          content: '{ "name": "demo", "version": "1.0.0" }',
        },
      ],
    };

    expect(disk.getOutputPath()).toMatchInlineSnapshot(`"demo-output"`);

    disk.setProject(demoProject);
    expect(disk.getProject()).toBeTruthy();

    expect(disk.getOutputPath()).toMatchInlineSnapshot(`"demo-output"`);
    expect(disk.setOutputPath('output')).toBe(undefined);
    expect(disk.getOutputPath()).toMatchInlineSnapshot(`"output"`);

    const publishRes = await disk.publish({
      project: demoProject,
    });

    expect(publishRes.success).toBeTruthy();
    expect(publishRes.payload).toBeTruthy();
  });

  it('should throws Error when project is missing', async () => {
    const disk = CodeGen.publishers.disk({});
    expect(disk.publish()).rejects.toBeTruthy();

    expect(() => {
      return disk.getProject();
    }).toThrowError(/MissingProject/);
  });
});
