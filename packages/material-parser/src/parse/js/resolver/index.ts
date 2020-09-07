import { namedTypes as t, visit } from 'ast-types';
import { uniqBy } from 'lodash';
import checkIsIIFE from './checkIsIIFE';
import resolveHOC from './resolveHOC';
import resolveIIFE from './resolveIIFE';
import resolveImport, { isImportLike } from './resolveImport';
import resolveTranspiledClass from './resolveTranspiledClass';
import isStaticMethod from './isStaticMethod';
import findAssignedMethods from './findAssignedMethods';
import resolveExportDeclaration from './resolveExportDeclaration';
import makeProxy from '../utils/makeProxy';
const expressionTo = require('react-docgen/dist/utils/expressionTo');
import { get, set, has, ICache } from '../utils/cache';
import getName from '../utils/getName';

const {
  isExportsOrModuleAssignment,
  isReactComponentClass,
  isReactCreateClassCall,
  isReactForwardRefCall,
  isStatelessComponent,
  normalizeClassDefinition,
  resolveToValue,
  getMemberValuePath,
} = require('react-docgen').utils;

function ignore() {
  return false;
}

function isComponentDefinition(path: any) {
  return (
    isReactCreateClassCall(path) ||
    isReactComponentClass(path) ||
    isStatelessComponent(path) ||
    isReactForwardRefCall(path)
  );
}

function resolveDefinition(definition: any) {
  if (isReactCreateClassCall(definition)) {
    // return argument
    const resolvedPath = resolveToValue(definition.get('arguments', 0));
    if (t.ObjectExpression.check(resolvedPath.node)) {
      return resolvedPath;
    }
  } else if (isReactComponentClass(definition)) {
    normalizeClassDefinition(definition);
    return definition;
  } else if (isStatelessComponent(definition) || isReactForwardRefCall(definition)) {
    return definition;
  }
  return null;
}

function getDefinition(definition: any, cache: ICache = {}): any {
  const { __meta: exportMeta = {} } = definition;
  if (checkIsIIFE(definition)) {
    definition = resolveToValue(resolveIIFE(definition));
    if (!isComponentDefinition(definition)) {
      definition = resolveTranspiledClass(definition);
    }
  } else {
    definition = resolveToValue(resolveHOC(definition));
    if (isComponentDefinition(definition)) {
      definition = makeProxy(definition, {
        __meta: exportMeta,
      });
      return definition;
    }
    if (checkIsIIFE(definition)) {
      definition = resolveToValue(resolveIIFE(definition));
      if (!isComponentDefinition(definition)) {
        definition = resolveTranspiledClass(definition);
      }
    } else if (t.SequenceExpression.check(definition.node)) {
      const classNameNode = definition.parent.get('id').node;
      const localNames: string[] = [];
      let node = definition.get('expressions', 0).node;
      while (t.AssignmentExpression.check(node)) {
        // @ts-ignore
        const name = node.left.name;
        if (name) {
          localNames.push(name);
        }
        node = node.right;
      }
      definition.get('expressions').each((x: any) => {
        if (!x.name) return;
        if (t.AssignmentExpression.check(x.node) && t.MemberExpression.check(x.node.left)) {
          const objectName = x.node.left.object.name;
          if (localNames.includes(objectName)) {
            x.get('left', 'object').replace(classNameNode);
          }
        }
      });
      definition = getDefinition(resolveToValue(definition.get('expressions').get(0)), cache);
    } else {
      return resolveImport(definition, (ast: any, sourcePath: string) => {
        const importMeta: any[] = [];
        if (t.ImportDeclaration.check(definition.node)) {
          // @ts-ignore
          const specifiers = definition.get('specifiers');
          specifiers.each((spec: any) => {
            const { node } = spec;
            importMeta.push({
              localName: node.local.name,
              importedName: node.imported ? node.imported.name : 'default',
            });
          });
        }

        let result;
        if (has('ast-export', ast.__path)) {
          result = get('ast-export', ast.__path);
        } else {
          result = findAllExportedComponentDefinition(ast);
          set('ast-export', ast.__path, result);
        }

        const exportList: any[] = [];
        const importList: any[] = [];
        result = result.forEach((def: any) => {
          let { __meta: meta = {} } = def;
          let exportName = meta.exportName;
          for (let item of importMeta) {
            if (exportName === item.importedName) {
              exportName = item.localName;
              break;
            }
          }

          if (exportName) {
            importList.push(makeProxy(def, { __meta: { exportName } }));
          }

          const nextMeta: any = {
            exportName,
          };

          if (exportName === exportMeta.localName) {
            nextMeta.exportName = exportMeta.exportName;
          } else {
            return;
          }

          if (exportMeta.subName) {
            nextMeta.subName = exportMeta.subName;
          } else if (meta.subName) {
            nextMeta.subName = meta.subName;
          }
          exportList.push(makeProxy(def, { __meta: nextMeta }));
        });
        cache[sourcePath] = importList;

        // result = result.filter((x) => !x.__shouldDelete);
        return exportList;
      });
    }
  }
  if (definition && (!definition.__meta || Object.keys(definition.__meta).length === 0)) {
    definition.__meta = exportMeta;
  }
  return definition;
}

