/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { namedTypes as t, visit } from 'ast-types';
import checkIsIIFE from './checkIsIIFE';
import resolveHOC from './resolveHOC';
import resolveIIFE from './resolveIIFE';
import resolveImport from './resolveImport';
import resolveTranspiledClass from './resolveTranspiledClass';

const {
  isExportsOrModuleAssignment,
  isReactComponentClass,
  isReactCreateClassCall,
  isReactForwardRefCall,
  isStatelessComponent,
  normalizeClassDefinition,
  resolveExportDeclaration,
  resolveToValue,
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
  } else if (
    isStatelessComponent(definition) ||
    isReactForwardRefCall(definition)
  ) {
    return definition;
  }
  return null;
}

function getDefinition(definition: any): any {
  if (checkIsIIFE(definition)) {
    definition = resolveToValue(resolveIIFE(definition));
    if (!isComponentDefinition(definition)) {
      definition = resolveTranspiledClass(definition);
    }
  } else {
    definition = resolveToValue(resolveHOC(definition));
    if (checkIsIIFE(definition)) {
      definition = resolveToValue(resolveIIFE(definition));
      if (!isComponentDefinition(definition)) {
        definition = resolveTranspiledClass(definition);
      }
    } else if (t.SequenceExpression.check(definition.node)) {
      return getDefinition(
        resolveToValue(definition.get('expressions').get(0)),
      );
    } else {
      definition = resolveImport(
        definition,
        findAllExportedComponentDefinition,
      );
    }
  }
  return definition;
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

  function exportDeclaration(path: any) {
    const definitions = resolveExportDeclaration(path)
      .reduce((acc: any[], definition: any) => {
        if (isComponentDefinition(definition)) {
          acc.push(definition);
        } else {
          definition = getDefinition(definition);
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
      .map((definition: any) => resolveDefinition(definition));

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
      components.push(
        ...resolveImport(path, findAllExportedComponentDefinition),
      );
      return false;
    },

    visitAssignmentExpression(path: any) {
      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportsOrModuleAssignment(path)) {
        return false;
      }
      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like React.createClass
      path = resolveToValue(path.get('right'));
      if (!isComponentDefinition(path)) {
        path = getDefinition(path);
      }

      const definition = resolveDefinition(path);
      if (definition && components.indexOf(definition) === -1) {
        components.push(definition);
      }
      return false;
    },
  });

  return components;
}
