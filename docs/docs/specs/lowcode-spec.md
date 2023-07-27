---
title: 《低代码引擎搭建协议规范》
sidebar_position: 0
---

## 1 介绍

### 1.1 本协议规范涉及的问题域

- 定义本协议版本号规范
- 定义本协议中每个子规范需要被支持的 Level
- 定义本协议相关的领域名词
- 定义搭建基础协议版本号规范（A）
- 定义搭建基础协议组件映射关系规范（A）
- 定义搭建基础协议组件树描述规范（A）
- 定义搭建基础协议国际化多语言支持规范（AA）
- 定义搭建基础协议无障碍访问规范（AAA）


### 1.2 协议草案起草人

- 撰写：月飞、康为、林熠
- 审阅：大果、潕量、九神、元彦、戊子、屹凡、金禅、前道、天晟、戊子、游鹿、光弘、力皓


### 1.3 版本号

1.1.0

### 1.4 协议版本号规范（A）

本协议采用语义版本号，版本号格式为 `major.minor.patch` 的形式。

- major 是大版本号：用于发布不向下兼容的协议格式修改
- minor 是小版本号：用于发布向下兼容的协议功能新增
- patch 是补丁号：用于发布向下兼容的协议问题修正


### 1.5 协议中子规范 Level 定义

| 规范等级 | 实现要求                                                                           |
| -------- | ---------------------------------------------------------------------------------- |
| A        | 强制规范，必须实现；违反此类规范的协议描述数据将无法写入物料中心，不支持流通。     |
| AA       | 推荐规范，推荐实现；遵守此类规范有助于业务未来的扩展性和跨团队合作研发效率的提升。 |
| AAA      | 参考规范，根据业务场景实际诉求实现；是集团层面鼓励的技术实现引导。                 |


### 1.6 名词术语

#### 1.6.1 物料系统名词

- **基础组件（Basic Component）**：前端领域通用的基础组件，阿里巴巴前端委员会官方指定的基础组件库是 Fusion Next/AntD。
- **图表组件（Chart Component）**：前端领域通用的图表组件，有代表性的图表组件库有 BizCharts。
- **业务组件（Business Component）**：业务领域内基于基础组件之上定义的组件，可能会包含特定业务域的交互或者是业务数据，对外仅暴露可配置的属性，且必须发布到公域（如阿里 NPM）；在同一个业务域内可以流通，但不需要确保可以跨业务域复用。
  - **低代码业务组件（Low-Code Business Component）**：通过低代码编辑器搭建而来，有别于源码开发的业务组件，属于业务组件中的一种类型，遵循业务组件的定义；同时低代码业务组件还可以通过低代码编辑器继续多次编辑。
- **布局组件（Layout Component）**：前端领域通用的用于实现基础组件、图表组件、业务组件之间各类布局关系的组件，如三栏布局组件。
- **区块（Block）**：通过低代码搭建的方式，将一系列业务组件、布局组件进行嵌套组合而成，不对外提供可配置的属性。可通过 区块容器组的包裹，实现区块内部具备有完整的样式、事件、生命周期管理、状态管理、数据流转机制。能独立存在和运行，可通过复制 schema 实现跨页面、跨应用的快速复用，保障功能和数据的正常。
- **页面（Page）**：由组件 + 区块组合而成。由页面容器组件包裹，可描述页面级的状态管理和公共函数。
- **模板（Template）**：特定垂直业务领域内的业务组件、区块可组合为单个页面，或者是再配合路由组合为多个页面集，统称为模板。


#### 1.6.2 低代码搭建系统名词

- **搭建编辑器**：使用可视化的方式实现页面搭建，支持组件 UI 编排、属性编辑、事件绑定、数据绑定，最终产出符合搭建基础协议规范的数据。
   - **属性面板**：低代码编辑器内部用于组件、区块、页面的属性编辑、事件绑定、数据绑定的操作面板。
   - **画布面板**：低代码编辑器内部用于 UI 编排的操作面板。
   - **大纲面板**：低代码编辑器内部用于页面组件树展示的面板。
- **编辑器框架**：搭建编辑器的基础框架，包含主题配置机制、插件机制、setter 控件机制、快捷键管理、扩展点管理等底层基础设施。
- **入料模块**：专注于物料接入，能自动扫描、解析源码组件，并最终产出一份符合《低代码引擎物料协议规范》的 Schema JSON。
- **编排模块**：专注于 Schema 可视化编排，以可视化的交互方式提供页面结构编排服务，并最终产出一份符合《低代码搭建基础协议规范》的 Schema JSON。
- **渲染模块**：专注于将 Schema JSON 渲染为 UI 界面，最终呈现一个可交互的页面。
- **出码模块 Schema2Code**：专注于通过 Schema JSON 生成高质量源代码，将符合《低代码搭建基础协议规范》的 Schema JSON 数据分别转化为面向 React / Rax / 阿里小程序等终端可渲染的代码。
- **事件绑定**：是指为某个组件的某个事件绑定相关的事件处理动作，比如为某个组件的**点击事件**绑定**一段处理函数**或**响应动作**（比如弹出对话框），每个组件可绑定的事件由该组件自行定义。
- **数据绑定**：是指为某个组件的某个属性绑定用于该属性使用的数据。
- **生命周期**: 一般指某个对象的生老病死，本文中指某个实体（组件、容器、区块等等）的创建、加载、显示、销毁等关键生命阶段的统称。

### 1.7 背景

- **协议目标**：通过约束低代码引擎的搭建协议规范，让上层低代码编辑器的产出物（低代码业务组件、区块、应用）保持一致性，可跨低代码研发平台进行流通而提效，亦不阻碍集团业务间融合的发展。 
- **协议通**：
  - 协议顶层结构统一
    - 协议 schema 具备有完整的描述能力，包含版本、国际化、组件树、组件映射关系等；
    - 顶层属性 key、value 值的格式，必须保持一致；
  - 组件树描述统一
    - 源码组件描述；
    - 页面、区块、低代码业务组件这三种容器组件的描述；
    - 数据流描述，包含数据请求、数据状态管理、数据绑定描述；
    - 事件描述，包含统一事件上下文、统一搭建 API；
- **物料通**：指在相同领域内的不同搭建产品，可直接使用的物料。比如模版、区块、组件；

### 1.8 受众

本协议适用于所有使用低代码搭建平台来开发页面或组件的开发者，以及围绕此协议的相关工具或工程化方案的开发者。阅读及使用本协议，需要对低代码搭建平台的交互和实现有一定的了解，对前端开发相关技术栈的熟悉也会有帮助，协议中对通用的前端相关术语不会做进一步的解释说明。

### 1.9 使用范围

本协议描述的是低代码搭建平台产物（应用、页面、区块、组件）的 schema 结构，以及实现其数据状态更新（内置 api)、能力扩展、国际化等方面完整，只在低代码搭建场景下可用；

### 1.10 协议目标

一套面向开发者的 schema 规范，用于规范化约束搭建编辑器的输出，以及渲染模块和出码模块的输入，将搭建编辑器、渲染模块、出码模块解耦，保障搭建编辑器、渲染模块、出码模块的独立升级。

### 1.11 设计说明

- **语义化**：语义清晰，简明易懂，可读性强。
- **渐进性描述**：搭建的本质是通过 源码组件 进行嵌套组合，从小往大、依次组合生成 组件、区块、页面，最终通过云端构建生成 应用 的过程。因此在搭建基础协议中，我们需要知道如何去渐进性的描述组件、区块、页面、应用这 4 个实体概念。
- **生成标准源码**：明确每一个属性与源码对应的转换关系，可生成跟手写无差异的高质量标准源代码。
- **可流通性**：产物能在不同搭建产品中流通，不涉及任何私域数据存储。
- **面向多端**：不能仅面向 React，还有小程序等多端。
- **支持国际化&无障碍访问标准的实现**


## 2 协议结构

协议最顶层结构如下：

