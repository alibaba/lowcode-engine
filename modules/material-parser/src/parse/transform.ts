import { omit, pick, isNil, uniq } from 'lodash';
import { safeEval, isEvaluable } from '../utils';
import { debug } from '../core';

const log = debug.extend('parse:transform');

export function transformType(itemType: any) {
  if (typeof itemType === 'string') return itemType;
  const {
    name,
    elements,
    value = elements,
    computed,
    required,
    type,
    raw,
    params,
    returns,
  } = itemType;
  if (computed !== undefined && value) {
    return safeEval(value);
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
    case 'symbol':
    case 'object':
    case 'null':
    case 'array':
    case 'element':
    case 'node':
    case 'void':
      break;
    case 'func':
      if (params) {
        result.params = params.map((x) => {
          const res: any = {
            name: x.name,
            propType: transformType(x.type || x.propType),
          };
          if (x.description) {
            res.description = x.description;
          }
          return res;
        });
      }
      if (returns) {
        result.returns = {
          propType: transformType(returns.type || returns.propType),
        };
      }
      if (raw) {
        result.raw = raw;
      }
      break;
    case 'literal': {
      result.type = 'oneOf';
      try {
        const literalValue = safeEval(value);
        result.value = [literalValue];
      } catch (e) {
        result.value = [raw];
      }
      break;
    }
    case 'enum':
    case 'oneOf':
      result.type = 'oneOf';
      result.value = value.map(transformType);
      break;
    case 'tuple':
      result.type = 'tuple';
      result.value = value.map(transformType);
      break;
    case 'union': {
      if (itemType.raw) {
        if (itemType.raw.match(/ReactNode$/)) {
          result.type = 'node';
          break;
        } else if (itemType.raw.match(/Element$/)) {
          result.type = 'element';
          break;
        }
      }
    }
    // eslint-disable-next-line no-fallthrough
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
      let _itemType = transformType(value[0]);
      if (typeof _itemType === 'object') {
        _itemType = omit(_itemType, ['isRequired']);
      }

      result.value = _itemType;
      break;
    }
    case 'signature': {
      if (typeof type === 'string') {
        result.type = type;
        break;
      }
      result.type = 'shape';
      const properties = type?.signature?.properties || itemType?.signature?.properties || [];
      if (properties.length === 0) {
        if (raw?.includes('=>')) {
          result.type = 'func';
          result.raw = raw;
        } else {
          result.type = 'object';
        }
      } else if (properties.length === 1 && typeof properties[0].key === 'object') {
        const v = transformType(properties[0].value);
        if (v === 'any') {
          result.type = 'object';
        } else if (typeof v === 'string') {
          result.value = v;
          result.type = 'objectOf';
        } else if (typeof v?.type === 'string') {
          result.value = v.type;
          result.type = 'objectOf';
        } else {
          result.type = 'object';
        }
      } else if (properties.length === 1 && properties[0].key === '__call') {
        result.type = 'func';
      } else {
        result.value = properties
          .filter((item: any) => typeof item.key !== 'object')
          .map((prop: any) => {
            const { key } = prop;
            const typeItem = {
              ...omit(prop.value, 'name'),
              type: prop.value.type || {},
            };
            typeItem.type = {
              ...typeItem.type,
              ...pick(prop.value, ['name', 'value']),
            };
            return transformItem(key, typeItem);
          });
      }
      break;
    }
    case 'objectOf':
    case 'instanceOf':
      result.value = transformType(value);
      break;
    case 'exact':
    case 'shape':
      result.value = Object.keys(value).map((n) => {
        const { name: _name, ...others } = value[n];
        return transformItem(n, {
          ...others,
          type: {
            name: _name,
          },
        });
      });
      break;
    case (name.match(/ReactNode$/) || {}).input:
      result.type = 'node';
      break;
    case (name.match(/JSX\.Element$/) || {}).input:
      result.type = 'element';
      break;
    default:
      result.type = 'object';
      break;
  }
  if (Object.keys(result).length === 1) {
    return result.type;
  }
  if (result?.type === 'oneOfType') {
    return combineOneOfValues(result);
  }
  return result;
}

function combineOneOfValues(propType) {
  if (propType.type !== 'oneOfType') {
    return propType;
  }
  const newValue = [];
  let oneOfItem = null;
  let firstBooleanIndex = -1;
  propType.value.forEach((item) => {
    if (item?.type === 'oneOf') {
      if (!oneOfItem) {
        oneOfItem = {
          type: 'oneOf',
          value: [],
        };
      }
      if (item.value.includes(true) || item.value.includes(false)) {
        if (firstBooleanIndex !== -1) {
          oneOfItem.value.splice(firstBooleanIndex, 1);
          newValue.push('bool');
        } else {
          firstBooleanIndex = oneOfItem.value.length;
          oneOfItem.value = oneOfItem.value.concat(item.value);
        }
      } else {
        oneOfItem.value = oneOfItem.value.concat(item.value);
      }
    } else {
      newValue.push(item);
    }
  });
  let result = propType;
  const oneOfItemLength = oneOfItem?.value?.length;
  if (oneOfItemLength) {
    newValue.push(oneOfItem);
  }
  if (firstBooleanIndex !== -1 || oneOfItemLength) {
    result = {
      ...propType,
      value: newValue,
    };
  }
  if (result.value.length === 1 && result.value[0]?.type === 'oneOf') {
    result = {
      ...result,
      type: 'oneOf',
      value: result.value[0].value,
    };
  }
  result.value = uniq(result.value);
  return result;
}

export function transformItem(name: string, item: any) {
  const {
    description,
    flowType,
    tsType,
    type = tsType || flowType,
    optional,
    required = optional,
    defaultValue,
    ...others
  } = item;
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
  if (!isNil(defaultValue) && typeof defaultValue === 'object' && isEvaluable(defaultValue)) {
    if (defaultValue === null) {
      result.defaultValue = defaultValue;
    } else if ('computed' in defaultValue) {
      // parsed data from react-docgen
      try {
        if (isEvaluable(defaultValue.value)) {
          result.defaultValue = safeEval(defaultValue.value);
        } else {
          result.defaultValue = defaultValue.value;
        }
      } catch (e) {
        log(e);
      }
    } else {
      // parsed data from react-docgen-typescript
      result.defaultValue = defaultValue.value;
    }
  }
  if (result.propType === undefined) {
    delete result.propType;
  }

  return result;
}
