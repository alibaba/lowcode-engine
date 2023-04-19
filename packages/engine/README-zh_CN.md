<p align="center">
  <a href="https://lowcode-engine.cn">
    <img width="200" src="https://img.alicdn.com/imgextra/i3/O1CN01i8K9cD1d0HU7TjDtv_!!6000000003673-2-tps-500-591.png">
  </a>
</p>

<h1 align="center">LowCodeEngine</h1>

<div align="center">

一套面向扩展设计的企业级低代码技术体系

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url]

[![][issues-helper-image]][issues-helper-url] [![Issues need help][help-wanted-image]][help-wanted-url]

[![codecov][codecov-image-url]][codecov-url] [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/lowcode-workspace/awesome-lowcode-engine)

[![](https://img.shields.io/badge/LowCodeEngine-%E6%9F%A5%E7%9C%8B%E8%B4%A1%E7%8C%AE%E6%8E%92%E8%A1%8C%E6%A6%9C-orange)](https://opensource.alibaba.com/contribution_leaderboard/details?projectValue=lowcode-engine)

[npm-image]: https://img.shields.io/npm/v/@alilc/lowcode-engine.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@alilc/lowcode-engine

[download-image]: https://img.shields.io/npm/dm/@alilc/lowcode-engine.svg?style=flat-square
[download-url]: https://npmjs.org/package/@alilc/lowcode-engine
[help-wanted-image]: https://flat.badgen.net/github/label-issues/alibaba/lowcode-engine/help%20wanted/open
[help-wanted-url]: https://github.com/alibaba/lowcode-engine/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22

[issues-helper-image]: https://img.shields.io/badge/using-issues--helper-orange?style=flat-square
[issues-helper-url]: https://github.com/actions-cool/issues-helper

[codecov-image-url]: https://codecov.io/gh/alibaba/lowcode-engine/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/alibaba/lowcode-engine

</div>

[![](https://img.alicdn.com/imgextra/i2/O1CN01UhoS7C1sNNhySvfWi_!!6000000005754-2-tps-2878-1588.png)](https://lowcode-engine.cn)

简体中文 | [English](./README.md)

## ✨ 特性

- 🌈 提炼自企业级低代码平台的面向扩展设计的内核引擎，奉行最小内核，最强生态的设计理念
- 📦 开箱即用的高质量生态元素，包括 物料体系、设置器、插件 等
- ⚙️ 完善的工具链，支持 物料体系、设置器、插件 等生态元素的全链路研发周期
- 🔌 强大的扩展能力，已支撑 100+ 个各种类型低代码平台
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件

## 🎯 兼容环境

- 现代浏览器（Chrome >= 80, Edge >= 80, last 2 safari versions, last 2 firefox versions）

## 📚 引擎协议

引擎完整实现了《低代码引擎搭建协议规范》和《低代码引擎物料协议规范》，协议栈是低代码领域的物料能否流通的关键部分。

![image](https://img.alicdn.com/imgextra/i3/O1CN01IisBcy1dNBIg16QFM_!!6000000003723-2-tps-1916-1070.png)

## 🌰 使用示例

```bash
npm install @alilc/lowcode-engine --save-dev
```

> **TIPS：仅支持 cdn 方式引入，npm 包用于提供 typings 等代码提示能力**

```ts
import { init, skeleton } from '@alilc/lowcode-engine';

skeleton.add({
  area: 'topArea',
  type: 'Widget',
  name: 'logo',
  content: YourFantasticLogo,
  contentProps: {
    logo:
      'https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png',
    href: '/',
  },
  props: {
    align: 'left',
    width: 100,
  },
});

init(document.getElementById('lce'));
```

### 工程化配置：
```json
{
  "externals": {
    "@alilc/lowcode-engine": "var window.AliLowCodeEngine",
    "@alilc/lowcode-engine-ext": "var window.AliLowCodeEngineExt"
  }
}
```

### cdn 可选方式：
#### 方式 1（推荐）：alifd cdn
```html
https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.18/dist/js/engine-core.js

https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/js/react-simulator-renderer.js
```

#### 方式 2（推荐）：uipaas cdn
```html
https://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/1.0.18/dist/js/engine-core.js

https://uipaas-assets.com/prod/npm/@alilc/lowcode-react-simulator-renderer/1.0.18/dist/js/react-simulator-renderer.js
```

#### 方式 3：unpkg
```html
https://unpkg.com/@alilc/lowcode-engine@1.0.18/dist/js/engine-core.js

https://unpkg.com/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/js/react-simulator-renderer.js
```

#### 方式 4：jsdelivr
```html
https://cdn.jsdelivr.net/npm/@alilc/lowcode-engine@1.0.18/dist/js/engine-core.js

https://cdn.jsdelivr.net/npm/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/js/react-simulator-renderer.js
```

#### 方式 5：使用自有 cdn
将源码中 packages/engine/dist 和 packages/(react|rax)-simulator-renderer/dist 下的文件传至你的 cdn 提供商

## 🔗 相关链接

- [官网首页](https://lowcode-engine.cn/)
- [Demo 马上玩](https://lowcode-engine.cn/demo) | [引擎 Demo 仓库](https://github.com/alibaba/lowcode-demo)
- [官方物料](https://github.com/alibaba/lowcode-materials)
- [官方设置器（setter）](https://github.com/alibaba/lowcode-engine-ext)
- [官方插件（plugin）](https://github.com/alibaba/lowcode-plugins)
- [生态元素（物料、setter、插件）工具链](https://lowcode-engine.cn/site/docs/guide/expand/editor/cli)
- [用户文档](https://lowcode-engine.cn/doc)
- [API](https://lowcode-engine.cn/site/docs/api/)

[awesome-lowcode-engine](https://github.com/lowcode-workspace/awesome-lowcode-engine) 中包含了一系列围绕引擎建设的工具、解决方案等，如果你有类似的解决方案或者工具，欢迎提 PR 到该仓库，让更多人了解到

## 💻 本地调试

```bash
$ git clone git@github.com:alibaba/lowcode-engine.git
$ cd lowcode-engine
$ npm install
$ npm run setup
$ npm start
```

> 📢 npm 访问速度较慢，阿里员工可以使用 tnpm，其他同学建议使用 cnpm 或者指定镜像 registry。
>
> 📢 windows 环境必须使用 [WSL](https://docs.microsoft.com/zh-cn/windows/wsl/install)，其他终端不保证能正常运行

lowcode-engine 启动后，提供了几个 umd 文件，可以结合 [lowcode-demo](https://github.com/alibaba/lowcode-demo) 项目做调试，文件代理规则参考[这里](https://lowcode-engine.cn/site/docs/participate/prepare#2-配置资源代理)。

## 🤝 参与共建

请先阅读：
1. [如何配置引擎调试环境？](https://lowcode-engine.cn/site/docs/participate/prepare)
2. [关于引擎的研发协作流程](https://lowcode-engine.cn/site/docs/participate/flow)
3. [引擎的工程化配置](https://lowcode-engine.cn/site/docs/participate/config)

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。（此段参考 [antd](https://github.com/ant-design/ant-design)）

关于提交 PR：
请将目标合并分支设置为 **develop**，不要指定 **main** 分支，在发布正式版本后，develop 分支将会合入 main 分支。

## ❤️ 致谢

感谢所有为引擎项目贡献力量的同学们~

<p>
<a href="https://github.com/alibaba/lowcode-engine/graphs/contributors"><img src="https://contrib.rocks/image?repo=alibaba/lowcode-engine" /></a>
</p>
