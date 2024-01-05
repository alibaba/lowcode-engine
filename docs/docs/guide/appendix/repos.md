---
title: 低代码仓库列表
sidebar_position: 2
---
## 1. 引擎主包
包含引擎的 4 大模块，入料、编排、渲染和出码。

仓库地址：[https://github.com/alibaba/lowcode-engine](https://github.com/alibaba/lowcode-engine)
子包明细：

1. designer
2. editor-core
3. editor-skeleton
4. engine
5. ignitor
6. plugin-designer
7. plugin-outline-pane
8. react-renderer
9. react-simulator-renderer
10. renderer-core
11. types
12. utils
13. material-parser
14. code-generator

## 2. 引擎官方扩展包
包含了常用的设置器（setter）、跟 setter 绑定的插件等

仓库地址：[https://github.com/alibaba/lowcode-engine-ext](https://github.com/alibaba/lowcode-engine-ext)
子包明细：

- 设置器 setter
   - array-setter
   - bool-setter
   - classname-setter
   - color-setter
   - events-setter
   - expression-setter
   - function-setter
   - i18n-setter
   - icon-setter
   - json-setter
   - mixed-setter
   - number-setter
   - object-setter
   - out.txt
   - radiogroup-setter
   - select-setter
   - slot-setter
   - string-setter
   - style-setter
   - textarea-setter
   - variable-setter
- 插件 plugin
   - plugin-event-bind-dialog 事件绑定浮层
   - plugin-variable-bind-dialog 变量绑定浮层
## 3. 低代码插件
包含了常用的插件等

仓库地址：[https://github.com/alibaba/lowcode-plugins](https://github.com/alibaba/lowcode-plugins)
子包明细：

- base-monaco-editor 基础代码编辑器
- plugin-code-editor 源码编辑面板
- plugin-datasource-pane 数据源面板
- plugin-manual 产品使用手册面板
- plugin-schema 页面数据面板
- plugin-undo-redo 前进/后退功能
- plugin-zh-cn 中英文切换功能

## 4. 引擎 demo
展示使用引擎编排和渲染等模块以及相应的依赖资源配置基础 demo

仓库地址：[https://github.com/alibaba/lowcode-demo](https://github.com/alibaba/lowcode-demo)
## 5. 工具链包
包含生成引擎生态元素（setter、物料、插件）的脚手架，启动脚本，调试插件等

仓库地址：[https://github.com/alibaba/lowcode-tools](https://github.com/alibaba/lowcode-tools)
## 6. 低代码数据源引擎
负责在渲染&出码两种运行时实现数据源管理，承担低代码搭建数据请求的能力；
仓库地址：[https://github.com/alibaba/lowcode-datasource](https://github.com/alibaba/lowcode-datasource)
## 7. 基础物料 & 物料描述
仓库地址：[https://github.com/alibaba/lowcode-materials](https://github.com/alibaba/lowcode-materials)
## 8. 出码 demo
仓库地址：[https://github.com/alibaba/lowcode-code-generator-demo](https://github.com/alibaba/lowcode-code-generator-demo)