- version { String } 当前协议版本号
- componentsMap { Array } 组件映射关系
- componentsTree { Array } 描述模版/页面/区块/低代码业务组件的组件树
- utils { Array } 工具类扩展映射关系
- i18n { Object } 国际化语料
- constants { Object } 应用范围内的全局常量
- css { string } 应用范围内的全局样式
- config: { Object } 当前应用配置信息
- meta: { Object } 当前应用元数据信息
- dataSource: { Array } 当前应用的公共数据源
- router: { Object } 当前应用的路由配置信息
- pages: { Array } 当前应用的所有页面信息

描述举例：

```json
{
  "version": "1.0.0",                  // 当前协议版本号
  "componentsMap": [{                  // 组件描述
    "componentName": "Button",
    "package": "@alifd/next",
    "version": "1.0.0",
    "destructuring": true,
    "exportName": "Select",
    "subName": "Button"
  }],
  "utils": [{
    "name": "clone",
    "type": "npm",
    "content": {
      "package": "lodash",
      "version": "0.0.1",
      "exportName": "clone",
      "subName": "",
      "destructuring": false,
      "main": "/lib/clone"
    }
  }, {
    "name": "moment",
    "type": "npm",
    "content": {
      "package": "@alifd/next",
      "version": "0.0.1",
      "exportName": "Moment",
      "subName": "",
      "destructuring": true,
      "main": ""
    }
  }],
  "componentsTree": [{                 // 描述内容，值类型 Array
    "id": "page1",
    "componentName": "Page",           // 单个页面，枚举类型 Page|Block|Component
    "fileName": "Page1",
    "props": {},
    "css": "body {font-size: 12px;} .table { width: 100px;}",
    "children": [{
      "componentName": "Div",
      "props": {
        "className": ""
      },
      "children": [{
        "componentName": "Button",
        "props": {
          "prop1": 1234,               // 简单 json 数据
          "prop2": [{                  // 简单 json 数据
            "label": "选项 1",
            "value": 1
          }, {
            "label": "选项 2",
            "value": 2
          }],
          "prop3": [{
            "name": "myName",
            "rule": {
              "type": "JSExpression",
              "value": "/\w+/i"
            }
          }],
          "valueBind": {               // 变量绑定
            "type": "JSExpression",
            "value": "this.state.user.name"
          },
          "onClick": {                 // 动作绑定
            "type": "JSFunction",
            "value": "function(e) { console.log(e.target.innerText) }"
          },
          "onClick2": {                // 动作绑定 2
            "type": "JSExpression",
            "value": "this.submit"
          }
        }
      }]
    }]
  }],
  "constants": {
    "ENV": "prod",
    "DOMAIN": "xxx.com"
  },
  "css": "body {font-size: 12px;} .table { width: 100px;}",
  "config": {                                          // 当前应用配置信息
    "sdkVersion": "1.0.3",                             // 渲染模块版本
    "historyMode": "hash",                             // 不推荐，推荐在 router 字段中配置
    "targetRootID": "J_Container",
    "layout": {
      "componentName": "BasicLayout",
      "props": {
        "logo": "...",
        "name": "测试网站"
      },
    },
    "theme": {
      // for Fusion use dpl defined
      "package": "@alife/theme-fusion",
      "version": "^0.1.0",
      // for Antd use variable
      "primary": "#ff9966"
    }
  },
  "meta": {                                           // 应用元数据信息，key 为业务自定义
    "name": "demo 应用",                               // 应用中文名称，
    "git_group": "appGroup",                          // 应用对应 git 分组名
    "project_name": "app_demo",                       // 应用对应 git 的 project 名称
    "description": "这是一个测试应用",                   // 应用描述
    "spma": "spa23d",                                 // 应用 spm A 位信息
    "creator": "月飞",
    "gmt_create": "2020-02-11 00:00:00",              // 创建时间
    "gmt_modified": "2020-02-11 00:00:00",            // 修改时间
    ...
  },
  "i18n": {
    "zh-CN": {
      "i18n-jwg27yo4": "你好",
      "i18n-jwg27yo3": "中国"
    },
    "en-US": {
      "i18n-jwg27yo4": "Hello",
      "i18n-jwg27yo3": "China"
    }
  },
  "router": {
    "baseUrl": "/",
    "historyMode": "hash",                             // 浏览器路由：browser  哈希路由：hash
    "routes": [
      {
        "path": "home",
        "page": "page1"
      }
    ]
  },
  "pages": [
    {
      "id": "page1",
      "treeId": "page1"
    }
  ]
}
```

### 2.1 协议版本号（A）

定义当前协议 schema 的版本号，不同的版本号对应不同的渲染 SDK，以保障不同版本搭建协议产物的正常渲染；


| 根属性名称 | 类型   | 说明       | 变量支持 | 默认值 |
| ---------- | ------ | ---------- | -------- | ------ |
| version    | String | 协议版本号 | -        | 1.0.0  |


描述示例：

```javascript
{
  "version": "1.0.0"
}
```

### 2.2 组件映射关系（A）

协议中用于描述 componentName 到公域组件映射关系的规范。


| 参数            | 说明                   | 类型                      | 变量支持 | 默认值 |
| --------------- | ---------------------- | ------------------------- | -------- | ------ |
| componentsMap[] | 描述组件映射关系的集合 | **ComponentMap**[] | -        | null   |

**ComponentMap 结构描述**如下：

| 参数          | 说明                                                                                                   | 类型    | 变量支持 | 默认值 |
| ------------- | ------------------------------------------------------------------------------------------------------ | ------- | -------- | ------ |
| componentName | 协议中的组件名，唯一性，对应包导出的组件名，是一个有效的 **JS 标识符**，而且是大写字母打头 | String  | -        | -      |
| package       | npm 公域的 package name                                                                                  | String  | -        | -      |
| version       | package version                                                                                        | String  | -        | -      |
| destructuring | 使用解构方式对模块进行导出                                                                                                   | Boolean | -        | -      |
| exportName    | 包导出的组件名                                                                                         | String  | -        | -      |
| subName       | 下标子组件名称                                                                                         | String  | -        |        |
| main          | 包导出组件入口文件路径                                                                                 | String  | -        | -      |


描述示例：

```json
{
  "componentsMap": [{
    "componentName": "Button",
    "package": "@alifd/next",
    "version": "1.0.0",
    "destructuring": true
  }, {
    "componentName": "MySelect",
    "package": "@alifd/next",
    "version": "1.0.0",
    "destructuring": true,
    "exportName": "Select"
  }, {
    "componentName": "ButtonGroup",
    "package": "@alifd/next",
    "version": "1.0.0",
    "destructuring": true,
    "exportName": "Button",
    "subName": "Group"
  }, {
    "componentName": "RadioGroup",
    "package": "@alifd/next",
    "version": "1.0.0",
    "destructuring": true,
    "exportName": "Radio",
    "subName": "Group"
  }, {
    "componentName": "CustomCard",
    "package": "@ali/custom-card",
    "version": "1.0.0"
  }, {
    "componentName": "CustomInput",
    "package": "@ali/custom",
    "version": "1.0.0",
    "main": "/lib/input",
    "destructuring": true,
    "exportName": "Input"
  }]
}
```

出码结果：

```javascript
// 使用解构方式，destructuring is true.
import { Button } from '@alifd/next';

// 使用解构方式，且 exportName 和 componentName 不同
import { Select as MySelect } from '@alifd/next';

// 使用解构方式，并导出其子组件
import { Button } from '@alifd/next';
const ButtonGroup = Button.Group;

import { Radio } from '@alifd/next';
const RadioGroup = Radio.Group;

// 不使用解构方式进行导出
import CustomCard from '@ali/custom-card';

// 使用特定路径进行导出
import { Input as CustomInput } from '@ali/custom/lib/input';

```


### 2.3 组件树描述（A）


协议中用于描述搭建出来的组件树结构的规范，整个组件树的描述由**组件结构**&**容器结构**两种结构嵌套构成。

- 组件结构：描述单个组件的名称、属性、子集的结构；
- 容器结构：描述单个容器的数据、自定义方法、生命周期的结构，用于将完整页面进行模块化拆分。

与源码对应的转换关系如下：

