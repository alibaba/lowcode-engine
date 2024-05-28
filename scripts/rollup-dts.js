import { join } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import { env, exit } from 'node:process';
import console from 'node:console';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { rimraf } from 'rimraf';

const libPath = env.PWD;
const packages = readdirSync(join(libPath, 'temp/packages'));
const typeTempIndexPath = join(libPath, 'temp/packages', packages[0], 'src/index.d.ts');

if (!existsSync(typeTempIndexPath)) {
  console.error('🚨类型入口路径错误');
  exit(1);
}

async function run() {
  const configObject = ExtractorConfig.loadFile('../../api-extractor.json');
  configObject.mainEntryPointFilePath = typeTempIndexPath;

  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    projectFolderLookupToken: libPath,
    packageJsonFullPath: join(libPath, 'package.json'),
  });

  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    console.log('🚀类型声明文件生成成功！！！');

    await rimraf(join(libPath, 'temp'));
  } else {
    console.error(
      '🚨类型声明文件生成失败：' +
        +`\n\t${extractorResult.errorCount} errors` +
        `\n\tand ${extractorResult.warningCount} warnings`,
    );
    exit(1);
  }
}

run();
