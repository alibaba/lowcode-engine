import { namedTypes as t } from 'ast-types';
const { match, resolveToValue } = require('react-docgen').utils;
const { traverseShallow } = require('react-docgen/dist/utils/traverse');
import isReactComponentStaticMember from './isReactComponentStaticMember';
import getRoot from '../utils/getRoot';

function findAssignedMethods(scope: any, idPath: any) {
  const results: any[] = [];

  if (!t.Identifier.check(idPath.node)) {
    return results;
  }

  const name = idPath.node.name;
  const idScope = idPath.scope.lookup(idPath.node.name);

  traverseShallow(scope.path, {
    visitAssignmentExpression: function(path: any) {
      const node = path.node;
      if (
        match(node.left, {
          type: 'MemberExpression',
          object: { type: 'Identifier', name },
        })
        // && path.scope.lookup(name) === idScope
      ) {
        results.push(path);
        return false;
      }
      return this.traverse(path);
    },
  });

  return results.filter((x) => !isReactComponentStaticMember(x.get('left')));
}

export default findAssignedMethods;

// const findAssignedMethodsFromScopes = (scope: any, idPath: any) => {
//   const rootNode = getRoot(idPath);
//   let { __scope: scopes = [] } = rootNode;
//   if (!scopes.find((x: any) => x.scope === scope && x.idPath === idPath)) {
//     scopes = [
//       ...scopes,
//       {
//         scope,
//         idPath,
//       },
//     ];
//   }
//   return scopes.map(({ scope: s, idPath: id }: any) => findAssignedMethods(s, id)).flatMap((x: any) => x);
// };

// export { findAssignedMethodsFromScopes };
