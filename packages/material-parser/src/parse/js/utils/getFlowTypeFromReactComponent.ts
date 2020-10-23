import { namedTypes as t } from 'ast-types';
import resolveGenericTypeAnnotation from './resolveGenericTypeAnnotation';

const {
  isReactComponentClass,
  isReactForwardRefCall,
  getTypeAnnotation,
  resolveToValue,
  getMemberValuePath,
} = require('react-docgen').utils;
const getTypeParameters = require('react-docgen/dist/utils/getTypeParameters').default;

function getStatelessPropsPath(componentDefinition: any) {
  const value = resolveToValue(componentDefinition);
  if (isReactForwardRefCall(value)) {
    const inner = resolveToValue(value.get('arguments', 0));
    return inner.get('params', 0);
  }
  if (t.VariableDeclarator.check(componentDefinition.parent.node)) {
    const id = componentDefinition.parent.get('id');
    if (id.node.typeAnnotation) {
      return id;
    }
  }

  return value.get('params', 0);
}

/**
 * Given an React component (stateless or class) tries to find the
 * flow type for the props. If not found or not one of the supported
 * component types returns null.
 */
export default (path: any) => {
  let typePath = null;

  if (isReactComponentClass(path)) {
    const superTypes = path.get('superTypeParameters');

    if (superTypes.value) {
      const params = superTypes.get('params');
      if (params.value.length === 3) {
        typePath = params.get(1);
      } else {
        typePath = params.get(0);
      }
    } else {
      const propsMemberPath = getMemberValuePath(path, 'props');
      if (!propsMemberPath) {
        return null;
      }

      typePath = getTypeAnnotation(propsMemberPath.parentPath);
    }

    return typePath;
  }

  const propsParam = getStatelessPropsPath(path);

  if (propsParam) {
    typePath = getTypeAnnotation(propsParam);
  }

  return typePath;
};

function applyToFlowTypeProperties(documentation: any, path: any, callback: any, typeParams?: any) {
  if (path.node.properties) {
    path.get('properties').each((propertyPath: any) => callback(propertyPath, typeParams));
  } else if (path.node.members) {
    path.get('members').each((propertyPath: any) => callback(propertyPath, typeParams));
  } else if (path.node.type === 'InterfaceDeclaration') {
    if (path.node.extends) {
      applyExtends(documentation, path, callback, typeParams);
    }

    path.get('body', 'properties').each((propertyPath: any) => callback(propertyPath, typeParams));
  } else if (path.node.type === 'TSInterfaceDeclaration') {
    if (path.node.extends) {
      applyExtends(documentation, path, callback, typeParams);
    }

    path.get('body', 'body').each((propertyPath: any) => callback(propertyPath, typeParams));
  } else if (path.node.type === 'IntersectionTypeAnnotation' || path.node.type === 'TSIntersectionType') {
    path
      .get('types')
      .each((typesPath: any) => applyToFlowTypeProperties(documentation, typesPath, callback, typeParams));
  } else if (path.node.type !== 'UnionTypeAnnotation') {
    // The react-docgen output format does not currently allow
    // for the expression of union types
    const typePath = resolveGenericTypeAnnotation(path);
    if (typePath) {
      applyToFlowTypeProperties(documentation, typePath, callback, typeParams);
    }
  }
}

function applyExtends(documentation: any, path: any, callback: any, typeParams: any) {
  path.get('extends').each((extendsPath: any) => {
    const resolvedPath = resolveGenericTypeAnnotation(extendsPath);
    if (resolvedPath) {
      if (resolvedPath.node.typeParameters && extendsPath.node.typeParameters) {
        typeParams = getTypeParameters(
          resolvedPath.get('typeParameters'),
          extendsPath.get('typeParameters'),
          typeParams,
        );
      }
      applyToFlowTypeProperties(documentation, resolvedPath, callback, typeParams);
    } else {
      const id = extendsPath.node.id || extendsPath.node.typeName || extendsPath.node.expression;
      if (id && id.type === 'Identifier') {
        documentation.addComposes(id.name);
      }
    }
  });
}

export { applyToFlowTypeProperties };
