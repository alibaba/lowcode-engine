import walkSourcePlugin from './sorceEditorPlugin';

const transfrom = {
  schema2Code(schema: Object) {
    let componentSchema = schema.componentTree[0];
    let code =
`export default class {
  ${initStateCode(componentSchema)}
  ${initLifeCycleCode(componentSchema)}
  ${initMethodsCode(componentSchema)}
}`;
    console.log(code);
    return code;
  },

  code2Schema(code: String) {

    let newCode = code.replace(/export default class/,'class A');

    let A,a;
    try {
      A = eval('('+newCode + ')');
      a = new A();
    }catch(e){
      return ''
    }


    let functionNameList = Object.getOwnPropertyNames(a.__proto__);

    let functionMap = {};

    functionNameList.map((functionName)=>{
      if (functionName != 'constructor'){
          let functionCode = a[functionName].toString().replace(new RegExp(functionName),'function');
          functionMap[functionName] = functionCode;
      }
    })

    console.log(JSON.stringify(a.state));

    console.log(functionMap);

  },

  getNewFunctionCode(functionName:String){
    return `\n\t${functionName}(){\n\t}\n`
  }
};


function initStateCode(componentSchema:Object) {
  if (componentSchema.state){
     return `state = ${JSON.stringify(componentSchema.state)}`
  }

  return '';
}

function initLifeCycleCode(componentSchema: Object) {
  if (componentSchema.lifeCycles) {
    let lifeCycles = componentSchema.lifeCycles;
    let codeList = [];

    for (let key in lifeCycles) {
      codeList.push(createFunctionCode(key, lifeCycles[key]));
    }

    return codeList.join('');
  } else {
    return '';
  }
}

function initMethodsCode(componentSchema: Object) {
  if (componentSchema.methods) {
    let methods = componentSchema.methods;
    let codeList = [];

    for (let key in methods) {
      codeList.push(createFunctionCode(key, methods[key]));
    }

    return codeList.join('');
  } else {
    return '';
  }
}

function createFunctionCode(functionName: String, functionNode: Object) {
  if (functionNode.type === 'JSExpression') {
    let functionCode = functionNode.value;
    functionCode = functionCode.replace(/function/, functionName);
    return functionCode;
  }
}

export default transfrom;
