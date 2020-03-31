import { namedTypes as t } from 'ast-types';
import fs from 'fs';
import p from 'path';

function getRoot(node: any) {
  let root = node.parent;
  while (root.parent) {
    root = root.parent;
  }
  return root.node;
}

function isImportLike(node: any) {
  return (
    t.ImportDeclaration.check(node) ||
    t.ExportAllDeclaration.check(node) ||
    t.ExportNamedDeclaration.check(node)
  );
}

function getPath(path: any, name: any) {
  const root = getRoot(path);
  if (!root) return;
  let { __path } = root;
  __path = p.dirname(__path);
  // is directory
  if (fs.existsSync(p.resolve(__path, name))) {
    name = name + '/index';
  }
  const suffix = suffixes.find(suf => {
    return fs.existsSync(p.resolve(__path, name + suf));
  });
  if (!suffix) return;
  return p.resolve(__path, name + suffix);
}

const buildParser = require('react-docgen/dist/babelParser').default;
const parser = buildParser();
const suffixes = ['.js', '.jsx', '.ts', '.tsx'];

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
    const fileContent = fs.readFileSync(__path, 'utf8');
    const ast = parser.parse(fileContent);
    ast.__src = fileContent;
    ast.__path = __path;
    return callback(ast);
  }
  return path;
}
