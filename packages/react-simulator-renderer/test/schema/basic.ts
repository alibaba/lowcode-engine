export default {
  id: 'node_ockvuu8u911',
  css: 'body{background-color:#f2f3f5}',
  flows: [],
  props: {
    className: 'page_kvuu9hym',
    pageStyle: {
      backgroundColor: '#f2f3f5',
    },
    containerStyle: {},
    templateVersion: '1.0.0',
  },
  state: {},
  title: '',
  methods: {
    __initMethods__: {
      type: 'JSExpression',
      value: "function (exports, module) { \"use strict\";\n\nexports.__esModule = true;\nexports.func1 = func1;\nexports.helloPage = helloPage;\n\nfunction func1() {\n  console.info('hello, this is a page function');\n}\n\nfunction helloPage() {\n  // 你可以这么调用其他函数\n  this.func1(); // 你可以这么调用组件的函数\n  // this.$('textField_xxx').getValue();\n  // 你可以这么使用「数据源面板」定义的「变量」\n  // this.state.xxx\n  // 你可以这么发送一个在「数据源面板」定义的「远程 API」\n  // this.dataSourceMap['xxx'].load(data)\n  // API 详见：https://go.alibaba-inc.com/help3/API\n} \n}",
    },
  },
  children: [
    {
      id: 'node_ockvuu8u915',
      props: {
        fieldId: 'div_kvuu9gl1',
        behavior: 'NORMAL',
        __style__: {},
        customClassName: '',
        useFieldIdAsDomId: false,
      },
      title: '',
      children: [
        {
          id: 'node_ockvuu8u916',
          props: {
            content: {
              use: 'zh-CN',
              type: 'JSExpression',
              'en-US': 'Tips content',
              value: '"我是一个简单的测试页面"',
              'zh-CN': '我是一个简单的测试页面',
              extType: 'i18n',
            },
            fieldId: 'text_kvuu9gl2',
            maxLine: 0,
            behavior: 'NORMAL',
            __style__: {},
            showTitle: false,
          },
          title: '',
          condition: true,
          componentName: 'Text',
        },
      ],
      condition: true,
      componentName: 'Div',
    },
  ],
  condition: true,
  dataSource: {
    list: [],
    sync: true,
    online: [],
    offline: [],
    globalConfig: {
      fit: {
        type: 'JSExpression',
        value: "function main(){\n  'use strict';\n\nvar __compiledFunc__ = function fit(response) {\n  var content = response.content !== undefined ? response.content : response;\n  var error = {\n    message: response.errorMsg || response.errors && response.errors[0] && response.errors[0].msg || response.content || '远程数据源请求出错，success is false'\n  };\n  var success = true;\n  if (response.success !== undefined) {\n    success = response.success;\n  } else if (response.hasError !== undefined) {\n    success = !response.hasError;\n  }\n  return {\n    content: content,\n    success: success,\n    error: error\n  };\n};\n  return __compiledFunc__.apply(this, arguments);\n}",
        extType: 'function',
      },
    },
  },
  lifeCycles: {
    constructor: {
      type: 'JSExpression',
      value: "function constructor() {\nvar module = { exports: {} };\nvar _this = this;\nthis.__initMethods__(module.exports, module);\nObject.keys(module.exports).forEach(function(item) {\n  if(typeof module.exports[item] === 'function'){\n    _this[item] = module.exports[item];\n  }\n});\n\n}",
      extType: 'function',
    },
  },
  componentName: 'Page',
};
