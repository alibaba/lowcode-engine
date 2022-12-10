---
title: API 总览
sidebar_position: 0
---

引擎直接提供 9 大类 API，以及若干间接的 API，具体如下图：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01ZA2RMv1nYlWf6ThGf_!!6000000005102-2-tps-1278-1390.png)

### API 设计约定
一些 API 设计约定：

1. 所有 API 命名空间都按照 variables / functions / events 来组织
2. 事件（events）的命名格式为：on[Will|Did]VerbNoun?，参考 [https://code.visualstudio.com/api/references/vscode-api#events](https://code.visualstudio.com/api/references/vscode-api#events)
3. 基于 Disposable 模式，对于事件的绑定、快捷键的绑定函数，返回值则是解绑函数
4. 对于属性的导出，统一用 .xxx 的 getter 模式，（尽量）不使用 .getXxx()
