import { namedTypes as t, visit } from 'ast-types';
import fs from 'fs';
import path from 'path';
import getRoot from './getRoot';
import findJSFilePath from './findJSFilePath';

const buildParser = require('react-docgen/dist/babelParser').default;
const expressionTo = require('react-docgen/dist/utils/expressionTo');

const {
  resolveToValue,
  isExportsOrModuleAssignment,
} = require('react-docgen').utils;

export default function getComposedPropTypesPath(documentation, propName, p) {
  const composes: string[] = Array.from(documentation._composes);
  let _path = null;
  const root = getRoot(p).node;
  for (const compose of composes) {
    const composePath = findJSFilePath(path.resolve(path.dirname(root.__path), compose));
    if (!composePath) continue;

    const fileContent = fs.readFileSync(composePath, 'utf8');
    const parser = buildParser({ filename: composePath });
    const ast = parser.parse(fileContent);

    visit(ast, {
      // eslint-disable-next-line no-loop-func
      visitAssignmentExpression(path: any) {
        // Ignore anything that is not `exports.X = ...;` or
        // `module.exports = ...;`
        if (!isExportsOrModuleAssignment(path)) {
          return false;
        }
        const arr = expressionTo.Array(path.get('left'));
        if (!(arr[0] === 'exports' && arr[1] === propName)) return false;

        // Resolve the value of the right hand side. It should resolve to a call
        // expression, something like React.createClass
        path = resolveToValue(path.get('right'));
        _path = path;
        return false;
      },
    });

    if (_path) {
      break;
    }
  }

  return _path;
}