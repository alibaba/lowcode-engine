---
title: 《低代码引擎物料协议规范》
sidebar_position: 1
---

## 1 介绍

### 1.1 本协议规范涉及的问题域

- 定义本协议版本号规范
- 定义本协议中每个子规范需要被支持的 Level
- 定义中后台物料目录规范（A）
- 定义中后台物料 API 规范（A）
- 定义中后台物料入库规范（A）
- 定义中后台物料国际化多语言支持规范（AA）
- 定义中后台物料主题配置规范（AAA）
- 定义中后台物料无障碍访问规范（AAA）

### 1.2 协议草案起草人

- 撰写：九神、大果、元彦、戊子、林熠、屹凡、金禅
- 审阅：潕量、月飞、康为、力皓、荣彬、暁仙、度城、金禅、戊子、林熠、絮黎

### 1.3 版本号

1.0.0

### 1.4 协议版本号规范（A）

本协议采用语义版本号，版本号格式为 `major.minor.patch` 的形式。

- major 是大版本号：用于发布不向下兼容的协议格式修改
- minor 是小版本号：用于发布向下兼容的协议功能新增
- patch 是补丁号：用于发布向下兼容的协议问题修正

### 1.5 协议中子规范 Level 定义

| 规范等级 | 实现要求                                                                           |
| -------- | ---------------------------------------------------------------------------------- |
| A        | 强制规范，必须实现；违反此类规范的协议描述数据将无法写入物料中心，不支持流通。     |
| AA       | 推荐规范，推荐实现；遵守此类规范有助于业务未来的扩展性和跨团队合作研发效率的提升。 |
| AAA      | 参考规范，根据业务场景实际诉求实现；是集团层面鼓励的技术实现引导。                 |

### 1.6 名词术语

- **物料**：能够被沉淀下来直接使用的前端能力，一般表现为业务组件、区块、模板。
- **业务组件（Business Component）**：业务领域内基于基础组件之上定义的组件，可能会包含特定业务域的交互或者是业务数据，对外仅暴露可配置的属性，且必须发布到公域（如阿里 NPM）；在同一个业务域内可以流通，但不需要确保可以跨业务域复用。
  - **低代码业务组件（Low-Code Business Component）**：通过低代码编辑器搭建而来，有别于源码开发的业务组件，属于业务组件中的一种类型，遵循业务组件的定义；同时低代码业务组件还可以通过低代码编辑器继续多次编辑。
- **区块（Block）**：通过低代码搭建的方式，将一系列业务组件、布局组件进行嵌套组合而成，不对外提供可配置的属性。可通过区块容器组件的包裹，实现区块内部具备有完整的样式、事件、生命周期管理、状态管理、数据流转机制。能独立存在和运行，可通过复制 schema 实现跨页面、跨应用的快速复用，保障功能和数据的正常。
- **模板（Template）**：特定垂直业务领域内的业务组件、区块可组合为单个页面，或者是再配合路由组合为多个页面集，统称为模板。

### 1.7 物料规范背景

目前集团业务融合频繁，而物料规范的不统一给业务融合带来额外的高成本，另一方面集团各个 BU 的前端物料也存在不同程度的重复建设。我们期望通过集团层面的物料通不阻碍业务融合的发展，同时通过集团层面的物料流通来提升物料丰富度，通过丰富物料的复用来提效中后台系统研发，同时也能给新业务场景提供高质量的启动物料。

### 1.8 物料规范定义

- **源码物料规范**：一套面向开发者的目录规范，用于规范化约束开发过程中的代码、文档、接口规范，以方便物料在集团内的流通。
- **搭建物料规范**：一套面向开发者的 Schema 规范，用于规范化约束开发过程中的代码、文档、接口规范，以方便物料在集团内的流通。

## 2. 物料规范 - 业务组件规范

### 2.1 源码规范

#### 2.1.1 目录规范（A）

```
component                       //  组件名称, 比如 biz-button
  ├── build                     // 【编译生成】【必选】
  │   └── index.html            // 【编译生成】【必选】可直接预览文件
  ├── lib                       // 【编译生成】【必选】
  │   ├── index.js              // 【编译生成】【必选】js 入口文件
  │   ├── index.scss            // 【编译生成】【必选】css 入口文件
  │   └── style.js              // 【编译生成】【必选】js 版本 css 入口文件，方便去重
  ├── demo                      // 【必选】组件文档目录，可以有多个 md 文件
  │   └── basic.md              // 【必选】组件文档示例，用于生成组件开发预览，以及生成组件文档
  ├── src                       // 【必选】组件源码
  │   ├── index.js              // 【必选】组件出口文件
  │   └── index.scss            // 【必选】仅包含组件自身样式的源码文件
  ├── README.md                 // 【必选】组件说明及 API
  └── package.json              // 【必选】组件 package.json
```

##### README.md

- README.md 应该包含业务组件的源信息、使用说明以及 API，示例如下：

```
# 按钮                             // 这一行是标题

按钮用于开始一个即时操作。             // 这一行是描述

{这段通过工程能力自动注入, 开发者无需编写
## 安装方法
npm install @alifd/ice-layout -S
}

## API

| 参数  | 说明 |  类型   |        可选值        | 默认值 |
| ---- | ---- | ------ | ------------------- | ------ |
| type | 类型  | String | `primary`、`normal` | `normal` |
```

