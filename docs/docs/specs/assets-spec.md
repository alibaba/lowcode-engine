---
title: 《低代码引擎资产包协议规范》
sidebar_position: 2
---

## 1 介绍

### 1.1 本协议规范涉及的问题域

- 定义本协议版本号规范
- 定义本协议中每个子规范需要被支持的 Level
- 定义本协议相关的领域名词
- 定义低代码资产包协议版本号规范（A）
- 定义低代码资产包协议组件及依赖资源描述规范（A）
- 定义低代码资产包协议组件描述资源加载规范（A）
- 定义低代码资产包协议组件在面板展示规范（AA）

### 1.2 协议草案起草人

- 撰写：金禅、璿玑、彼洋
- 审阅：力皓、絮黎、光弘、戊子、潕量、游鹿

### 1.3 版本号

1.1.0

### 1.4 协议版本号规范（A）

本协议采用语义版本号，版本号格式为 `major.minor.patch` 的形式。

- major 是大版本号：用于发布不向下兼容的协议格式修改
- minor 是小版本号：用于发布向下兼容的协议功能新增
- patch 是补丁号：用于发布向下兼容的协议问题修正

### 1.5 协议中子规范 Level 定义

| 规范等级 | 实现要求                                                     |
| -------- | ------------------------------------------------------------ |
| A        | 基础规范，低代码引擎核心层支持；                             |
| AA       | 推荐规范，由低代码引擎官方插件、setter 支持。                |
| AAA      | 参考规范，需由基于引擎的上层搭建平台支持，实现可参考该规范。 |

### 1.6 名词术语

- **资产包**: 低代码引擎加载资源的动态数据集合，主要包含组件及其依赖的资源、组件低代码描述、动态插件/设置器资源等。

### 1.7 背景

根据低代码引擎的实现，一个组件要在引擎上渲染和配置，需要提供组件的 umd 资源以及组件的`低代码描述`，并且组件通常都是以集合的形式被引擎消费的；除了组件之外，还有组件的依赖资源、引擎的动态插件/设置器等资源也需要注册到引擎中；因此我们定义了“低代码资产包”这个数据结构，来描述引擎所需加载的动态资源的集合。

### 1.8 受众

本协议适用于使用“低代码引擎”构建搭建平台的开发者，通过本协议的定义来进行资源的分类和加载。阅读及使用本协议，需要对低代码搭建平台的交互和实现有一定的了解，对前端开发相关技术栈的熟悉也会有帮助，协议中对通用的前端相关术语不会做进一步的解释说明。

## 2 协议结构

协议最顶层结构如下，包含 7 方面的描述内容：

- version { String } 当前协议版本号
- packages { Array } 低代码编辑器中加载的资源列表
- components { Array } 所有组件的描述协议列表
- sort { Object } 用于描述组件面板中的 tab 和 category
- plugins { Array } 设计器插件描述协议列表
- setters { Array } 设计器中设置器描述协议列表
- extConfig { Object } 平台自定义扩展字段

### 2.1 version (A)

定义当前协议 schema 的版本号；

| 根属性名称 | 类型   | 说明       | 变量支持 | 默认值 |
| ---------- | ------ | ---------- | -------- | ------ |
| version    | String | 协议版本号 | -        | 1.1.0  |

### 2.2 packages (A)

定义低代码编辑器中加载的资源列表，包含公共库和组件 (库) cdn 资源等；

