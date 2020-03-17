/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// const { namedTypes: t, visit } = require("ast-types");
const resolveFunctionDefinitionToReturnValue = require('react-docgen/dist/utils/resolveFunctionDefinitionToReturnValue')
  .default;
//   isReactCreateClassCall,
//   isReactForwardRefCall,
//   resolveToValue,
//   resolveHOC

import checkIsIIFE from './checkIsIIFE';
/**
 * If the path is a call expression, it recursively resolves to the
 * rightmost argument, stopping if it finds a React.createClass call expression
 *
 * Else the path itself is returned.
 */
export default function resolveIIFE(path: any) {
  if (!checkIsIIFE(path)) {
    return path;
  }
  const returnValue = resolveFunctionDefinitionToReturnValue(
    path.get('callee'),
  );

  return returnValue;
}