- README.en-US.md（文件命名采取 [bcp47 规范](http://www.rfc-editor.org/rfc/bcp/bcp47.txt)）多语言的情况，可选

```
# Button

Button use to trigger an action.

{这段通过工程能力自动注入, 开发者无需编写
## Install
npm install @alifd/ice-layout -S
}

## API

| Param | Description | Type   | Enum                | Default |
| ----- | ----------- | ------ | ------------------- | ------- |
| type  | type        | String | `primray`、`normal` | normal  |
```

##### package.json

`package.json` 中包含了一些依赖信息和配置信息，示例如下：

```json
{
  "name": "@alife/1688-button",
  "description": "业务组件描述",
  "version": "0.0.1",
  "main": "lib/index.js",
  "stylePath": "lib/style.js", // 【私有字段】样式文件地址，webpack 插件引用
  "files": [
    "demo/",
    "lib/",
    "build/" // 存放编译后的 demo，发布前应该编译生成该目录
  ],
  "dependencies": {
    "@alifd/next": "1.x" // 【可选】可以是一个 util 类型的组件，如果依赖 next，请务必写语义化版本号，不要写*这种
  },
  "devDependencies": {
    "react": "^16.5.0",
    "react-dom": "^16.5.0"
  },
  "peerDependencies": {
    "react": "^16.5.0"
  },
  "componentConfig": {
    // 【私有字段】组件配置信息
    "name": "button", // 组件英文名
    "title": "按钮", // 组件中文名
    "category": "form" // 组件分类
  }
}
```

##### src/index.js

包含组件的出口文件，示例如下：

```javascript
import Button from './Button.jsx';
import ButtonGroup from './ButtonGroup.jsx';

export const Group = ButtonGroup; // 子组件推荐写法

export default Button;
```

推荐用法

```javascript
import Button, { Group } form '@scope/button';
```

##### src/index.scss

```css
/* 不引入依赖组件的样式，比如组件 import { Button } from '@alifd/next'; */
/* 不需要在 index.scss 中引入 @import '~@alifd/next/lib/button/index.scss'; */

/* 如果需要引入主题变量引入此段 */
@import '~@alifd/next/variables.scss';

/* 组件自身样式 */
.custom-component {
  color: $color-brand1-1;
}
```

##### demo

demo 目录存放的是组件的文档，无文档的业务组件无法带来任何价值，因此 demo 是必选项。demo 目录下的文件采取 markdown 的写法，可以是多个文件，示例（demo/basic.md）如下：

demo/basic.md

````
---
title: {按钮类型}
order: {文档的排序，数字，0 最小，从小到大排序}
---

按钮有三种视觉层次：主按钮、次按钮、普通按钮。不同的类型可以用来区别按钮的重要程度。

:::lang=en-US
---
title: Container
order: 3
---

Change the default container by passing a function to `container`;
enable `useAbsolute` to use `absolute position` to implement affix component;

:::

```jsx    // 以下建议用英文编写
import Button from '@alife/1688-button';

ReactDOM.render(<div className="test">
    <Button type="normal">english</Button>
</div>, mountNode);
```

```css
.test {
    background: #CCC;
}
```
````

#### 2.1.2 API 规范（A)

API 是组件的属性解释，给开发者作为组件属性配置的参考。为了保持 API 的一致性，我们制定这个 API 命名规范。对于业界通用的，约定俗成的命名，我们遵循社区的约定。对于业界有多种规则难以确定的，我们确定其中一种，大家共同遵守。

##### 通用规则

- 所有的 API 采用小驼峰的书写规则，如 `onChange`、`direction`、`defaultVisible`。
- 标签名采用大驼峰书写规则，如 `Menu`、`Slider`、`DatePicker`。

##### 通用命名

| API 名称       | 类型           | 描述                                                                | 常见变量                                               |
| :------------- | :------------- | :------------------------------------------------------------------ | :----------------------------------------------------- |
| shape          | string         | 形状，从组件的外形来看有区别的时候，使用 shape                      |                                                        |
| direction      | enum           | 方向，取值采用缩写的方式。                                          | hoz（水平）, ver（垂直）                               |
| align          | enum           | 对齐方式                                                            | tl, tc, tr, cl, cc, cr, bl, bc, br                     |
| status         | enum           | 状态                                                                | normal, success, error, warning                        |
| size           | enum           | 大小                                                                | small, medium, large 更大或更小可用 (xxs, xs, xl, xxl) |
| type           | enum or string | 分类:1. dom 结构不变、只有皮肤的变化 2.组件类型只有并列的几类       | normal, primary, secondary                             |
| visible        | boolean        | 是否显示                                                            |                                                        |
| defaultVisible | boolean        | 是否显示（非受控）                                                  |                                                        |
| disabled       | boolean        | 禁用组件                                                            |                                                        |
| closable       | bool/string    | 允许关闭的方式                                                      |                                                        |
| htmlType       | string         | 当原生组件与 Fusion 组件的 type 产生冲突时，原生组件使用 `htmlType` |                                                        |
| link           | string         | 链接                                                                |                                                        |
| dataSource     | array          | 列表数据源                                                          | `[{label, value}, {label, value}]`                     |
| has+'属性'     | boolean        | 拥有某个属性                                                        | 例如 `hasArrow`， `hasHeader`， `hasClose` 等等        |

##### 多选枚举

当某个 API 的接口，允许用户指定多个枚举值的时候，我们把这个接口定义为多选枚举。一个很典型的例子是某个弹层组件的 `closable` 属性，我们会允许：键盘 esc 按键、点击 mask、点击 close 按钮、点击组件以外的任何区域进行关闭。

不要有一个 API 值，支持多种类型。例如某个弹层的组件，我们会允许 esc、点击 mask、点击 close 按钮等进行关闭。此时 API 设计可以通过多个 API 承载，例如：

```js
closable?: boolean;         // 默认为 true
closeMode?: CM[] | string;  // 默认值是 ['close', 'mask', 'esc']
```

true 表示触发规则都会关闭，false 表示触发规则不会关闭。

示例：

- `<Dialog closable closeMode={['close', 'mask', 'esc']} />`，所有合法条件都会关闭
- `<Dialog closable={false} />`，任何情况下都不关闭，只能通过受控设置 visible
- `<Dialog closable closeMode={['close', 'esc']} />`，用户按 esc 或者点击关闭按钮会关闭

##### 事件

- 标准事件或者自定义的符合 w3c 标准的事件，命名必须 on 开头， 即 `on` + 事件名，如 onExpand。

##### 表单规范

- 支持[受控模式](https://reactjs.org/docs/forms.html#controlled-components)(value + onChange) （A)
  - value 控制组件数据展现
  - onChange 组件发生变化时候的回调函数（第一个参数可以给到 value)
- `value={undefined}`的时候清空数据，field 的 reset 函数会给所有组件下发 undefined 数据 (AA))
- 一次完整操作抛一次 onChange 事件 `建议` 比如有 Process 表示进展中的状态，建议增加 API `onProcess`；如果有 Start 表示启动状态，建议增加 API `onStart`  (AA)

##### 属性的传递

**1. 原子组件（Atomic Component）**

> 最小粒子，不能再拆分的组件

举例：Input/Button/NumberPicker

期望使用起来像普通的 html 标签一样，能够把用户传入的参数，透传到真正的节点上。

```jsx
<Input id="my-input" aria-label="this is input" />
```

渲染后的 dom 结构：

```jsx
<span class="next-input next-medium">
  <input id="my-input"  aria-label="this is input" height="100%" autocomplete="off" value="">
</span>
```

**2. 复合组件（Composite component）**

复合组件一般由两个及以上的原子组件/复合组件构成，比如：Select 由 Inupt + 弹窗组成，Search 由 Select + Button 组成，TreeSelect 由 Tree + Select 组成。

为了提高组件使用的便利性，对 API 属性的要求如下：

1. 复合组件核心的原子组件（比如 Search 的核心原子组件是 Input）的属性以及使用频率高的属性建议扁平化，让复合组件可以直接使用其属性；
2. 复合组件内的非核心原子组件，则通过 `xxxProps` （如 inputProps/btnProps）的方式，将参数传递到相应原子组件上。

**属性扁平化例子**：

比如 `Search` 组件由 `Input` 和 `Button` 构成，但是 `Search` 更像是 `Input` ，因此把 `Input` 作为主要组件，将属性扁平化。即在 `Search` 组件上直接使用一些 `Input` 的属性。 `<Search innerBefore="before text">`

比如 `Select` `TreeSelect` 都有弹层部分，`Overlay` `Overlay.Popup` 的 `visible` 属性使用率较高，一般用于 fixed 布局下的弹窗滚动跟随。因此把该属性暴露到最外层，简化使用 `<Select visible={true}>`

**xxxProps 例子**：
比如 `Search` 组件由 `Input` 和 `Button` 构成，`Button` 的属性通过 `buttonProps` 传递给内部的 `Button`。`<Search buttonProps={{loading: true}}>`

#### 2.1.3 入库方式 (A)

入库是指：发布组件，并且存储到集团物料中心，方便统一管理和流通。

step 1: 发布组件到 tnpm

```bash
$ tnpm publish
```

step 2: 同步到集团物料中心

```bash
# 安装工具
$ tnpm i iceworks -g
# 执行同步
$ iceworks sync
```

#### 2.1.4 国际化多语言支持规范（AA）

