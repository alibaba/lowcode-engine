---
title: 使用渲染模块
sidebar_position: 0
---
## 快速使用
渲染依赖于 schema 和 components。其中 schema 和 components 需要一一对应，schema 中使用到的组件都需要在 components 中进行声明，否则无法正常渲染。
### 简单示例

```jsx
import ReactRenderer from '@alilc/lowcode-react-renderer';
import ReactDOM from 'react-dom';
import { Button } from '@alifd/next';

const schema = {
  componentName: 'Page',
  props: {},
  children: [
    {
      componentName: 'Button',
      props: {
        type: 'primary',
        style: {
          color: '#2077ff'
        },
      },
      children: '确定',
    },
  ],
};

const components = {
  Button,
};

ReactDOM.render((
  <ReactRenderer
    schema={schema}
    components={components}
  />
), document.getElementById('root'));
```

####
### 项目使用示例
> [设计器 demo](https://lowcode-engine.cn/demo/demo-general/index.html)
> 项目代码完整示例：[https://github.com/alibaba/lowcode-demo](https://github.com/alibaba/lowcode-demo)

**step 1：在设计器中获取组件列表**
```typescript
import { material, project } from '@alilc/lowcode-engine';
const packages = material.getAssets().packages
```
**step 2：在设计器中获取当前配置页面的 schema**
```typescript
import { material, project } from '@alilc/lowcode-engine';

const schema = project.exportSchema();
```


**step 3：以某种方式存储 schema 和 packages**
这里用 localStorage 作为存储示例，真实项目中使用数据库或者其他存储方式。
```typescript
window.localStorage.setItem(
  'projectSchema',
  JSON.stringify(project.exportSchema())
);
const packages = await filterPackages(material.getAssets().packages);
window.localStorage.setItem(
  'packages',
  JSON.stringify(packages)
);
```
**step 4：预览时，获取存储的 schema 和 packages**
```typescript
const packages = JSON.parse(window.localStorage.getItem('packages') || '');
const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '');
const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
```
**step 5：通过整合 schema 和 packages 信息，进行渲染**
```typescript
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { Loading } from '@alifd/next';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';

const SamplePreview = () => {
  const [data, setData] = useState({});

  async function init() {
    // 渲染前置处理，初始化项目 schema 和资产包为渲染模块所需的 schema prop 和 components prop
    const packages = JSON.parse(window.localStorage.getItem('packages') || '');
    const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '');
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
    });
  }

  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Loading fullScreen />;
  }

  return (
    <div className="lowcode-plugin-sample-preview">
      <ReactRenderer
        className="lowcode-plugin-sample-preview-content"
        schema={schema}
        components={components}
      />
    </div>
  );
};

ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));

```
### 国际化示例
```typescript
class Demo extends PureComponent {
  static displayName = 'renderer-demo';
  render() {
    return (
      <div className="demo">
        <ReactRenderer
          key={schema.fileName}
          schema={schema}
          components={components}
          appHelper={{
            utils,
            constants
          }}
          locale="zh-CN"
          messages={{
            "hello": "你好",
            "china": "中国"
          }}
        />
      </div>
    );
  }
}
```

## API

| 参数 | 说明 | 类型 | 必选 |
| --- | --- | --- | --- |
| schema | 符合[搭建协议](https://lowcode-engine.cn/lowcode)的数据 | Object | 是 |
| components | 组件依赖的实例 | Object | 是 |
| componentsMap | 组件的配置信息 | Object | 否 |
| appHelper | 渲染模块全局上下文 | Object | 否 |
| designMode | 设计模式，可选值：extend、border、preview | String | 否 |
| suspended | 是否挂起 | Boolean | 否 |
| onCompGetRef | 组件 ref 回调（schema, ref）=> {} | Function | 否 |
| onCompGetCtx | 组件 ctx 更新回调 (schema, ctx) => {} | Function | 否 |
| rendererName | 渲染类型，标识当前模块是以什么类型进行渲染的 | string | 否 |
| customCreateElement | 自定义创建 element 的钩子
(Component, props, children) => {} | Function | 否 |
| notFoundComponent | 当组件找不到时，可以通过这个参数自定义展示文案。 | Component | 否 |
| thisRequiredInJSE | 为 true 的情况下 JSExpression 仅支持通过 this 来访问。假如需要兼容原来的 'state.xxx'，则设置为 false，推荐使用 true。 | Boolean | 否 |
| locale | 国际化语言类型 | string | 否 |
| messages | 国际化语言对象 | Object | 否 |


### schema

搭建基础协议数据，渲染模块将基于 schema 中的内容进行实时渲染。

### messages
国际化内容，需要配合 locale 使用
messages 格式示例：
```typescript
{
  'zh-CN': {
    'hello-world': '你好，世界！',
  },
  'en-US': {
    'hello-world': 'Hello world!',
  },
}
```

### locale
当前语言类型
示例：'zh-CN' | 'en-US'

### components

渲染模块渲染页面需要用到的组件依赖的实例，`components` 对象中的 Key 需要和搭建 schema 中的`componentName` 字段对应。

### componentsMap

> 在生产环境下不需要设置。


配置规范参见[《低代码引擎搭建协议规范》](https://lowcode-engine.cn/lowcode)，主要在搭建场景中使用，用于提升用户搭建体验。

- 属性配置校验：用户可以配置组件特定属性的 `propTypes`，在搭建场景中用户输入的属性值不满足 `propType` 配置时，渲染模块会将当前属性设置为 `undefined`，避免组件抛错导致编辑器崩溃；
- `isContainer` 标记：当组件被设置为容器组件且当前容器组件内没有其他组件时，用户可以通过拖拽方式将组件直接添加到容器组件内部；
- `parentRule` 校验：当用户使用的组件未出现在组件配置的 `parentRule` 组件内部时，渲染模块会使用 `visualDom` 组件进行占位，避免组件抛错的同时在下钻编辑场景也能够不阻塞用户配置，典型的场景如`Step.Item`、`Table.Column`、`Tab.Item` 等等。

### appHelper

appHelper 主要用于设置渲染模块的全局上下文，目前 appHelper 支持设置以下上下文：

- `utils`：全局公共函数
- `constants`：全局常量
- `location`：react-router 的 `location` 实例
- `history`：react-router 的 `history` 实例

设置了 appHelper 以后，上下文会直接挂载到容器组件的 this 上，用户可以在搭建协议中的 function 及变量表达式场景使用上下文，具体使用方式如下所示：
**schema：**

```javascript
export default {
  "componentName": "Page",
  "fileName": "test",
  "props": {},
  "children": [{
    "componentName": "Div",
    "props": {},
    "children": [{
      "componentName": "Text",
      "props": {
        "text": {
        	"type": "JSExpression",
          "value": "this.location.pathname"
        }
      }
    }, {
      "componentName": "Button",
      "props": {
        "type": "primary",
        "style": {
          "marginLeft": 10
        },
        "onClick": {
        	"type": "JSExpression",
          "value": "function onClick(e) { this.utils.xxx(this.constants.yyy);}"
        }
      },
      "children": "click me"
    }]
  }]
}
```

```typescript
import ReactRenderer from '@alilc/lowcode-react-renderer';
import ReactDOM from 'react-dom';
import { Button } from '@alifd/next';
import schema from './schema'

const components = {
  Button,
};

ReactDOM.render((
  <ReactRenderer
    schema={schema}
    components={components}
		appHelper={{
			utils: {
        xxx: () => {}
      }
    }}
  />
), document.getElementById('root'));
```
### designMode

> 在生产环境下不需要设置。


designMode 属性主要在搭建场景中使用，主要有以下作用：

- 当 `designMode` 改变时，触发当前 schema 中所有组件重新渲染
- 当 `designMode` 设置为 `design` 时，渲染模块会为 `Dialog`、`Overlay` 等初始状态无 dom 渲染的组件外层包裹一层 div，使其在画布中能够展示边框供用户选中

### suspended

渲染模块是否挂起，当设置为 `true` 时，渲染模块最外层容器的 `shouldComponentUpdate`将始终返回 false，在下钻编辑或者多引擎渲染的场景会用到该参数。

### onCompGetRef

组件 ref 的回调，在搭建场景下编排模块可以根据该回调获取组件实例并实现生命周期注入或者组件 DOM 操作等功能，回调函数主要包含两个参数：

- `schema`：当前组件的 schema 模型结构
- `ref`：当前组件的 ref 实例

### onCompGetCtx
组件 ctx 更新的回调，在组件每次 render 渲染周期我们都会为组件构造新的上下文环境，因此该回调函数会在组件每次 render 过程中触发，主要包含两个参数：

- `schema`：当前组件的 schema 模型结构
- `ctx`：当前组件的上下文信息，主要包含以下内容：
   - `page`：当前页面容器实例
   - `this`: 当前组件所属的容器组件实例
   - `item`/`index`: 循环上下文（属性 key 可以根据 loopArgs 进行定制）
   - `form`: 表单上下文

### rendererName
渲染类型，标识当前模块是以什么类型进行渲染的

- `LowCodeRenderer`: 低代码组件
- `PageRenderer`: 页面

### customCreateElement
自定义创建 element 的钩子，用于在渲染前后对组件进行一些处理，包括但不限于增加 props、删除部分 props。主要包含三个参数：

- `Component`：要渲染的组件
- `props`：要渲染的组件的 props
- `children`：要渲染的组件的子元素

### thisRequiredInJSE
> 版本 >= 1.0.11

默认值：true
为 true 的情况下 JSExpression 仅支持通过 this 来访问。假如需要兼容原来的 'state.xxx'，则设置为 false，推荐使用 true。
