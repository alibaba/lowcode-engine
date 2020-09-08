/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { namedTypes as t, visit } from 'ast-types';

const {
  resolveToValue,
  getPropType,
  getPropertyName,
  getMemberValuePath,
  isReactModuleName,
  printValue,
  resolveToModule,
} = require('react-docgen').utils;

const isRequiredPropType = require('react-docgen/dist/utils/isRequiredPropType')
  .default;

function getRoot(node: any) {
  let root = node.parent;
  while (root.parent) {
    root = root.parent;
  }
  return root;
}

function isPropTypesExpression(path: any) {
  const moduleName = resolveToModule(path);
  if (moduleName) {
    return isReactModuleName(moduleName) || moduleName === 'ReactPropTypes';
  }
  return false;
}

function amendPropTypes(getDescriptor: any, path: any) {
  if (!t.ObjectExpression.check(path.node)) {
    return;
  }

  path.get('properties').each((propertyPath: any) => {
    switch (propertyPath.node.type) {
      // @ts-ignore
      case t.Property.name: {
        const propName = getPropertyName(propertyPath);
        if (!propName) return;

        const propDescriptor = getDescriptor(propName);
        const valuePath = propertyPath.get('value');
        const type = isPropTypesExpression(valuePath)
          ? getPropType(valuePath)
          : { name: 'custom', raw: printValue(valuePath) };

        if (type) {
          propDescriptor.type = type;
          propDescriptor.required =
            type.name !== 'custom' && isRequiredPropType(valuePath);
        }
        break;
      }
      // @ts-ignore
      case t.SpreadElement.name: {
        const resolvedValuePath = resolveToValue(propertyPath.get('argument'));
        switch (resolvedValuePath.node.type) {
          // @ts-ignore
          case t.ObjectExpression.name: // normal object literal
            amendPropTypes(getDescriptor, resolvedValuePath);
            break;
        }
        break;
      }
    }
  });
}

function getDefinePropertyValuePath(nodePath: any, propName: string) {
  const program = getRoot(nodePath);
  let resultPath = nodePath;
  if (!nodePath.node.id) return;
  const componentName = nodePath.node.id.name;

  visit(program, {
    visitCallExpression(path) {
      const args = path.get('arguments');
      const argsNodeList = args.value;
      if (
        argsNodeList.length === 3 &&
        t.Identifier.check(argsNodeList[0]) &&
        argsNodeList[0].name === componentName &&
        t.Literal.check(argsNodeList[1]) &&
        argsNodeList[1].value === propName
      ) {
        resultPath = args.get(2);
      }
      return false;
    },
  });
  return resultPath;
}

function getPropTypeHandler(propName: string) {
  return function(documentation: any, path: any) {
    let propTypesPath = getMemberValuePath(path, propName);
    if (!propTypesPath) {
      propTypesPath = getDefinePropertyValuePath(path, propName);
      if (!propTypesPath) {
        return;
      }
    }
    propTypesPath = resolveToValue(propTypesPath);
    if (!propTypesPath) {
      return;
    }
    let getDescriptor;
    switch (propName) {
      case 'childContextTypes':
        getDescriptor = documentation.getChildContextDescriptor;
        break;
      case 'contextTypes':
        getDescriptor = documentation.getContextDescriptor;
        break;
      default:
        getDescriptor = documentation.getPropDescriptor;
    }
    amendPropTypes(getDescriptor.bind(documentation), propTypesPath);
  };
}

export const propTypeHandler = getPropTypeHandler('propTypes');
export const contextTypeHandler = getPropTypeHandler('contextTypes');
export const childContextTypeHandler = getPropTypeHandler('childContextTypes');
