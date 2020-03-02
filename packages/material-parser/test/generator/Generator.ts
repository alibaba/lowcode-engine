import test from 'ava';
import { ensureFile, writeFile } from 'fs-extra';
import { join } from 'path';
import { IComponentMaterial } from '../../src/otter-core';

import Generator from '../../src/generator/Generator';
import ReactParser from '../../src/parser/ReactParser';
import Scanner from '../../src/scanner/Scanner';
import { IMaterializeOptions, IMaterialParsedModel } from '../../src/types';
import { getFromFixtures } from '../helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');
// const antdComptPath = getFromFixtures('antd-component');
const fusionComptPath = getFromFixtures('fusion-next-component');

async function generate(
  options: IMaterializeOptions
): Promise<IComponentMaterial> {
  const scanner = new Scanner(options);
  const scanModel = await scanner.scan();
  const parser = new ReactParser(options);
  const parsedModels: IMaterialParsedModel[] = await parser.parse(scanModel);
  const generator = new Generator(options);
  const actual: IComponentMaterial = await generator.generate(
    scanModel,
    parsedModels
  );

  return actual;
}

test.serial('generate multiple exported components', async t => {
  const options: IMaterializeOptions = {
    cwd: multiExportedComptPath,
    entry: multiExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: true,
  };

  const actual = await generate(options);

  t.snapshot(actual);
});

test.only('generate single exported components', async t => {
  const options: IMaterializeOptions = {
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: false,
  };
  // const scanner = new Scanner(options);
  // const scanModel = await scanner.scan();
  // const parser = new ReactParser(options);
  // const parsedModels: IMaterialParsedModel[] = await parser.parse(scanModel);
  // const generator = new Generator(options);
  // t.log('parsedModels', JSON.stringify(parsedModels,null,2));
  // const actual: IComponentMaterial = await generator.generate(
  //   scanModel,
  //   parsedModels
  // );
  const actual = await generate(options);

  t.snapshot(actual);
});

test.serial('generate single exported components with extensions', async t => {
  const options: IMaterializeOptions = {
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: false,
    extensions: {
      'mat:config:manifest': async (params: {
        manifestObj: IComponentMaterial;
        manifestFilePath: string;
      }): Promise<{
        manifestJSON: string;
        manifestFilePath: string;
        manifestObj: IComponentMaterial;
      }> => {
        const manifestJSON: string = JSON.stringify(
          params.manifestObj
        );
        // 将 manifest 文件存储到指定目录下
        const manifestFilePath = params.manifestFilePath.replace(
          '/es/',
          '/src/'
        );
        await writeFile(manifestFilePath, manifestJSON);
        return {
          manifestJSON,
          manifestObj: params.manifestObj,
          manifestFilePath,
        };
      },
    },
  };

  const actual = await generate(options);

  t.snapshot(actual);
});

test.serial(
  'generate multiple exported components with extensions',
  async t => {
    const options: IMaterializeOptions = {
      cwd: multiExportedComptPath,
      entry: multiExportedComptPath,
      accesser: 'local',
      isExportedAsMultiple: true,
      extensions: {
        'mat:config:manifest': async (params: {
          manifestObj: IComponentMaterial;
          manifestFilePath: string;
        }): Promise<{
          manifestJSON: string;
          manifestFilePath: string;
          manifestObj: IComponentMaterial;
        }> => {
          const manifestJSON: string = JSON.stringify(
            params.manifestObj
          );
          // 将 manifest 文件存储到指定目录下
          const manifestFilePath = params.manifestFilePath.replace(
            '/es/',
            '/src/'
          );

          await writeFile(manifestFilePath, manifestJSON);

          return Promise.resolve({
            manifestJSON,
            manifestObj: params.manifestObj,
            manifestFilePath,
          });
        },
      },
    };

    const actual = await generate(options);

    t.snapshot(actual);
  }
);

// test.serial('generate @alife/next components', async t => {
//   const options: IMaterializeOptions = {
//     cwd: fusionComptPath,
//     entry: join(fusionComptPath, 'node_modules/@alife/next'),
//     accesser: 'local',
//     isExportedAsMultiple: true,
//     extensions: {
//       'mat:config:manifest': async (params: {
//         manifestObj: IComponentMaterial;
//         manifestFilePath: string;
//       }): Promise<{
//         manifestJSON: string;
//         manifestFilePath: string;
//         manifestObj: IComponentMaterial;
//       }> => {
//         const manifestJSON: string = JSON.stringify(
//           params.manifestObj
//         );
//         // 将 manifest 文件存储到指定目录下
//         const manifestFilePath = params.manifestFilePath.replace(
//           '/node_modules/@alife/next/es/',
//           '/src/@alife/next/'
//         );

//         await ensureFile(manifestFilePath);
//         await writeFile(manifestFilePath, manifestJSON);

//         return Promise.resolve({
//           manifestJSON,
//           manifestObj: params.manifestObj,
//           manifestFilePath,
//         });
//       },
//     },
//   };

//   const actual = await generate(options);

//   t.snapshot(actual);
// });
