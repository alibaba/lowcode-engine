---
title: React 组件导入
sidebar_position: 3
---
## 介绍
大家在使用[低代码引擎](https://lowcode-engine.cn/)构建低代码应用平台时，遇到的一个主要问题是如何让已有的 React 组件能够快速低成本地接入进来。这个问题拆解下来主要包括两个子问题：
1. 如何给已有组件[配置物料描述](/site/docs/specs/material-spec)，
2. 如何构建出一个低代码引擎能够识别的资产包 (Assets)。

我们的产品「[Parts·造物](https://parts.lowcode-engine.cn/)」可以帮助大家解决这个问题。我们通过在线可视化的方式完成物料描述配置，并且提供一键打包的功能生成引擎可以识别的资产包。

## 导入物料
首先，我们需要在 [物料管理](/site/docs/specs/material-spec) 页面导入我们需要进行在线物料描述配置的物料。
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01IyZdZf1L1VWWU3dnp_!!6000000001239-2-tps-1399-342.png)

- 点击列表左上方的 导入已有物料 按钮
- 在弹框中输入 npm 包名
- 点击 获取包信息 按钮，获取 npm 包基本信息
- 点击确定，导入成功

![image.png](https://img.alicdn.com/imgextra/i4/O1CN019FwWgs1kqgAXq5UNJ_!!6000000004735-2-tps-640-315.png)
## 配置管理
第二步：物料导入以后，我们就可以为导入的物料新增[物料描述配置](/site/docs/specs/material-spec)，点击右侧的组件配置开始配置。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01kqymdB1nkDQclPk7F_!!6000000005127-2-tps-965-261.png)
### 新增配置

- 点击配置管理右上角的 新增配置
   - 选择组件的版本号
   - 填写组件路径，一般和 npm 包的 package.json 里的 main 字段相同（如果填写错误，后面会渲染不出来）
   - 描述字段用于给这份配置增加一些备注信息。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01i78OhT1cKbVWnXRNu_!!6000000003582-2-tps-596-418.png)

为了降低配置成本，第一次新增配置的时候会自动解析组件代码，生成一份初始化组件物料描述。所以需要等待片刻，用于代码解析。解析完成后，点击配置按钮即可进入在线配置界面。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01R24mTl1tJY3oJ5DCi_!!6000000005881-2-tps-963-232.png)

### 组件描述配置
操作界面如下，接下来讲具体的配置流程

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01XjSW9I1u662raRg8E_!!6000000005987-2-tps-1438-938.png)

#### 新增组件

如果新增配置的过程中，代码自动解析失败或者解析出来的组件列表不满足开发要求，我们可以点击左侧组件列表插件 新增 按钮，添加新的组件，具体的字段描述可以参考提示内容，以 [react-color](https://github.com/casesandberg/react-color) 为例：

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01A9VFfQ1m9kH2Qliz4_!!6000000004912-2-tps-1436-1005.png)

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01klci7y1IUPflKpeVB_!!6000000000896-2-tps-1193-704.png)
#### 给组件增加物料描述

- 打开左侧 Setter 面板
- 按照组件的属性拖入需要 Setter 类型（如图中组件的 width 属性，拖入数字 Setter）
- 各种 Setter 的介绍可以参看这篇文档：[预置设置器列表](/site/docs/guide/appendix/setters)
- 配置属性的基本信息（如图所示）
- 配置完成后点击右上角的保存

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01gxLKBp1RaDEMPS54O_!!6000000002127-2-tps-1434-967.png)

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01uReCQ825yYuwIfj2J_!!6000000007595-2-tps-925-360.png)

#### 高级配置（属性联动）

举个栗子：如图所示，如果期望“设置器”这个配置项的值“被修改”的时候，下面的“默认值”跟着变化。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01bg7X571bpSZdnXTBW_!!6000000003514-2-tps-371-572.png)

如何使用

组件的属性配置目前支持 3 个基本的联动函数：

- 显示状态：返回 true | false，如果返回 true，表示组件配置显示，否则配置时不显示
- 获取值：当调用该配置节点的 getValue 方法时触发的方法
- 值变化：当调用该配置节点的 setValue 方法时触发的方法

![image.png](https://img.alicdn.com/imgextra/i3/O1CN018ZJAJO21q57TdWfjM_!!6000000007035-2-tps-316-142.png)

方法的第一个参数都是当前配置节点的对象，常用到的有以下几个：

- getValue(): 获取当前节点的值，如果当前节点是子节点的话，否则为 undefined
- setValue(): 设置当前节点的值，如果当前节点是子节点的话
- parent: 当前节点的父节点
- getPropValue(propName): 父节点获取子节点的属性值，propName 为子节点的属性名称
- setPropValue(propName, value): 父节点设置子节点的属性值，propName 为子节点的属性名称，value 为设置的值
- getConfig: 获取当前节点的配置，如 title、setter 等


#### 调试物料描述

点击右上角的预览按钮，开始调试我们刚刚配置的属性，如果是组件的首次预览，会有一段组件构建的过程（构建出 umd 包的过程），构建完成后就可以调试我们的配置了。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN012biqEn1uGAl650nb2_!!6000000006009-2-tps-1431-373.png)

#### 发布物料描述
物料描述调试没问题后，就可以到项目中去使用了，使用前需要先发布物料描述

- 点击右上角的发布按钮
- 选择需要发布的组件
- 点击确定发布完成

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01uwa8RH1QDwM7FN31k_!!6000000001943-2-tps-1431-734.png)
## 资产包
第三步：物料描述发布完成后，接下来我们就需要构建出可用的资产包用于低代码应用中。

#### 资产包构建
有两种方式可以构建资产包：
- 一种是通过 [`我的资产包`] 资产包管理模块进行整个资产包生命周期的管理，当然也包括资产包的构建，可参考 [资产包管理](./partsassets)
- 一种是通过 [`我的物料`] 组件物料管理模块的 `资产包构建` 进行构建, 具体操作如下：

  - 选择需要构建的组件
  - 点击构建资产包按钮
  - 选择刚刚的物料描述配置
  - 开始构建，构建完成后你将得到一份 json 文件（里面包含了物料描述和 umd 包），就可以到项目中使用了

#### 资产包使用
详情请参考 [资产包管理](./partsassets#使用资产包)

## 联系我们

<img src="https://img.alicdn.com/imgextra/i2/O1CN01UF88Xi1jC5SZ6m4wt_!!6000000004511-2-tps-750-967.png" width="300" />
