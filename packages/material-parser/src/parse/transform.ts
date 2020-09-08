import { omit, pick } from 'lodash';

export function transformType(itemType: any) {
  if (typeof itemType === 'string') return itemType;
  const { name, elements, value = elements, computed, required, type } = itemType;
  // if (!value && !required && !type) {
  //   return name;
  // }
  if (computed !== undefined && value) {
    return eval(value);
  }
  const result: any = {
    type: name,
  };
  if (required) {
    result.isRequired = required;
  }
  switch (name) {
    case 'number':
    case 'string':
    case 'bool':
    case 'any':
    case 'func':
    case 'symbol':
    case 'object':
    case 'null':
      break;
    case 'literal':
      return eval(value);
    case 'enum':
    case 'tuple':
    case 'oneOf':
      result.type = 'oneOf';
      result.value = value.map(transformType);
      break;
    case 'union':
    case 'oneOfType':
      result.type = 'oneOfType';
      result.value = value.map(transformType);
      break;
    case 'boolean':
      result.type = 'bool';
      break;
    case 'Function':
      result.type = 'func';
      break;
    case 'unknown':
      result.type = 'any';
      break;
    case 'Array':
    case 'arrayOf': {
      result.type = 'arrayOf';
      const v = omit(transformType(value[0]), ['isRequired']);
      if (Object.keys(v).length === 1 && v.type) {
        result.value = v.type;
      } else {
        result.value = v;
      }
      break;
    }
    case 'signature': {
      if (typeof type === 'string') {
        result.type = type;
        break;
      }
      result.type = 'shape';
      const properties = type?.signature?.properties || [];
      if (properties.length === 0) {
        result.type = 'object';
      } else if (properties.length === 1 && typeof properties[0].key === 'object') {
        result.type = 'objectOf';
        const v = transformType(properties[0].value);
        if (typeof v.type === 'string') result.value = v.type;
      } else if (properties.length === 1 && properties[0].key === '__call') {
        result.type = 'func';
      } else {
        result.value = properties
          .filter((item: any) => typeof item.key !== 'object')
          .map((prop: any) => {
            const {
              key,
              value: { name, ...others },
            } = prop;
            return transformItem(key, {
              ...others,
              type: pick(prop.value, ['name', 'value']),
            });
          });
      }
      break;
    }
    case 'objectOf':
    case 'arrayOf':
    case 'instanceOf':
      result.value = transformType(value);
      break;
    case 'exact':
    case 'shape':
      result.value = Object.keys(value).map((n) => {
        // tslint:disable-next-line:variable-name
        const { name: _name, ...others } = value[n];
        return transformItem(n, {
          ...others,
          type: {
            name: _name,
          },
        });
      });
      break;
    case (name.match('ReactNode$') || {}).input:
      result.type = 'node';
      break;
    case (name.match('Element$') || {}).input:
      result.type = 'element';
      break;
    case (name.match('ElementType$') || {}).input:
      result.type = 'elementType';
      break;
    default:
      result.type = 'instanceOf';
      result.value = name;
      break;
  }
  if (Object.keys(result).length === 1) {
    return result.type;
  }
  return result;
}

export function transformItem(name: string, item: any) {
  const { description, flowType, tsType, type = tsType || flowType, required, defaultValue, ...others } = item;
  const result: any = {
    name,
  };

  if (type) {
    result.propType = transformType({
      ...type,
      ...omit(others, ['name']),
      required: !!required,
    });
  }
  if (description) {
    if (description.includes('\n')) {
      result.description = description.split('\n')[0];
    } else {
      result.description = description;
    }
  }
  if (defaultValue !== undefined) {
    try {
      const value = eval(defaultValue.value);
      result.defaultValue = value;
    } catch (e) {}
  }
  if (result.propType === undefined) {
    delete result.propType;
  }
  return result;
}
