import * as path from 'path';
import { writeFileSync, pathExistsSync } from 'fs-extra';
import { loadFile } from '../../utils';

import { debug } from '../../core';

const log = debug.extend('parse:ts:generate_dts');

function getTypeDir(workDir: string, dsl: string) {
  const typePkgName = `@types/${dsl}`;
  let typeDir = path.join(workDir, 'node_modules', typePkgName);

  /** 适配 workspace 的情况，如果当前目录没有对应文件，从 workspace 依赖中寻找 */
  if (!pathExistsSync(typeDir)) {
    typeDir = path.join(workDir, '../../node_modules', typePkgName);
  }
  return typeDir;
}

/**
 * Generate alias dts file by removing some needless interfaces.
 * Replace original file at present, which will cause type pollution, looking for better solution
 * @param {string} workDir - the dir containing the module to be parsed
 * @returns {string} - the path of generated xxx.d.ts
 */
export default function generateDTS({
  workDir,
  dslType = 'react',
}: {
  workDir: string;
  dslType?: string;
}): {
  originalTypePath: string;
  newTypePath: string;
} {
  const typeDir = getTypeDir(workDir, dslType);
  const typePath = path.join(typeDir, 'index.d.ts');
  const fileContent = loadFile(typePath);
  // const materialParserTypeDir = path.join(workDir, `node_modules/material-parser-types/${type}`);
  // ensureDirSync(materialParserTypeDir);
  const materialParserTypeDir = typeDir;
  const newTypePath = path.join(materialParserTypeDir, 'index.d.ts');
  // if (!pathExistsSync(newTypePath)) {
  // copySync(
  //   path.join(typeDir, 'global.d.ts'),
  //   path.join(materialParserTypeDir, 'global.d.ts'),
  // );
  let newContent = fileContent.replace(
    /(?<=interface HTMLAttributes[^e]+)(extends[^}]+)/,
    `{
    style?: CSSProperties;
    className?: string;
  `,
  );
  newContent = newContent.replace(/(?<=interface IntrinsicElements {)([^}]+)/, '');
  newContent = newContent.replace(/type LibraryManagedAttributes[^;]+;/, '');
  writeFileSync(newTypePath, newContent);
  log('generate dts', newTypePath);
  // } else {
  //   log('found dts', newTypePath);
  // }

  return {
    originalTypePath: typePath,
    newTypePath,
  };
}