export interface IMethodsPath {
  subName: string;
  localName: string;
  value: any;
}

/**
 * Extract all flow types for the methods of a react component. Doesn't
 * return any react specific lifecycle methods.
 */
function getSubComponents(path: any, scope: any, cache: ICache) {
  // Extract all methods from the class or object.
  let methodPaths = [];
  if (isReactComponentClass(path)) {
    methodPaths = path.get('body', 'body').filter(isStaticMethod);
    methodPaths = [...methodPaths, ...findAssignedMethods(scope || path.scope, path.get('id'))];
  } else if (t.ObjectExpression.check(path.node)) {
    methodPaths = path.get('properties').filter(isStaticMethod);
    methodPaths = [...methodPaths, ...findAssignedMethods(scope || path.scope, path.get('id'))];
    // Add the statics object properties.
    const statics = getMemberValuePath(path, 'statics');
    if (statics) {
      statics.get('properties').each((p: any) => {
        if (isStaticMethod(p)) {
          p.node.static = true;
          methodPaths.push(p);
        }
      });
    }
  } else if (
    t.VariableDeclarator.check(path.parent.node) &&
    path.parent.node.init === path.node &&
    t.Identifier.check(path.parent.node.id)
  ) {
    methodPaths = findAssignedMethods(scope || path.parent.scope, path.parent.get('id'));
  } else if (
    t.AssignmentExpression.check(path.parent.node) &&
    path.parent.node.right === path.node &&
    t.Identifier.check(path.parent.node.left)
  ) {
    methodPaths = findAssignedMethods(scope || path.parent.scope, path.parent.get('left'));
  } else if (t.FunctionDeclaration.check(path.node)) {
    methodPaths = findAssignedMethods(scope || path.parent.scope, path.get('id'));
  } else if (t.ArrowFunctionExpression.check(path.node)) {
    methodPaths = findAssignedMethods(scope || path.parent.scope, path.parent.get('id'));
  }

  return (
    methodPaths
      .map((x: any) => {
        if (t.ClassProperty.check(x.node)) {
          return {
            value: x.get('value'),
            subName: x.node.key.name,
            localName: getName(x.get('value')),
          };
        }
        return {
          value: x,
          subName: x.node.left.property.name,
          localName: getName(x.get('right')),
        };
      })
      .map(({ subName, localName, value }: IMethodsPath) => ({
        subName,
        localName,
        value: resolveToValue(value),
      }))
      .map(({ subName, localName, value }: IMethodsPath) => {
        let def = getDefinition(
          makeProxy(value, {
            __meta: {
              localName,
              subName,
              exportName: path.__meta && path.__meta.exportName,
            },
          }),
          cache,
        );
        if (!Array.isArray(def)) {
          def = [def];
        }
        return {
          subName,
          localName,
          value: def.flatMap((x: any) => x).filter((x: any) => isComponentDefinition(x)),
        };
      })
      .map(({ subName, localName, value }: IMethodsPath) =>
        value.map((x: any) => ({
          subName,
          localName,
          value: x,
        })),
      )
      // @ts-ignore
      .flatMap((x: any) => x)
      .map(({ subName, localName, value }: IMethodsPath) => {
        const __meta = {
          subName: subName,
          exportName: path.__meta && path.__meta.exportName,
        };
        return makeProxy(value, { __meta });
      })
  );
}

