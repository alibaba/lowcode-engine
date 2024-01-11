import CodeGen from '../../../../src';
import fileSaver from 'file-saver';
import * as utils from '../../../../src/publisher/zip/utils';

jest.mock('file-saver');

describe('public/publisher/zip/zip', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

    expect(zip.getOutputPath()).toMatchInlineSnapshot('"demo-output"');

    expect(zip.getProject()).toMatchInlineSnapshot('undefined');
    zip.setProject(demoProject);
    expect(zip.getProject()).toBeTruthy();

    expect(zip.getOutputPath()).toMatchInlineSnapshot('"demo-output"');
    expect(zip.setOutputPath('output')).toBe(undefined);
    expect(zip.getOutputPath()).toMatchInlineSnapshot('"output"');

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

  it('should publish the project as a zip file in the browser', async () => {
    const zipContent = 'zip content';
    const zipName = 'example-project';
    jest.spyOn(utils, 'isNodeProcess').mockReturnValue(false);
    // new Zip 里面也有平台判断，所以这里 mock
    jest.spyOn(utils, 'generateProjectZip').mockResolvedValue(zipContent as any);
    const spy = jest.spyOn(fileSaver, 'saveAs');

    const zip = CodeGen.publishers.zip({
      projectSlug: zipName,
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

    zip.setProject(demoProject);
    const publishRes = await zip.publish({
      project: demoProject,
    });

    expect(publishRes.success).toBeTruthy();
    expect(spy).toBeCalledWith(zipContent, `${zipName}.zip`);
    spy.mockReset();
    spy.mockRestore();
  });
});
