export default {
  componentName: 'Page',
  id: 'page',
  title: 'hey, i\' a page!',
  props: {
    extensions: {
      启用页头: true,
    },
    pageStyle: {
      backgroundColor: '#f2f3f5',
    },
    containerStyle: {},
    className: 'page_kgaqfbm4',
    templateVersion: '1.0.0',
  },
  lifeCycles: {
    constructor: {
      type: 'js',
      compiled:
        "function constructor() {\nvar module = { exports: {} };\nvar _this = this;\nthis.__initMethods__(module.exports, module);\nObject.keys(module.exports).forEach(function(item) {\n  if(typeof module.exports[item] === 'function'){\n    _this[item] = module.exports[item];\n  }\n});\n\n}",
      source:
        "function constructor() {\nvar module = { exports: {} };\nvar _this = this;\nthis.__initMethods__(module.exports, module);\nObject.keys(module.exports).forEach(function(item) {\n  if(typeof module.exports[item] === 'function'){\n    _this[item] = module.exports[item];\n  }\n});\n\n}",
    },
  },
  condition: true,
  css:
    'body{background-color:#f2f3f5}.card_kgaqfbm5 {\n  margin-bottom: 12px;\n}.card_kgaqfbm6 {\n  margin-bottom: 12px;\n}.button_kgaqfbm7 {\n  margin-right: 16px;\n  width: 80px\n}.button_kgaqfbm8 {\n  width: 80px;\n}.div_kgaqfbm9 {\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  background: #fff;\n  padding: 20px 0;\n}',
  methods: {
    __initMethods__: {
      type: 'js',
      source: 'function (exports, module) { /*set actions code here*/ }',
      compiled: 'function (exports, module) { /*set actions code here*/ }',
    },
  },
  children: [
    {
      componentName: 'Div',
      id: 'div',
      props: {
        className: 'div_kgaqfbm9',
        behavior: 'NORMAL',
        __style__:
          ':root {\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  background: #fff;\n  padding: 20px 0;\n}',
        events: {},
        fieldId: 'div_k1ow3h1o',
        useFieldIdAsDomId: false,
        customClassName: {
          type: 'JSExpression',
          value: 'getFromSomewhere()',
        },
        customClassName2: {
          type: 'JSExpression',
          mock: { hi: 'mock' },
          value: 'getFromSomewhere()',
        },
      },
      extraPropA: 'haha',
    },
    {
      componentName: 'Div',
      id: 'div2',
      props: {
        className: 'div_kgaqfbm9',
        behavior: 'NORMAL',
        __style__:
          ':root {\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  background: #fff;\n  padding: 20px 0;\n}',
        events: {},
        fieldId: 'div_k1ow3h1o',
        useFieldIdAsDomId: false,
        customClassName: '',
      },
      extraPropA: 'haha',
    },
    {
      componentName: 'Test',
      id: 'test',
      props: {
        className: 'div_kgaqfbm9',
        behavior: 'NORMAL',
        __style__:
          ':root {\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  background: #fff;\n  padding: 20px 0;\n}',
        events: {},
        fieldId: 'div_k1ow3h1o',
        useFieldIdAsDomId: false,
        customClassName: '',
      },
      extraPropA: 'haha',
    },
  ],
};
