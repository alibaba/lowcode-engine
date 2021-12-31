import getComposedPath from '../utils/getComposedPath';
import evaluate from '../utils/evaluate';

const { namedTypes: t, NodePath, visit } = require('ast-types');
type NodePathType = typeof NodePath;
const {
  getPropertyName,
  isReactComponentClass,
  getMemberValuePath,
  isReactForwardRefCall,
  printValue,
  resolveToValue,
} = require('react-docgen').utils;
const resolveFunctionDefinitionToReturnValue = require('react-docgen/dist/utils/resolveFunctionDefinitionToReturnValue');

function getDefaultValue(path: NodePathType) {
  let { node } = path;
  let defaultValue;
  if (t.Literal.check(node)) {
    defaultValue = node.raw;
  } else {
    if (t.AssignmentPattern.check(path.node)) {
      path = resolveToValue(path.get('right'));
    } else {
      path = resolveToValue(path);
    }
    if (t.ImportDeclaration.check(path.node)) {
      defaultValue = node.name;
    } else {
      node = path.node;
      try {
        const result = evaluate(path);
        if (result.confident) {
          defaultValue = result.value;
        }
      } catch (e) {
        // log(e);
        // TODO
      }
    }
  }
  if (typeof defaultValue !== 'undefined') {
    return {
      value: defaultValue,
      computed:
        t.CallExpression.check(node) || t.MemberExpression.check(node) || t.Identifier.check(node),
    };
  }

  return null;
}

function getStatelessPropsPath(componentDefinition: any) {
  const value = resolveToValue(componentDefinition);
  if (isReactForwardRefCall(value)) {
    const inner = resolveToValue(value.get('arguments', 0));
    return inner.get('params', 0);
  }
  return value.get('params', 0);
}

function getDefaultPropsPath(componentDefinition: any) {
  let defaultPropsPath = getMemberValuePath(componentDefinition, 'defaultProps');
  if (!defaultPropsPath) {
    return null;
  }

  defaultPropsPath = resolveToValue(defaultPropsPath);
  if (!defaultPropsPath) {
    return null;
  }

  if (t.FunctionExpression.check(defaultPropsPath.node)) {
    // Find the value that is returned from the function and process it if it is
    // an object literal.
    const returnValue = resolveFunctionDefinitionToReturnValue(defaultPropsPath);
    if (returnValue && t.ObjectExpression.check(returnValue.node)) {
      defaultPropsPath = returnValue;
    }
  }
  return defaultPropsPath;
}

function getDefaultValuesFromProps(properties: any[], documentation: any, isStateless: boolean) {
  properties
    // Don't evaluate property if component is functional and the node is not an AssignmentPattern
    .filter(
      (propertyPath) => !isStateless || t.AssignmentPattern.check(propertyPath.get('value').node),
    )
    .forEach((propertyPath) => {
      if (t.Property.check(propertyPath.node)) {
        const propName = getPropertyName(propertyPath);
        if (!propName) return;

        const propDescriptor = documentation.getPropDescriptor(propName);
        const defaultValue = getDefaultValue(
          isStateless ? propertyPath.get('value', 'right') : propertyPath.get('value'),
        );
        if (defaultValue) {
          propDescriptor.defaultValue = defaultValue;
        }
      } else if (t.SpreadElement.check(propertyPath.node)) {
        const resolvedValuePath = resolveToValue(propertyPath.get('argument'));
        if (t.ObjectExpression.check(resolvedValuePath.node)) {
          getDefaultValuesFromProps(
            resolvedValuePath.get('properties'),
            documentation,
            isStateless,
          );
        }
      }
    });
}

export default function defaultPropsHandler(documentation: any, componentDefinition: any) {
  let statelessProps = null;
  let defaultPropsPath = getDefaultPropsPath(componentDefinition);
  /**
   * function, lazy, memo, forwardRef etc components can resolve default props as well
   */
  if (!isReactComponentClass(componentDefinition)) {
    statelessProps = getStatelessPropsPath(componentDefinition);
  }

  // Do both statelessProps and defaultProps if both are available so defaultProps can override
  if (statelessProps && t.ObjectPattern.check(statelessProps.node)) {
    getDefaultValuesFromProps(statelessProps.get('properties'), documentation, true);
  }
  if (defaultPropsPath && !t.ObjectExpression.check(defaultPropsPath.node)) {
    const composedPath = getComposedPath(documentation, 'defaultProps', defaultPropsPath);
    if (composedPath) {
      defaultPropsPath = composedPath;
    }
  }
  if (defaultPropsPath && t.ObjectExpression.check(defaultPropsPath.node)) {
    getDefaultValuesFromProps(defaultPropsPath.get('properties'), documentation, false);
  }
}
