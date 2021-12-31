const { namedTypes: t } = require('ast-types');

const { resolveToValue } = require('react-docgen').utils;

function isInfinity(path) {
  return t.Identifier.check(path.node) && path.node.name === 'Infinity';
}

function wrapValue(value, confident = true) {
  return {
    value,
    confident,
  };
}

export default function evaluate(path: any) {
  if (t.UnaryExpression.check(path.node)) {
    if (path.node.operator === 'void') {
      return wrapValue(undefined);
    }

    const argument = path.get('argument');

    const result = evaluate(argument);
    if (!result.confident) {
      return wrapValue(undefined, false);
    }

    const arg = result.value;
    if (arg === undefined) {
      return wrapValue(undefined);
    }

    switch (path.node.operator) {
      case '!':
        return wrapValue(!arg);
      case '+':
        return wrapValue(+arg);
      case '-':
        return wrapValue(-arg);
      case '~':
        return wrapValue(~arg);
      case 'typeof':
        return wrapValue(typeof arg);
    }
  }

  if (t.Identifier.check(path.node)) {
    const valuePath = resolveToValue(path);
    if (isInfinity(valuePath)) {
      return wrapValue(undefined);
    }
    return evaluate(valuePath);
  }

  if (t.Literal.check(path.node)) {
    return wrapValue(path.node.value);
  }

  if (t.ObjectExpression.check(path.node)) {
    const returnValue = {};
    path.get('properties').each((propertyPath) => {
      const { confident, value } = evaluate(propertyPath.get('value'));
      if (!confident) {
        return;
      }
      const keyPath = propertyPath.get('key');
      let key;
      if (keyPath.node.computed) {
        const result = evaluate(keyPath);
        if (!result.confident) {
          return;
        }
        key = result.value;
      } else {
        key = keyPath.node.name;
      }
      returnValue[key] = value;
    });

    return wrapValue(returnValue);
  }

  if (t.ArrayExpression.check(path.node)) {
    const value = [];
    let isValid = true;
    path.get('elements').each((x) => {
      if (!isValid) return;
      const result = evaluate(x);
      if (!result.confident) {
        isValid = false;
      } else {
        value.push(result.value);
      }
    });

    if (isValid) {
      return wrapValue(value);
    }
  }

  return wrapValue(undefined, false);
}
