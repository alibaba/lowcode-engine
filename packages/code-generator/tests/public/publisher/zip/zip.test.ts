import CodeGen from '../../../../src';

describe('public/publisher/zip/zip', () => {
  it('should works', async () => {
    const zip = CodeGen.publishers.zip({
      outputPath: 'demo-output',
      projectSlug: 'example-project',
    });

    const demoProject = {
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

    expect(zip.getOutputPath()).toMatchInlineSnapshot(`"demo-output"`);

    expect(zip.getProject()).toMatchInlineSnapshot(`undefined`);
    zip.setProject(demoProject);
    expect(zip.getProject()).toBeTruthy();

    expect(zip.getOutputPath()).toMatchInlineSnapshot(`"demo-output"`);
    expect(zip.setOutputPath('output')).toBe(undefined);
    expect(zip.getOutputPath()).toMatchInlineSnapshot(`"output"`);

    const publishRes = await zip.publish({
      project: demoProject,
    });

    expect(publishRes.success).toBeTruthy();
    expect(publishRes.payload).toBeTruthy();
  });

  it('should throws Error when project is missing', async () => {
    const zip = CodeGen.publishers.zip({});
    expect(zip.publish()).rejects.toBeTruthy();
  });
});
