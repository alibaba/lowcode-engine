/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import getTSType from './getTSType';

const { namedTypes: t } = require('ast-types');
const {
  resolveToValue,
  getFlowType,
  getParameterName,
  getPropertyName,
  getTypeAnnotation,
} = require('react-docgen').utils;
const { getDocblock } = require('react-docgen/dist/utils/docblock');

function getMethodFunctionExpression(methodPath) {
  if (t.AssignmentExpression.check(methodPath.node)) {
    return resolveToValue(methodPath.get('right'));
  }
  // Otherwise this is a method/property node
  return methodPath.get('value');
}

function getMethodParamsDoc(methodPath) {
  const params = [];
  const functionExpression = getMethodFunctionExpression(methodPath);

  // Extract param flow types.
  functionExpression.get('params').each((paramPath) => {
    let type = null;
    const typePath = getTypeAnnotation(paramPath);
    if (typePath && t.Flow.check(typePath.node)) {
      type = getFlowType(typePath);
      if (t.GenericTypeAnnotation.check(typePath.node)) {
        type.alias = typePath.node.id.name;
      }
    } else if (typePath) {
      type = getTSType(typePath);
      if (t.TSTypeReference.check(typePath.node)) {
        type.alias = typePath.node.typeName.name;
      }
    }

    const param = {
      name: getParameterName(paramPath),
      optional: paramPath.node.optional,
      type,
    };

    params.push(param);
  });

  return params;
}

// Extract flow return type.
function getMethodReturnDoc(methodPath) {
  const functionExpression = getMethodFunctionExpression(methodPath);

  if (functionExpression.node.returnType) {
    const returnType = getTypeAnnotation(functionExpression.get('returnType'));
    if (returnType && t.Flow.check(returnType.node)) {
      return { type: getFlowType(returnType) };
    }
    if (returnType) {
      return { type: getTSType(returnType) };
    }
  }

  return null;
}

function getMethodModifiers(methodPath) {
  if (t.AssignmentExpression.check(methodPath.node)) {
    return ['static'];
  }

  // Otherwise this is a method/property node

  const modifiers = [];

  if (methodPath.node.static) {
    modifiers.push('static');
  }

  if (methodPath.node.kind === 'get' || methodPath.node.kind === 'set') {
    modifiers.push(methodPath.node.kind);
  }

  const functionExpression = methodPath.get('value').node;
  if (functionExpression.generator) {
    modifiers.push('generator');
  }
  if (functionExpression.async) {
    modifiers.push('async');
  }

  return modifiers;
}

function getMethodName(methodPath) {
  if (t.AssignmentExpression.check(methodPath.node) && t.MemberExpression.check(methodPath.node.left)) {
    const { left } = methodPath.node;
    const { property } = left;
    if (!left.computed) {
      return property.name;
    }
    if (t.Literal.check(property)) {
      return String(property.value);
    }
    return null;
  }
  return getPropertyName(methodPath);
}

function getMethodAccessibility(methodPath) {
  if (t.AssignmentExpression.check(methodPath.node)) {
    return null;
  }

  // Otherwise this is a method/property node
  return methodPath.node.accessibility;
}

function getMethodDocblock(methodPath) {
  if (t.AssignmentExpression.check(methodPath.node)) {
    let path = methodPath;
    do {
      path = path.parent;
    } while (path && !t.ExpressionStatement.check(path.node));
    if (path) {
      return getDocblock(path);
    }
    return null;
  }

  // Otherwise this is a method/property node
  return getDocblock(methodPath);
}

// Gets the documentation object for a component method.
// Component methods may be represented as class/object method/property nodes
// or as assignment expresions of the form `Component.foo = function() {}`
export default function getMethodDocumentation(methodPath) {
  if (getMethodAccessibility(methodPath) === 'private') {
    return null;
  }

  const name = getMethodName(methodPath);
  if (!name) return null;

  return {
    name,
    docblock: getMethodDocblock(methodPath),
    modifiers: getMethodModifiers(methodPath),
    params: getMethodParamsDoc(methodPath),
    returns: getMethodReturnDoc(methodPath),
  };
}
