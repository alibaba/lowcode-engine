const LIFECYCLES_FUNCTION_MAP = {
  react: ['constructor', 'render', 'componentDidMount', 'componentDidUpdate', 'componentWillUnmount', 'componentDidCatch'],
};


const transfrom = {
  schema2Code(schema) {
    const componentSchema = schema.componentsTree[0];
    const code =
      `export default class {
  ${initStateCode(componentSchema)}
  ${initLifeCycleCode(componentSchema)}
  ${initMethodsCode(componentSchema)}
}`;
    console.log(code);
    return code;
  },

  code2Schema(code: string) {
    const newCode = code.replace(/export default class/, 'class A');
    let A; let a;
    try {
      // eslint-disable-next-line no-eval
      A = eval(`(${newCode})`);
      a = new A();
    } catch (e) {
      return '';
    }

    // eslint-disable-next-line no-proto
    const functionNameList = Object.getOwnPropertyNames(a.__proto__);

    const functionMap = {};

    functionNameList.map((functionName) => {
      if (functionName != 'constructor') {
        if (a[functionName]) {
          const functionCode = a[functionName].toString().replace(new RegExp(functionName), 'function');
          functionMap[functionName] = functionCode;
        }
      }
      return functionName;
    });

    if (a.state) {
      functionMap.state = a.state;
    }

    console.log(functionMap);
    return functionMap;
  },

  getNewFunctionCode(functionName: string) {
    return `\n\t${functionName}(){\n\t}\n`;
  },

  setFunction2Schema(functionMap, schema){
    let pageNode = schema.componentsTree[0];
    // 先清除原有的schema的值
    delete pageNode.state;
    pageNode.lifeCycles = {};
    pageNode.methods = {};
    if (!pageNode) return '';
    for (const key in functionMap) {
      if (key == 'state') {
        pageNode.state = functionMap[key];
      } else if (LIFECYCLES_FUNCTION_MAP.react.indexOf(key) >= 0) {
        // // 判断是否属于lifeCycles节点
        // if (LIFECYCLES_FUNCTION_MAP.react.indexOf(key) >= 0) {
        // 判断有没有lifecycles节点
        if (!pageNode.lifeCycles) {
          pageNode.lifeCycles = {};
        } else {
          pageNode.lifeCycles[key] = {
            type: 'JSFunction',
            value: functionMap[key],
          };
        }
      } else if (!pageNode.methods) {
        // methods节点
        pageNode.methods = {};
        // if (!pageNode.methods) {
        //   pageNode.methods = {};
        // } else {
        //   pageNode.methods[key] = {
        //     type: 'JSFunction',
        //     value: functionMap[key],
        //   };
        // }
      } else {
        pageNode.methods[key] = {
          type: 'JSFunction',
          value: functionMap[key],
        };
      }
    }

    return schema;
  },
};


function initStateCode(componentSchema) {
  if (componentSchema.state) {
    return `state = ${JSON.stringify(componentSchema.state)}`;
  }

  return '';
}

function initLifeCycleCode(componentSchema) {
  if (componentSchema.lifeCycles) {
    const { lifeCycles } = componentSchema;
    const codeList = [];

    for (const key in lifeCycles) {
      codeList.push(createFunctionCode(key, lifeCycles[key]));
    }

    return codeList.join('');
  } else {
    return '';
  }
}

function initMethodsCode(componentSchema) {
  if (componentSchema.methods) {
    const { methods } = componentSchema;
    const codeList = [];

    for (const key in methods) {
      codeList.push(createFunctionCode(key, methods[key]));
    }

    return codeList.join('');
  } else {
    return '';
  }
}

function createFunctionCode(functionName: string, functionNode) {
  if (functionNode.type === 'JSExpression' || functionNode.type === 'JSFunction') {
    let functionCode = functionNode.value;
    functionCode = functionCode.replace(/function/, functionName);
    return functionCode;
  }
}


export default transfrom;
