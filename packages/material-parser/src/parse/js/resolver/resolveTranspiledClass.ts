import { builders, NodePath, visit } from 'ast-types';
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
          // @ts-ignore
          arg.node.id || 'Default',
          [],
          builders.blockStatement([
            builders.returnStatement(
              builders.jsxElement(
                builders.jsxOpeningElement(builders.jsxIdentifier('div'), [], true),
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
