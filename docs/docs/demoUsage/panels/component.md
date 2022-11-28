---
title: 4. 组件面板详解
sidebar_position: 0
---
## 概述
组件面板顾名思义就是承载组件的面板，组件面板会获取并解析传入给低代码引擎的资产包数据(数据结构[点此查看](https://lowcode-engine.cn/assets))，得到需要被展示的组件列表，并根据分类、排序规则对组件进行排列，同时也提供了搜索功能。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647964501932-33676243-c42b-4e7c-8663-77c5898d3343.png#clientId=uf38e3cbf-9388-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=438&id=ubb9e4616&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1672&originWidth=3056&originalType=binary&ratio=1&rotation=0&showTitle=true&size=451947&status=done&style=stroke&taskId=u0fc240e1-a792-4bd1-b84d-5bbc8e8fc8b&title=%E7%BB%84%E4%BB%B6%E9%9D%A2%E6%9D%BF&width=800 "组件面板")
## 组件信息
组件面板承载的组件信息有：

- 组件标题；
- 组件截图；
- 组件低代码 schema 片段；
- 组件分组；
- 组件分类；
- 是否隐藏组件；
- 关键词：关键词用于搜索，会聚合 name、title、description、keywords 等字段作为搜索匹配的目标；

其中标题和截图是我们能够看到的，schema 片段则是拖拽到设计器时会自动插入页面 schema 中，面板会根据分组、分类来对组件进行排列；
这些组件信息均通过资产包数据获取，字段对应关系如下图所示：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647965256061-d15ad119-471f-43c7-8856-2c91bb3670ad.png#clientId=uf38e3cbf-9388-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1012&id=u1b3132db&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1678&originWidth=1326&originalType=binary&ratio=1&rotation=0&showTitle=false&size=996705&status=done&style=stroke&taskId=u6730f591-c7e1-42ba-8cb7-fcc95e76e8c&title=&width=800)
## 组件分组、分类排序
组件面板会把相同分组的组件放在同一个 tab 下，相同分类的组件放在同一个 collapse 中，同时也支持对 tab 和 collapse 进行排序；
由于是整体性的排序，组件自身的信息无法决定此排序，因此在资产包数据根节点新增了 sort 字段用于指定分组和分类的排序，具体定义在[《低代码引擎资产包协议规范》](https://lowcode-engine.cn/assets)2.4 sort 章节；

| **根属性名称** | **类型** | **说明** | **变量支持** | **默认值** |
| --- | --- | --- | --- | --- |
| sort.groupList | String[] | 组件分组，用于组件面板 tab 展示 | - | ['精选组件', '原子组件'] |
| sort.categoryList | String[] | 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列 | - | ['通用', '数据展示', '表格类', '表单类'] |

## 搜索
组件面板会提取组件的 name、title、description、keywords 等字段作为搜索匹配的目标，因此除了能够通过组件名称、描述进行搜索外，还可以指定一些关键词-keywords，keywords 是数组也可以是字符串类型。
