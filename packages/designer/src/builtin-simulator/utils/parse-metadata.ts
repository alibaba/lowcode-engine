import PropTypes from 'prop-types';
import { isValidElement } from 'react';
import { isElement } from '@alilc/lowcode-utils';
import { IPublicTypePropConfig } from '@alilc/lowcode-types';

export const primitiveTypes = [
  'string',
  'number',
  'array',
  'bool',
  'func',
  'object',
  'node',
  'element',
  'symbol',
  'any',
];

// eslint-disable-next-line @typescript-eslint/ban-types
function makeRequired(propType: any, lowcodeType: string | object) {
  function lowcodeCheckTypeIsRequired(...rest: any[]) {
    return propType.isRequired(...rest);
  }
  if (typeof lowcodeType === 'string') {
    lowcodeType = {
      type: lowcodeType,
    };
  }
  lowcodeCheckTypeIsRequired.lowcodeType = {
    ...lowcodeType,
    isRequired: true,
  };
  return lowcodeCheckTypeIsRequired;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function define(propType: any = PropTypes.any, lowcodeType: string | object = {}) {
  if (!propType._inner && propType.name !== 'lowcodeCheckType') {
    propType.lowcodeType = lowcodeType;
  }
  function lowcodeCheckType(...rest: any[]) {
    return propType(...rest);
  }
  lowcodeCheckType.lowcodeType = lowcodeType;
  lowcodeCheckType.isRequired = makeRequired(propType, lowcodeType);
  return lowcodeCheckType;
}

export const LowcodeTypes: any = {
  ...PropTypes,
  define,
};

(window as any).PropTypes = LowcodeTypes;
if ((window as any).React) {
  (window as any).React.PropTypes = LowcodeTypes;
}

// override primitive type checkers
primitiveTypes.forEach((type) => {
  const propType = (PropTypes as any)[type];
  if (!propType) {
    return;
  }
  propType._inner = true;
  LowcodeTypes[type] = define(propType, type);
});

// You can ensure that your prop is limited to specific values by treating
// it as an enum.
LowcodeTypes.oneOf = (list: any[]) => {
  return define(PropTypes.oneOf(list), {
    type: 'oneOf',
    value: list,
  });
};

// An array of a certain type
LowcodeTypes.arrayOf = (type: any) => {
  return define(PropTypes.arrayOf(type), {
    type: 'arrayOf',
    value: type.lowcodeType || 'any',
  });
};

// An object with property values of a certain type
LowcodeTypes.objectOf = (type: any) => {
  return define(PropTypes.objectOf(type), {
    type: 'objectOf',
    value: type.lowcodeType || 'any',
  });
};

// An object that could be one of many types
LowcodeTypes.oneOfType = (types: any[]) => {
  const itemTypes = types.map((type) => type.lowcodeType || 'any');
  return define(PropTypes.oneOfType(types), {
    type: 'oneOfType',
    value: itemTypes,
  });
};

// An object with warnings on extra properties
LowcodeTypes.exact = (typesMap: any) => {
  const configs = Object.keys(typesMap).map((key) => {
    return {
      name: key,
      propType: typesMap[key]?.lowcodeType || 'any',
    };
  });
  return define(PropTypes.exact(typesMap), {
    type: 'exact',
    value: configs,
  });
};

// An object taking on a particular shape
LowcodeTypes.shape = (typesMap: any = {}) => {
  const configs = Object.keys(typesMap).map((key) => {
    return {
      name: key,
      propType: typesMap[key]?.lowcodeType || 'any',
    };
  });
  return define(PropTypes.shape(typesMap), {
    type: 'shape',
    value: configs,
  });
};

const BasicTypes = ['string', 'number', 'object'];
export function parseProps(component: any): IPublicTypePropConfig[] {
  if (!component) {
    return [];
  }
  const propTypes = component.propTypes || ({} as any);
  const defaultProps = component.defaultProps || ({} as any);
  const result: any = {};
  if (!propTypes) return [];
  Object.keys(propTypes).forEach((key) => {
    const propTypeItem = propTypes[key];
    const defaultValue = defaultProps[key];
    const { lowcodeType } = propTypeItem;
    if (lowcodeType) {
      result[key] = {
        name: key,
        propType: lowcodeType,
      };
      if (defaultValue != null) {
        result[key].defaultValue = defaultValue;
      }
      return;
    }

    let i = primitiveTypes.length;
    while (i-- > 0) {
      const k = primitiveTypes[i];
      if ((LowcodeTypes as any)[k] === propTypeItem) {
        result[key] = {
          name: key,
          propType: k,
        };
        if (defaultValue != null) {
          result[key].defaultValue = defaultValue;
        }
        return;
      }
    }
    result[key] = {
      name: key,
      propType: 'any',
    };
    if (defaultValue != null) {
      result[key].defaultValue = defaultValue;
    }
  });

  Object.keys(defaultProps).forEach((key) => {
    if (result[key]) return;
    const defaultValue = defaultProps[key];
    let type: string = typeof defaultValue;
    if (type === 'boolean') {
      type = 'bool';
    } else if (type === 'function') {
      type = 'func';
    } else if (type === 'object' && Array.isArray(defaultValue)) {
      type = 'array';
    } else if (defaultValue && isValidElement(defaultValue)) {
      type = 'node';
    } else if (defaultValue && isElement(defaultValue)) {
      type = 'element';
    } else if (!BasicTypes.includes(type)) {
      type = 'any';
    }

    result[key] = {
      name: key,
      propType: type || 'any',
      defaultValue,
    };
  });

  return Object.keys(result).map((key) => result[key]);
}

export function parseMetadata(component: any): any {
  return {
    props: parseProps(component),
    ...component.componentMetadata,
  };
}
