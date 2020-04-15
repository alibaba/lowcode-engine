import { CompositeArray, CompositeValue, ICompositeObject } from '../../types';
import { generateValue, isJsExpression } from './jsExpression';

function generateArray(value: CompositeArray): string {
  const body = value.map(v => generateUnknownType(v)).join(',');
  return `[${body}]`;
}

function generateObject(value: ICompositeObject): string {
  if (isJsExpression(value)) {
    return generateValue(value);
  }

  const body = Object.keys(value)
    .map(key => {
      const v = generateUnknownType(value[key]);
      return `${key}: ${v}`;
    })
    .join(',');

  return `{${body}}`;
}

function generateUnknownType(value: CompositeValue): string {
  if (Array.isArray(value)) {
    return generateArray(value as CompositeArray);
  } else if (typeof value === 'object') {
    return generateObject(value as ICompositeObject);
  } else if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
}

export function generateCompositeType(
  value: CompositeValue,
): [boolean, string] {
  const result = generateUnknownType(value);

  if (result.substr(0, 1) === "'" && result.substr(-1, 1) === "'") {
    return [true, result.substring(1, result.length - 1)];
  }

  return [false, result];
}
