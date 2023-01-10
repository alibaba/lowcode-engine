---
title: React 组件导入
sidebar_position: 3
---
## 介绍
大家在使用[低代码引擎](https://lowcode-engine.cn/)构建低代码应用平台时，遇到的一个主要问题是如何让已有的 React 组件能够快速低成本地接入进来。这个问题拆解下来主要包括两个子问题：1. 如何给已有组件[配置物料描述](https://lowcode-engine.cn/material)，2. 如何构建出一个低代码引擎能够识别的资产包(Assets)。
我们的产品 「[Parts·造物](https://parts.lowcode-engine.cn/)」 可以帮助大家解决这个问题。我们通过在线可视化的方式完成物料描述配置，并且提供一键打包的功能生成引擎可以识别的资产包。

## 导入物料
首先，我们需要在 [物料管理](https://parts.lowcode-engine.cn/material#/) 页面导入我们需要进行在线物料描述配置的物料。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434800993-0fbf5ed5-63e5-492b-85ab-feafd663ad2d.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=196&id=u918deb34&margin=%5Bobject%20Object%5D&name=image.png&originHeight=342&originWidth=1399&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33102&status=done&style=stroke&taskId=u95c39b84-836c-45f8-aee6-0effc1ccfd1&title=&width=800)

- 点击列表左上方的 导入已有物料 按钮
- 在弹框中输入 npm包名
- 点击 获取包信息 按钮，获取npm包基本信息
- 点击确定，导入成功

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434801003-7bd783f0-8804-445e-b508-8601501dfa60.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u825d698a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=315&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21969&status=done&style=stroke&taskId=ued992c2e-822b-4c32-81b5-9c9add84954&title=)
## 配置管理
第二步：物料导入以后，我们就可以为导入的物料新增[物料描述配置](https://lowcode-engine.cn/material)，点击右侧的组件配置开始配置。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434801125-979e6348-b78a-47b4-bb2e-fa8f1bb4ff90.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=216&id=u7fb954eb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=261&originWidth=965&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15305&status=done&style=stroke&taskId=uc1e18ffd-fe76-4fe4-83a4-c907f308b14&title=&width=800)
### 新增配置

- 点击配置管理右上角的 新增配置
   - 选择组件的版本号
   - 填写组件路径，一般和 npm 包的 package.json 里的 main 字段相同 （如果填写错误，后面会渲染不出来）
   - 描述字段用于给这份配置增加一些备注信息。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434801095-1957da7f-5d9d-4c17-a762-c576bf0f763f.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=380&id=u9ad0ec47&margin=%5Bobject%20Object%5D&name=image.png&originHeight=418&originWidth=596&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26130&status=done&style=stroke&taskId=u2b592498-195a-4fec-9853-ec5c3b95ef7&title=&width=541.8181700745893)
为了降低配置成本，第一次新增配置的时候会自动解析组件代码，生成一份初始化组件物料描述。所以需要等待片刻，用于代码解析。解析完成后，点击配置按钮即可进入在线配置界面。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434801053-1a48b598-e987-4cd5-b657-030d345e0a99.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=193&id=ud384a13d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=232&originWidth=963&originalType=binary&ratio=1&rotation=0&showTitle=false&size=23541&status=done&style=stroke&taskId=ud2efc4d3-6d52-4b77-adbd-14dd5ee4b11&title=&width=800)
### 组件描述配置
操作界面如下，接下来讲具体的配置流程
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434802081-6546d0f5-19da-475e-8dec-93ea324cc4e3.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=522&id=uf73c4753&margin=%5Bobject%20Object%5D&name=image.png&originHeight=938&originWidth=1438&originalType=binary&ratio=1&rotation=0&showTitle=false&size=111984&status=done&style=stroke&taskId=u0ce37d2b-8ca3-48b5-ac67-8fb461d17b5&title=&width=800)
#### 新增组件
如果新增配置的过程中，代码自动解析失败或者解析出来的组件列表不满足开发要求，我们可以点击左侧组件列表插件 新增 按钮，添加新的组件，具体的字段描述可以参考提示内容，以 [react-color](https://github.com/casesandberg/react-color) 为例：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434802087-eaf4e2f1-2028-4415-b696-9788a6b2d0ed.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=560&id=u4341eb1b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1005&originWidth=1436&originalType=binary&ratio=1&rotation=0&showTitle=false&size=147918&status=done&style=stroke&taskId=ud921b52d-1961-4be9-b4ec-77d6364b213&title=&width=800)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434802555-bbd14a55-89a6-42cd-a4b3-76c98febf00c.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=472&id=u06e0b78f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=704&originWidth=1193&originalType=binary&ratio=1&rotation=0&showTitle=false&size=240470&status=done&style=stroke&taskId=u77603c5d-9d14-4379-86d2-deb4deaba50&title=&width=800)
#### 给组件增加物料描述
选中刚刚新增的BlockPicker组件，然后给它增加描述：

- 打开左侧 Setter 面板
- 按照组件的属性拖入需要 Setter 类型 （如图中组件的width属性，拖入数字Setter）
- 各种 Setter 的介绍可以参看这篇文档：[https://www.yuque.com/lce/doc/grfylu](https://www.yuque.com/lce/doc/grfylu)
- 配置属性的基本信息（如图所示）
- 配置完成后点击右上角的保存

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434802458-b0fb8a0e-307e-458c-a9f9-af3d2697024c.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=539&id=udeb647da&margin=%5Bobject%20Object%5D&name=image.png&originHeight=967&originWidth=1434&originalType=binary&ratio=1&rotation=0&showTitle=false&size=158958&status=done&style=stroke&taskId=u2950484f-659b-4643-af5e-75d04f14346&title=&width=800)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434802443-cdc533bf-1b08-4c11-b3d2-7cfd7fe0a5dd.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=311&id=uaaaa88fb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=360&originWidth=925&originalType=binary&ratio=1&rotation=0&showTitle=false&size=64587&status=done&style=stroke&taskId=u7139e8ef-eee3-468b-833c-a42d8f3cb56&title=&width=800)
#### 高级配置（属性联动）
举个栗子：如图所示，如果期望 “设置器” 这个配置项的值 “被修改”的时候，下面的 “默认值” 跟着变化。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434803379-009a9783-ec24-4a08-8a46-55ae775ce7ba.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=520&id=u005ad05e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=572&originWidth=371&originalType=binary&ratio=1&rotation=0&showTitle=false&size=96588&status=done&style=stroke&taskId=u97330f9d-6728-4a05-a842-55df114ccee&title=&width=337.27271996253796)
如何使用
组件的属性配置目前支持3个基本的联动函数：

