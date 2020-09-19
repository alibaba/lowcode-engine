import { namedTypes as t } from 'ast-types';
import fs from 'fs';
import p from 'path';
import getRoot from '../utils/getRoot';

export function isImportLike(node: any) {
  return t.ImportDeclaration.check(node) || t.ExportAllDeclaration.check(node) || t.ExportNamedDeclaration.check(node);
}

function getPath(path: any, name: any) {
  const root = getRoot(path);
  if (!root) return;
  let { __path } = root;
  __path = p.dirname(__path);
  // is directory
  if (fs.existsSync(p.resolve(__path, name))) {
    name += '/index';
  }
  const suffix = suffixes.find((suf) => {
    return fs.existsSync(p.resolve(__path, name + suf));
  });
  if (!suffix) return;
  return p.resolve(__path, name + suffix);
}

const buildParser = require('react-docgen/dist/babelParser').default;

const suffixes = ['.js', '.jsx', '.ts', '.tsx'];

const cache: {
  [name: string]: any;
} = {};

export default function resolveImport(path: any, callback: any) {
  let name;
  if (path.name === 'local') {
    name = path.parentPath.parentPath.parentPath.node.source.value;
  } else if (!isImportLike(path.node)) {
    return path;
  } else {
    name = path.node.source.value;
  }
  if (name) {
    const __path = getPath(path, name);
    if (!__path) return path;
    let ast;
    if (!cache[__path]) {
      const fileContent = fs.readFileSync(__path, 'utf8');
      const parser = buildParser({ filename: __path });
      ast = parser.parse(fileContent);
      ast.__src = fileContent;
      ast.__path = __path;
      cache[__path] = ast;
    } else {
      ast = cache[__path];
    }

    return callback(ast, __path);
  }
  return path;
}
