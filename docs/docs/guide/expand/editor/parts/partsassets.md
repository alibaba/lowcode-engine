---
title: 资产包管理
sidebar_position: 4
---

## 介绍

通过前述介绍，相信大家已经了解如何使用 「[Parts·造物](https://parts.lowcode-engine.cn/)」 来将已有的 React 组件快速接入低代码引擎，以及生产低代码组件。

大家在使用的过程中，可能会希望构建出来的资产包可以后续随时访问下载，或者希望构建资产包时各个组件的版本等信息可以持久化起来并且能够多人维护。

通过「[Parts·造物](https://parts.lowcode-engine.cn/)」的 `资产包` 管理功能帮助大家解决这个问题

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01Fkaznh1zWj9wYKpcH_!!6000000006722-2-tps-1702-628.png)

## 新建资产包

首先，我们在 我的资产包 tab 中点击 `新建资产包`
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01qe8zfO1ilysebSfD5_!!6000000004454-2-tps-3064-1432.png)

- 填写资产包名称
- 配置资产包管理员，管理员拥有该资产包的所有权限，初始默认为资产包的创建者，还可以添加其他人作为管理员，
- 配置资产包描述(可选)
- 点击 `确定`, 即可完成资产包的创建

接下来需要为资产包添加一个或者多个组件。

## 添加组件

第二步：新建完资产包以后，我们就可以为其添加组件了，如果是新建资产包流程，新建完成之后会自动弹出组件配置的弹窗，当然，你可可以通过点击资产包卡片的方式打开组件配置的弹窗。
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01kqymdB1nkDQclPk7F_!!6000000005127-2-tps-965-261.png)

- 点击弹窗中 `添加组件` 按钮，在弹出的组件选择面板中，选中需要添加的组件并点击 `下一步`。
  ![image.png](https://img.alicdn.com/imgextra/i1/O1CN014Baihf1r742Qi1Wel_!!6000000005583-2-tps-1856-1520.png)
- 进入组件版本以及描述协议版本选择界面，选择所需要的正确版本，点击 `安装` 即可完成一个组件的添加。
  ![image.png](https://img.alicdn.com/imgextra/i2/O1CN01Y7aWWi1MMPDVlidgz_!!6000000001420-2-tps-1668-1462.png)

## 构建资产包

添加完组件以后就点击 `保存并构建资产包` 进入资产包构建配置弹窗
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01iZf4Ue1PlXnyKYxnK_!!6000000001881-2-tps-1288-670.png)

- `开启缓存` : 可充分利用之前的构建结果缓存来加速资产包的生成，我们会将每个组件的构建结果以 包名和版本号为 key 进行缓存。
- `任务描述` : 当前构建任务的一些描述信息。

点击 `确认` 按钮 会自动跳转到当前资产包的构建历史界面:
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01krDaFc1TuTztMPssI_!!6000000002442-2-tps-1726-696.png)
构建历史界面会显示当前资产包所有的构建历史记录，表格状态栏展示了构建的状态：`成功`,`失败`,`正在运行` 三种状态， 操作列可以在构建成功时复制或者下载资产包结果

## 使用资产包

在 [**lowcode-demo**](https://github.com/alibaba/lowcode-demo)**中直接引用，可直接替换 demo 中原来的资产包文件：**

例如，在 basic-fusion 或者 lowcode-component demo 中，直接用你的资产包文件替换文件[assets.json](https://github.com/alibaba/lowcode-demo/blob/main/demo-basic-fusion/src/services/assets.json)，即可快速使用自己的物料了。

### 在编辑器中使用资产包
在使用含有低代码组件的资产包注意 注意引擎版本必须大于等于 `1.1.0-beta.9`。
### 在预览中使用资产包
在预览中使用资产包的整体思路是从 `资产包` 中提取并转换出 `ReactRenderer` 渲染所需要的 react 组件列表(`components` 参数)，然后将 `schema` 以及 `components` 传入到 `ReactRenderer` 中进行渲染，需要注意的是，在 `资产包` 的转换过程中，我们也需要将 `低代码组件` 转换成 react 组件， 具体逻辑可以参考下 `demo-lowcode-component` 中 `src/parse-assets.ts` 文件的实现。


## 联系我们

<img src="https://img.alicdn.com/imgextra/i2/O1CN01UF88Xi1jC5SZ6m4wt_!!6000000004511-2-tps-750-967.png" width="300" />