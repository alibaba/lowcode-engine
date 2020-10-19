const LIFECYCLES_FUNCTION_MAP = {
  react: ['constructor', 'render', 'componentDidMount', 'componentDidUpdate', 'componentWillUnmount', 'componentDidCatch'],
};


const transfrom = {
  schema2Code(schema) {
    const componentSchema = schema.componentsTree[0];
    const code =
      `export default class LowcodeComponent extends Component {
  ${initStateCode(componentSchema)}
  ${initLifeCycleCode(componentSchema)}
  ${initMethodsCode(componentSchema)}
}`;
    console.log(code);
    return code;
  },

  code2Schema(code: string) {
    let codeNew = code;
    const functionMap = {};
    let startIndex;

    const stateStartStr = this.pickupStateStartStr(codeNew);
    if (stateStartStr != null) {
      startIndex = codeNew.indexOf(stateStartStr) + stateStartStr.length;
      const stateBodyStr = this.pickupFunctionBody(codeNew, startIndex);
      const stateData = JSON.parse('{' + stateBodyStr);
      functionMap.state = stateData;
    }


    while (true) {
      const functionNameStr = this.pickupFunctionName(codeNew);
      if (functionNameStr != null) {
        startIndex = codeNew.indexOf(functionNameStr) + functionNameStr.length;
        const functionBodyStr = this.pickupFunctionBody(codeNew, startIndex);
        const functionStr = functionNameStr + functionBodyStr;
        codeNew = codeNew.replace(functionStr, '');
        const functionName = functionNameStr.match(/\w+/);
        functionMap[functionName] = functionStr.replace(functionName, 'function');
      } else {
        break;
      }
    }


    // debugger;
    // const newCode = code.replace(/export default class LowcodeComponent extends Component/, 'class A');
    // let A; let a;
    // try {
    //   // eslint-disable-next-line no-eval
    //   A = eval(`(${newCode})`);
    //   a = new A();
    // } catch (e) {
    //   console.log(e.message);
    //   return null;
    // }

    // // eslint-disable-next-line no-proto
    // const functionNameList = Object.getOwnPropertyNames(a.__proto__);

    // const functionMap = {};
    // functionNameList.map((functionName) => {
    //   if (functionName != 'constructor') {
    //     if (a[functionName]) {
    //       const functionCode = a[functionName].toString().replace(new RegExp(functionName), 'function');
    //       functionMap[functionName] = functionCode;
    //     }
    //   }
    //   return functionName;
    // });

    // if (a.state) {
    //   functionMap.state = a.state;
    // }

    console.log(functionMap);
    return functionMap;
  },


  pickupFunctionName(codeStr) {
    // 函数名的正则表达式
    // eslint-disable-next-line no-useless-escape
    const reg = /\w+\s?\((\w|\,|\s)*\)\s?\{/;
    const result = codeStr.match(reg);
    if (result && result[0]) {
      const functionNameStr = result[0];
      return functionNameStr;
    }
    return null;
  },

  pickupFunctionBody(codeStr, startIndex) {
    const startStr = codeStr.substr(startIndex);
    const stack = []; let endIndex;
    for (let i = 0; i < startStr.length; i++) {
      // 如果发现已经有{,则是内函数或者是系统函数，需要进行排除
      if (startStr[i] === '{') {
        stack.push(i);
      }

      // 判断是否是函数体的结尾
      if (startStr[i] === '}') {
        // 有内函数，出栈
        if (stack.length > 0) {
          stack.pop();
        } else {
          endIndex = i;
          break;
        }
      }
    }

    const functionBodyStr = startStr.substr(0, endIndex + 1);
    // console.log(functionBodyStr);
    return functionBodyStr;
  },

  // 捕获state头部部分
  pickupStateStartStr(codeStr) {
    const reg = /state\s?=\s?\s?\{/;
    const result = codeStr.match(reg);
    if (result && result[0]) {
      const stateStartStr = result[0];
      return stateStartStr;
    }
    return null;
  },

  getNewFunctionCode(functionName: string) {
    return `\n\t${functionName}(){\n\t}\n`;
  },

  setFunction2Schema(functionMap, css, schema) {
    const pageNode = schema.componentsTree[0];
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

    pageNode.css = css;

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
