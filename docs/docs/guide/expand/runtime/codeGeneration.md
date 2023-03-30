---
title: 使用出码功能
sidebar_position: 1
---

## 出码简述
所谓出码，即将低代码编排出的 schema 进行解析并转换成最终可执行的代码的过程。
## 出码的适用范围
出码是为了更高效的运行和更灵活地定制渲染，相对而言，基于 Schema 的运行时渲染，有着能实时响应内容的变化和接入成本低的优点，但是也存在着实时解析运行的性能开销比较大和包大小比较大的问题，而且无法自由地进行扩展二次开发，功能自由度受到一定程度限制。
当然，出码也会存在一些限制：一方面需要额外的接入成本，另一方面通常需要额外的生成代码和打包构建的时间，难以做到基于 Schema 的运行时渲染那样保存即预览的效果。

所以不是所有场景都建议做出码，一般来说以下 3 个场景可以考虑使用出码进行优化。

### 场景一：想要极致的打开速度，降低 LCP/FID
这种场景比较常见的是 C 端应用，比如手淘上的页面和手机钉钉上的页面，要求能够尽快得响应用户操作，不要出现卡死的情况。当一个流入协议大小比较大的时候，前端进行解析时的开销也比较大。如果能把这部分负担转移到编译时去完成的话，前端依赖包大小就会减少许多。从而也提升了加载速度，降低了带宽消耗。页面越简单，这其中的 gap 就会越明显。

### 场景二：老项目 + 新需求，想用搭建产出
这是一个很常见的场景，毕竟迁移或者重构都是有一个过程的，阿里的业务都是一边跑一边换发动机。在这种场景中，我们不可能要求使用运行时方案来做实现，因为运行时是一个项目级别的能力，最好是项目中统一使用他这一种方式，保证体验的一致性与连贯性。所以我们可以只在低代码平台上搭建新的业务页面，然后通过出码模块导出这些页面的源码，连同一些全局依赖模块，一起 Merge 到老项目中。完成开发体验的优化。

### 场景三：协议不能描述部分代码逻辑（协议功能不足或特别定制化的逻辑）
当我们发现一些逻辑诉求不能在目前协议中很好地表达的时候，这其实是项目复杂度较高的一个信号。比较好的方式就是将低代码研发和源码研发结合起来。这种模式下最大的诉求点之一就是，需要将搭建的内容输出为可读性和确定性都比较良好的代码模块。这也就是出码模块需要支持好的使用场景了。

## 如何使用
### 1) 通过命令行快速体验

欢迎使用命令行工具快速体验：`npx @alilc/lowcode-code-generator -i example-schema.json -o generated -s icejs3`

--其中 example-schema.json 可以从[这里下载](https://alifd.alicdn.com/npm/@alilc/lowcode-code-generator@latest/example-schema.json)

### 2) 通过设计器插件快速体验

1. 安装依赖： `npm install --save @alilc/lowcode-plugin-code-generator`
2. 注册插件：

```typescript
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

1. 安装依赖： `npm install --save @alilc/lowcode-code-generator`
2. 引入代码生成器：

```javascript
import CodeGenerator from '@alilc/lowcode-code-generator';
```

3. 创建项目构建器：

```javascript
const projectBuilder = CodeGenerator.solutions.icejs();
```

4. 生成代码

```javascript
const project = await projectBuilder.generateProject(
  schema, // 编排搭建出来的 schema
);
```

5. 将生成的代码写入到磁盘中 (也可以生成一个 zip 包)

```javascript
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

1. 安装依赖： `npm install --save @alilc/lowcode-code-generator`
2. 引入代码生成器：

```javascript
import * as CodeGenerator from '@alilc/lowcode-code-generator/standalone-loader';
```

3. 【可选】提前初始化代码生成器：

```javascript
// 提前初始化下，这样后面用的时候更快 (这个 init 内部会提前准备好创建 worker 的一些资源)
await CodeGenerator.init();
```

4. 出码

```javascript
const result = await CodeGenerator.generateCode({
  solution: 'icejs', // 出码方案 (目前内置有 icejs、icejs3 和 rax )
  schema, // 编排搭建出来的 schema
});

console.log(result); // 出码结果 (默认是递归结构描述的，可以传 flattenResult: true 以生成扁平结构的结果)
```

注：一般来说在浏览器中出码适合做即时预览功能。

### 5）自定义出码
前端框架灵活多变，默认内置的出码方案很难满足所有人的需求，好在此代码生成器支持非常灵活的插件机制 -- 内置功能大多都是通过插件完成的（在 `src/plugins`下），比如：
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01CEl2Hq1omnH0UCyGF_!!6000000005268-2-tps-457-376.png)

所以您可以通过添加自己的插件或替换掉默认内置的插件来实现您的自定义功能。
为了方便自定义出码方案，出码模块还提供自定义出码方案的脚手架功能，即执行下面脚本即可生成一个自定义出码方案：
```shell
npx @alilc/lowcode-code-generator init-solution <your-solution-name>
```
里面内置了一个示例的插件 (在 `src/plugins/example.ts`中)，您可以根据注释引导来完善相关插件，从而组合生成您的专属出码方案 (`src/index.ts`)。您所生成的出码方案可以发布成 NPM 包，从而能按上文 1~4 中的使用方案进行使用。
