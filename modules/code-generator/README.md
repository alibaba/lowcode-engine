# 出码

所谓出码，即将低代码编排出的 schema 进行解析并转换成最终可执行的代码的过程。本模块提供有 Icejs 和 Rax 两套框架的出码方案，并提供了强大而灵活的扩展机制。

## 使用方法

### 1) 通过命令行快速体验

欢迎使用命令行工具快速体验：`npx @alilc/lowcode-code-generator -i example-schema.json -o generated -s icejs`

--其中 example-schema.json 可以从[这里下载](https://unpkg.com/@alilc/lowcode-code-generator@beta/example-schema.json)

### 2) 通过设计器插件快速体验

1. 安装依赖: `npm install --save @alilc/lowcode-plugin-code-generator`
2. 注册插件:

```ts
import { plugins } from '@alilc/lowcode-engine';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';

// 在你的初始化函数中：
await plugins.register(CodeGenPlugin);

// 如果您不希望自动加上出码按钮，则可以这样注册
await plugins.register(CodeGenPlugin, { disableCodeGenActionBtn: true });
```

然后运行你的低代码编辑器项目即可 -- 在设计器的右上角会出现一个“出码”按钮，点击即可在浏览器中出码并预览。

### 3）服务端出码接入

此代码生成器一开始就是为服务端出码设计的，你可以直接这样来在 node.js 环境中使用：

1. 安装依赖: `npm install --save @alilc/lowcode-code-generator`
2. 引入代码生成器:

```js
import CodeGenerator from '@alilc/lowcode-code-generator';
```

3. 创建项目构建器:

```js
const projectBuilder = CodeGenerator.solutions.icejs();
```

4. 生成代码

```js
const project = await projectBuilder.generateProject(
  schema, // 编排搭建出来的 schema
);
```

5. 将生成的代码写入到磁盘中(也可以生成一个 zip 包)

```js
// 写入磁盘
await CodeGenerator.publishers.disk().publish({
  project, // 上一步生成的 project
  outputPath: '/path/to/your/output/dir', // 输出目录
  projectSlug: 'your-project-slug', // 项目标识
});

// 写入到 zip 包
await CodeGenerator.publishers.zip().publish({
  project, // 上一步生成的 project
  outputPath: '/path/to/your/output/dir', // 输出目录
  projectSlug: 'your-project-slug', // 项目标识 -- 对应生成 your-project-slug.zip 文件
});
```

注：一般来说在服务端出码可以跟 github/gitlab, CI 和 CD 流程等一起串起来使用，通常用于优化性能。

### 4）浏览器中出码接入

随着现在电脑性能和浏览器技术的发展，出码其实已经不必非得在服务端做了，借助于 Web Worker 特性，可以在浏览器中进行出码：

1. 安装依赖: `npm install --save @alilc/lowcode-code-generator`
2. 引入代码生成器:

```js
import * as CodeGenerator from '@alilc/lowcode-code-generator/standalone-loader';
```

3. 【可选】提前初始化代码生成器:

```js
// 提前初始化下，这样后面用的时候更快(这个 init 内部会提前准备好创建 worker 的一些资源)
await CodeGenerator.init();
```

4. 出码

```js
const project = await CodeGenerator.generateCode({
  solution: 'icejs', // 出码方案 (目前内置有 icejs 和 rax )
  schema, // 编排搭建出来的 schema
});

console.log(project); // 出码结果(默认是递归结构描述的，可以传 flattenResult: true 以生成扁平结构的结果)
```

注：一般来说在浏览器中出码适合做即时预览功能。

5. 下载 zip 包

```js
// 写入到 zip 包
await CodeGenerator.publishers.zip().publish({
  project, // 上一步生成的 project
  projectSlug: 'your-project-slug', // 项目标识 -- 对应下载 your-project-slug.zip 文件
});
```

### 5）自定义出码

前端框架灵活多变，默认内置的出码方案很难满足所有人的需求，好在此代码生成器支持非常灵活的插件机制 -- 欢迎参考 ./src/plugins/xxx 来编写您自己的出码插件，然后参考 ./src/solutions/xxx 将各种插件组合成一套适合您的业务场景的出码方案。

## 参与共建

欢迎参与共建，如何共建请参阅：[./CONTRIBUTING.md](https://github.com/alibaba/lowcode-engine/blob/main/modules/code-generator/CONTRIBUTING.md)
