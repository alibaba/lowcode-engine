import PropTypes from 'prop-types';

export const primitiveTypeMaps = {
  string: {
    defaultValue: '',
    display: 'inline',
    setter: 'TextSetter',
  },
  number: {
    display: 'inline',
    setter: 'NumberSetter'  // extends TextSetter
  },
  array: {
    defaultValue: [],
    display: 'inline',
    // itemType: any
    setter: 'ArraySetter' // extends ExpressionSetter
  },
  bool: {
    defaultValue: false,
    display: 'inline',
    setter: 'BoolSetter'
  },
  func: {
    defaultValue: () => {},
    display: 'inline',
    setter: 'FunctionSetter' // extends ExpressionSetter
  },
  object: {
    defaultValue: {},
    display: 'inline',
    // itemType: any
    setter: 'ObjectSetter' // extends ExpressionSetter
  },
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  node: {
    defaultValue: '',
    display: 'inline',
    setter: 'FragmentSetter',
  },
  // A React element.
  element: {
    display: 'inline',
    setter: 'JSXSetter', // extends ExpressionSetter
  },
  symbol: {
    display: 'inline',
    setter: 'ExpressionSetter',
  },
  any: {
    display: 'inline',
    setter: 'ExpressionSetter',
  }
};

function makeRequired(propType, visionType) {
  function visionCheckTypeIsRequired(...rest) {
    return propType.isRequired(...rest);
  }
  visionCheckTypeIsRequired.visionType = {
    ...visionType,
    required: true,
  };
  return visionCheckTypeIsRequired;
}

function define(propType = PropTypes.any, visionType = {}) {
  if (!propType._inner && propType.name !== 'visionCheckType') {
    propType.visionType = visionType;
  }
  function visionCheckType(...rest) {
    return propType(...rest);
  }
  visionCheckType.visionType = visionType;
  visionCheckType.isRequired = makeRequired(propType, visionType);
  return visionCheckType;
}

const VisionTypes = {
  ...PropTypes,
  define,
};

export default VisionTypes;

// override primitive type chechers
Object.keys(primitiveTypeMaps).forEach((type) => {
  const propType = PropTypes[type];
  if (!propType) {
    return;
  }
  propType._inner = true;
  VisionTypes[type] = define(propType, primitiveTypeMaps[type]);
});

// You can ensure that your prop is limited to specific values by treating
// it as an enum.
VisionTypes.oneOf = (list) => {
  return define(PropTypes.oneOf(list), {
    defaultValue: list && list[0],
    display: 'inline',
    setter: {
      type: 'SelectSetter',
      options: list,
    },
  });
};

// An array of a certain type
VisionTypes.arrayOf = (type) => {
  return define(PropTypes.arrayOf(type), {
    defaultValue: [],
    display: 'inline',
    setter: {
      type: 'ArraySetter', // list
      itemType: type.visionType || primitiveTypeMaps.any, // addable type
    }
  });
};

// An object with property values of a certain type
VisionTypes.objectOf = (type) => {
  return define(PropTypes.objectOf(type), {
    defaultValue: {},
    display: 'inline',
    setter: {
      type: 'ObjectSetter', // all itemType
      itemType: type.visionType || primitiveTypeMaps.any, // addable type
    }
  });
};

// An object that could be one of many types
VisionTypes.oneOfType = (types) => {
  const itemType = types.map(type => type.visionType || primitiveTypeMaps.any);
  return define(PropTypes.oneOfType(types), {
    defaultValue: itemType[0] && itemType[0].defaultValue,
    display: 'inline',
    setter: {
      type: 'OneOfTypeSetter',
      itemType, // addable type
    },
  });
};


// You can also declare that a prop is an instance of a class. This uses
// JS's instanceof operator.
VisionTypes.instanceOf = (classType) => {
  return define(PropTypes.instanceOf(classType), {
    display: 'inline',
    setter: 'ExpressionSetter',
  });
};

// An object with warnings on extra properties
VisionTypes.exact = (typesMap) => {
  const exactTypes = {};
  const defaultValue = {};
  Object.keys(typesMap).forEach(key => {
    exactTypes[key] = typesMap[key].visionType || primitiveTypeMaps.any;
    defaultValue[key] = exactTypes[key].defaultValue;
  });
  return define(PropTypes.exact(typesMap), {
    defaultValue,
    display: 'inline',
    setter: {
      type: 'ObjectSetter', // all itemType
      exactTypes,
    },
  });
}

// An object taking on a particular shape
VisionTypes.shape = (typesMap) => {
  const exactTypes = {};
  const defaultValue = {};
  Object.keys(typesMap).forEach(key => {
    exactTypes[key] = typesMap[key].visionType || primitiveTypeMaps.any;
    defaultValue[key] = exactTypes[key].defaultValue;
  });
  return define(PropTypes.shape(typesMap), {
    defaultValue,
    display: 'inline',
    setter: {
      type: 'ObjectSetter', // all itemType
      exactTypes,
      itemType: primitiveTypeMaps.any, // addable type
    },
  });
};


// color
// time
// date
// range