/**
 * Given an AST, this function tries to find the exported component definition.
 *
 * The component definition is either the ObjectExpression passed to
 * `React.createClass` or a `class` definition extending `React.Component` or
 * having a `render()` method.
 *
 * If a definition is part of the following statements, it is considered to be
 * exported:
 *
 * modules.exports = Definition;
 * exports.foo = Definition;
 * export default Definition;
 * export var Definition = ...;
 */
export default function findAllExportedComponentDefinition(ast: any) {
  const components: any[] = [];
  const cache: ICache = {};
  let programScope: any;

  function exportDeclaration(path: any) {
    const definitions = resolveExportDeclaration(path)
      .reduce((acc: any[], definition: any) => {
        if (isComponentDefinition(definition)) {
          acc.push(definition);
        } else {
          definition = getDefinition(definition, cache);
          if (!Array.isArray(definition)) {
            definition = [definition];
          }
          definition.forEach((def: any) => {
            if (isComponentDefinition(def)) {
              acc.push(def);
            }
          });
        }
        return acc;
      }, [])
      .map((definition: any) => {
        const { __meta: meta } = definition;
        const def = resolveDefinition(definition);
        return makeProxy(def, { __meta: meta });
      });

    if (definitions.length === 0) {
      return false;
    }
    definitions.forEach((definition: any) => {
      if (definition && components.indexOf(definition) === -1) {
        components.push(definition);
      }
    });
    return false;
  }

  visit(ast, {
    visitProgram: function(path) {
      programScope = path.scope;
      return this.traverse(path);
    },
    visitFunctionDeclaration: ignore,
    visitFunctionExpression: ignore,
    visitClassDeclaration: ignore,
    visitClassExpression: ignore,
    visitIfStatement: ignore,
    visitWithStatement: ignore,
    visitSwitchStatement: ignore,
    visitWhileStatement: ignore,
    visitDoWhileStatement: ignore,
    visitForStatement: ignore,
    visitForInStatement: ignore,
    visitForOfStatement: ignore,
    visitImportDeclaration: ignore,

    visitExportNamedDeclaration: exportDeclaration,
    visitExportDefaultDeclaration: exportDeclaration,
    visitExportAllDeclaration: function(path) {
      components.push(...resolveImport(path, findAllExportedComponentDefinition));
      return false;
    },

    visitAssignmentExpression(path: any) {
      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportsOrModuleAssignment(path)) {
        return false;
      }
      const arr = expressionTo.Array(path.get('left'));
      const meta: any = {
        exportName: arr[1] === 'exports' ? 'default' : arr[1],
      };
      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like React.createClass
      path = resolveToValue(path.get('right'));
      if (!isComponentDefinition(path)) {
        path = getDefinition(path, cache);
      }

      let definitions = resolveDefinition(path);
      if (!Array.isArray(definitions)) {
        definitions = [definitions];
      }
      definitions.forEach((definition: any) => {
        if (definition && components.indexOf(definition) === -1) {
          // if (definition.__meta) {
          definition = makeProxy(definition, {
            __meta: meta,
          });
          // }
          components.push(definition);
        }
      });
      return false;
    },
  });

  const result = components.reduce((acc, item) => {
    let subModuleDefinitions = [];
    subModuleDefinitions = getSubComponents(item, programScope, cache);
    return [...acc, item, ...subModuleDefinitions];
  }, []);

  const res = uniqBy(result, (x: any) => {
    return `${x.__meta.exportName}/${x.__meta.subName}`;
  });

  return res;
}
