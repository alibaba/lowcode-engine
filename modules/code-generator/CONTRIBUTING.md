# 如何共建

1. 拉取最新代码，切换到 develop 分支，基于 develop 分支切出一个 feature 或 hotfix 分支
2. 到 `lowcode-engine` 项目根目录下，执行 `lerna bootstrap && lerna run build --scope "@alilc/lowcode-types"` 来安装依赖并构建
3. 到 `lowcode-engine/modules/code-generator`下，安装依赖(`npm i`)，然后先跑一遍 `npm test` 看看是否所有用例都能通过 (如果网络条件不太好，建议使用 [cnpm - 淘宝提供的中国 NPM 镜像](https://npmmirror.com/))
4. 在 tests 目录下编写您的需求/问题的测试用例
5. 修改 src 下的一些代码，然后运行 `npm test` 或 `npm start` 启动 jest 进行调测
6. 确保所有的测试用例都能通过时，提 MR 给 @牧毅 -- MR 将在 1 个工作日内给您回复意见。

当然，欢迎提前私聊沟通 @牧毅，或加入 低代码渲染/出码服务金牌用户群 讨论沟通。

# FAQ

## 如何查看单测覆盖率？

执行 `npm test:cov` 命令，这样会自动生成单测覆盖率的报告到 `coverage` 目录下。

## 如何只执行一个测试用例？

```sh
npm test -t 'demo2-utils-name-alias'
```

## 更新特定测试用例的 expected:

```sh
npm test:update-snapshots -t 'demo2-utils-name-alias'
```

## 如何只执行某个测试用例文件？

执行 `npx jest 测试用例的文件路径` 即可，如:

```sh
npx jest tests/plugins/common/requireUtils.test.ts
```

## 如何调试某个测试用例？

建议需要打断点的地方通过 VSCode 打上断点，然后打开 VSCode 的 JavaScript Debug Terminal，在其中执行 `npx jest tests/path/to/your/test/file.ts` 或 `npx jest -t your-test-case-title` 来执行你的测试用例 -- 这样执行到打了断点的语句时会自动断住，以便调试。