- 组件结构：转换成一个 .jsx 文件内 React Class 类 render 函数返回的 **jsx** 代码。
- 容器结构：将转换成一个标准文件，如 React 的 jsx 文件，export 一个 React Class，包含生命周期定义、自定义方法、事件属性绑定、异步数据请求等。

#### 2.3.1 基础结构描述 (A)

此部分定义了组件结构、容器结构的公共基础字段。

> 阅读时可先跳到后续章节，待需要时回来参考阅读

##### 2.3.1.1 Props 结构描述

| 参数        | 说明         | 类型   | 支持变量 | 默认值 | 备注                                  |
| ----------- | ------------ | ------ | -------- | ------ | ------------------------------------- |
| id          | 组件 ID       | String | ✅        | -      | 系统属性                              |
| className   | 组件样式类名 | String | ✅        | -      | 系统属性，支持变量表达式              |
| style       | 组件内联样式 | Object | ✅        | -      | 系统属性，单个内联样式属性值          |
| ref         | 组件 ref 名称  | String | ✅        | -      | 可通过 `this.$(ref)` 获取组件实例 |
| extendProps | 组件继承属性 | 变量   | ✅        | -      | 仅支持变量绑定，常用于继承属性对象    |
| ...         | 组件私有属性 | -      | -        | -      |                                       |

##### 2.3.1.2 css/less/scss 样式描述

| 参数          | 说明                                                                       | 类型   | 支持变量 | 默认值 |
| ------------- | -------------------------------------------------------------------------- | ------ | -------- | ------ |
| css/less/scss | 用于描述容器组件内部节点的样式，对应生成一个独立的样式文件，不支持 @import | String | -        | null   |

描述示例：

```json
{
  "css": "body {font-size: 12px;} .table { width: 100px; }"
}
```

##### 2.3.1.3 ComponentDataSource 对象描述