| 字段                           | 字段描述                                                                                  | 字段类型        | 规范等级 | 备注                                                                                                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| packages[].id?                 | 资源唯一标识                                                                              | String          | A        | 资源唯一标识，如果为空，则以 package 为唯一标识                                                                                                                                                           |
| packages[].title?              | 资源标题                                                                                  | String          | A        | 资源标题                                                                                                                                                                                                  |
| packages[].package             | npm 包名                                                                                  | String          | A        | 组件资源唯一标识                                                                                                                                                                                          |
| packages[].version             | npm 包版本号                                                                              | String          | A        | 组件资源版本号                                                                                                                                                                                            |
| packages[].type                | 资源包类型                                                                                | String          | AA       | 取值为: proCode（源码）、lowCode（低代码，默认为 proCode                                                                                                                                                  |
| packages[].schema              | 低代码组件 schema 内容                                                                    | object          | AA       | 取值为: proCode（源码）、lowCode（低代码）                                                                                                                                                                |
| packages[].deps                | 当前资源包的依赖资源的唯一标识列表                                                        | `Array<String>` | A        | 唯一标识为 id 或者 package 对应的值                                                                                                                                                                       |
| packages[].library             | 作为全局变量引用时的名称，用来定义全局变量名                                              | String          | A        | 低代码引擎通过该字段获取组件实例                                                                                                                                                                          |
| packages[].editUrls            | 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css                                       | `Array<String>` | A        | 低代码引擎编辑器会加载这些 url                                                                                                                                                                            |
| packages[].urls                | 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css                                       | `Array<String>` | AA       | 低代码引擎渲染模块会加载这些 url                                                                                                                                                                          |
| packages[].advancedEditUrls    | 组件多个编辑态视图打包后的 CDN url 列表集合，包含 js 和 css                               | Object          | AAA      | 上层平台根据特定标识提取某个编辑态的资源，低代码引擎编辑器会加载这些资源，优先级高于 packages[].editUrls                                                                                                  |
| packages[].advancedUrls        | 组件多个端的渲染态视图打包后的 CDN url 列表集合，包含 js 和 css                           | Object          | AAA      | 上层平台根据特定标识提取某个渲染态的资源， 低代码引擎渲染模块会加载这些资源，优先级高于 packages[].urls                                                                                                   |
| packages[].external            | 当前资源在作为其他资源的依赖，在其他依赖打包时时是否被排除了(同 webpack 中 external 概念) | Boolean         | AAA      | 某些资源会被单独提取出来，是其他依赖的前置依赖，根据这个字段决定是否提前加载该资源                                                                                                                        |
| packages[].loadEnv             | 指定当前资源加载的环境                                                                    | `Array<String>` | AAA      | 主要用于指定 external 资源加载的环境，取值为 design(设计态)、runtime(预览态) 中的一个或多个                                                                                                               |
| packages[].exportSourceId      | 标识当前 package 内容是从哪个 package 导出来的                                            | String          | AAA      | 此时 urls 无效                                                                                                                                                                                            |
| packages[].exportSourceLibrary | 标识当前 package 是从 window 上的哪个属性导出来的                                         | String          | AAA      | exportSourceId 的优先级高于exportSourceLibrary ,此时 urls 无效                                                                                                                                            |
| packages[].async               | 标识当前 package 资源加载在 window.library 上的是否是一个异步对象                         | Boolean         | A        | async 为 true 时，需要通过 await 才能拿到真正内容                                                                                                                                                         |
| packages[].exportMode          | 标识当前 package 从其他 package 的导出方式                                                | String          | A        | 目前只支持 `"functionCall"`, exportMode等于 `"functionCall"` 时，当前package 的内容以函数的方式从其他 package 中导出，具体导出接口如: `(library: string, packageName: string, isRuntime?: boolean) => any \| Promise<any>`, library 为当前 package 的 library, packageName 为当前的包名，返回值为当前 package 的导出内容 |

描述举例：

