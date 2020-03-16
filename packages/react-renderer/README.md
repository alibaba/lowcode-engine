# iceluna-sdk

> iceluna 底层引擎渲染能力。

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Develop](#Develop)
- [Structure](#Structure)
- [Publish](#Publish)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background
iceluna 是由淘系技术部研发，面向中后台应用低代码搭建的通用解决方案，集前端应用工程创建、开发、调试及发布的全链路一体化的低代码搭建平台。同时，基于集团中后台 《搭建基础协议》 和 《物料协议》 标准之上，生产低代码搭建物料，沉淀搭建基础设施，助力上层不同业务领域 孵化低代码搭建产品，目标 打造成为基于集团标准的低代码搭建中台。

iceluna 代码整个项目结构如下图。
![iceluna代码仓库结构](https://img.alicdn.com/tfs/TB1KJThsHr1gK0jSZR0XXbP8XXa-660-322.png)

该项目 iceluna-SDK 为 iceluna 通用解决方案的提供最底层，最核心的渲染引擎能力。为 iceluna 体系上层可视化编辑器提供基础引擎能力。

## Install

```sh
# 前提：tnpm install @ali/iceluna-cli -g
tnpm i
```

## Develop
1. 执行 `tnpm link`, 在全局建立符号链接。
2. 到[IDE项目](http://gitlab.alibaba-inc.com/iceluna/iceluna-IDE)启动前，执行 `tnpm link @ali/iceluna-sdk`，建立连接。
3. 按照 `iceluna-IDE` 方式调试

## Structure
```
.
└── src
    ├── comp
    ├── context
    ├── engine
    ├── hoc
    ├── utils
```

## Publish

## Maintainers

[@月飞](dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=qhkv9cp), [@下羊](dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=r93lhx4)

## Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.


## License

MIT © 2019 