| 参数        | 说明                   | 类型                                   | 支持变量 | 默认值 | 备注                                                                                                        |
| ----------- | ---------------------- | -------------------------------------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| list[]     | 数据源列表             | **ComponentDataSourceItem**[] | -        | -      | 成为为单个请求配置, 内容定义详见 [ComponentDataSourceItem 对象描述](#2314-componentdatasourceitem-对象描述) |
| dataHandler | 所有请求数据的处理函数 | Function                               | -        | -      | 详见 [dataHandler Function 描述](#2317-datahandler-function 描述)                                           |

##### 2.3.1.4 ComponentDataSourceItem 对象描述

| 参数           | 说明                         | 类型                                                 | 支持变量 | 默认值                      | 备注                                                                                                                                                                 |
| -------------- | ---------------------------- | ---------------------------------------------------- | -------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | 数据请求 ID 标识               | String                                               | -        | -                           |                                                                                                                                                                      |
| isInit         | 是否为初始数据               | Boolean                                              | ✅        | true                        | 值为 true 时，将在组件初始化渲染时自动发送当前数据请求                                                                                                                 |
| isSync         | 是否需要串行执行             | Boolean                                              | ✅        | false                       | 值为 true 时，当前请求将被串行执行                                                                                                                                     |
| type           | 数据请求类型                 | String                                               | -        | fetch                       | 支持四种类型：fetch/mtop/jsonp/custom                                                                                                                                |
| shouldFetch    | 本次请求是否可以正常请求     | (options: ComponentDataSourceItemOptions) => boolean | -        | ```() => true```            | function 参数参考 [ComponentDataSourceItemOptions 对象描述](#2315-componentdatasourceitemoptions-对象描述)                                                           |
| willFetch      | 单个数据结果请求参数处理函数 | Function                                             | -        | options => options          | 只接受一个参数（options），返回值作为请求的 options，当处理异常时，使用原 options。也可以返回一个 Promise，resolve 的值作为请求的 options，reject 时，使用原 options |
| requestHandler | 自定义扩展的外部请求处理器   | Function                                             | -        | -                           | 仅 type='custom' 时生效                                                                                                                                               |
| dataHandler    | request 成功后的回调函数     | Function                                             | -        | `response => response.data`| 参数：请求成功后 promise 的 value 值                                                                                                                                 ||
| errorHandler   | request 失败后的回调函数     | Function                                             | -        | -                           | 参数：请求出错 promise 的 error 内容                                                                                                                                 |
| options {}     | 请求参数                     | **ComponentDataSourceItemOptions**| -        | -                           | 每种请求类型对应不同参数，详见 | 每种请求类型对应不同参数，详见 [ComponentDataSourceItemOptions 对象描述](#2315-componentdatasourceitemoptions-对象描述)                                              |

**关于 dataHandler 于 errorHandler 的细节说明：**

request 返回的是一个 promise，dataHandler 和 errorHandler 遵循 Promise 对象的 then 方法，实际使用方式如下：

```ts
// 伪代码
try {
  const result = await request(fetchConfig).then(dataHandler, errorHandler);
  dataSourceItem.data = result;
  dataSourceItem.status = 'success';
} catch (err) {
  dataSourceItem.error = err;
  dataSourceItem.status = 'error';
}
```
**注意：**
- dataHandler 和 errorHandler 只会走其中的一个回调
- 它们都有修改 promise 状态的机会，意味着可以修改当前数据源最终状态
- 最后返回的结果会被认为是当前数据源的最终结果，如果被 catch 了，那么会认为数据源请求出错
- dataHandler 会有默认值，考虑到返回结果入参都是 response 完整对象，默认值会返回 `response.data`，errorHandler 没有默认值


##### 2.3.1.5 ComponentDataSourceItemOptions 对象描述

| 参数    | 说明         | 类型    | 支持变量 | 默认值 | 备注                                                                                                        |
| ------- | ------------ | ------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| uri     | 请求地址     | String  | ✅        | -      |                                                                                                             |
| params  | 请求参数     | Object  | ✅        | {}     | 当前数据源默认请求参数（在运行时会被实际的 load 方法的参数替换，如果 load 的 params 没有则会使用当前 params) |
| method  | 请求方法     | String  | ✅        | GET    |                                                                                                             |
| isCors  | 是否支持跨域 | Boolean | ✅        | true   | 对应 `credentials = 'include'`                                                                              |
| timeout | 超时时长     | Number  | ✅        | 5000   | 单位 ms                                                                                                      |
| headers | 请求头信息   | Object  | ✅        | -      | 自定义请求头                                                                                                |



##### 2.3.1.6 ComponentLifeCycles 对象描述

生命周期对象，schema 面向多端，不同 DSL 有不同的生命周期方法：

- React：对于中后台 PC 物料，已明确使用 React 作为最终渲染框架，因此提案采用 [React16 标准生命周期方法](https://reactjs.org/docs/react-component.html)标准来定义生命周期方法，降低理解成本，支持生命周期如下：
  - constructor(props, context) 
    - 说明：初始化渲染时执行，常用于设置 state 值。
  - render() 
    - 说明：执行于容器组件 React Class 的 render 方法最前，常用于计算变量挂载到 this 对象上，供 props 上属性绑定。此 render() 方法不需要设置 return 返回值。
  - componentDidMount()
    - 说明：组件已加载
  - componentDidUpdate(prevProps, prevState, snapshot)
    - 说明：组件已更新
  - componentWillUnmount()
    - 说明：组件即将从 DOM 中移除
  - componentDidCatch(error, info)
    - 说明：组件捕获到异常
- Rax：目前没有使用生命周期，使用 hooks 替代生命周期；

该对象由一系列 key-value 组成，key 为生命周期方法名，value 为 JSFunction 的描述，详见下方示例：

```json
{
  "componentDidMount": {              // key 为上文中 React 的生命周期方法名
    "type": "JSFunction",             // type 目前仅支持 JSFunction
    "value": "function() {\           // value 为 javascript 函数
      console.log('did mount');\
    }"
  },
  "componentWillUnmount": {
    "type": "JSFunction",
    "value": "function() {\
      console.log('will unmount');\
    }"
  }
  ...
},
```


##### 2.3.1.7 dataHandler Function 描述

- 参数：为 dataMap 对象，包含字段如下：
  - key: 数据 id
  - value: 单个请求结果
- 返回值：数据对象 data，将会在渲染引擎和 schemaToCode 中通过调用 `this.setState(...)` 将返回的数据对象生效到 state 中；支持返回一个 Promise，通过 `resolve（返回数据）`，常用于串行发送请求场景。

##### 2.3.1.8 ComponentPropDefinition 对象描述

| 参数         | 说明       | 类型           | 支持变量 | 默认值    | 备注                                                                                                              |
| ------------ | ---------- | -------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| name         | 属性名称   | String         | -        | -         |                                                                                                                   |
| propType     | 属性类型   | String\|Object | -        | -         | 具体值内容结构，参考《低代码引擎物料协议规范》内的“2.2.2.3 组件属性信息”中描述的**基本类型**和**复合类型** |
| description  | 属性描述   | String         | -        | ''        |                                                                                                                   |
| defaultValue | 属性默认值 | Any            | -        | undefined | 当 defaultValue 和 defaultProps 中存在同一个 prop 的默认值时，优先使用 defaultValue。                             |

范例：
```json
{
  "propDefinitions": [{
    "name": "title",
    "propType": "string",
    "defaultValue": "Default Title"
  }, {
    "name": "onClick",
    "propType": "func"
  }]
  ...
},
```

#### 2.3.2 组件结构描述（A）

对应生成源码开发体系中 render 函数返回的 jsx 代码，主要描述有以下属性：


| 参数          | 说明                   | 类型             | 支持变量 | 默认值            | 备注                                                                                                       |
| ------------- | ---------------------- | ---------------- | -------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| id            | 组件唯一标识           | String           | -        |                   | 可选，组件 id 由引擎随机生成（UUID），并保证唯一性，消费方为上层应用平台，在组件发生移动等场景需保持 id 不变 |
| componentName | 组件名称               | String           | -        | Div               | 必填，首字母大写，同 [componentsMap](#22-组件映射关系 a) 中的要求                                           |
| props {}      | 组件属性对象           | **Props**| -        | {}                | 必填，详见 | 必填，详见 [Props 结构描述](#2311-props-结构描述)                                                          |
| condition     | 渲染条件               | Boolean          | ✅        | true              | 选填，根据表达式结果判断是否渲染物料；支持变量表达式                                                       |
| loop          | 循环数据               | Array            | ✅        | -                 | 选填，默认不进行循环渲染；支持变量表达式                                                                   |
| loopArgs      | 循环迭代对象、索引名称 | [String, String] |          | ["item", "index"] | 选填，仅支持字符串                                                                                         |
| children      | 子组件                 | Array            |          |                   | 选填，支持变量表达式                                                                                       |


描述举例：

```json
{
  "componentName": "Button",
  "props": {
    "className": "btn",
    "style": {
      "width": 100,
      "height": 20
    },
    "text": "submit",
    "onClick": {
      "type": "JSFunction",
      "value": "function(e) {\
        console.log('btn click')\
      }"
    }
  },
  "condition": {
    "type": "JSExpression",
    "value": "!!this.state.isshow"
  },
  "loop": [],
  "loopArgs": ["item", "index"],
  "children": []
}
```


#### 2.3.3 容器结构描述 (A) 

容器是一类特殊的组件，在组件能力基础上增加了对生命周期对象、自定义方法、样式文件、数据源等信息的描述。包含**低代码业务组件容器 Component**、**区块容器 Block**、**页面容器 Page** 3 种。主要描述有以下属性：

- 组件类型：componentName
- 文件名称：fileName
- 组件属性：props
- state 状态管理：state
- 生命周期 Hook 方法：lifeCycles
- 自定义方法设置：methods
- 异步数据源配置：dataSource
- 条件渲染：condition
- 样式文件：css/less/scss


详细描述：

| 参数            | 说明                       | 类型                                                                                                       | 支持变量 | 默认值 | 备注                                                                                                                          |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| componentName   | 组件名称                   | 枚举类型，包括`'Page'` （代表页面容器）、`'Block'` （代表区块容器）、`'Component'` （代表低代码业务组件容器） | -        | 'Div'    | 必填，首字母大写                                                                                                              |
| fileName        | 文件名称                   | String                                                                                                     | -        | -      | 必填，英文                                                                                                                    |
| props { }       | 组件属性对象               | **Props**                                                                                                  | -        | {}     | 必填，详见 [Props 结构描述](#2311-props-结构描述)                                                                             |
| static          | 低代码业务组件类的静态对象 |                                                                                                            |          |        |                                                                                                                               |
| defaultProps    | 低代码业务组件默认属性     | Object                                                                                                     | -        | -      | 选填，仅用于定义低代码业务组件的默认属性                                                                                      |
| propDefinitions | 低代码业务组件属性类型定义 | **ComponentPropDefinition**[]                                                                       | -        | -      | 选填，仅用于定义低代码业务组件的属性数据类型。详见 [ComponentPropDefinition 对象描述](#2318-componentpropdefinition-对象描述) |
| condition       | 渲染条件                   | Boolean                                                                                                    | ✅        | true   | 选填，根据表达式结果判断是否渲染物料；支持变量表达式                                                                          |
| state           | 容器初始数据               | Object                                                                                                     | ✅        | -      | 选填，支持变量表达式                                                                                                          |
| children        | 子组件                     | Array                                                                                                      | -        |        | 选填，支持变量表达式                                                                                                          |
| css/less/scss   | 样式属性                   | String                                                                                                     | ✅        | -      | 选填，详见 [css/less/scss 样式描述](#2312-csslessscss 样式描述)                                                               |
| lifeCycles      | 生命周期对象               | **ComponentLifeCycles**                                                                                    | -        | -      | 详见 [ComponentLifeCycles 对象描述](#2316-componentlifecycles-对象描述)                                                       |
| methods         | 自定义方法对象             | Object                                                                                                     | -        | -      | 选填，对象成员为函数类型                                                                                                      |
| dataSource {}   | 数据源对象                 | **ComponentDataSource**| -        | -      | 选填，异步数据源，详见                                                  | -        | -      | 选填，异步数据源，详见 [ComponentDataSource 对象描述](#2313-componentdatasource-对象描述)                                     |



#### 完整描述示例

描述示例 1：（正常 fetch/mtop/jsonp 请求）：

```json
{
  "componentName": "Block",
  "fileName": "block-1",
  "props": {
    "className": "luna-page",
    "style": {
      "background": "#dd2727"
    }
  },
  "children": [{
    "componentName": "Button",
    "props": {
      "text": {
        "type": "JSExpression",
        "value": "this.state.btnText"
      }
    }
  }],
  "state": {
    "btnText": "submit"
  },
  "css": "body {font-size: 12px;}",
  "lifeCycles": {
    "componentDidMount": {
      "type": "JSFunction",
      "value": "function() {\
        console.log('did mount');\
      }"
    },
    "componentWillUnmount": {
      "type": "JSFunction",
      "value": "function() {\
        console.log('will unmount');\
      }"
    }
  },
  "methods": {
    "testFunc": {
      "type": "JSFunction",
      "value": "function() {\
        console.log('test func');\
      }"
    }
  },
  "dataSource": {
    "list": [{
      "id": "list",
      "isInit": true,
      "type": "fetch/mtop/jsonp",
      "options": {
        "uri": "",
        "params": {},
        "method": "GET",
        "isCors": true,
        "timeout": 5000,
        "headers": {}
      },
      "dataHandler": {
        "type": "JSFunction",
        "value": "function(data, err) {}"
      }
    }],
    "dataHandler": {
      "type": "JSFunction",
      "value": "function(dataMap) { }"
    }
  },
  "condition": {
    "type": "JSExpression",
    "value": "!!this.state.isShow"
  }
}
```

描述示例 2：（自定义扩展请求处理器类型）：

```json
{
  "componentName": "Block",
  "fileName": "block-1",
  "props": {
    "className": "luna-page",
    "style": {
      "background": "#dd2727"
    }
  },
  ...
  "dataSource": {
    "list": [{
      "id": "list",
      "isInit": true,
      "type": "custom",
      "requestHandler": {
        "type": "JSFunction",
        "value": "this.utils.hsfHandler"
      },
      "options": {
        "uri": "hsf://xxx",
        "param1": "a",
        "param2": "b",
        ...
      },
      "dataHandler": {
        "type": "JSFunction",
        "value": "function(data, err) { }"
      }
    }],
    "dataHandler": {
      "type": "JSFunction",
      "value": "function(dataMap) { }"
    }
  }
}
```

#### 2.3.4 属性值类型描述（A）

在上述**组件结构**和**容器结构**描述中，每一个属性所对应的值，除了传统的 JS 值类型（String、Number、Object、Array、Boolean）外，还包含有**节点类型**、**事件函数类型**、**变量类型**等多种复杂类型；接下来将对于复杂类型的详细描述方式进行详细介绍。

##### 2.3.4.1 节点类型（A）

通常用于描述组件的某一个属性为 **ReactNode** 或 **Function-Return-ReactNode** 的场景。该类属性的描述均以 **JSSlot** 的方式进行描述，详细描述如下：

**ReactNode** 描述：

| 参数  | 说明       | 值类型                | 默认值   | 备注                                                           |
| ----- | ---------- | --------------------- | -------- | -------------------------------------------------------------- |
| type  | 值类型描述 | String                | 'JSSlot' | 固定值                                                         |
| value | 具体的值   | NodeSchema \| NodeSchema[] | null     | 内容为 NodeSchema 类型，详见[组件结构描述](#232-组件结构描述（A）) |


举例描述：如 **Card** 的 **title** 属性

```json
{
  "componentName": "Card",
  "props": {
    "title": {
      "type": "JSSlot",
      "value": [{
        "componentName": "Icon",
        "props": {}
      },{
        "componentName": "Text",
        "props": {}
      }]
    },
    ...
  }
}

```


**Function-Return-ReactNode** 描述：

| 参数   | 说明       | 值类型                | 默认值   | 备注                                                           |
| ------ | ---------- | --------------------- | -------- | -------------------------------------------------------------- |
| type   | 值类型描述 | String                | 'JSSlot' | 固定值                                                         |
| value  | 具体的值   | NodeSchema \| NodeSchema[] | null     | 内容为 NodeSchema 类型，详见[组件结构描述](#232-组件结构描述 a) |
| params | 函数的参数 | String[]     | null     | 函数的入参，其子节点可以通过 `this[参数名]` 来获取对应的参数。 |


举例描述：如 **Table.Column** 的 **cell** 属性

```json
{
  "componentName": "TabelColumn",
  "props": {
    "cell": {
      "type": "JSSlot",
      "params": ["value", "index", "record"],
      "value": [{
        "componentName": "Input",
        "props": {}
      }]
    },
    ...
  }
}

```

##### 2.3.4.2 事件函数类型（A）

协议内的事件描述，主要包含**容器结构**的**生命周期**和**自定义方法**，以及**组件结构**的**事件函数类属性**三类。所有事件函数的描述，均以 **JSFunction** 的方式进行描述，保留与原组件属性、生命周期（React / 小程序）一致的输入参数，并给所有事件函数 binding 统一一致的上下文（当前组件所在容器结构的 **this** 对象）。

**事件函数类型**的属性值描述如下：

```json
{
  "type": "JSFunction",
  "value": "function onClick(){\
    console.log(123);\
  }"
}
```

描述举例：

```json
{
  "componentName": "Block",
  "fileName": "block1",
  "props": {},
  "state": {
    "name": "lucy"
  },
  "lifeCycles": {
    "componentDidMount": {
      "type": "JSFunction",
      "value": "function() {\
        console.log('did mount');\
      }"
    },
    "componentWillUnmount": {
      "type": "JSFunction",
      "value": "function() {\
        console.log('will unmount');\
      }"
    }
  },
  "methods": {
    "getNum": {
      "type": "JSFunction",
      "value": "function() {\
        console.log('名称是：' + this.state.name)\
      }"
    }
  },
  "children": [{
    "componentName": "Button",
    "props": {
      "text": "按钮",
      "onClick": {
        "type": "JSFunction",
        "value": "function(e) {\
          console.log(e.target.innerText);\
        }"
      }
    }
  }]
}
```

##### 2.3.4.3 变量类型（A）

在上述**组件结构** 或**容器结构**中，有多个属性的值类型是支持变量类型的，通常会通过变量形式来绑定某个数据，所有的变量表达式均通过 JSExpression 表达式，上下文与事件函数描述一致，表达式内通过 **this** 对象获取上下文；

变量**类型**的属性值描述如下：


- return 数字类型

  ```json
  {
    "type": "JSExpression",
    "value": "this.state.num"
  }
  ```
- return 数字类型

  ```json
  {
    "type": "JSExpression",
    "value": "this.state.num - this.state.num2"
  }
  ```
- return "8 万" 字符串类型

  ```json
  {
    "type": "JSExpression",
    "value": "`${this.state.num}万`"
  }
  ```
- return "8 万" 字符串类型

  ```json
  {
    "type": "JSExpression",
    "value": "this.state.num + '万'"
  }
  ```
- return 13 数字类型

  ```json
  {
    "type": "JSExpression",
    "value": "getNum(this.state.num, this.state.num2)"
  }
  ```
- return true 布尔类型

  ```json
  {
    "type": "JSExpression",
    "value": "this.state.num > this.state.num2"
  }
  ```

描述举例：

```json
{
  "componentName": "Block",
  "fileName": "block1",
  "props": {},
  "state": {
    "num": 8,
    "num2": 5
  },
  "methods": {
    "getNum": {
      "type": "JSFunction",
      "value": "function(a, b){\
        return a + b;\
      }"
    }
  },
  "children": [{
    "componentName": "Button",
    "props": {
      "text": {
        "type": "JSExpression",
        "value": "this.getNum(this.state.num, this.state.num2) + '万'"
      }
    },
    "condition": {
      "type": "JSExpression",
      "value": "this.state.num > this.state.num2"
    }
  }]
}
```

##### 2.3.4.4 国际化多语言类型（AA）

协议内的一些文本值内容，我们希望是和协议全局的国际化多语言语料是关联的，会按照全局国际化语言环境的不同使用对应的语料。所有国际化多语言值均以 **i18n** 结构描述。这样可以更为清晰且结构化得表达使用场景。

**国际化多语言类型**的属性值类型描述如下：

```typescript
type Ti18n = {
  type: 'i18n';
  key: string; // i18n 结构中字段的 key 标识符
  params?: Record<string, JSDataType | JSExpression>; // 模版型 i18n 文案的入参，JSDataType 指代传统 JS 值类型
}
```

其中 `key` 对应协议 `i18n` 内容的语料键值，`params` 为语料为字符串模板时的变量内容。

假设协议已加入如下 i18n 内容：
```json
{
  "i18n": {
    "zh-CN": {
      "i18n-jwg27yo4": "你好",
      "i18n-jwg27yo3": "{name}博士"
    },
    "en-US": {
      "i18n-jwg27yo4": "Hello",
      "i18n-jwg27yo3": "Doctor {name}"
    }
  }
}
```

**国际化多语言类型**简单范例：

```json
{
  "type": "i18n",
  "key": "i18n-jwg27yo4"
}
```

**国际化多语言类型**模板范例：

```json
{
  "type": "i18n",
  "key": "i18n-jwg27yo3",
  "params": {
    "name": "Strange"
  }
}
```

描述举例：

```json
{
  "componentName": "Button",
  "props": {
    "text": {
      "type": "i18n",
      "key": "i18n-jwg27yo4"
    }
  }
}
```


#### 2.3.5 上下文 API 描述（A）

在上述**事件类型描述**和**变量类型描述**中，在函数或 JS 表达式内，均可以通过 **this** 对象获取当前组件所在容器（React Class）的实例化对象，在搭建场景下的渲染模块和出码模块实现上，统一约定了该实例化 **this** 对象下所挂载的最小 API 集合，以保障搭建协议具备有一致的**数据流**和**事件上下文**。 

##### 2.3.5.1 容器 API：

| 参数                                | 说明                                    | 类型                         | 备注                                                                                                           |
| ----------------------------------- | --------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **this {}**                         | 当前区块容器的实例对象                  | Class Instance               | -                                                                                                              |
| *this*.state                        | 三种容器实例的数据对象 state            | Object                       | -                                                                                                              |
| *this*.setState(newState, callback) | 三种容器实例更新数据的方法              | Function                     | 这个 setState 通常会异步执行，详见下文 [setState](#setstate)                                                   |
| *this*.customMethod()               | 三种容器实例的自定义方法                | Function                     | -                                                                                                              |
| *this*.dataSourceMap {}             | 三种容器实例的数据源对象 Map             | Object                       | 单个请求的 id 为 key, value 详见下文 [DataSourceMapItem 结构描述](#datasourcemapitem-结构描述)                     |
| *this*.reloadDataSource()           | 三种容器实例的初始化异步数据请求重载    | Function                     | 返回 \<Promise\>                                                                                               |
| **this.page {}**                    | 当前页面容器的实例对象                  | Class Instance               |                                                                                                                |
| *this.page*.props                   | 读取页面路由，参数等相关信息            | Object                       | query 查询参数 { key: value } 形式；path 路径；uri 页面唯一标识；其它扩展字段                            |
| *this.page*.xxx                     | 继承 this 对象所有 API                     |                              | 此处 `xxx` 代指 `this.page` 中的其他 API                                                                          |
| **this.component {}**               | 当前低代码业务组件容器的实例对象        | Class Instance               |                                                                                                                |
| *this.component*.props              | 读取低代码业务组件容器的外部传入的 props | Object                       |                                                                                                                |
| *this.component*.xxx                | 继承 this 对象所有 API                     |                              | 此处 `xxx` 代指 `this.component` 中的其他 API                                                                     |
| **this.$(ref)**                     | 获取组件的引用（单个）                    | Component Instance           | `ref` 对应组件上配置的 `ref` 属性，用于唯一标识一个组件；若有同名的，则会返回第一个匹配的。                    |
| **this.$$(ref)**                    | 获取组件的引用（所有同名的）              | Array of Component Instances | `ref` 对应组件上配置的 `ref` 属性，用于唯一标识一个组件；总是返回一个数组，里面是所有匹配 `ref` 的组件的引用。 |

##### setState

`setState()` 将对容器 `state` 的更改排入队列，并通知低代码引擎需要使用更新后的 `state` 重新渲染此组件及其子组件。这是用于更新用户界面以响应事件处理器和处理服务器数据的主要方式。

请将 `setState()` 视为请求而不是立即更新组件的命令。为了更好的感知性能，低代码引擎会延迟调用它，然后通过一次传递更新多个组件。低代码引擎并不会保证 state 的变更会立即生效。

`setState()`并不总是立即更新组件，它会批量推迟更新。这使得在调用用 `setState()` 后立即读取 `this.state` 成为了隐患。为了消除隐患，请使用 `setState` 的回调函数（`setState(updater, callback)`），`callback` 将在应用更新后触发。即，如下例所示：

```js
this.setState(newState, () => {
  // 在这里更新已经生效了
  // 可以通过 this.state 拿到更新后的状态
  console.log(this.state);
});

// ⚠注意：这里拿到的并不是更新后的状态，这里还是之前的状态
console.log(this.state);
```

如需基于之前的 `state` 来设置当前的 `state`，则可以将传递一个 `updater` 函数：`(state, props) => newState`，例如：

```js
this.setState((prevState) => ({ count: prevState.count + 1 }));
```

为了方便更新部分状态，`setState` 会将 `newState` 浅合并到新的 `state` 上。


##### DataSourceMapItem 结构描述

| 参数         | 说明                       | 类型      | 备注                                                                                                                           |
| ------------ | -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| load(params) | 调用单个数据源             | Function  | 当前参数 params 会替换 [ComponentDataSourceItemOptions 对象描述](#2315-componentdatasourceitemoptions-对象描述)中的 params 内容 |
| status       | 获取单个数据源上次请求状态 | String    | loading、loaded、error、init                                                                                                   |
| data         | 获取上次请求成功后的数据   | Any       |                                                                                                                                |
| error        | 获取上次请求失败的错误对象 | Error 对象 |                                                                                                                                |

备注：如果组件没有在区块容器内，而是直接在页面内，那么 `this === this.page`


##### 2.3.5.2 循环数据 API

获取在循环场景下的数据对象。举例：上层组件设置了 loop 循环数据，且设置了 `loopArgs：["item", "index"]`，当前组件的属性表达式或绑定的事件函数中，可以通过 this 上下文获取所在循环的数据环境；默认值为 `['item','index']` ，如有多层循环，需要自定义不同 loopArgs，同样通过 `this[自定义循环别名]` 获取对应的循环数据和序号；


| 参数       | 说明                              | 类型   | 可选值 |
| ---------- | --------------------------------- | ------ | ------ |
| this.item  | 获取当前 index 对应的循环体数据； | Any    | -      |
| this.index | 当前物料在循环体中的 index        | Number | -      |

### 2.4 工具类扩展描述（AA）

用于描述物料开发过程中，自定义扩展或引入的第三方工具类（例如：lodash 及 moment），增强搭建基础协议的扩展性，提供通用的工具类方法的配置方案及调用 API。

| 参数               | 说明               | 类型                                                                                                             | 支持变量 | 默认值 |
| ------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| utils[]           | 工具类扩展映射关系 | **UtilItem**[]                                                                                          | -        |        |
| *UtilItem*.name    | 工具类扩展项名称   | String                                                                                                           | -        |        |
| *UtilItem*.type    | 工具类扩展项类型   | 枚举， `'npm'` （代表公网 npm 类型） / `'tnpm'` （代表阿里巴巴内部 npm 类型） / `'function'` （代表 Javascript 函数类型） | -        |        |
| *UtilItem*.content | 工具类扩展项内容   | [ComponentMap 类型](#22-组件映射关系 a) 或 [JSFunction](#2432事件函数类型 a)                                        | -        |        |

描述示例：

```javascript
{
  utils: [{
    name: 'clone',
    type: 'npm',
    content: {
      package: 'lodash',
      version: '0.0.1',
      exportName: 'clone',
      subName: '',
      destructuring: false,
      main: '/lib/clone'
    }
  }, {
    name: 'moment',
    type: 'npm',
    content: {
      package: '@alifd/next',
      version: '0.0.1',
      exportName: 'Moment',
      subName: '',
      destructuring: true,
      main: ''
    }
  }, {
    name: 'recordEvent',
    type: 'function',
    content: {
      type: 'JSFunction',
      value: "function(logkey, gmkey, gokey, reqMethod) {\n  goldlog.record('/xxx.event.' + logkey, gmkey, gokey, reqMethod);\n}"
    }
  }]
}
```

出码结果：

```javascript
import clone from 'lodash/lib/clone';
import { Moment } from '@alifd/next';

export const recordEvent = function(logkey, gmkey, gokey, reqMethod) {
  goldlog.record('/xxx.event.' + logkey, gmkey, gokey, reqMethod);
}

...
```

扩展的工具类，用户可以通过统一的上下文 this.utils 方法获取所有扩展的工具类或自定义函数，例如：this.utils.moment、this.utils.clone。搭建协议中的使用方式如下所示：

```javascript
{
  componentName: 'Div',
  props: {
    onClick: {
      type: 'JSFunction,
      value: 'function(){ this.utils.clone(this.state.data); }'
    }
  }
}
```

### 2.5 国际化多语言支持（AA）

协议中用于描述国际化语料和组件引用国际化语料的规范，遵循集团国际化中台关于国际化语料规范定义。


| 参数 | 说明           | 类型   | 可选值 | 默认值 |
| ---- | -------------- | ------ | ------ | ------ |
| i18n | 国际化语料信息 | Object | -      | null   |


描述示例：

```json
{
  "i18n": {
    "zh-CN": {
      "i18n-jwg27yo4": "你好",
      "i18n-jwg27yo3": "中国"
    },
    "en-US": {
      "i18n-jwg27yo4": "Hello",
      "i18n-jwg27yo3": "China"
    }
  }
}
```

使用举例：

```json
{
  "componentName": "Button",
  "props": {
    "text": {
      "type": "i18n",
      "key": "i18n-jwg27yo4"
    }
  }
}
```

```json
{
  "componentName": "Button",
  "props": {
    "text": "按钮",
    "onClick": {
      "type": "JSFunction",
      "value": "function() {\
        console.log(this.i18n('i18n-jwg27yo4'));\
      }"
    }
  }
}
```

使用举例（已废弃）
```json
{
  "componentName": "Button",
  "props": {
    "text": {
      "type": "JSExpression",
      "value": "this.i18n['i18n-jwg27yo4']"
    }
  }
}
```

### 2.6 应用范围内的全局常量（AA）

用于描述在整个应用内通用的全局常量，比如请求 API 的域名、环境等。

### 2.7 应用范围内的全局样式（AA）

用于描述在应用范围内的全局样式，比如 reset.css 等。

### 2.8 当前应用配置信息（AA）

用于描述当前应用的配置信息，比如当前应用的 Shell/Layout、主题等。

> 注意：该字段为扩展字段，消费方式由各自场景自己决定，包括运行时和出码。

### 2.9 当前应用元数据信息（AA）

用于描述当前应用的元数据信息，比如当前应用的名称、Git 信息、版本号等等。

> 注意：该字段为扩展字段，消费方式由各自场景自己决定，包括运行时和出码。

### 2.10 当前应用的公共数据源（AA）

用于描述当前应用的公共数据源，数据结构跟容器结构里的 ComponentDataSource 保持一致。
在运行时 / 出码使用时，API 和应用级数据源 API 保持一致，都是 `this.dataSourceMap['globalDSName'].load()`

### 2.11 当前应用的路由信息（AA）

用于描述当前应用的路径 - 页面的关系。通过声明路由信息，应用能够在不同的路径里显示对应的页面。

##### 2.11.1 Router （应用路由配置）结构描述

路由配置的结构说明：

| 参数        | 说明                   | 类型                            | 可选值 | 默认值    | 备注   |
| ----------- | ---------------------- | ------------------------------- | ------ | --------- | ------ |
| baseName    | 应用根路径             | String                          | -      | '/'       | 选填｜ |
| historyMode | history 模式           | 枚举类型，包括'browser'、'hash' | -      | 'browser' | 选填｜ |
| routes      | 路由对象组，路径与页面的关系对照组 | Route[]                         | -      | -         | 必填｜ |


##### 2.11.2 Route （路由记录）结构描述

路由记录，路径与页面的关系对照。Route 的结构说明：

| 参数     | 说明                         | 类型                         | 可选值 | 默认值 | 备注                                                                   |
| -------- | ---------------------------- | ---------------------------- | ------ | ------ | ---------------------------------------------------------------------- |
| name     | 该路径项的名称               | String                       | -      | -      | 选填                                                                   |
| path     | 路径                         | String                       | -      | -      | 必填，路径规则详见下面说明                                                                   |
| query    | 路径的 query 参数            | Object                       | -      | -      | 选填                                                                   |
| page     | 路径对应的页面 ID            | String                       | -      | -      | 选填，page 与 redirect 字段中必须要有有一个存在                        |
| redirect | 此路径需要重定向到的路由信息 | String \| Object \| Function | -      | -      | 选填，page 与 redirect 字段中必须要有有一个存在，详见下文 **redirect** |
| meta     | 路由元数据                   | Object                       | -      | -      | 选填                                                                   |
| children | 子路由                       | Route[]                      | -      | -      | 选填                                                                   |

以上结构仅说明了路由记录需要的必需字段，如果需要更多的信息字段可以自行实现。

关于 **path** 字段的详细说明：

路由记录通常通过声明 path 字段来匹配对应的浏览器 URL 来确认是否满足匹配条件，如 `path=abc` 能匹配到 `/abc` 这个 URL。

> 在声明 path 字段的时候，可省略 `/`，只声明后面的字符，如 `/abc` 可声明为 `abc`。

path（页面路径）是浏览器URL的组成部分，同时大部分网站的 URL 也都受到了 Restful 思想的影响，所以我们也是用类似的形式作为路径的规则基底。
路径规则是路由配置的重要组成部分，我们希望一个路径配置的基本能力需要支持具体的路径（/xxx）与路径参数 (/:abc）。

以一个 `/one/:two?/three/:four?/:five?` 路径为例，它能够解析以下路径：
- `/one/three`
- `/one/:two/three`
- `/one/three/:four`
- `/one/three/:five`
- `/one/:two/three/:four`
- `/one/:two/three/:five`
- `/one/three/:four/:five`
- `/one/:two/three/:four/:five`

更多的路径规则，如路径中的通配符、多次匹配等能力如有需要可自行实现。

关于 **redirect** 字段的详细说明：

**redirect** 字段有三种填入类型，分别是 `String`、`Object`、`Function`：
1. 字符串(`String`)格式下默认处理为重定向到路径，支持传入 '/xxx'、'/xxx?ab=c'。
2. 对象(`String`)格式下可传入路由对象，如 { name: 'xxx' }、{ path: '/xxx' }，可重定向到对应的路由对象。
3. 函数`Function`格式为`(to) => Route`，它的入参为当前路由项信息，支持返回一个 Route 对象或者字符串，存在一些特殊情况，在重定向的时候需要对重定向之后的路径进行处理的情况下，需要使用函数声明。

```json
{
  "redirect": {
    "type": "JSFunction",
    "value": "(to) => { return { path: '/a', query: { fromPath: to.path } } }",
  }
}
```

##### 完整描述示例

``` json
{
  "router": {
    "baseName": "/",
    "historyMode": "hash",
    "routes": [
      {
        "path": "home",
        "page": "home"
      },
      {
        "path": "/*",
        "redirect": "notFound"
      }
    ]
  },
  "componentsTree": [
    {
      "id": "home",
      ...
    },
    {
      "id": "notFound",
      ...
    }
  ]
}
```

### 2.12 当前应用的页面信息（AA）

用于描述当前应用的页面信息，比如页面对应的低代码搭建内容、页面标题、页面配置等。
在一些比较复杂的场景下，允许声明一层页面映射关系，以支持页面声明更多信息与配置，同时能够支持不同类型的产物。

| 参数    | 说明                  | 类型   | 可选值 | 默认值 | 备注                                                     |
| ------- | --------------------- | ------ | ------ | ------ | -------------------------------------------------------- |
| id      | 页面 id               | String | -      | -      | 必填                                                     |
| type    | 页面类型              | String | -      | -      | 选填，可用来区分页面的类型                            |
| treeId  | 对应的低代码树中的 id | String | -      | -      | 选填，页面对应的 componentsTree 中的子项 id            |
| packageId | 对应的资产包对象      | String | -      | -      | 选填，页面对应的资产包对象，一般用于微应用场景下，当路由匹配到当前页面的时候，会加载 `packageId` 对应的微应用进行渲染。 |
| meta    | 页面元信息            | Object | -      | -      | 选填，用于描述当前应用的配置信息                      |
| config  | 页面配置              | Object | -      | -      | 选填，用于描述当前应用的元数据信息                     |


#### 2.12.1 微应用（低代码+）相关说明

在开发过程中，我们经常会遇到一些特殊的情况，比如一个低代码应用想要集成一些别的系统的页面或者系统中的一些页面只能是源码开发（与低代码相对的纯工程代码形式），为了满足更多的使用场景，应用级渲染引擎引入了微应用（微前端）的概念，使低代码页面与其他的页面结合成为可能。

微应用对象通过资产包加载，需要暴露两个生命周期方法：
- mount(container: HTMLElement, props: any)
  - 说明：微应用挂载到 container（dom 节点）的调用方法，会在渲染微应用时调用
- unmout(container: HTMLElement, props: any)
  - 说明：微应用从容器节点（container）卸载的调用方法，会在卸载微应用时调用

> 在微应用的场景下，可能会存在多个页面路由到同一个应用，应用可通过资产包加载，所以需要将对应的页面配置指向对应的微应用（资产包）对象。

**描述示例**

```json
{
  "router": {
    "baseName": "/",
    "historyMode": "hash",
    "routes": [
      {
        "path": "home",
        "page": "home"
      },
      {
        "page": "guide",
        "page": "guide"
      },
      {
        "path": "/*",
        "redirect": "notFound"
      }
    ]
  },
  "pages": [
    {
      "id": "home",
      "treeId": "home",
      "meta": {
        "title": "首页"
      }
    },
    {
      "id": "notFound",
      "treeId": "notFound",
      "meta": {
        "title": "404页面"
      }
    },
    {
      "id": "guide",
      "packagId": "microApp"
    }
  ]
}

// 资产包
[
  {
    "id": "microApp",
    "package": "microApp",
    "version": "1.23.0",
    "urls": [
      "https://g.alicdn.com/code/lib/microApp.min.css",
      "https://g.alicdn.com/code/lib/microApp.min.js"
    ],
    "library": "microApp"
  },
]
```


## 3 应用描述

### 3.1 文件目录

以下是推荐的应用目录结构，与标准源码 build-scripts 对齐，这里的目录结构是帮助理解应用级协议的设计，不做强约束

```html
├── META/                          # 低代码元数据信息，用于多分支冲突解决、数据回滚等功能
├── public/                        # 静态文件，构建时会 copy 到 build/ 目录
│   ├── index.html                 # 应用入口 HTML
│   └── favicon.png                # Favicon
├── src/
│   ├── components/                # 应用内的低代码业务组件
│   │   └── guide-component/
│   │       ├── index.js           # 组件入口
│   │       ├── components.js      # 组件依赖的其他组件
│   │       ├── schema.js          # schema 描述
│   │       └── index.scss         # css 样式
│   ├── pages/                     # 页面
│   │   └── home/                  # Home 页面
│   │       ├── index.js           # 页面入口
│   │       └── index.scss         # css 样式
│   ├── layouts/
│   │   └── basic-layout/          # layout 组件名称
│   │       ├── index.js           # layout 入口
│   │       ├── components.js      # layout 组件依赖的其他组件
│   │       ├── schema.js          # layout schema 描述
│   │       └── index.scss         # layout css 样式
│   ├── config/                    # 配置信息
│   │   ├── components.js          # 应用上下文所有组件
│   │   ├── routes.js              # 页面路由列表
│   │   └── app.js                 # 应用配置文件
│   ├── utils/                     # 工具库
│   │   └── index.js               # 应用第三方扩展函数
│   ├── locales/                   # [可选] 国际化资源
│   │   ├── en-US
│   │   └── zh-CN
│   ├── global.scss                # 全局样式
│   └── index.jsx                  # 应用入口脚本，依赖 config/routes.js 的路由配置动态生成路由；
├── webpack.config.js              # 项目工程配置，包含插件配置及自定义 webpack 配置等
├── README.md
├── package.json
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .stylelintignore
└── .stylelintrc.js
```

### 3.2 应用级别 APIs
> 下文中 `xxx` 代指任意 API
#### 3.2.1 路由 Router API
  - this.location.`xxx` 「不推荐，推荐统一通过 this.router api」
  - this.history.`xxx` 「不推荐，推荐统一通过 this.router api」
  - this.match.`xxx` 「不推荐，推荐统一通过 this.router api」
  - this.router.`xxx`

##### Router 结构说明

| API            | 函数签名                                                                | 说明    |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| getCurrentRoute | () => RouteLocation | 获取当前解析后的路由信息，RouteLocation 结构详见下面说明 |
| push | (target: string \| Route) => void | 路由跳转方法，跳转到指定的路径或者 Route |
| replace | (target: string \| Route) => void | 路由跳转方法，与 `push` 的区别在于不会增加一条历史记录而是替换当前的历史记录 |
| beforeRouteLeave | (guard: (to: RouteLocation, from: RouteLocation) => boolean \| Route) => void | 路由跳转前的守卫方法，详见下面说明 |
| afterRouteChange | (fn: (to: RouteLocation, from: RouteLocation) => void) => void | 路由跳转后的钩子函数，会在每次路由改变后执行 |

##### 3.2.1.1 RouteLocation（路由信息）结构说明

**RouteLocation** 是路由控制器匹配到对应的路由记录后进行解析产生的对象，它的结构如下：

| 参数           | 说明                   | 类型   | 可选值 | 默认值 | 备注   |
| -------------- | ---------------------- | ------ | ------ | ------ | ------ |
| path           | 当前解析后的路径       | String | -      | -      | 必填  |
| hash           | 当前路径的 hash 值，以 # 开头  | String | -      | -      | 必填   |
| href           | 当前的全部路径         | String | -      | -      | 必填   |
| params         | 匹配到的路径参数       | Object | -      | -      | 必填   |
| query          | 当前的路径 query 对象  | Object | -      | -      | 必填，代表当前地址的 search 属性的对象   |
| name           | 匹配到的路由记录名     | String | -      | -      | 选填   |
| meta           | 匹配到的路由记录元数据 | Object | -      | -      | 选填   |
| redirectedFrom | 原本指向向的路由记录         | Route  |  -      | -     | 选填，在重定向到当前地址之前，原先想访问的地址   |
| fullPath       | 包括 search 和 hash 在内的完整地址 | String | - | - | 选填 |


##### beforeRouteLeave
通过 beforeRouteLeave 注册的路由守卫方法会在每次路由跳转前执行。该方法一般会在应用鉴权，路由重定向等场景下使用。

> `beforeRouteLeave` 只在 `router.push/replace` 的方法调用时生效。

传入守卫的入参为：
* to: 即将要进入的目标路由(RouteLocation)
* from: 当前导航正要离开的路由(RouteLocation)

该守卫返回一个 `boolean` 或者路由对象来告知路由控制器接下来的行为。
* 如果返回 `false`， 则停止跳转
* 如果返回 `true`，则继续跳转
* 如果返回路由对象，则重定向至对应的路由

**使用范例：**

```json
{
  "componentsTree": [{
    "componentName": "Page",
    "fileName": "Page1",
    "props": {},
    "children": [{
      "componentName": "Div",
      "props": {},
      "children": [{
        "componentName": "Button",
        "props": {
          "text": "跳转到首页",
          "onClick": {
            "type": "JSFunction",
            "value": "function () { this.router.push('/home'); }"
          }
        },
      }]
    }],
  }]
}
```


#### 3.2.2 应用级别的公共函数或第三方扩展
   - this.utils.`xxx`

#### 3.2.3 国际化相关 API
| API            | 函数签名                                                                | 说明                                                                |
| -------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| this.i18n      | (i18nKey: string, params?: { [paramName: string]: string; }) => string | i18nKey 是语料的标识符，params 可选，是用来做模版字符串替换的。返回语料字符串 |
| this.getLocale | () => string                                                           | 返回当前环境语言 code                                                 |
| this.setLocale | (locale: string) => void                                               | 设置当前环境语言 code                                                 |

**使用范例：**
```json
{
  "componentsTree": [{
    "componentName": "Page",
    "fileName": "Page1",
    "props": {},
    "children": [{
      "componentName": "Div",
      "props": {},
      "children": [{
        "componentName": "Button",
        "props": {
          "children": {
            "type": "JSExpression",
            "value": "this.i18n('i18n-hello')"
          },
          "onClick": {
            "type": "JSFunction",
            "value": "function () { this.setLocale('en-US'); }"
          }
        },
      }, {
        "componentName": "Button",
        "props": {
          "children": {
            "type": "JSExpression",
            "value": "this.i18n('i18n-chicken', { count: this.state.count })"
          },
        },
      }]
    }],
  }],
  "i18n": {
    "zh-CN": {
      "i18n-hello": "你好",
      "i18n-chicken": "我有{count}只鸡"
    },
    "en-US": {
      "i18n-hello": "Hello",
      "i18n-chicken": "I have {count} chicken"
    }
  }
}
```
