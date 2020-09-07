const LIFECYCLES_FUNCTION_MAP = {
  react: ['constructor', 'render', 'componentDidMount', 'componentDidUpdate', 'componentWillUnmount', 'componentDidCatch'],
};


const transfrom = {
  schema2Code(schema: Object) {
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
      A = eval(`(${newCode })`);
      a = new A();
    } catch (e) {
      return '';
    }

    const functionNameList = Object.getOwnPropertyNames(a.__proto__);

    const functionMap = {};

    functionNameList.map((functionName) => {
      if (functionName != 'constructor') {
        if (a[functionName]) {
          const functionCode = a[functionName].toString().replace(new RegExp(functionName), 'function');
          functionMap[functionName] = functionCode;
        }
      }
    });

    if (a.state) {
      functionMap.state = a.state;
    }

    console.log(functionMap);
    return functionMap;
  },

  getNewFunctionCode(functionName:string) {
    return `\n\t${functionName}(){\n\t}\n`;
  },

  setFunction2Schema(functionMap, schema) {
    const pageNode = schema.componentsTree[0];
    if (!pageNode) return '';
    for (const key in functionMap) {
      if (key == 'state') {
        pageNode.state = functionMap[key];
      } else {
        // 判断是否属于lifeCycles节点
        if (LIFECYCLES_FUNCTION_MAP.react.indexOf(key) >= 0) {
          // 判断有没有lifecycles节点
          if (!pageNode.lifeCycles) {
            pageNode.lifeCycles = {};
          } else {
            pageNode.lifeCycles[key] = {
              type: 'JSFunction',
              value: functionMap[key],
            };
          }
        } else {
          // methods节点
          if (!pageNode.methods) {
            pageNode.methods = {};
          } else {
            pageNode.methods[key] = {
              type: 'JSFunction',
              value: functionMap[key],
            };
          }
        }
      }
    }

    return schema;
  },
};


function initStateCode(componentSchema:Object) {
  if (componentSchema.state) {
    return `state = ${JSON.stringify(componentSchema.state)}`;
  }

  return '';
}

function initLifeCycleCode(componentSchema: Object) {
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

function initMethodsCode(componentSchema: Object) {
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

function createFunctionCode(functionName: string, functionNode: Object) {
  if (functionNode.type === 'JSExpression' || functionNode.type === 'JSFunction') {
    let functionCode = functionNode.value;
    functionCode = functionCode.replace(/function/, functionName);
    return functionCode;
  }
}


export default transfrom;
