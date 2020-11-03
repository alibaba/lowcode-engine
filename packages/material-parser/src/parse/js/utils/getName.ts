import { namedTypes as t } from 'ast-types';

export default function (def: any) {
  let name = '';
  if (def.node.name) {
    name = def.node.name;
    // hoc
  } else if (t.CallExpression.check(def.node)) {
    if (def.node.arguments && def.node.arguments.length && t.Identifier.check(def.get('arguments', 0).node)) name = def.get('arguments', 0).node.name;
  }

  return name;
}
