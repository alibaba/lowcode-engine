import { pathExists, readFileSync, writeFile } from 'fs-extra';
import { isPlainObject } from 'lodash';
import safeEval from 'safe-eval';
import * as path from 'path';
import spawn from 'cross-spawn-promise';

export async function isNPMInstalled(args: {
  workDir: string;
  moduleDir: string;
  npmClient?: string;
}) {
  return pathExists(path.join(args.workDir, 'node_modules'));
}

export async function install(args: { workDir: string; moduleDir: string; npmClient?: string }) {
  if (await isNPMInstalled(args)) return;
  const { workDir, npmClient = 'tnpm' } = args;
  try {
    await spawn(npmClient, ['i'], { stdio: 'inherit', cwd: workDir } as any);
  } catch (e) {
    // TODO
  }
}

export async function installTypeScript(args: {
  workDir: string;
  moduleDir: string;
  npmClient?: string;
}) {
  if (await isNPMInstalled(args)) return;
  const { workDir, npmClient = 'tnpm' } = args;
  await spawn(npmClient, ['i', 'typescript'], { stdio: 'inherit', cwd: workDir } as any);
}

export async function installPeerDeps(args: {
  workDir: string;
  moduleDir: string;
  npmClient?: string;
}) {
  const { workDir, moduleDir, npmClient = 'tnpm' } = args;
  const modulePkgJsonPath = path.resolve(moduleDir, 'package.json');
  if (!(await pathExists(modulePkgJsonPath))) {
    return;
  }
  const pkgJsonPath = path.resolve(workDir, 'package.json');
  if (!(await pathExists(pkgJsonPath))) {
    return;
  }
  const modulePkgJson = await resolvePkgJson(modulePkgJsonPath);
  const pkgJson = await resolvePkgJson(pkgJsonPath);
  const { peerDependencies = {} } = modulePkgJson;
  pkgJson.dependencies = pkgJson.dependencies || {};
  pkgJson.dependencies = {
    ...pkgJson.dependencies,
    ...peerDependencies,
  };
  await writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
  await spawn(npmClient, ['i'], { stdio: 'inherit', cwd: workDir } as any);
}

export async function installTypeModules(args: {
  workDir: string;
  moduleDir: string;
  npmClient?: string;
}) {
  const { workDir, moduleDir, npmClient = 'tnpm' } = args;
  const pkgJsonPath = path.resolve(moduleDir, 'package.json');
  if (!(await pathExists(pkgJsonPath))) {
    return;
  }
  await spawn(npmClient.replace('m', 'x'), ['typesync'], { stdio: 'inherit', cwd: workDir } as any);
}

export async function resolvePkgJson(pkgJsonPath: string): Promise<{ [k: string]: any }> {
  const content = await loadFile(pkgJsonPath);
  const json = JSON.parse(content);
  return json;
}

export function loadFile(filePath: string): string {
  const content: string | Buffer = readFileSync(filePath);
  if (typeof content === 'string') {
    return content;
  }
  return content.toString();
}

export function isPrimitive(val) {
  return !['object', 'function'].includes(typeof val) || val === null;
}

export function isEvaluable(value) {
  if (isPrimitive(value)) return true;
  if (Array.isArray(value)) {
    return value.every(isEvaluable);
  } else if (isPlainObject(value)) {
    return Object.keys(value).every(key => isEvaluable(value[key]));
  }
  return false;
}

export { safeEval };
