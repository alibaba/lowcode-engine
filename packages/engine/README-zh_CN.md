<p align="center">
  <a href="https://lowcode-engine.cn">
    <img width="200" src="https://img.alicdn.com/imgextra/i3/O1CN01i8K9cD1d0HU7TjDtv_!!6000000003673-2-tps-500-591.png">
  </a>
</p>

<h1 align="center">LowCodeEngine</h1>

<div align="center">

一套面向扩展设计的企业级低代码技术体系

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url]

[![Discussions][discussions-image]][discussions-url] [![][issues-helper-image]][issues-helper-url] [![Issues need help][help-wanted-image]][help-wanted-url]

[npm-image]: https://img.shields.io/npm/v/@alilc/lowcode-engine.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@alilc/lowcode-engine

[download-image]: https://img.shields.io/npm/dm/@alilc/lowcode-engine.svg?style=flat-square
[download-url]: https://npmjs.org/package/@alilc/lowcode-engine
[help-wanted-image]: https://flat.badgen.net/github/label-issues/alibaba/lowcode-engine/help%20wanted/open
[help-wanted-url]: https://github.com/alibaba/lowcode-engine/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22
[discussions-image]: https://img.shields.io/badge/discussions-on%20github-blue?style=flat-square
[discussions-url]: https://github.com/alibaba/lowcode-engine/discussions

[issues-helper-image]: https://img.shields.io/badge/using-issues--helper-orange?style=flat-square
[issues-helper-url]: https://github.com/actions-cool/issues-helper

</div>

[![](https://img.alicdn.com/imgextra/i4/O1CN01RkvLv91gv1PZtdtSv_!!6000000004203-2-tps-2878-1588.png)](https://lowcode-engine.cn)

简体中文 | [English](./README.md)

## ✨ 特性

- 🌈 提炼自企业级低代码平台的面向扩展设计的内核引擎，奉行最小内核，最强生态的设计理念
- 📦 开箱即用的高质量生态元素，包括 物料体系、设置器、插件 等
- ⚙️ 完善的工具链，支持 物料体系、设置器、插件 等生态元素的全链路研发周期
- 🔌 强大的扩展能力，已支撑近 100 个各种垂直类低代码平台
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件

## 🎯 兼容环境

- 现代浏览器（Chrome >= 80, Edge >= 80, last 2 safari versions, last 2 firefox versions）

## 📚 引擎协议

引擎完整实现了《阿里巴巴中后台前端基础搭建协议规范》和《阿里巴巴中后台前端物料协议规范》，协议栈是低代码领域的物料能否流通的关键部分。

![image](https://user-images.githubusercontent.com/1195765/150266126-fef3e3a9-d6a4-4f8e-8592-745f1a344162.png)

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
  content: YourFantaticLogo,
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
https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.0/dist/js/engine-core.js

https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.0.0/dist/js/react-simulator-renderer.js
```

#### 方式 2：unpkg
```html
https://unpkg.com/@alilc/lowcode-engine@1.0.0/dist/js/engine-core.js

https://unpkg.com/@alilc/lowcode-react-simulator-renderer@1.0.0/dist/js/react-simulator-renderer.js
```

#### 方式 3：jsdelivr
```html
https://cdn.jsdelivr.net/npm/@alilc/lowcode-engine@1.0.0/dist/js/engine-core.js

https://cdn.jsdelivr.net/npm/@alilc/lowcode-react-simulator-renderer@1.0.0/dist/js/react-simulator-renderer.js
```

#### 方式 4：使用自有 cdn
将源码中 packages/engine/dist 和 packages/(react|rax)-simulator-renderer/dist 下的文件传至你的 cdn 提供商

## 🔗 相关链接

- [官网首页](https://lowcode-engine.cn/)
- [Demo 马上玩](https://lowcode-engine.cn/demo) | [引擎 Demo 仓库](https://github.com/alibaba/lowcode-demo)
- [官方物料](https://github.com/alibaba/lowcode-materials)
- [官方设置器（setter）](https://github.com/alibaba/lowcode-engine-ext)
- [官方插件（plugin）](https://github.com/alibaba/lowcode-plugins)
- [生态元素（物料、setter、插件）工具链](https://www.yuque.com/lce/doc/ulvlkz)
- [用户文档](https://lowcode-engine.cn/docV2)
- [API](https://lowcode-engine.cn/docV2/vlmeme)

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
> 📢 node 版本限定在 14
>
> 📢 windows 环境必须使用 [WSL](https://docs.microsoft.com/zh-cn/windows/wsl/install)，其他终端不保证能正常运行

lowcode-engine 启动后，提供了几个 umd 文件，可以结合 [lowcode-demo](https://github.com/alibaba/lowcode-demo) 项目做调试，文件代理规则参考[这里](https://www.yuque.com/lce/doc/glz0fx)。

## 🤝 参与共建

请先阅读：
1. [如何配置引擎调试环境？](https://www.yuque.com/lce/doc/glz0fx)
2. [关于引擎的研发协作流程](https://www.yuque.com/lce/doc/contributing)
3. [引擎的工程化配置](https://www.yuque.com/lce/doc/gxwqg6)

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。（此段参考 [antd](https://github.com/ant-design/ant-design)）
