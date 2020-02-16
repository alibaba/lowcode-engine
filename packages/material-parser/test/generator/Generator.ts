import test from 'ava';
test.serial('generator', (t) => {
  t.pass();
})
// import { ensureFile, writeFile } from 'fs-extra';
// import { join } from 'path';
// import ReactCompiler from '../../src/generator/compiler/ReactCompiler';
// import { IMaterialinManifest, IMaterialinSchema } from '../../src/otter-core';

// import Generator from '../../src/generator/Generator';
// import ReactParser from '../../src/parser/ReactParser';
// import Scanner from '../../src/scanner/Scanner';
// import { IMaterializeOptions, IMaterialParsedModel } from '../../src/types';
// import { getFromFixtures } from '../helpers';

// const multiExportedComptPath = getFromFixtures('multiple-exported-component');
// const singleExportedComptPath = getFromFixtures('single-exported-component');
// // const antdComptPath = getFromFixtures('antd-component');
// // const fusionComptPath = getFromFixtures('fusion-next-component');

// async function generate(
//   options: IMaterializeOptions
// ): Promise<IMaterialinSchema> {
//   const scanner = new Scanner(options);
//   const scanModel = await scanner.scan();
//   const parser = new ReactParser(options);
//   const parsedModels: IMaterialParsedModel[] = await parser.parse(scanModel);
//   const generator = new Generator(options, new ReactCompiler());
//   const actual: IMaterialinSchema = await generator.generate(
//     scanModel,
//     parsedModels
//   );

//   return actual;
// }

// // test.serial('generate multiple exported components', async t => {
// //   const options: IMaterializeOptions = {
// //     cwd: multiExportedComptPath,
// //     entry: multiExportedComptPath,
// //     accesser: 'local',
// //     isExportedAsMultiple: true,
// //   };

// //   const actual = await generate(options);

// //   t.snapshot(actual);
// // });

// test.serial('generate single exported components', async t => {
//   const options: IMaterializeOptions = {
//     cwd: singleExportedComptPath,
//     entry: singleExportedComptPath,
//     accesser: 'local',
//     isExportedAsMultiple: false,
//   };

//   const actual = await generate(options);

//   t.snapshot(actual);
// });

// test.serial('generate single exported components with extensions', async t => {
//   const options: IMaterializeOptions = {
//     cwd: singleExportedComptPath,
//     entry: singleExportedComptPath,
//     accesser: 'local',
//     isExportedAsMultiple: false,
//     extensions: {
//       'mat:config:manifest': async (params: {
//         manifestObj: IMaterialinManifest;
//         manifestFilePath: string;
//       }): Promise<{
//         manifestJS: string;
//         manifestFilePath: string;
//         manifestObj: IMaterialinManifest;
//       }> => {
//         const manifestJS: string = `const manifest = ${JSON.stringify(
//           params.manifestObj
//         )}; export default manifest;`;
//         // 将 manifest 文件存储到指定目录下
//         const manifestFilePath = params.manifestFilePath.replace(
//           '/es/',
//           '/src/'
//         );
//         await writeFile(manifestFilePath, manifestJS);
//         return {
//           manifestJS,
//           manifestObj: params.manifestObj,
//           manifestFilePath,
//         };
//       },
//       'mat:config:container': async (params: {
//         filePath: string;
//         fileContent: string;
//       }): Promise<{
//         filePath: string;
//         fileContent: string;
//       }> => {
//         const filePath = params.filePath.replace('/es/', '/src/');
//         await writeFile(filePath, params.fileContent);
//         return {
//           filePath,
//           fileContent: params.fileContent,
//         };
//       },
//     },
//   };

//   const actual = await generate(options);

//   t.snapshot(actual);
// });

// test.serial(
//   'generate multiple exported components with extensions',
//   async t => {
//     const options: IMaterializeOptions = {
//       cwd: multiExportedComptPath,
//       entry: multiExportedComptPath,
//       accesser: 'local',
//       isExportedAsMultiple: true,
//       extensions: {
//         'mat:config:manifest': async (params: {
//           manifestObj: IMaterialinManifest;
//           manifestFilePath: string;
//         }): Promise<{
//           manifestJS: string;
//           manifestFilePath: string;
//           manifestObj: IMaterialinManifest;
//         }> => {
//           const manifestJS: string = `const manifest = ${JSON.stringify(
//             params.manifestObj
//           )}; export default manifest;`;
//           // 将 manifest 文件存储到指定目录下
//           const manifestFilePath = params.manifestFilePath.replace(
//             '/es/',
//             '/src/'
//           );

//           await writeFile(manifestFilePath, manifestJS);

//           return Promise.resolve({
//             manifestJS,
//             manifestObj: params.manifestObj,
//             manifestFilePath,
//           });
//         },
//         'mat:config:container': async (params: {
//           filePath: string;
//           fileContent: string;
//         }): Promise<{
//           filePath: string;
//           fileContent: string;
//         }> => {
//           const filePath = params.filePath.replace('/es/', '/src/');
//           await writeFile(filePath, params.fileContent);

//           return {
//             filePath,
//             fileContent: params.fileContent,
//           };
//         },
//         'mat:build:bundle': async (params: {
//           bundleJS: string; // bundle 文件内容
//           bundleObj: { [key: string]: any }; // bundle 对象
//         }): Promise<void> => {
//           // 将 bundle 内容写入文件
//           const bundleFilePath = join(multiExportedComptPath, 'dist/bundle.js');
//           await ensureFile(bundleFilePath);
//           await writeFile(bundleFilePath, params.bundleJS);
//         },
//       },
//     };

//     const actual = await generate(options);

//     t.snapshot(actual);
//   }
// );