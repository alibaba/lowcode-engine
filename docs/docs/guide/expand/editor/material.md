---
title: 物料扩展
sidebar_position: 1
---
## 物料简述
物料是页面搭建的原料，按照粒度可分为组件、区块和模板：

1. 组件：组件是页面搭建最小的可复用单元，其只对外暴露配置项，用户无需感知其内部实现；
2. 区块：区块是一小段符合低代码协议的 schema，其内部会包含一个或多个组件，用户向设计器中拖入一个区块后可以随意修改其内部内容；
3. 模板：模板和区块类似，也是一段符合低代码协议的 schema，不过其根节点的 componentName 需固定为 Page，它常常用于初始化一个页面；

低代码编辑器中的物料需要进行一定的配置和处理，才能让用户在低代码平台使用起来。这个过程中，需要一份一份配置文件，也就是资产包。资产包文件中，针对每个物料定义了它们在低代码编辑器中的使用描述。
## 资产包配置
### 什么是低代码资产包
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1647671718994-e013a162-37be-4fa7-bd3b-3af06878c3c2.png#clientId=uf20508c2-6786-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=579&id=u7a0c3dae&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1646&originWidth=3068&originalType=binary&ratio=1&rotation=0&showTitle=false&size=635660&status=done&style=stroke&taskId=uc304cc2b-24bf-449d-8e2e-fd25c88b189&title=&width=1080)
在低代码 Demo 中，我们可以看到，组件面板不只提供一个组件，组件是以集合的形式提供给低代码平台的，而低代码资产包正是这些组件构成集合的形式。
**_它背后的 Interface，_**[**_在引擎中的定义摘抄如下_**](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/assets.ts)**_：_**

