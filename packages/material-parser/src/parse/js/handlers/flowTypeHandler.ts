/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { namedTypes as t } from 'ast-types';
import getTSType from '../utils/getTSType';
import getRoot from '../utils/getRoot';
import parseTS from '../../ts';
const { unwrapUtilityType } = require('react-docgen/dist/utils/flowUtilityTypes');
const { getFlowType, getPropertyName, resolveToValue } = require('react-docgen').utils;
const setPropDescription = require('react-docgen/dist/utils/setPropDescription').default;
import getFlowTypeFromReactComponent from '../utils/getFlowTypeFromReactComponent';
import { applyToFlowTypeProperties } from '../utils/getFlowTypeFromReactComponent';

function setPropDescriptor(documentation: any, path: any, typeParams: any) {
  if (t.ObjectTypeSpreadProperty.check(path.node)) {
    const argument = unwrapUtilityType(path.get('argument'));

    if (t.ObjectTypeAnnotation.check(argument.node)) {
      applyToFlowTypeProperties(
        documentation,
        argument,
        (propertyPath: any, innerTypeParams: any) => {
          setPropDescriptor(documentation, propertyPath, innerTypeParams);
        },
        typeParams,
      );
      return;
    }

    const name = argument.get('id').get('name');
    const resolvedPath = resolveToValue(name);

    if (resolvedPath && t.TypeAlias.check(resolvedPath.node)) {
      const right = resolvedPath.get('right');
      applyToFlowTypeProperties(
        documentation,
        right,
        (propertyPath: any, innerTypeParams: any) => {
          setPropDescriptor(documentation, propertyPath, innerTypeParams);
        },
        typeParams,
      );
    } else {
      documentation.addComposes(name.node.name);
    }
  } else if (t.ObjectTypeProperty.check(path.node)) {
    const type = getFlowType(path.get('value'), typeParams);
    const propName = getPropertyName(path);
    if (!propName) return;

    const propDescriptor = documentation.getPropDescriptor(propName);
    propDescriptor.required = !path.node.optional;
    propDescriptor.flowType = type;

    // We are doing this here instead of in a different handler
    // to not need to duplicate the logic for checking for
    // imported types that are spread in to props.
    setPropDescription(documentation, path);
  } else if (t.TSPropertySignature.check(path.node)) {
    const type = getTSType(path.get('typeAnnotation'), typeParams);

    const propName = getPropertyName(path);
    if (!propName) return;

    const propDescriptor = documentation.getPropDescriptor(propName);
    propDescriptor.required = !path.node.optional;
    propDescriptor.tsType = type;

    // We are doing this here instead of in a different handler
    // to not need to duplicate the logic for checking for
    // imported types that are spread in to props.
    setPropDescription(documentation, path);
  }
}

/**
 * This handler tries to find flow Type annotated react components and extract
 * its types to the documentation. It also extracts docblock comments which are
 * inlined in the type definition.
 */
export default function flowTypeHandler(documentation: any, path: any) {
  const flowTypesPath = getFlowTypeFromReactComponent(path);

  if (!flowTypesPath) {
    return;
  }

  applyToFlowTypeProperties(documentation, flowTypesPath, (propertyPath: any, typeParams: any) => {
    setPropDescriptor(documentation, propertyPath, typeParams);
  });
  // const root = getRoot(path);
  // const { __path } = root;
  // const result = parseTS(__path);
  // result.length &&
  //   Object.keys(result[0].props).forEach((propName: string) => {
  //     const propItem = result[0].props[propName];
  //     const propDescriptor = documentation.getPropDescriptor(propName);
  //     propDescriptor.required = propItem.required;
  //     propDescriptor.type = propItem.type;
  //     propDescriptor.description = propItem.description;
  //     propDescriptor.defaultValue = propItem.defaultValue;
  //   });
}