- 显示状态：返回true | false，如果返回true，表示组件配置显示，否则配置时不显示
- 获取值：当调用该配置节点的getValue方法时触发的方法
- 值变化：当调用该配置节点的setValue方法时触发的方法

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434803522-85aed489-4e00-4787-a496-54cc73e25bc5.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=129&id=u0a782260&margin=%5Bobject%20Object%5D&name=image.png&originHeight=142&originWidth=316&originalType=binary&ratio=1&rotation=0&showTitle=false&size=29086&status=done&style=stroke&taskId=u95864da5-4ccf-4e4b-b903-1ce26af4f66&title=&width=287.2727210462587)
方法的第一个参数都是当前配置节点的对象，常用到的有以下几个：

- getValue(): 获取当前节点的值，如果当前节点是子节点的话，否则为undefined
- setValue(): 设置当前节点的值，如果当前节点是子节点的话
- parent: 当前节点的父节点
- getPropValue(propName): 父节点获取子节点的属性值，propName为子节点的属性名称
- setPropValue(propName, value): 父节点设置子节点的属性值，propName为子节点的属性名称, value 为设置的值
- getConfig: 获取当前节点的配置，如title、setter等
#### 调试物料描述
点击右上角的预览按钮，开始调试我们刚刚配置的属性，如果是组件的首次预览，会有一段组件构建的过程（构建出umd包的过程），构建完成后就可以调试我们的配置了。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434804408-717e49bd-26b3-4a28-b3e5-bd1d67cdab00.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=209&id=ucf92cc3e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=373&originWidth=1431&originalType=binary&ratio=1&rotation=0&showTitle=false&size=46363&status=done&style=stroke&taskId=u501edca5-bbef-4fde-b341-b42c28b125a&title=&width=800)
#### 发布物料描述
物料描述调试没问题后，就可以到项目中去使用了，使用前需要先发布物料描述

- 点击右上角的发布按钮
- 选择需要发布的组件
- 点击确定发布完成

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434804305-276f03e2-4dd2-41e9-9375-1c3bd0c7092a.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=410&id=uf879e7fd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=734&originWidth=1431&originalType=binary&ratio=1&rotation=0&showTitle=false&size=103858&status=done&style=stroke&taskId=udc267585-ffb7-4247-b1f5-b7aca386e10&title=&width=800)
## 资产包
第三步：物料描述发布完成后，接下来我们就需要构建出可用的资产包用于低代码应用中。
#### 资产包构建
有两种方式可以构建资产包:
- 一种是通过 [`我的资产包`] 资产包管理模块进行整个资产包生命周期的管理，当然也包括资产包的构建，可参考 [资产包管理](./partsassets)
- 一种是通过 [`我的物料`] 组件物料管理模块的 `资产包构建` 进行构建, 具体操作如下：

  - 选择需要构建的组件
  - 点击构建资产包按钮
  - 选择刚刚的物料描述配置
  - 开始构建，构建完成后你将得到一份json文件（里面包含了物料描述和umd包），就可以到项目中使用了

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12718919/1652434804769-6f6f60f1-9ee3-4561-972d-610f0616576e.png#clientId=u0f780a28-b8dc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=430&id=ue119fa2b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=770&originWidth=1431&originalType=binary&ratio=1&rotation=0&showTitle=false&size=93492&status=done&style=stroke&taskId=ubfd97421-964b-4823-adc8-b056a588924&title=&width=800)
#### 资产包使用
详情请参考 [资产包管理](./partsassets#使用资产包)

## 联系我们

<img src="https://img.alicdn.com/imgextra/i2/O1CN01UF88Xi1jC5SZ6m4wt_!!6000000004511-2-tps-750-967.png" width="300" />