```json
{
  "packages": [
    {
      "title": "fusion 组件库",
      "package": "@alifd/next",
      "version": "1.23.0",
      "urls": [
        "https://g.alicdn.com/code/lib/alifd__next/1.23.18/next.min.css",
        "https://g.alicdn.com/code/lib/alifd__next/1.23.18/next-with-locales.min.js"
      ],
      "library": "Next"
    },
    {
      "title": "Fusion 精品组件库",
      "package": "@alife/fusion-ui",
      "version": "0.1.5",
      "editUrls": [
        "https://g.alicdn.com/code/npm/@alife/fusion-ui/0.1.7/build/lowcode/view.js",
        "https://g.alicdn.com/code/npm/@alife/fusion-ui/0.1.7/build/lowcode/view.css"
      ],
      "urls": [
        "https://g.alicdn.com/code/npm/@alife/fusion-ui/0.1.7/dist/FusionUI.js",
        "https://g.alicdn.com/code/npm/@alife/fusion-ui/0.1.7/dist/FusionUI.css"
      ],
      "library": "FusionUI"
    },
    {
      "title": "低代码组件 A",
      "id": "lcc-a",
      "version": "0.1.5",
      "type": "lowCode",
      "schema": {
        "componentsMap": [
          {
            "package": "@ali/vc-text",
            "componentName": "Text",
            "version": "4.1.1"
          }
        ],
        "utils": [
          {
            "name": "dataSource",
            "type": "npm",
            "content": {
              "package": "@ali/vu-dataSource",
              "exportName": "dataSource",
              "version": "1.0.4"
            }
          }
        ],
        "componentsTree": [
          {
            "defaultProps": {
              "content": "这是默认值"
            },
            "methods": {
              "__initMethods__": {
                "compiled": "function (exports, module) { /*set actions code here*/ }",
                "source": "function (exports, module) { /*set actions code here*/ }",
                "type": "js"
              }
            },
            "loopArgs": ["item", "index"],
            "props": {
              "mobileSlot": {
                "type": "JSBlock",
                "value": {
                  "children": [
                    {
                      "condition": true,
                      "hidden": false,
                      "isLocked": false,
                      "conditionGroup": "",
                      "componentName": "Text",
                      "id": "node_ockxiczf4m2",
                      "title": "",
                      "props": {
                        "maxLine": 0,
                        "showTitle": false,
                        "behavior": "NORMAL",
                        "content": {
                          "en-US": "Title",
                          "zh-CN": "页面标题",
                          "type": "i18n"
                        },
                        "__style__": {},
                        "fieldId": "text_kxiczgj4"
                      }
                    }
                  ],
                  "componentName": "Slot",
                  "props": {
                    "slotName": "mobileSlot",
                    "slotTitle": "mobile 容器"
                  }
                }
              },
              "className": "component_k8e4naln",
              "useDevice": false,
              "fieldId": "symbol_k8bnubw4"
            },
            "condition": true,
            "children": [
              {
                "condition": true,
                "loopArgs": [null, null],
                "componentName": "Text",
                "id": "node_ockxiczf4m4",
                "props": {
                  "maxLine": 0,
                  "showTitle": false,
                  "behavior": "NORMAL",
                  "content": {
                    "variable": "props.content",
                    "type": "variable",
                    "value": {
                      "use": "zh-CN",
                      "en-US": "Tips content",
                      "zh-CN": "这是一个低代码组件",
                      "type": "i18n"
                    }
                  },
                  "fieldId": "text_kxid1d9n"
                }
              }
            ],
            "propTypes": [
              {
                "defaultValue": "这是默认值",
                "name": "content",
                "title": "文本内容",
                "type": "string"
              }
            ],
            "componentName": "Component",
            "id": "node_k8bnubvz",
            "state": {}
          }
        ]
      },
      "library": "LCCA"
    },
    {
      "title": "多端组件库",
      "package": "@ali/atest1",
      "version": "1.23.0",
      "advancedUrls": {
        "default": [
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@alife/theme-254/1.24.0/@ali/atest1/1.0.0/theme.7c897c2.css",
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@ali/atest1/1.0.0/main.3354663.js"
        ],
        "mobile": [
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@alife/theme-254/1.24.0/@ali/atest1/1.0.0/theme.7c897c2.css",
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@ali/atest1/1.0.0/main.mobile.3354663.js"
        ],
        "rax": [
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@alife/theme-254/1.24.0/@ali/atest1/1.0.0/theme.7c897c2.css",
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@ali/atest1/1.0.0/main.rax.3354663.js"
        ]
      },
      "advancedEditUrls": {
        "design": [
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@alife/theme-254/1.24.0/@ali/atest1/1.0.0/theme.7c897c2.css",
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@ali/atest1/1.0.0/editView.design.js"
        ],
        "default": [
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@alife/theme-254/1.24.0/@ali/atest1/1.0.0/theme.7c897c2.css",
          "https://g.alicdn.com/legao-comp/web_bundle_0724/@ali/atest1/1.0.0/editView.js"
        ]
      },
      "library": "Atest1"
    },
    {
      "library": "UiPaaSServerless3",
      "advancedUrls": {
        "default": [
          "https://g.alicdn.com/legao-comp/serverless3/1.1.0/env-staging-d224466e-0614-497d-8cd5-e4036dc50b70/main.js"
        ]
      },
      "id": "UiPaaSServerless3-view",
      "type": "procode",
      "version": "1.0.0"
    },
    {
      "package": "react-color",
      "library": "ReactColor",
      "id": "react-color",
      "type": "procode",
      "version": "2.19.3",
      "async": true,
      "exportMode": "functionCall",
      "exportSourceId": "UiPaaSServerless3-view"
    }
  ]
}
```

### 2.3 components (A)

定义资产包中包含的所有组件的低代码描述的集合，分为“ComponentDescription”和“RemoteComponentDescription”(详见 2.6 TypeScript 定义)：

- ComponentDescription: 符合“组件描述协议”的数据，详见物料规范中`2.2.2 组件描述协议`部分；
- RemoteComponentDescription 是将一个或多个 ComponentDescription 构建打包的 js 资源的描述，在浏览器中加载该资源后可获取到其中包含的每个组件的 ComponentDescription 的具体内容；

### 2.4 sort (AA)

定义组件列表分组

