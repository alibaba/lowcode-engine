module.exports = {
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": [
    "react"
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6":true
  },
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true,
        "experimentalObjectRestSpread": true
      }
  },
  "rules": {
    "react/no-deprecated": 0, // react15.x关闭deprated警告 
    "constructor-super": 2,//要求在构造函数中有 super() 的调用
    "no-case-declarations": 2,//不允许在 case 子句中使用词法声明
    "no-class-assign": 2,//禁止修改类声明的变量
    "no-compare-neg-zero": 2,//禁止负0比较
    "no-cond-assign": 2,//禁止条件表达式中出现赋值操作符
    "no-console": [2, {
      "allow": ["info", "warn", "error"]
    }],//禁止console
    "no-const-assign": 2,//禁止修改 const 声明的变量
    "no-constant-condition": 2,//禁止在条件中使用常量表达式
    "no-control-regex": 2,//禁止在正则表达式中使用控制字符
    "no-debugger": 2,//禁止debugger
    "no-delete-var": 2,//禁止删除变量
    "no-dupe-args": 2,//禁止重复的参数
    "no-dupe-class-members": 2,//禁止类成员中出现重复的名称
    "no-dupe-keys": 2,//禁止重复的键值
    "no-duplicate-case": 2,//禁止重复的case条件
    "no-empty-character-class": 2,//禁止在正则表达式中使用空字符集
    "no-empty-pattern": 2,//禁止使用空解构模式
    "no-empty": 2,//禁止出现空语句块
    "no-ex-assign": 2,//禁止对 catch 子句的参数重新赋值
    "no-extra-boolean-cast": 2,//禁止不必要的布尔转换
    "no-extra-semi": 2,//禁止多余的分号
    "no-fallthrough": 2,//禁止 case 语句落空
    "no-func-assign": 2,//禁止对 function 声明重新赋值
    "no-global-assign": 2,//禁止对全局对象重新赋值
    "no-inner-declarations": 2,//禁止在嵌套的块中出现变量声明或 function 声明
    "no-invalid-regexp": 2,//禁止 RegExp 构造函数中存在无效的正则表达式字符串
    "no-irregular-whitespace": 2,//禁止在字符串和注释之外不规则的空白
    "no-mixed-spaces-and-tabs": 2,//禁止空格和 tab 的混合缩进
    "no-new-symbol": 2,//禁止对Symbol使用new关键字
    "no-obj-calls": 2,//禁止把全局对象作为函数调用
    "no-octal": 2,//禁止8进制的字面量
    "no-redeclare": 2,//禁止多次声明同一变量
    "no-regex-spaces": 2,//禁止正则表达式字面量中出现多个空格
    "no-self-assign": 2,//禁止自我赋值
    "no-sparse-arrays": 2,//禁用稀疏数组
    "no-this-before-super": 2,//禁止在构造函数中，在调用 super() 之前使用 this 或 super
    "no-undef": 2,//禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    "no-unexpected-multiline": 2,//禁止出现令人困惑的多行表达式
    "no-unreachable": 2,//禁止在return、throw、continue 和 break 语句之后出现不可达代码
    "no-unsafe-finally": 2,//禁止在 finally 语句块中出现控制流语句
    "no-unsafe-negation": 2,//禁止在表达式左侧使用关系表达式
    "no-unused-labels": 2,//禁用出现未使用过的标
    "no-unused-vars": 2,//禁止出现未使用过的变量
    "no-useless-escape": 2,//禁用不必要的转义字符
    "require-yield": 2,//要求 generator 函数内有 yield
    "use-isnan": 2,//使用isNan() 判断isNaN
    "valid-typeof": 2//强制 typeof 表达式与有效的字符串进行比较
  },
  "settings": {}
}