import { namedTypes as t } from 'ast-types';
import fs from 'fs';
import p from 'path';
import getRoot from '../utils/getRoot';

const { resolveToModule, resolveToValue, match } = require('react-docgen').utils;

export function isImportLike(path) {
  const { node } = path;
  return (
    t.ImportDeclaration.check(node) ||
    t.ExportAllDeclaration.check(node) ||
    t.ExportNamedDeclaration.check(node)
  );
}

export function isRequireLike(path: any) {
  if (
    t.CallExpression.check(path.node) &&
    t.Identifier.check(path.get('callee').node) &&
    path.get('callee').node.name === 'require' &&
    t.Literal.check(path.get('arguments', 0)?.node)
  ) {
    return true;
  }

  return false;
}

export function resolveToImport(initialPath) {
  const pathBuffer = [initialPath];

  while (pathBuffer.length) {
    let path = pathBuffer.shift();
    const node = path.node;
    switch (node.type) {
      case 'VariableDeclarator':
        if (node.init) {
          pathBuffer.unshift(path.get('init'));
        }
        break;
      case 'CallExpression': {
        if (match(node.callee, { type: 'Identifier', name: 'require' })) {
          return path;
        }
        const paths = [path.get('callee')];
        const argumentsPath = path.get('arguments');
        for (let index = 0; index < argumentsPath.value.length; index++) {
          paths.push(argumentsPath.get(index));
        }
        pathBuffer.unshift(...paths);
      }
      case 'Identifier':
      case 'JSXIdentifier': {
        const valuePath = resolveToValue(path);
        if (valuePath !== path) {
          pathBuffer.unshift(valuePath);
        }
        break;
      }
      case 'ImportDeclaration':
        return path;
      case 'MemberExpression':
        while (path && t.MemberExpression.check(path.node)) {
          path = path.get('object');
        }
        if (path) {
          pathBuffer.unshift(path);
        }
    }
  }

  return null;
}

function getPath(path: any, name: any) {
  const root = getRoot(path).node;
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
  let mode: 'import' | 'require' = 'import';

  let importPath;
  if (path.name === 'local') {
    name = path.parentPath.parentPath.parentPath.node.source.value;
    importPath = path;
  } else {
    importPath = resolveToImport(path);
    if (!importPath) {
      return path;
    }
    if (isImportLike(importPath)) {
      name = importPath.node.source.value;
    } else if (isRequireLike(importPath)) {
      const moduleName = resolveToModule(importPath);
      if (typeof moduleName === 'string') {
        mode = 'require';
        name = moduleName;
      }
    } else {
      return path;
    }
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

    const importMeta: any[] = [];
    if (mode === 'import') {
      if (t.ImportDeclaration.check(importPath.node)) {
        // @ts-ignore
        const specifiers = importPath.get('specifiers');
        specifiers.each((spec: any) => {
          const { node } = spec;
          importMeta.push({
            localName: node.local.name,
            importedName: node.imported ? node.imported.name : 'default',
          });
        });
      }
    } else {
      const idPath = importPath.parentPath.get('id');
      if (t.Identifier.check(idPath.node)) {
        importMeta.push({
          localName: 'default',
          importedName: idPath.node.name,
        });
      } else if (t.ObjectPattern.check(path.node)) {
        path.get('properties').each((propertyPath) => {
          const keyPath = propertyPath.get('key');
          const valuePath = propertyPath.get('value');
          if (t.Identifier.check(keyPath.node) && t.Identifier.check(valuePath.node)) {
            importMeta.push({
              localName: keyPath.node.name,
              importedName: valuePath.node.name,
            });
          }
        });
      }
    }

    return callback(ast, __path, importMeta, mode);
  }
  return path;
}
