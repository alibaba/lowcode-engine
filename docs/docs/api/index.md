---
title: API 总览
sidebar_position: 0
---

引擎提供的公开 API 分为`命名空间`和`模型`两类，其中`命名空间`用于聚合一大类的 API，`模型`为各 API 涉及到的对象模型。

## 命名空间

引擎直接提供以下几大类 API

- skeleton 面板 API
- material 物料 API
- project 模型 API
- simulator-host 模拟器 API
- hotkey 快捷键 API
- setters 设置器 API
- event 事件 API
- config 配置 API
- common 通用 API
- logger 日志 API
- init 初始化 API

## 模型
以下模型通过前面的 API 以返回值等形式间接透出。

- document-model 文档
- node 节点
- node-children 节点孩子
- props 属性集
- prop 属性
- setting-field 设置属性
- setting-top-entry 设置属性集
- component-meta 物料元数据
- selection 画布选中
- detecting 画布 hover
- history 操作历史
- window 低代码设计器窗口模型
- detecting 画布节点悬停模型
- modal-nodes-manager 模态节点管理器模型
- plugin-instance 插件实例
- drop-location 拖拽放置位置模型


## API 设计约定
一些 API 设计约定：

1. 所有 API 命名空间都按照 variables / functions / events 来组织
2. 事件（events）的命名格式为：on[Will|Did]VerbNoun?，参考 [https://code.visualstudio.com/api/references/vscode-api#events](https://code.visualstudio.com/api/references/vscode-api#events)
3. 基于 Disposable 模式，对于事件的绑定、快捷键的绑定函数，返回值则是解绑函数
4. 对于属性的导出，统一用 .xxx 的 getter 模式，（尽量）不使用 .getXxx()

## experimental

说明此模块处于公测阶段, API 可能会发生改变.