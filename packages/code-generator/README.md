# 出码模块

**重要！！！ 本模块是 Node 端运行的！本模块是 Node 端运行的！本模块是 Node 端运行的！暂不支持 Web 端直接跑。**
如果有业务诉求需要在 Web 端运行，可以联系 @春希(armslave.yy)，会在架构组讨论优先度。

详细介绍看这里：[出码模块 语雀文档](https://yuque.antfin.com/docs/share/2b342641-6e01-4c77-b8e0-30421f55f69b)

## 安装接入

## 自定义导出

## 开始开发

本项目隶属于 [ali-lowcode-engine](http://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine), 需要和整个 [ali-lowcode-engine](http://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine) 一起开发。

所以先要初始化整个 [ali-lowcode-engine](http://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine) 的环境：

1. 克隆 [ali-lowcode-engine](http://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine): `git clone git@gitlab.alibaba-inc.com:ali-lowcode/ali-lowcode-engine.git`
2. 运行 `setup` 脚本，初始化环境： `npm run setup`

然后，因为本项目依赖 `@ali/lowcode-types` 所以需要先构建下 `type`，即执行: `lerna run build --scope @ali/lowcode-types`

最后，可以运行 `npm start` 命令启动本地调试（本项目通过 `ava` 进行单元测试，故 `start` 脚本其实就是 `watch` 模式的 `ava`):

```sh
# 到本项目目录下执行：（推荐）
npm start

# 或直接执行 ava：
npx ava --watch

# 或在 ali-lowcode-engine 工程根目录下执行: (不推荐，因为命令太长而且没法响应输入)
lerna run start --stream --scope @ali/lowcode-code-generator
```