| 根属性名称        | 类型     | 说明                                                                                         | 变量支持 | 默认值                                   |
| ----------------- | -------- | -------------------------------------------------------------------------------------------- | -------- | ---------------------------------------- |
| sort.groupList    | String[] | 组件分组，用于组件面板 tab 展示                                                              | -        | ['精选组件', '原子组件']                 |
| sort.categoryList | String[] | 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列 | -        | ['通用', '数据展示', '表格类', '表单类'] |

### 2.5 plugins (AAA)

自定义设计器插件列表

| 根属性名称            | 类型      | 说明                 | 变量支持 | 默认值 |
| --------------------- | --------- | -------------------- | -------- | ------ |
| plugins[].name        | String    | 插件名称             | -        | -      |
| plugins[].title       | String    | 插件标题             | -        | -      |
| plugins[].description | String    | 插件描述             | -        | -      |
| plugins[].docUrl      | String    | 插件文档地址         | -        | -      |
| plugins[].screenshot  | String    | 插件截图地址         | -        | -      |
| plugins[].tags        | String[]  | 插件标签分类         | -        | -      |
| plugins[].keywords    | String[]  | 插件检索关键字       | -        | -      |
| plugins[].reference   | Reference | 插件引用的资源包信息 | -        | -      |

### 2.6 setters (AAA)

自定义设置器列表

| 根属性名称            | 类型      | 说明                   | 变量支持 | 默认值 |
| --------------------- | --------- | ---------------------- | -------- | ------ |
| setters[].name        | String    | 设置器组件名称         | -        | -      |
| setters[].title       | String    | 设置器标题             | -        | -      |
| setters[].description | String    | 设置器描述             | -        | -      |
| setters[].docUrl      | String    | 设置器文档地址         | -        | -      |
| setters[].screenshot  | String    | 设置器截图地址         | -        | -      |
| setters[].tags        | String[]  | 设置器标签分类         | -        | -      |
| setters[].keywords    | String[]  | 设置器检索关键字       | -        | -      |
| setters[].reference   | Reference | 设置器引用的资源包信息 | -        | -      |

### 2.7 extConfig (AAA)

定义平台相关的扩展内容，用于存放平台自身实现的一些私有协议，以允许存量平台能够平滑地迁移至标准协议。extConfig 是一个 key-value 结构的对象，协议不会规定 extConfig 中的字段名称以及类型，完全自定义

### 2.8 TypeScript 定义

_组件低代码描述相关部分字段含义详见物料规范中`2.2.2 组件描述协议`部分；_

