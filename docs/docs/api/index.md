---
title: API 总览
sidebar_position: 0
---

引擎直接提供 9 大类 API，以及若干间接的 API，具体如下图：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1645445575048-cc511d60-3b84-411d-a70e-21b7a596d09c.png#clientId=uaab5e9c4-fa7b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=695&id=u8e1d0318&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1390&originWidth=1278&originalType=binary&ratio=1&rotation=0&showTitle=false&size=410614&status=done&style=none&taskId=u9fdcdcfb-4e8b-4e22-8865-94181f458d0&title=&width=639)

### API 设计约定
一些 API 设计约定：

1. 所有 API 命名空间都按照 variables / functions / events 来组织
2. 事件（events）的命名格式为：on[Will|Did]VerbNoun?，参考 [https://code.visualstudio.com/api/references/vscode-api#events](https://code.visualstudio.com/api/references/vscode-api#events)
3. 基于 Disposable 模式，对于事件的绑定、快捷键的绑定函数，返回值则是解绑函数
4. 对于属性的导出，统一用 .xxx 的 getter 模式，（尽量）不使用 .getXxx()