文件命名采取 [bcp47](https://tools.ietf.org/html/bcp47) 规范

##### 目录规范

在 `src` 目录新增 `locale` 目录用于管理不同语言的文案。

```
|- BizHello
|-- src
|---- locale
|------ zh-CN.js
|------ en-US.js
|------ ja-JP.js
```

##### 定义不同的语言

```javascript
// zh-CN.js
export default {
  hello: '你好，世界',
};
```

```javascript
// en-US.js
export default {
  hello: 'hello world',
};
```

```javascript
// ja-JP.js
export default {
  hello: 'こんにちは、世界',
};
```

##### 组件支持多语言建议方案

```jsx
// index.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import zhCN from './locale/zh-CN.js'; // 引入默认语言
export default class BizHello extends Component {
  static componentName = 'BizHello';

  static propTypes = {
    locale: PropTypes.object, // 增加 locale，用于配置文案
  };

  static defaultProps = {
    locale: zhCN,
  };

  render() {
    const { locale } = this.props;
    return <div>{locale.hello}</div>;
  }
}
```

##### 组件支持全局替换国际化文案

配合 ConfigProvider 支持全局替换国际化文案。

```jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider } from '@alifd/next';
import zhCN from './locale/zh-CN.js'; // 引入默认语言
class BizHello extends Component {
  static propTypes = {
    locale: PropTypes.object, // 增加 locale，用于配置文案
  };

  static defaultProps = {
    locale: zhCN,
  };

  render() {
    const { locale } = this.props;
    return <div>{locale.hello}</div>;
  }
}
export default ConfigProvider.config(BizHello, {
  componentName: 'BizHello', // 指定组件名称，默认取组件的 displayName
});
```

#### 2.1.5 主题切换规范（AA）

业务组件中如果有自定义的需要跟随主题色的 UI，一定要引入变量的形式，增加组件的流通性。

##### src/index.scss

```css
/* 如果需要引入主题变量引入此段 */
@import '~@alifd/next/variables.scss';

/* 组件自身样式 */
.custom-component {
  color: $color-brand1-1;
}
```

#### 2.1.6 [Deprecated]支持转设计稿（AAA）

对接 sketch 插件（FusionCool）的目的是为了让开发产出的业务组件能够直接给设计师使用，用法类似现在 Fusion Next 基础组件。

新增文件 `adaptor/index.js` 。

```jsx
import BizButton from '@alifd/biz-button';

export default {
  name: 'BizButton',
  editor: () => ({
    props: [
      {
        name: 'level',
        type: 'enum',
        options: ['normal', 'primary', 'secondary'],
      },
      {
        name: 'size',
        type: 'enum',
        options: ['large', 'medium', 'small'],
        default: 'medium',
      },
    ],
    data: {
      default: 'hello',
    },
  }), // 内容编辑器
  adaptor: ({ data, level, size, ...others }) => {
    return (
      <BizButton type={level} size={size}>
        {data}
      </BizButton>
    );
  },
};
```

api 属性标准参考 [https://fusion.design/help.html#/dev-biz](https://fusion.design/help.html#/dev-biz)

#### 2.1.7 无障碍访问规范 (AAA)

无障碍需要符合 [WCAG 2.1 A 级标准](https://www.w3.org/TR/WCAG21/)，可参考 [W3C 无障碍最佳实践](https://www.w3.org/TR/wai-aria-practices-1.1/)、[Fusion 无障碍指引 2.3.1](https://alibaba-fusion.github.io/next/part1/basics.html) 章节等。

##### 增加 a11y.md 无障碍 demo

必须借助 API 才能完成无障碍工作的组件必须为开发者提供无障碍的使用文档，请[参考](https://fusion.design/pc/component/select?themeid=2#accessibility-container)组件 API 中 `ARIA and Keyboard` ，建议在 `demo` 目录新增 `a11y.md` 文件用于演示组件的无障碍使用。

```
component
  └─ demo
      ├─ a11y.md
      └─ basic.md
```

详细指引查看无障碍开发指南 [https://alibaba-fusion.github.io/next/part1/basics.html](https://alibaba-fusion.github.io/next/part1/basics.html)。

##### 通过键盘快速访问

一般键盘事件有 Up Arrow/Down Arrow/Enter/Esc/Tab

例子：Select 的键盘事件说明

| 按键       | 说明                 |
| :--------- | :------------------- |
| Up Arrow   | 获取当前项前一项焦点 |
| Down Arrow | 获取当前项后一项焦点 |
| Enter      | 打开列表或选择当前项 |
| Esc        | 关闭列表             |

##### 对读屏软件友好

- 对于组件，我们为开发者内置 `role` 和特定 `aria-_属性`，开发者也可以对非组件 API 属性都可以透传至 DOM 元素，进行修改 `role` 和 `aria-_参数`，但是要注意对应关系，请[参考](https://alibaba-fusion.github.io/next/part1/WAI-ARIA.html)。
- 对一些特殊的组件传递参数才能支持无障碍，设置 `id`，`autoFocus` 和传参数，如下：
  - id - `Balloon`，`Rating`
  - autoFocus - 弹层自动聚焦，例如 `Dialog`，`Overlay`，`Dropdown`
  - 传参数 - 有些组件需要根据具体的业务，实现不同的可访问性，这里为开发者内置一些参数，想使用无障碍的时候，用户只需要根据现有的需求，选择对应的内置参数，例如设置 aria-label，以下组件需要用户传参数才支持无障碍组件如下：`NumberPicker`、`Transfer`

### 2.2 低代码规范

#### 2.2.1 组件规范

通过低代码编辑器搭建而来，有别于源码开发的业务组件，属于业务组件中的一种类型，遵循业务组件的定义；同时低代码业务组件还可以通过低代码编辑器继续多次编辑。

| 根属性描述     | 说明                                                                                              | 类型   |
| -------------- | ------------------------------------------------------------------------------------------------- | ------ |
| version        | 协议版本号                                                                                        | String |
| componentsMap  | 描述组件映射关系的集合                                                                            | Array  |
| componentsTree | 低代码业务组件树描述，是长度固定为 1 的数组，即数组内仅包含根容器的描述（低代码业务组件容器类型） | Array  |
| utils          | 工具类扩展映射关系                                                                                | Array  |
| i18n           | 国际化语料                                                                                        | Object |

描述举例：

```json
{
  "version": "1.0.0",
  "componentsMap": [{}],
  "componentsTree": [
    {
      // 低代码业务组件树，顶层由低代码业务组件容器包裹；
      "componentName": "Component", // 低代码业务组件容器组件名
      "fileName": "SearchComp", // 低代码业务组件文件名，同时会将首字母大写，作为低代码业务组件名
      "props": {}, // 一般不定义，如果有数据用于模拟外部传入的属性值
      "css": "body {font-size: 12px;}",
      "state": {
        "name": "lucy"
      },
      "static": {}, // 用于定义自定组件的 static 属性
      "defaultProps": {
        // 默认 props：选填仅用于定义低代码业务组件的默认属性固定对象
        "name": "xxx"
      },
      "children": [
        {
          "componentName": "Div",
          "props": {
            "className": "className1"
          },
          "children": [
            {
              "componentName": "Button",
              "props": {
                "text": "点击弹出我的姓名",
                "onClick": {
                  "type": "JSFunction",
                  "value": "function(e){\
              alert(this.state.name)\
            }"
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "i18n": {}
}
```

#### 2.2.2 组件描述协议

对源码组件在低代码搭建平台中使用时所具备的配置能力和交互行为进行规范化描述，让不同平台对组件接入的实现保持一致，让组件针对不同的搭建平台接入时可以使用一份统一的描述内容，让组件在不同的业务中流通成为可能。

##### 2.2.2.1 协议结构

单个组件描述内容为 json 结构，主要包含以下三部分内容，分别为：

- **基础信息 (A)：** 描述组件的基础信息，通常包含包信息、组件名称、标题、描述等。
- **组件属性信息 (A)：** 描述组件属性信息，通常包含参数、说明、类型、默认值 4 项内容。
- **能力配置/体验增强：** 推荐用于优化搭建产品编辑体验，定制编辑能力的配置信息。

##### 2.2.2.2 基础信息（A）

| 字段              | 字段描述                                                                                                                                    | 字段类型                  | 允许空 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------ |
| componentName     | 组件名称                                                                                                                                    | String                    | 否     |
| title             | 组件中文名称                                                                                                                                | String                    | 否     |
| description       | 组件描述                                                                                                                                    | String                    | 是     |
| docUrl            | 组件文档链接                                                                                                                                | String                    | 否     |
| screenshot        | 组件快照                                                                                                                                    | String                    | 否     |
| icon              | 组件的小图标                                                                                                                                | String (URL)              | 是     |
| tags              | 组件标签                                                                                                                                    | String                    | 是     |
| keywords          | 组件关键词，用于搜索联想                                                                                                                    | String                    | 是     |
| devMode           | 组件研发模式                                                                                                                                | String  (proCode,lowCode) | 是     |
| npm               | npm 源引入完整描述对象                                                                                                                      | Object                    | 否     |
| npm.package       | 源码组件库名                                                                                                                                | String                    | 否     |
| npm.exportName    | 源码组件名称                                                                                                                                | String                    | 否     |
| npm.subName       | 子组件名                                                                                                                                    | String                    | 否     |
| npm.destructuring | 解构                                                                                                                                        | Bool                      | 否     |
| npm.main          | 组件路径                                                                                                                                    | String                    | 否     |
| npm.version       | 源码组件版本号                                                                                                                              | String                    | 否     |
| snippets          | 内容为组件不同状态下的低代码 schema (可以有多个)，用户从组件面板拖入组件到设计器时会向页面 schema 中插入 snippets 中定义的组件低代码 schema | Object[]                  | 否     |
| group             | 用于描述当前组件位于组件面板的哪个 tab                                                                                                      | String                    | 否     |
| category          | 用于描述组件位于组件面板同一 tab 的哪个区域                                                                                                 | String                    | 否     |
| priority          | 用于描述组件在同一 category 中的排序                                                                                                        | String                    | 否     |

##### 2.2.2.3 组件属性信息 props (A)

描述组件属性信息，通常包含名称、类型、描述、默认值 4 项内容。

| 字段         | 字段描述   | 字段类型      | 允许空 |
| ------------ | ---------- | ------------- | ------ |
| name         | 属性名称   | String        | 否     |
| propType     | 属性类型   | String/Object | 否     |
| description  | 属性描述   | String        | 是     |
| defaultValue | 属性默认值 | Any           | 是     |

propType 类型参考 [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes)，存在**基本类型**和**复合类型**，描述如下：

**基本类型**

| propType 值                                            | 类型描述               | 参考 PropTypes 类型       |
| ------------------------------------------------------ | ---------------------- | ------------------------- |
| 'array'                                                | 数组类型               | PropTypes.array           |
| 'bool'                                                 | 布尔类型               | PropTypes.bool            |
| 'func'                                                 | 函数类型               | PropTypes.func            |
| 'number'                                               | 数字类型               | PropTypes.number          |
| 'object'                                               | 对象类型               | PropTypes.object          |
| 'string'                                               | 字符串类型             | PropTypes.string          |
| 'node'                                                 | 节点类型               | PropTypes.node            |
| 'element'                                              | 元素类型               | PropTypes.element         |
| 'any'                                                  | 任意值类型             | PropTypes.any             |
| `{<br />  type: 'xxx',<br />  isRequired: true<br />}` | 指定类型，且是必要属性 | PropTypes.xxxx.isRequired |

> 注意：上述类型均支持 PropTypes.xxx.isRequired 链式描述方式描述该属性是否为**必要属性**。

描述举例：

```javascript
// 组件源码
export default class FusionForm extends PureComponent {
  static displayName = 'FusionForm';
  static propTypes = {
    name: PropTypes.string,
    age: PropTypes.number,
    friends: PropTypes.array,
  };
  render(){
    return ...;
  }
}

// 组件属性描述
{
  props: [{
    name: 'name',
    propType: {
      type: 'string',
      isRequired: true,
    },
    description: '这是用于描述姓名',
    defaultValue: '张三',
  }, {
    name: 'age',
    propType: 'number',
    description: '这是用于描述年龄',
    defaultValue: 18,
  }, {
    name: 'friends',
    propType: 'array',
    description: '这是用于描述好友列表',
    defaultValue: [ '李四', '王五', '赵六' ],
  }],
}
```

**复合类型**

| propType 值                                                                                                                                                                                                                                    | 类型描述                                         | PropTypes 类型           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------ |
| `<br />  type: 'oneOf',<br />  value: ['a', 'b', 'c', '...']<br />`                                                                                                                                                                            | 枚举值类型                                       | PropTypes.oneOf(...)     |
| `<br />  type: 'oneOfType',<br />  value: ['string', 'number', {<br />    type: 'array',<br />    isRequired: true<br />  }]<br />`                                                                                                            | 指定类型中的一种，支持递归描述                   | PropTypes.oneOfType(...) |
| `<br />  type: 'arrayOf',<br />  value: 'number'<br />`                                                                                                                                                                                        | 指定统一成员**值类型**的数组类型                 | PropTypes.arrayOf(...)   |
| `<br />  type: 'objectOf',<br />  value: 'string'<br />`                                                                                                                                                                                       | 指定统一对象属性**值类型**的对象类型             | PropTypes.objectOf(...)  |
| `<br />  type: 'shape',<br />  value: [{<br />    name: 'color',<br />    propType: 'string'<br />  }, {<br />    name: 'fontSize',<br />    propType: {<br />      type: 'number',<br />      isRequied: true  <br />    }  <br />  }]<br />` | 指定对象的部分**属性名**和**值类型**的对象类型   | PropTypes.shape(...)     |
| `<br />  type: 'exact',<br />  value: [{<br />    name: 'name',<br />    propType: 'string'  <br />  }, {<br />    name: 'quantity',<br />    propType: 'number'<br />  }]<br />`                                                              | 严格指定对象全部**属性名**和**值类型**的对象类型 | PropTypes.exact(...)     |

描述举例：

```javascript
// 组件源码
export default class FusionForm extends PureComponent {
  static displayName = 'FusionForm';
  static propTypes = {
    title: PropTypes.oneOf(['News', 'Photos']),
    message: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Message),
    ]),
    size: PropTypes.arrayOf(PropTypes.number),
    bodyStyle: PropTypes.shape({
      color: PropTypes.string,
      fontSize: PropTypes.number,
    }),
    extraContext: function (props, propName, componentName) {
      if (!/matchme/.test(props[propName])) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    },
  };
  render() {
    return ...;
  }
}

// 组件属性描述
{
  props: [{
    name: 'title',
    propType: {
      type: 'oneOf',
      value: ['News', 'Photos'],
    },
    description: '这是用于描述标题',
    defaultValue: '标题一',
  }, {
    name: 'message',
    propType: {
      type: 'oneOfType',
      value: ['string', 'number', {
        type: 'array',
        isRequired: true,
      }],
    },
    description: '这是用于描述消息内容',
    defaultValue: 'xxx',
  }, {
    name: 'size',
    propType: {
      type: 'arrayOf',
      value: 'number',
    },
    description: '这是用于描述大小列表',
    defaultValue: [1, 2, 3],
  }], {
    name: 'bodyStyle',
    propType: {
      type: 'shape',
      value: [{
        name: 'color',
        propType: 'string',
      }, {
        name: 'fontSize',
        propType: {
          type: 'number',
          isRequied: true,
        }
      }],
    },
    description: '这是用于描述主体样式',
    defaultValue: [1, 2, 3],
  }],
}
```

##### 2.2.2.4 编辑体验增强 configure

推荐用于优化搭建产品的编辑体验，定制编辑能力的配置信息，通过能力抽象分类，主要包含如下几个维度的配置项：

| 字段                         | 字段描述                             | 字段类型 | 备注                                                                                                                     |
| ---------------------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| props (A)                    | 属性面板配置                         | Array    | 用于属性面板能力描述                                                                                                     |
| component(A)                 | 组件能力配置                         | Object   | 与组件相关的能力、约束、行为等描述，有些信息可从组件视图实例上直接获取                                                   |
| supports (AA)                | 通用扩展配置能力支持性               | Object   | 用于通用扩展面板能力描述                                                                                                 |
| advanced (AAA)               | 高级特性配置                         | Object   | 用户可以在这些配置通过引擎上下文控制组件在设计器中的表现，例如自动初始化组件的子组件、截获组件的操作事件进行个性化处理等 |
| 【已废弃】experimental (AAA) | 将引擎的一些实验性特性放在这个配置里 | Object   | 用户可以提前体验这些特性                                                                                                 |

###### 2.2.2.4.1 属性面板配置 props (A)

props 数组下对象字段描述：

| 字段                | 字段描述                                                                                    | 字段类型                                       | 备注                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------ |
| type                | 指定类型                                                                                    | Enum                                           | 可选值为 `'field'                                                                                | 'group'` ,默认为 'field' |
| display             | 指定类型                                                                                    | Enum                                           | 可选值为 `'accordion' \| 'inline' \| 'block' \| 'plain' \| 'popup' \| 'entry'` ，默认为 'inline' |
| title               | 分类标题                                                                                    | 属性标题                                       | String                                                                                           |                          |
| items               | 分类下的属性列表                                                                            | Array\<Object\>                                | type = 'group' 生效                                                                              |
| name                | 属性名                                                                                      | String                                         | type = 'field' 生效                                                                              |
| defaultValue        | 默认值                                                                                      | Any(视字段类型而定)                            | type = 'field' 生效                                                                              |
| supportVariable     | 是否支持配置变量                                                                            | Boolean                                        | type = 'field' 生效                                                                              |
| condition           | 配置当前 prop 是否展示                                                                      | (target: IPublicModelSettingField) => boolean; | -                                                                                                |
| ignoreDefaultValue  | 配置当前 prop 是否忽略默认值处理逻辑，如果返回值是 true 引擎不会处理默认值                  | (target: IPublicModelSettingField) => boolean; | -                                                                                                |
| setter              | 单个控件 (setter) 描述，搭建基础协议组件的描述对象，支持 JSExpression / JSFunction / JSSlot | `String\|Object\|Function`                     | type = 'field' 生效                                                                              |
| extraProps          | 其他配置属性（不做流通要求）                                                                | Object                                         | 其他配置                                                                                         |
| extraProps.getValue | setter 渲染时被调用，setter 会根据该函数的返回值设置 setter 当前值                          | Function                                       | (target: IPublicModelSettingField, value: any) => any;                                           |
| extraProps.setValue | setter 内容修改时调用，开发者可在该函数内部修改节点 schema 或者进行其他操作                 | Function                                       | (target: IPublicModelSettingField, value: any) => void;                                          |

根据属性值类型 propType，确定对应控件类型 (setter) 。

###### 2.2.2.4.2 通用扩展面板支持性配置 supports (AA)

样式配置面板能力描述，描述是否支持行业样式编辑、是否支持类名设置等。

```json
{
  "configure": {
    // 支持的事件枚举
    "supports": {
      // 支持事件列表
      "events": ["onClick", "onChange"],
      // 支持循环设置
      "loop": true,
      // 支持条件设置
      "condition": true,
      // 支持样式设置
      "style": true
    }
  }
}
```

###### 2.2.2.4.3 组件能力配置 component

与组件相关的能力、约束、行为等描述，有些信息可从组件视图实例上直接获取，包含如下字段：

| 字段                            | 用途                                                                                                                                                 | 类型               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| isContainer(A)                  | 是否容器组件                                                                                                                                         | Boolean            |
| isModal(A)                      | 组件是否带浮层，浮层组件拖入设计器时会遮挡画布区域，此时应当辅助一些交互以防止阻挡                                                                   | Boolean            |
| descriptor(A)                   | 组件树描述信息                                                                                                                                       | String             |
| nestingRule(A)                  | 嵌套控制：防止错误的节点嵌套，比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等                                                  | Object             |
| nestingRule.childWhitelist      | 子节点类型白名单                                                                                                                                     | `String\|Function` |
| nestingRule.parentWhitelist     | 父节点类型白名单                                                                                                                                     | `String\|Function` |
| nestingRule.descendantBlacklist | 后裔节点类型黑名单                                                                                                                                   | `String\|Function` |
| nestingRule.ancestorWhitelist   | 祖父节点类型白名单                                                                                                                                   | `String\|Function` |
| isNullNode(AAA)                 | 是否存在渲染的根节点                                                                                                                                 | Boolean            |
| isLayout(AAA)                   | 是否是 layout 布局组件                                                                                                                               | Boolean            |
| rootSelector(AAA)               | 组件选中框的 cssSelector                                                                                                                             | String             |
| disableBehaviors(AAA)           | 用于屏蔽在设计器中选中组件时提供的操作项，默认操作项有 copy、hide、remove                                                                            | String[]           |
| actions(AAA)                    | 用于详细配置上述操作项的内容                                                                                                                         | Object             |
| isMinimalRenderUnit             | 是否是最小渲染单元，最小渲染单元下的组件渲染和更新都从单元的根节点开始渲染和更新。如果嵌套了多层最小渲染单元，渲染会从最外层的最小渲染单元开始渲染。 | Boolean            |

描述举例：

```js
{
  configure: {
    component: {
      isContainer: true,
      isModal: false,
      descriptor: 'title',
      nestingRule: {
        childWhitelist: ['SelectOption'],
        parentWhitelist: ['Select', 'Table'],
      },
      rootSelector: '.next-dialog',
      disableBehaviors: ['copy', 'remove'],
      actions: {
        name: 'copy', // string;
        content: '＋', // string | ReactNode | ActionContentObject;
        items: [], // ComponentAction[];
        condition: 'always', // boolean | ((currentNode: any) => boolean) | 'always';
        important: true, // boolean;
      },
    },
  },
}
```

###### 2.2.2.4.4 高级功能配置 advanced (AAA)

组件在低代码引擎设计器中的事件回调和 hooks 等高级功能配置，包含如下字段：

| 字段                        | 用途                                                                  | 类型                           | 备注                                                |
| --------------------------- | --------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------- | --- | --- | --- | ---- | ---- | ---- | --------------------------------------------------------------------------- | ------------- | ---------- | ------------ | ---------------- |
| initialChildren             | 组件拖入“设计器”时根据此配置自动生成 children 节点 schema             | NodeData[]/Function NodeData[] | ((target: IPublicModelSettingField) => NodeData[]); |
| getResizingHandlers         | 用于配置设计器中组件 resize 操作工具的样式和内容                      | Function                       | `(currentNode: any) => Array<{ type: 'N'            | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW'; content?: ReactElement; propTarget?: string; appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always'; }> | ReactElement[];` |
| callbacks                   | 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等  | Callback                       | -                                                   |
| callbacks.onNodeAdd         | 在容器中拖入组件时触发的事件回调                                      | Function                       | (e: MouseEvent, currentNode: any) => any            |
| callbacks.onNodeRemove      | 在容器中删除组件时触发的事件回调                                      | Function                       | (e: MouseEvent, currentNode: any) => any            |
| callbacks.onResize          | 调整容器尺寸时触发的事件回调，常常与 getResizingHandlers 搭配使用     | Function                       | 详见 Types 定义                                     |
| callbacks.onResizeStart     | 调整容器尺寸开始时触发的事件回调，常常与 getResizingHandlers 搭配使用 | Function                       | 详见 Types 定义                                     |
| callbacks.onResizeEnd       | 调整容器尺寸结束时触发的事件回调，常常与 getResizingHandlers 搭配使用 | Function                       | 详见 Types 定义                                     |
| callbacks.onSubtreeModified | 容器节点结构树发生变化时触发的回调                                    | Function                       | (currentNode: any, options: any) => void;           |
| callbacks.onMouseDownHook   | 鼠标按下操作回调                                                      | Function                       | (e: MouseEvent, currentNode: any) => any;           |
| callbacks.onClickHook       | 鼠标单击操作回调                                                      | Function                       | (e: MouseEvent, currentNode: any) => any;           |
| callbacks.onDblClickHook    | 鼠标双击操作回调                                                      | Function                       | (e: MouseEvent, currentNode: any) => any;           |
| callbacks.onMoveHook        | 节点被拖动回调                                                        | Function                       | (currentNode: any) => boolean;                      |
| callbacks.onHoverHook       | 节点被 hover 回调                                                     | Function                       | (currentNode: any) => boolean;                      |
| callbacks.onChildMoveHook   | 容器节点的子节点被拖动回调                                            | Function                       | (childNode: any, currentNode: any) => boolean;      |

描述举例：

```js
{
  configure: {
    advanced: {
      callbacks: {
        onNodeAdd: (dragment, currentNode) => {

        }
      },
      getResizingHandlers: () => {
        return [ 'E' ];
      },
      initials: [
        {
          name: 'linkType',
          initial: () => 'link'
        },
      ]
    },
  }
}
```

##### 2.2.2.5 TypeScript 定义

```TypeScript

export interface ConfigureProp {
  /**
   * 面板配置隶属于单个 field 还是分组
   */
  type?: 'field' | 'group';
  /**
   * the name of this setting field, which used in quickEditor
   */
  name: string | number;
  /**
   * the field title
   * @default sameas .name
   */
  title?: TitleContent;
  /**
   * 单个属性的 setter 配置
   *
   * the field body contains when .type = 'field'
   */
  setter?: SetterType | DynamicSetter;
  /**
   * the setting items which group body contains when .type = 'group'
   */
  items?: ConfigureProp[];
  /**
   * extra props for field
   * 其他配置属性（不做流通要求）
   */
  extraProps?: ExtraProps;
}

export interface ConfigureSupport {
  /**
   * 支持事件列表
   */
  events?: ConfigureSupportEvent[];
  /**
   * 支持 className 设置
   */
  className?: boolean;
  /**
   * 支持样式设置
   */
  style?: boolean;
  /**
   * 支持生命周期设置
   */
  lifecycles?: any[];
  // general?: boolean;
  /**
   * 支持循环设置
   */
  loop?: boolean;
  /**
   * 支持条件式渲染设置
   */
  condition?: boolean;
}

export interface ConfigureComponent {
  /**
   * 是否容器组件
   */
  isContainer?: boolean;
  /**
   * 组件是否带浮层，浮层组件拖入设计器时会遮挡画布区域，此时应当辅助一些交互以防止阻挡
   */
  isModal?: boolean;
  /**
   * 是否存在渲染的根节点
   */
  isNullNode?: boolean;
  /**
   * 组件树描述信息
   */
  descriptor?: string;
  /**
   * 嵌套控制：防止错误的节点嵌套
   * 比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等
   */
  nestingRule?: NestingRule;

  /**
   * 是否是最小渲染单元
   * 最小渲染单元下的组件渲染和更新都从单元的根节点开始渲染和更新。如果嵌套了多层最小渲染单元，渲染会从最外层的最小渲染单元开始渲染。
   */
  isMinimalRenderUnit?: boolean;

  /**
   * 组件选中框的 cssSelector
   */
  rootSelector?: string;
  /**
   * 禁用的行为，可以为 `'copy'`, `'move'`, `'remove'` 或它们组成的数组
   */
  disableBehaviors?: string[] | string;
  /**
   * 用于详细配置上述操作项的内容
   */
  actions?: ComponentAction[];
}

export interface Advanced {
  /**
   * @todo 待补充文档
   */
  context?: { [contextInfoName: string]: any };
  /**
   * @todo 待补充文档
   */
  view?: ComponentType<any>;
  /**
   * @todo 待补充文档
   */
  transducers?: any;
  /**
   * @todo 待补充文档
   */
  filters?: FilterItem[];
  /**
   * @todo 待补充文档
   */
  autoruns?: AutorunItem[];
  /**
   * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
   */
  callbacks?: Callbacks;
  /**
   * 拖入容器时，自动带入 children 列表
   */
  initialChildren?: NodeData[] | ((target: IPublicModelSettingField) => NodeData[]);
  /**
   * @todo 待补充文档
   */
  isAbsoluteLayoutContainer?: boolean;
  /**
   * @todo 待补充文档
   */
  hideSelectTools?: boolean;

  /**
   * 样式 及 位置，handle上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
   * NWSE 是交给引擎计算放置位置，ReactElement 必须自己控制初始位置
   */
  /**
   * 用于配置设计器中组件 resize 操作工具的样式和内容
   * - hover 时控制柄高亮
   * - mousedown 时请求独占
   * - dragstart 请求通用 resizing 控制 请求 hud 显示
   * - drag 时 计算并设置效果，更新控制柄位置
   */
  getResizingHandlers?: (
    currentNode: any,
  ) => (
    | Array<{
      type: 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW';
      content?: ReactElement;
      propTarget?: string;
      appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always';
    }>
    | ReactElement[]
  );

  /**
   * Live Text Editing：如果 children 内容是纯文本，支持双击直接编辑
   */
  liveTextEditing?: LiveTextEditingConfig[];
}

export interface Configure {
  /**
   * 属性面板配置
   */
  props?: ConfigureProp[];
  /**
   * 组件能力配置
   */
  component?: ConfigureComponent;
  /**
   * 通用扩展面板支持性配置
   */
  supports?: ConfigureSupport;
  /**
   * 高级特性配置
   */
  advanced?: Advanced;
}

export interface Snippet {
  /**
   * 组件分类title
   */
  title?: string;
  /**
   * snippet 截图
   */
  screenshot?: string;
  /**
   * snippet 打标
   *
   * @deprecated 暂未使用
   */
  label?: string;
  /**
   * 待插入的 schema
   */
  schema?: NodeSchema;
}

export interface ComponentDescription { // 组件描述协议，通过 npm 中的 exportName 对应到 package
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
  snippets: Snippet[];
  group: string;
  category: string;
  priority: number;
}
```

#### 2.2.3 资产包协议

##### 2.2.3.1 协议结构

协议最顶层结构如下，包含 5 方面的描述内容：

- version { String } 当前协议版本号
- packages{ Array } 低代码编辑器中加载的资源列表
- components { Array } 所有组件的描述协议列表
- sort { Object } 用于描述组件面板中的 tab 和 category

##### 2.2.3.2 version (A)

定义当前协议 schema 的版本号；

| 根属性名称 | 类型   | 说明       | 变量支持 | 默认值 |
| ---------- | ------ | ---------- | -------- | ------ |
| version    | String | 协议版本号 | -        | 1.0.0  |

##### 2.2.3.3 packages (A)

定义低代码编辑器中加载的资源列表，包含公共库和组件 (库) cdn 资源等；

| 字段                    | 字段描述                                            | 字段类型        | 备注                             |
| ----------------------- | --------------------------------------------------- | --------------- | -------------------------------- |
| packages[].title? (A)   | 资源标题                                            | String          | 资源标题                         |
| packages[].package (A)  | npm 包名                                            | String          | 组件资源唯一标识                 |
| packages[].version(A)   | npm 包版本号                                        | String          | 组件资源版本号                   |
| packages[].library(A)   | 作为全局变量引用时的名称，用来定义全局变量名        | String          | 低代码引擎通过该字段获取组件实例 |
| packages[].editUrls (A) | 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css | Array\<String\> | 低代码引擎编辑器会加载这些 url   |
| packages[].urls (AA)    | 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css | Array\<String\> | 低代码引擎渲染模块会加载这些 url |

描述举例：

```json
{
  "packages": [
    {
      "package": "moment",
      "version": "2.24.0",
      "urls": ["https://g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js"],
      "library": "moment"
    },
    {
      "package": "lodash",
      "library": "_",
      "urls": ["https://g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js"]
    },
    {
      "title": "fusion 组件库",
      "package": "@alifd/next",
      "version": "1.24.18",
      "urls": [
        "https://g.alicdn.com/code/lib/alifd__next/1.24.18/next.min.css",
        "https://g.alicdn.com/code/lib/alifd__next/1.24.18/next-with-locales.min.js"
      ],
      "library": "Next"
    },
    {
      "package": "@alilc/lowcode-materials",
      "version": "1.0.0",
      "library": "AlilcLowcodeMaterials",
      "urls": [
        "https://alifd.alicdn.com/npm/@alilc/lowcode-materials@1.0.0/dist/AlilcLowcodeMaterials.js",
        "https://alifd.alicdn.com/npm/@alilc/lowcode-materials@1.0.0/dist/AlilcLowcodeMaterials.css"
      ],
      "editUrls": [
        "https://alifd.alicdn.com/npm/@alilc/lowcode-materials@1.0.0/build/lowcode/view.js",
        "https://alifd.alicdn.com/npm/@alilc/lowcode-materials@1.0.0/build/lowcode/view.css"
      ]
    },
    {
      "package": "@alifd/fusion-ui",
      "version": "1.0.0",
      "library": "AlifdFusionUi",
      "urls": [
        "https://alifd.alicdn.com/npm/@alifd/fusion-ui@1.0.0/build/lowcode/view.js",
        "https://alifd.alicdn.com/npm/@alifd/fusion-ui@1.0.0/build/lowcode/view.css"
      ],
      "editUrls": [
        "https://alifd.alicdn.com/npm/@alifd/fusion-ui@1.0.0/build/lowcode/view.js",
        "https://alifd.alicdn.com/npm/@alifd/fusion-ui@1.0.0/build/lowcode/view.css"
      ]
    }
  ]
}
```

##### 2.2.3.4 components (A)

定义所有组件的描述协议列表，组件描述协议遵循本规范章节 2.2.2 的定义；

##### 2.2.3.5 sort (A)

定义组件列表分组

| 根属性名称        | 类型     | 说明                                                                                         | 变量支持 | 默认值                                   |
| ----------------- | -------- | -------------------------------------------------------------------------------------------- | -------- | ---------------------------------------- |
| sort.groupList    | String[] | 组件分组，用于组件面板 tab 展示                                                              | -        | ['精选组件', '原子组件']                 |
| sort.categoryList | String[] | 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列 | -        | ['通用', '数据展示', '表格类', '表单类'] |

##### 2.2.3.6 TypeScript 定义

```TypeScript
export interface ComponentSort {
  groupList?: String[]; // 用于描述组件面板的 tab 项及其排序，例如：["精选组件", "原子组件"]
  categoryList?: String[]; // 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列；
}

export interface Assets {
  version: string; // 资产包协议版本号
  packages?: Array<Package>; // 大包列表，external与package的概念相似，融合在一起
  components: Array<ComponentDescription> | Array<RemoteComponentDescription>; // 所有组件的描述协议列表
  componentList?: ComponentCategory[]; // 【待废弃】组件分类列表，用来描述物料面板
  sort: ComponentSort; // 新增字段，用于描述组件面板中的 tab 和 category
}

export interface RemoteComponentDescription {
  exportName: string; // 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
  url: string; // 组件描述的资源链接；
  package: { // 组件(库)的 npm 信息；
    npm: string;
  }
}
```

## 3 物料规范 - 区块规范

### 3.1 源码规范

英文 block, 可复用的代码片段，每个区块对应一个 npm。

#### 3.1.1 目录 (A)

```html
block/ ├── build │   ├── index.css // 【编译生成】 │ ├── index.html //
【编译生成】【必选】可直接预览文件 │   ├── index.js // 【编译生成】 │   └── views // 【3A
编译生成】html2sketch │   ├── block_view1.html // 【3A 编译生成】给 sketch 用的 html │   └──
block_view1.png // 【3A 编译生成】截图 ├── src // 【必选】区块源码 │ ├── index.jsx // 【必选】入口 │
└── index.module.scss // 【可选】如有样式请使用 CSS Modules 避免冲突 ├── README.md //
【可选】无格式要求 └── package.json // 【必选】
```

#### 3.1.2 package.json (A)

```json
{
  "name": "",
  "version": "",
  "description": "",
  "files": ["src/", "build/", "screenshot.png"],
  "blockConfig": {
    "name": "user-landing",
    "title": "用户欢迎信息",
    "category": "form",
    "screenshot": "https://unpkg.com/@icedesign/user-landing-block/screenshot.png"
  }
}
```

#### 3.1.3 html2sketch (3A)

##### 3.1.3.1 package.json 内 blockConfig 结构

```json
{
  "blockConfig": {
    "name": "user-landing",
    "title": "用户欢迎信息",
    "category": "form",
    "screenshot": "https://unpkg.com/@icedesign/user-landing-block/screenshot.png",
    "views": [
      {
        // 区块视图，配置此项后会进入 fusion cool
        "title": "视图 1 标题", // 区块视图标题
        "props": {
          // 区块支持的 props
          "type": "primary"
        },
        "screenshot": "build/views/block_view1.png", // 【编译自动填充】视图截图，会在 build 时自动生成
        "html": "build/views/block_view1.html" // 【编译自动填充】视图渲染后 html 结构，会在 build 时自动生成
      },
      {
        "title": "视图 2 标题", // 区块视图标题
        "props": {
          // 区块支持的 props
          "type": "sencondary"
        },
        "screenshot": "build/views/block_view2.png", // 【编译自动填充】视图截图，会在 build 时自动生成
        "html": "build/views/block_view2.html" // 【编译自动填充】视图渲染后 html 结构，会在 build 时自动生成
      }
    ]
  }
}
```

### 3.2 低代码规范

由业务组件、布局组件进行嵌套组合而成。不对外提供可配置的属性。可通过**区块容器组件**的包裹，实现容器内部具备有完整的样式、事件、生命周期管理、状态管理、数据流转机制。能独立存在和运行，可实现跨页面、跨应用的快速复用，保障功能和数据的正常。

| 根属性描述     | 说明                               | 类型   |
| -------------- | ---------------------------------- | ------ |
| version        | 协议版本号                         | String |
| componentsMap  | 描述组件映射关系的集合             | Array  |
| componentsTree | 区块组件树描述，顶层不限定组件类型 | Array  |
| utils          | 工具类扩展映射关系                 | Array  |
| i18n           | 国际化语料                         | Object |

描述举例 1：

```json
{
  "version": "1.0.0",
  "componentsMap": [{}],
  "componentsTree": [
    {
      // 区块组件树，顶层由区块容器组件包裹；
      "componentName": "Block", // 区块容器组件名
      "fileName": "block1", // 区块容器 1
      "props": {},
      "css": "body {font-size: 12px;}",
      "state": {
        "name": "lucy"
      },
      "children": [
        {
          "componentName": "Div",
          "props": {
            "className": "className1"
          },
          "children": [
            {
              "componentName": "Button",
              "props": {
                "text": "点击弹出我的姓名",
                "onClick": {
                  "type": "JSFunction",
                  "value": "function(e){\
              alert(this.state.name)\
            }"
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "i18n": {}
}
```

描述举例 2：

```json
{
  "version": "1.0.0",
  "componentsMap": [{}],
  "componentsTree": [
    {
      //区块组件树，由普通组件描述组合而成；无区块容器
      "componentName": "Input",
      "props": {
        "placeholder": "请输入搜索关键词"
      }
    },
    {
      "componentName": "Button",
      "props": {
        "text": "搜索",
        "onClick": {
          "type": "JSFunction",
          "value": "\
        // some comments \
        function(e){\
          //...\
        }"
        }
      }
    }
  ],
  "i18n": {}
}
```

## 4 物料规范 - 模板规范

### 4.1 源码规范

#### 4.1.1 目录规范（A）

与标准源码 build-scripts 对齐

```html
├── META/ # 低代码元数据信息，用于多分支冲突解决、数据回滚等功能 ├── build │   ├── index.css #
【编译生成】 │ ├── index.html # 【编译生成】【必选】可直接预览文件 │   ├── index.js # 【编译生成】
│   └── views # 【3A 编译生成】html2sketch │   ├── page1.html # 【3A 编译生成】给 sketch 用的 html
│   └── page1.png # 【3A 编译生成】截图 ├── public/ # 静态文件，构建时会 copy 到 build/ 目录 │ ├──
index.html # 应用入口 HTML │ └── favicon.png # Favicon ├── src/ │ ├── components/ #
应用内的低代码业务组件 │ │ └── GuideComponent/ │ │ ├── index.js # 组件入口 │ │ ├── components.js #
组件依赖的其他组件 │ │ ├── schema.js # schema 描述 │ │ └── index.scss # css 样式 │ ├── pages/ # 页面
│ │ └── HomePage/ # Home 页面 │ │ ├── index.js # 页面入口 │ │ └── index.scss # css 样式 │ ├──
layouts/ │ │ └── BasicLayout/ # layout 组件名称 │ │ ├── index.js # layout 入口 │ │ ├── components.js
# layout 组件依赖的其他组件 │ │ ├── schema.js # layout schema 描述 │ │ └── index.scss # layout css
样式 │ ├── config/ # 配置信息 │ │ ├── components.js # 应用上下文所有组件 │ │ ├── routes.js #
页面路由列表 │ │ └── constants.js # 全局常量定义 │ │ └── app.js # 应用配置文件 │ ├── utils/ # 工具库
│ │ └── index.js # 应用第三方扩展函数 │ ├── stores/ # [可选] 全局状态管理 │ │ └── user.js │ ├──
locales/ # [可选] 国际化资源 │ │ ├── en-US │ │ └── zh-CN │ ├── global.scss # 全局样式 │ └──
index.jsx # 应用入口脚本，依赖 config/routes.js 的路由配置动态生成路由； ├── webpack.config.js #
项目工程配置，包含插件配置及自定义 `webpack` 配置等 ├── README.md ├── package.json ├── .editorconfig
├── .eslintignore ├── .eslintrc.js ├── .gitignore ├── .stylelintignore └── .stylelintrc.js
```

##### 入口文件

(/src/index.jsx)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import pkg from '../package.json';
import router from './router';
import './index.scss';
const App = hot(router);

ReactDOM.render(
  <App />,
  document.getElementById((pkg.config && pkg.config.targetRootID) || 'root'),
);
```

##### 应用参数配置文件

(/src/config/app.js)

- 支持配置路由方式：historyMode
  - 支持 2 种路由方式：
    - 浏览器路由：browser
    - 哈希路由：hash
  - 支持透传路由产生的参数到所有组件的上下文 this 对象上
    - history 对象：this.history
    - location 对象：this.location
      - 支持内置 query 参数的解析：this.location.query
    - match 对象：this.match
- 支持渲染的目标节点 ID：targetRootID
- 支持配置应用的 fusion 主题风格：theme
- 支持配置 layout 的组件名称和属性配置：layout
- 支持配置渲染模块版本号：sdkVersion
- 支持配置固定依赖组件列表：compDependencies

```javascript
export default {
  sdkVersion: '1.0.3',
  historyMode: 'hash', // 浏览器路由：browser  哈希路由：hash
  targetRootID: 'ice-container',
  layout: {
    componentName: 'BasicLayout',
    props: {},
  },
  theme: {
    package: '@alife/theme-fusion',
    version: '^0.1.0',
  },
  compDependencies: [],
};
```

##### 应用扩展配置规范：

(/src/utils/index.js)

- 支持 npm 包第三方扩展；
- 支持应用范围的自定义扩展函数；

```javascript
import { Message, Dialog } from '@alifd/next';
import moment from 'moment';

export default {
  Message,                // npm 包依赖
  Dialog,
  moment,
  xxx: function(item) {   // 自定义函数
    return ...
  }
}
```

##### 应用常量配置

(/src/config/constants.js)

```javascript
export default {
  ISIDE: false,
};
```

##### 应用样式配置

(/src/global.scss)

```css
a {
  color: #2077ff;
  text-decoration: none;
}

.transparent {
  opacity: 0;
}
```

#### 4.1.2 html2sketch (AAA)

##### 4.1.2.1 package.json 内 scaffoldConfig 结构

```json
{
  "scaffoldConfig": {
    "name": "user-landing",
    "title": "用户欢迎信息",
    "category": "form",
    "screenshot": "https://unpkg.com/@icedesign/user-landing-block/screenshot.png",
    "views": [
      {
        // 模板视图，配置此项后会进入 fusion cool
        "title": "视图 1 标题", // 模板视图标题
        "path": "#/dashboard/monitor", // 读取路由列表生成，hash 路由必须加#
        "screenshot": "build/views/page0.png", // 【编译自动填充】视图截图，会在 build 时自动生成
        "html": "build/views/page0.html" // 【编译自动填充】视图渲染后 html 结构，会在 build 时自动生成
      },
      {
        "title": "视图 2 标题", // 区块视图标题
        "path": "#/dashboard/list", // 读取路由列表生成，hash 路由必须加#
        "screenshot": "build/views/page1.png", // 【编译自动填充】视图截图，会在 build 时自动生成
        "html": "build/views/page1.html" // 【编译自动填充】视图渲染后 html 结构，会在 build 时自动生成
      }
    ]
  }
}
```
