---
title: 研发协作流程
sidebar_position: 2
---
## 代码风格
引擎项目配置了 eslint 和 stylelint，在每次 git commit 前都会检查代码风格，假如有报错，请修改后再提交。（**严禁 -n 提交，-n 也逃脱不了 github workflow 的 lint 检查，放弃吧，骚年~**）

## 测试机制
每次提交代码前，务必本地跑一次单元测试，通过后再提交 MR。

假如涉及新的功能，需要**补充相应的单元测试**，目前引擎核心模块的单测覆盖率都在 80%+，假如降低了覆盖率，将会不予以通过。

跑单测流程：

1. 项目根目录下执行 npm run build
2. 只改了一个包，比如 designer，则在 designer 目录下，执行 npm test
3. （or）改了多个包，则在根目录下执行 npm test
## commit 风格
几点要求：

1. commit message 格式遵循 [ConvensionalCommits](https://www.conventionalcommits.org/en/v1.0.0/#summary)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1645066644352-4de1c64c-bff6-4482-90d1-1fb610aa91f2.png#averageHue=%23eceef0&clientId=u6dcee4f0-35df-4&crop=0&crop=0&crop=1&crop=1&height=297&id=CfpQy&margin=%5Bobject%20Object%5D&name=image.png&originHeight=594&originWidth=2070&originalType=binary&ratio=1&rotation=0&showTitle=false&size=341605&status=done&style=none&taskId=u4499b752-5e24-42f6-9186-280fd5a51aa&title=&width=1035)
2. 请按照一个 bugfix / feature 对应一个 commit，假如不是，请 rebase 后再提交 MR，不要一堆无用的、试验性的 commit。

好处：从引擎的整体 commit 历史来看，会很清晰，**每个 commit 完成一件确定的事，changelog 也能自动生成**。另外，假如因为某个 commit 导致了 bug，也很容易通过 rebase drop 等方式快速修复。

## 分支用途

- main 分支，最稳定的分支，跟 npm latest 包的内容保持一致
- develop 分支，开发分支，拥有最新的、已经验证过的 feature / bugfix，Pull Request 的**目标合入分支**
- release 分支
   - 正式发布分支，命名规则为 release/x.y.z，一般从 develop 拉出来进行发布，x.y.z 为待发布的版本号
   - beta 发布分支，命名规则为 release/x.y.z-beta(\.\d+)?，可以快速验证修改，发布 npm beta 版本。

验证通过后，因为 beta 发布分支上会存在无用的 commit（比如 lerna 修改 package.json 这种），所以不直接 PR 到 develop，而是从 develop 拉分支，从 beta 发布分支 cherry pick 有用的 commit 到新分支，然后 PR 到 develop。

## 引擎发布机制

日常迭代先从 develop 拉分支，然后自测、单测通过后，提交 PR 到 develop 分支，由发布负责人基于 develop 拉 release/1.0.z 分支~

### 版本规划

> 此处是理想节奏，实际情况可能会有调整

- 日常迭代 2 周，一般月中或月底
- 特殊情况紧急迭代随时发
- 大 Feature 迭代，每年 2 - 4 次


### 发布步骤
> **发布需要权限，如果提 PR 之后着急发布可以**[**加入贡献者交流群**](../participate/#核心贡献者交流)**。**

#### 发正式版
步骤如下（以发布 1.0.0 版本为例）：

1. git checkout develop
   ```bash
   git checkout develop
   ```
2. 创建 release 分支
   ```bash
   git checkout -b release/1.0.0
   ```
3. build
   ```bash
   npm run build
   ```
4. 发布到 npm
   ```bash
   npm run pub
   ```
5. 同步到 tnpm 源 & alifd CDN（此步骤将发布在 npm 源的包同步到阿里内网源，因为 alifd cdn 将依赖内网 npm 源）
   ```bash
   tnpm run sync
   ```
6. 更新[发布日志](https://github.com/alibaba/lowcode-engine/releases)
7. 合并 release/x.x.x 到 main 分支
8. 合并 main 分支到 develop 分支

如果是发布 beta 版本，步骤如下（以发布 1.0.1 版本为例）：

#### 发某版本首个 beta，如 1.0.1-beta.0
1. 拉 develop 分支
   ```bash
   git checkout develop
   ```
   更新到最新（如需）
   ```bash
   git pull
   ```
2. 拉 release 分支，此处以 1.0.1 版本做示例
   ```bash
   git checkout -b release/1.0.1-beta
   ```
3. build
   ```bash
   npm run build
   ```
4. 发布，此处需有 @alilc scope 发包权限
   ```bash
   npm run pub:prepatch
   ```
5. 同步到 tnpm 源 & alifd CDN
   ```bash
   tnpm run sync
   ```

#### 发某版本非首个 beta，如 1.0.1-beta.0 -> 1.0.1-beta.1
1. 切换到 release 分支
   ```bash
   git checkout release/1.0.1-beta
   ```
2. 更新到 develop 分支最新代码
   ```bash
   git rebase origin/develop
   ```
3. build
   ```bash
   npm run build
   ```
4. 发布，此处需有 @alilc scope 发包权限 ***此处命令与发首个 beta 时有变化***
   ```bash
   npm run pub:prerelease
   ```
5. 同步到 tnpm 源 & alifd CDN
   ```bash
   tnpm run sync
   ```



## DEMO 发布机制
1. **修改版本号**
   手动修改 package.json 的版本号
2. **build**
   ```bash
   npm run build
   ```
3. publish（此步骤需要 npm 发包权限）
   ```bash
   npm run pub
   ```
   如发 beta 版
   ```bash
   npm publish --tag beta
   ```
4. 同步到 tnpm 源 & alifd CDN
   ```bash
   tnpm run sync
   ```

**官网生效**
需要在通过阿里内部系统更新 demo 版本
