/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { builders, namedTypes as t, NodePath, visit } from 'ast-types';
/**
 * If the path is a call expression, it recursively resolves to the
 * rightmost argument, stopping if it finds a React.createClass call expression
 *
 * Else the path itself is returned.
 */
export default function resolveTranspiledClass(path: any) {
  let classPath = path;
  visit(path, {
    visitFunctionDeclaration(arg) {
      classPath = new NodePath(
        builders.functionDeclaration(
          arg.node.id,
          [],
          builders.blockStatement([
            builders.returnStatement(
              builders.jsxElement(
                builders.jsxOpeningElement(
                  builders.jsxIdentifier('div'),
                  [],
                  true,
                ),
              ),
            ),
          ]),
        ),
        path.parent,
      );
      return false;
    },
  });
  return classPath;
}
