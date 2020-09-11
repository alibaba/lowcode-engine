/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { namedTypes as t } from 'ast-types';

const supportedUtilityTypes = new Set(['$Exact', '$ReadOnly']);

/**
 * See `supportedUtilityTypes` for which types are supported and
 * https://flow.org/en/docs/types/utilities/ for which types are available.
 */
function isSupportedUtilityType(path: any) {
  if (t.GenericTypeAnnotation.check(path.node)) {
    const idPath = path.get('id');
    return !!idPath && supportedUtilityTypes.has(idPath.node.name);
  }
  return false;
}

export { isSupportedUtilityType };

function isReactUtilityType(path: any) {
  if (t.TSTypeReference.check(path.node)) {
    const objName = path.get('typeName', 'left').node.name;
    if (objName === 'React') {
      return true;
    }
  }

  return false;
}

/**
 * Unwraps well known utility types. For example:
 *
 *   $ReadOnly<T> => T
 */
function unwrapUtilityType(path: any) {
  while (isSupportedUtilityType(path) || isReactUtilityType(path)) {
    path = path.get('typeParameters', 'params', 0);
  }

  return path;
}

export { unwrapUtilityType };
