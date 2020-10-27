import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import CodeGenerator from '@ali/lowcode-code-generator';

@Injectable()
export class ApiService {
  async generateProject(schema: string) {
    const tmpDir = os.tmpdir();
    const createIceJsProjectBuilder = CodeGenerator.solutions.icejs;
    const builder = createIceJsProjectBuilder();
    const publisher = CodeGenerator.publishers.zip({
      outputPath: tmpDir,
      projectSlug: 'demo-project',
    });
    const filePath = path.join(tmpDir, 'demo-project.zip');

    const result = await builder.generateProject(schema);
    publisher.setProject(result);
    const response = await publisher.publish();
    if (!response.success) {
      throw new Error('generateProject failed');
    }
    return fs.createReadStream(filePath);
  }
}