```typescript
export interface Assets {
  version: string; // 资产包协议版本号
  packages?: Array<Package>; // 大包列表，external与package的概念相似，融合在一起
  components: Array<ComponentDescription> | Array<RemoteComponentDescription>; // 所有组件的描述协议列表
  sort: ComponentSort; // 新增字段，用于描述组件面板中的 tab 和 category
}

export interface ComponentSort {
  groupList?: String[]; // 用于描述组件面板的 tab 项及其排序，例如：["精选组件", "原子组件"]
  categoryList?: String[]; // 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列；
}

export interface RemoteComponentDescription {
  exportName: string; // 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
  url: string; // 组件描述的资源链接；
  package: { // 组件(库)的 npm 信息；
    npm: string;
  }
}
```
资产包协议 TS 描述
### Demo 中的资产包
在 Demo 项目中，自带了一份默认的资产包：
> [https://github.com/alibaba/lowcode-demo/blob/main/src/universal/assets.json](https://github.com/alibaba/lowcode-demo/blob/main/src/universal/assets.json)

这份资产包里的物料是我们内部沉淀出的，用户可以通过这套资产包体验引擎提供的搭建、配置能力。
**_在项目中正常注册资产包：_**
```json
import { material } from '@alilc/lowcode-engine'
// 以任何方式引入 assets
material.setAssets(assets)
```
**_以支持调试的方式注册资产包：_**
> 这样启动并部署出来的项目，可以通过在预览地址加上 ?debug 来调试本地物料。
> 例如：
> - 通过插件初始化一个物料
> - 按照参考文章配置物料支持调试
> - 启动物料
> - 访问：[https://lowcode-engine.cn/demo?debug](https://lowcode-engine.cn/demo?debug)
>
详细参考：[https://www.yuque.com/lce/doc/ulvlkz](https://www.yuque.com/lce/doc/ulvlkz)

```javascript
import { material } from '@alilc/lowcode-engine'
import Inject, { injectAssets } from '@alilc/lowcode-plugin-inject';
await material.setAssets(await injectAssets(assets));
```

### 手工配置资产包
参考 Demo 中的[基础 Fusion Assets 定义](https://github.com/alibaba/lowcode-demo/blob/main/src/scenarios/basic-fusion/assets.json)，如果我们修改 assets.json，我们就能做到配置资产包：

- packages 对象：我们需要在其中定义这个包的获取方式，如果不定义，就不会被低代码引擎动态加载并对应上组件实例。定义方式是 UMD 的包，低代码引擎会尝试在 window 上寻找对应 library 的实例；
- components 对象：我们需要在其中定义物料描述，物料描述我们将在下一节继续讲解。
## 物料描述配置
### 什么是物料描述
在低代码平台中，用户是不同的，有可能是开发、测试、运营、设计，也有可能是销售、行政、HR 等等各种角色。他们大多数不具备专业的前端开发知识，对于低代码平台来说，我们使用组件的流程如下：

1. 用户通过拖拽/选择组件，在画布中看到组件；
2. 选中组件，出现组件的配置项；
3. 修改组件配置项；
4. 画布更新生效。

**_当我们选中一个组件，我们可以看到面板右侧会显示组件的配置项。_**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644312295732-5e0df2b5-065a-4d80-a66c-b5b20c8c32af.png#clientId=ue1d4eb8d-3b5c-4&crop=0&crop=0&crop=1&crop=1&from=url&height=535&id=ML9vP&margin=%5Bobject%20Object%5D&name=image.png&originHeight=743&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=212807&status=done&style=stroke&taskId=u2458e0f7-6bea-40d8-bb9b-9811562c6fe&title=&width=1080)
**_它包含以下内容：_**

1. 基础信息：描述组件的基础信息，通常包含包信息、组件名称、标题、描述等。
2. 组件属性信息：描述组件属性信息，通常包含参数、说明、类型、默认值 4 项内容。
3. 能力配置/体验增强：推荐用于优化搭建产品编辑体验，定制编辑能力的配置信息。

因此，我们设计了[**《中后台低代码组件描述协议》**](http://lowcode-engine.cn/material)来描述一个低代码编辑器中可被配置的内容。
### Demo 中的物料描述
我们可以从 Demo 中的 assets.json 找到如下三个物料描述：

- @alifd/pro-layout：布局组件，放在`window.AlifdProLayoutMeta`，[meta 文件地址](https://alifd.alicdn.com/npm/@alifd/pro-layout@1.0.1-beta.5/build/lowcode/meta.js)；
- @alifd/fusion-ui：精选组件，放在`window.AlifdFusionUiMeta`，[meta 文件地址](https://alifd.alicdn.com/npm/@alifd/fusion-ui@1.0.5-beta.1/build/lowcode/meta.js)；
- @alilc/lowcode-materials：原子组件，放在 `window.AlilcLowcodeMaterialsMeta`，[meta 文件地址](https://alifd.alicdn.com/npm/@alilc/lowcode-materials@1.0.1/build/lowcode/meta.js)；

**_引擎中，会尝试调用对应 meta 文件，并注入到全局：_**
```tsx
const src = 'https://alifd.alicdn.com/npm/@alifd/pro-layout@1.0.1-beta.5/build/lowcode/meta.js'
const script = document.createElement('script')
script.src = src
document.head.appendChild(script)
```
然后在 window 上就能拿到对应的物料描述内容了：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1647672326187-ec19ed1e-645a-4086-8384-ccca19b9f36c.png#clientId=uf20508c2-6786-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=648&id=ue7a84d56&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1138&originWidth=1896&originalType=binary&ratio=1&rotation=0&showTitle=false&size=582492&status=done&style=stroke&taskId=u11707d78-e1c5-4368-9de0-e98b7597815&title=&width=1080)
手工配置物料描述时，可以用这样的方式参考一下 Demo 中的物料描述是如何实现的。
### 手工配置物料描述
详见：“物料描述详解”章节。
## 物料的低代码开发
> _**注意：引擎提供的 cli 并未对 windows 系统做适配，windows 环境必须使用 **_[_**WSL**_](https://docs.microsoft.com/zh-cn/windows/wsl/install)_**，其他终端不保证能正常运行**_

您可以通过本节内容，完成一个组件在低代码编辑器中的配置和调试。
### 前言（必读）
引擎提供的物料开发脚手架内置了**_入料模块_**，初始化的时候会自动根据源码解析出一份_**低代码描述**_，但是从源码解析出来的低代码描述让用户直接使用是不够精细的，因为源码包含的信息不够，它没办法完全包含配置项的交互；
![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1650539267595-c15e6200-9747-46bf-a61d-2a635d295406.png?x-oss-process=image/format,png#clientId=u97daa023-2ae2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=856&id=u5b22ab2d&name=image.png&originHeight=1830&originWidth=802&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4406602&status=done&style=stroke&taskId=ued90eb0c-b714-401a-bbfe-9f0b04794f6&title=&width=375)
比如设计师出了上面的设计稿，这里面除了有哪些 props 可被配置，通过哪个设置器配置，还包含了 props 之间的聚合、排序，甚至有自定义 setter ，这些信息源码里是不具备的，需要在低代码描述里进行开发；
**_因此我们建议只把 cli 初始化的低代码描述作为启动，要根据用户习惯对配置项进行设计，然后人工地去开发调试直接的低代码描述。_**
### 新开发组件
#### 组件项目初始化
```json
npm init @alilc/element your-material-name
```
#### 选择组件类型
> 组件 -> <组件组织方式>

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647569723981-d0cb5f94-c137-4abf-8165-947b49595c8c.png#clientId=u6b9f3678-e2a3-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=174&id=ud7ad63de&margin=%5Bobject%20Object%5D&name=image.png&originHeight=464&originWidth=1596&originalType=binary&ratio=1&rotation=0&showTitle=false&size=298505&status=done&style=stroke&taskId=ud5e35ff9-c823-41bf-b441-db9e06a1f29&title=&width=600)
这里我们选择 react-组件库，之后便生出我们的组件库项目，目录结构如下：
```
my-materials
├── README.md
├── components  (业务组件目录）
│   ├── ExampleComponent              // 业务组件1
│   │   ├── build                     // 【编译生成】【必选】
│   │   │   └── index.html						// 【编译生成】【必选】可直接预览文件
│   │   ├── lib                       // 【编译生成】【必选】
│   │   │   ├── index.js              // 【编译生成】【必选】js 入口文件
│   │   │   ├── index.scss            // 【编译生成】【必选】css 入口文件
│   │   │   └── style.js							// 【编译生成】【必选】js 版本 css 入口文件，方便去重
│   │   ├── demo                      // 【必选】组件文档，用于生成组件开发预览，以及生成组件文档
│   │   │   └── basic.md
│   │   ├── src                       // 【必选】组件源码
│   │   │   ├── index.js              // 【必选】，组件出口文件
│   │   │   └── main.scss             // 【必选】，仅包含组件自身样式的源码文件
│   │   ├── README.md                 // 【必选】，组件说明及API
│   │   └── package.json              // 【必选】
└── └── ExampleComponent2             // 业务组件2
```
#### 组件开发与调试
```
# 安装依赖
npm install

# 启动 lowcode 环境进行调试预览
npm run lowcode:dev

# 构建低代码产物
npm run lowcode:build
```
执行上述命令后会在组件(库)根目录生成一个 `lowcode` 文件夹，里面会包含每个组件的低代码描述：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644314663918-b2464be7-a65b-447c-af2a-12ea326a7558.png#clientId=ue1d4eb8d-3b5c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=376&id=AYq7T&margin=%5Bobject%20Object%5D&name=image.png&originHeight=906&originWidth=1446&originalType=binary&ratio=1&rotation=0&showTitle=false&size=347634&status=done&style=stroke&taskId=u25ffbb86-6681-427f-b199-69a22560a9c&title=&width=600)

在 src/components 目录新增一个组件并在 src/index.tsx 中导出，然后再执行 npm run lowcode:dev 时，低代码插件会在 lowcode/<component-name\> 目录自动生成新增组件的低代码描述（meta.ts）。

用户可以直接修改低代码描述来修改组件的配置：

- 设置组件的 setter；（上一个章节介绍的设置器，也可以定制设置器用到物料中）
- 新增组件配置项
- 更改当前配置项；
#### 配置示例
隐藏一个 prop
```typescript
{
  name: 'dataSource',
  condition: () => false,
}
```
展示样式
```typescript
{
  name: 'dataSource',
  display: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry' // 常用的是 inline(默认), block、entry
}
```

#### 编辑态视图
用户可以在 lowcode/<component-name\> 目录下新增 view.tsx 来增加编辑态视图。编辑态视图用于在编辑态时展示与真实预览不一样的视图。
view.tsx 输出的也是一个 React 组件。

注意：如果是单组件，而非组件库模式的话，view.tsx 应置于 lowcode 而非 lowcode/<component-name\> 目录下


#### 发布组件
```
# 在组件根目录下，执行
$ npm publish
```
### 现存组件低代码化
组件低代码化是指，在引入低代码平台之前，我们大多数都是使用源码开发的组件，也就是 ProCode 组件。
在引入低代码平台之后，原来的源码组件是需要转化为低代码物料，这样才能在低代码平台进行消费。
所以接下来会说明，对于已有的源码组件，我们如何把它低代码化。
#### 配置低代码开发环境
在您的组件开发环境中，安装 [build-scripts](https://github.com/ice-lab/build-scripts) 和它的低代码开发插件：
```shell
npm install -D @alifd/build-plugin-lowcode @alib/build-scripts --save-dev
```
新增 build-scripts 配置文件：build.lowcode.js
```javascript
module.exports = {
  alias: {
    '@': './src',
  },
  plugins: [
    [
      "@alifd/build-plugin-lowcode",
      {
        engineScope: '@alilc',
      }
    ]
  ],
};

```
在 package.json 中定义低代码开发相关命令
```javascript
"lowcode:dev": "build-scripts start --config ./build.lowcode.js",
"lowcode:build": "build-scripts build --config ./build.lowcode.js",
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644314665584-018b6675-ca7c-4bf5-b755-15a9b629f78f.png#clientId=ue1d4eb8d-3b5c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=270&id=brUY9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=822&originWidth=1830&originalType=binary&ratio=1&rotation=0&showTitle=false&size=972113&status=done&style=stroke&taskId=u09d05c9e-cf05-417e-bf32-8268d004134&title=&width=600)
#### 开发调试
```bash
# 启动低代码开发调试环境
npm run lowcode:dev
```
组件开发形式还和原来的保持一致，但是新增了一份组件的配置文件，其中配置方式和低代码物料的配置是一样的。
#### 构建
```bash
# 构建低代码产物
npm run lowcode:build
```
#### 发布组件
```bash
# 在组件根目录下，执行
npm publish
```
## 在项目中引入组件(库)
> 以下内容可观看[《阿里巴巴低代码引擎项目实战(3)-自定义组件接入》](https://www.bilibili.com/video/BV1dZ4y1m76S/)直播回放

对于平台或者用户来说，可能所需要的组件集合是不同的。如果需要自定义组件集合，就需要定制资产包，定制的资产包是配置了一系列组件的，将这份资产包用于引擎即可在引擎中使用自定义的组件集合。
### 管理一份资产包
项目中使用的组件相关资源都需要在资产包中定义，那么我们自己开发的组件库如果要在项目中使用，只需要把组件构建好的相关资源 merge 到 assets.json 中就可以；
#### 自定义组件加入到资产包
通过官方脚手架自定义组件构建发布之后，npm 包里会出现一个 `build/lowcode/assets-prod.json`文件，我们只需要把该文件的内容 merge 到项目的 assets.json 中就可以；
#### 资产包托管

- 最简单的方式就是类似[引擎 demo 项目](https://github.com/alibaba/lowcode-demo/blob/main/src/universal/assets.json)的做法，在项目中维护一份 assets.json，新增组件或者组件版本更新都需要修改这份资产包；
- 灵活一点的做法是通过 oss 等服务维护一份远程可配置的 assets.json ，新增组件或者组件更新只需要修改这份远程的资产包，项目无需更新；
- 再高级一点的做法是实现一个资产包管理的服务，能够通过用户界面去更新资产包的内容；
### 在项目中引入资产包
```javascript
import { ILowCodePluginContext, material, plugins } from '@alilc/lowcode-engine'

// 动态加载 assets
plugins.register((ctx: ILowCodePluginContext) => {
  return {
    name: 'ext-assets',
    async init() {
      try {
        // 将下述链接替换为您的物料即可。无论是通过 utils 从物料中心引入，还是通过其他途径如直接引入物料描述
        const res = await window.fetch('https://fusion.alicdn.com/assets/default@0.1.95/assets.json')
        const assets = await res.text()
        material.setAssets(assets)
      } catch (err) {
        console.error(err)
      }
    },
  }
}).catch(err => console.error(err))
```