```TypeScript

/**
 * 资产包协议
 */
export interface Assets {
  /**
   * 资产包协议版本号
   */
  version: string;
  /**
   * 资源列表
   */
  packages?: Array<Package>;
  /**
   * 所有组件的描述协议集合
   */
  components: Array<ComponentDescription|RemoteComponentDescription>;
  /**
   * 低代码编辑器插件集合
   */
  plugins?: Array<PluginDescription>;
  /**
   * 低代码设置器集合
   */
  setters?: Array<SetterDescription>;
  /**
   * 平台扩展配置
   */
  extConfig?: AssetsExtConfig;
  /**
   * 用于描述组件面板中的 tab 和 category
   */
  sort: ComponentSort;
}

export interface AssetsExtConfig{
  [index: string]: any;
}

/**
 * 描述组件面板中的 tab 和 category 排布
 */
export interface ComponentSort {
  /**
   * 用于描述组件面板的 tab 项及其排序，例如：["精选组件", "原子组件"]
   */
  groupList?: String[];
  /**
   * 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列；
   */
  categoryList?: String[];
}

/**
 * 定义资产包依赖信息
 */
export interface Package {
  /**
   * 唯一标识
   */
  id: string;
  /**
   * 包名
   */
  package: string;
  /**
   * 包版本号
   */
  version: string;
  /**
   * 资源类型
   */
  type: string;
  /**
   * 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css
   */
  urls?: string[] | any;
  /**
   * 组件多个渲染态视图打包后的 CDN url 列表，包含 js 和 css，优先级高于 urls
   */
  advancedUrls?: ComplexUrls;
  /**
   * 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css
   */
  editUrls?: string[] | any;
  /**
   * 组件多个编辑态视图打包后的 CDN url 列表，包含 js 和 css，优先级高于 editUrls
   */
  advancedEditUrls?: ComplexUrls;
  /**
   * 低代码组件的 schema 内容
   */
  schema?: ComponentSchema;
  /**
   * 当前资源所依赖的其他资源包的 id 列表
   */
  deps?: string[];
  /**
   * 指定当前资源加载的环境
   */
  loadEnv?: LoadEnv[];
  /**
   * 当前资源是否是 external 资源
   */
  external?: boolean;
  /**
   * 作为全局变量引用时的名称，和 webpack output.library 字段含义一样，用来定义全局变量名
   */
  library: string;
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
   */
  exportName?: string;
  /**
   * 标识当前 package 资源加载在 window.library 上的是否是一个异步对象
   */
  async?: boolean;
  /**
   * 标识当前 package 从其他 package 的导出方式
   */
  exportMode?: string;
  /**
   * 标识当前 package 内容是从哪个 package 导出来的
   */
  exportSourceId?: string;
  /**
   * 标识当前 package 是从 window 上的哪个属性导出来的
   */
  exportSourceLibrary?: string;
}


/**
 * 复杂 urls 结构，同时兼容简单结构和多模态结构
 */
export type ComplexUrls = string[] | MultiModeUrls;

/**
 * 多模态资源
 */
export interface MultiModeUrls {
  /**
   * 默认的资源 url
   */
  default: string[];
  /**
   * 其他模态资源的 url
   */
  [index: string]: string[];
}


/**
 * 资源加载环境种类
 */
export enum LoadEnv {
  /**
   * 设计态
   */
	design = "design",
  /**
   * 运行态
   */
  runtime = "runtime"
}

/**
 * 低代码设置器描述
 */
export type SetterDescription = PluginDescription;

/**
 * 低代码插件器描述
 */
export interface PluginDescription {
  /**
   * 插件名称
   */
  name: string;
  /**
   * 插件标题
   */
  title: string;
  /**
   * 插件类型
   */
  type?: string;
  /**
   * 插件描述
   */
  description?: string;
  /**
   * 插件文档地址
   */
  docUrl: string;
  /**
   * 插件截图
   */
  screenshot: string;
  /**
   * 插件相关的标签
   */
  tags?: string[];
  /**
   * 插件关键字
   */
  keywords?: string[];
  /**
   * 插件引用的资源信息
   */
  reference: Reference;
}

/**
 * 资源引用信息，Npm 的升级版本，
 */
export interface Reference {
  /**
   * 引用资源的 id 标识
   */
  id?: string;
  /**
   * 引用资源的包名
   */
  package?: string;
  /**
   * 引用资源的导出对象中的属性值名称
   */
  exportName: string;
  /**
   * 引用 exportName 上的子对象
   */
  subName: string;
  /**
   * 引用的资源主入口
   */
  main?: string;
  /**
   * 是否从引用资源的导出对象中获取属性值
   */
  destructuring: boolean;
  /**
   * 资源版本号
   */
  version: string;
}


/**
 * 低代码片段
 *
 * 内容为组件不同状态下的低代码 schema (可以有多个)，用户从组件面板拖入组件到设计器时会向页面 schema 中插入 snippets 中定义的组件低代码 schema
 */
export interface Snippet {
  title: string;
  screenshot?: string;
  schema: ElementJSON;
}

/**
 * 组件低代码描述
 */
export interface ComponentDescription {
  componentName: string;
  title: string;
  description?: string;
  docUrl: string;
  screenshot: string;
  icon?: string;
  tags?: string[];
  keywords?: string[];
  devMode?: 'proCode' | 'lowCode';
  npm: Npm;
  props: Prop[];
  configure: Configure;
  /**
   * 多模态下的组件描述, 优先级高于 configure
   */
  advancedConfigures: MultiModeConfigures;
  snippets: Snippet[];
  group: string;
  category: string;
  priority: number;
  /**
   * 组件引用的资源信息
   */
  reference: Reference;
}

export interface MultiModeConfigures {
  default: Configure;
  [index: string]: Configure;
}

/**
 * 远程物料描述
 */
export interface RemoteComponentDescription {
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
   */
  exportName?: string;
  /**
   * 组件描述的资源链接；
   */
  url?: string;
  /**
   * 组件多模态描述的资源信息，优先级高于 url
   */
  advancedUrls?: ComplexUrl;
  /**
   * 组件(库)的 npm 信息；
   */
  package?: {
    npm?: string;
  };
}

export type ComplexUrl = string | MultiModeUrl

export interface MultiModeUrl {
  default: string;
  [index: string]: string;
}

export interface ComponentSchema {
  version: string;
  componentsMap: ComponentsMap;
  componentsTree: [ComponentTree];
  i18n: I18nMap;
  utils: UtilItem[];
}

```

`ComponentSchema` 的定义见[低代码业务组件描述](./material-spec.md#221-组件规范)
