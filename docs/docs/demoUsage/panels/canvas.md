---
title: 5. 画布详解
sidebar_position: 1
---
## 组件操作
### 画布操作
点击组件在右侧面板中能够显示出对应组件的属性配置选项
![Dec-17-2021 19-28-28.gif](https://img.alicdn.com/imgextra/i1/O1CN01flb5tL1inM47Gdo3a_!!6000000004457-1-tps-1468-754.gif)

拖拽修改组件的排列顺序
![Dec-17-2021 19-29-40.gif](https://img.alicdn.com/imgextra/i3/O1CN01UJ1x731NBFB4eELV0_!!6000000001531-1-tps-1468-754.gif)

拖拽时会在右侧提示当前的组件树。
![Dec-17-2021 19-31-30.gif](https://img.alicdn.com/imgextra/i1/O1CN01jLUYQE1h4dmcfYhZB_!!6000000004224-1-tps-1468-754.gif)

### 组件控制
点击组件右上角的复制按钮，或者按下 `ctrl + c` 再按下 `ctrl + v`，可以将其复制；
点击组件右上角的删除按钮，或者直接使用 `Delete` 键，可以将其删除。
![Dec-17-2021 19-33-20.gif](https://img.alicdn.com/imgextra/i2/O1CN01QT1pq621gvCVpoOm6_!!6000000007015-1-tps-1468-754.gif)

### 选择组件切换

可以用键盘上的按键切换组件选择：

- `↑` 向上选择组件
- `↓` 向下选择组件
- `←` 向左选择组件
- `→` 向右选择组件

可以 hover 到组件操作辅助区的第一项来选中组件的父级节点：
![Feb-22-2022 14-42-30.gif](https://img.alicdn.com/imgextra/i4/O1CN01RWbgGJ1TM8HoOpQ7V_!!6000000002367-1-tps-1536-790.gif)

### 可扩展项简述

快捷键、操作辅助区均可扩展。

## Slot 区块

React 中，可以定义一个 prop 选项为 `JSXElement` 或 `(...args) => JSXElement` 的形式，这个形式在低代码画布中，被定义为 Slot，允许往其内部拖入组件，进行符合直觉的操作。
![Feb-22-2022 14-46-02.gif](https://img.alicdn.com/imgextra/i4/O1CN01geivkn1csUog5gZbm_!!6000000003656-1-tps-1534-790.gif)

### 锁定 Slot

您可以对 Slot 进行锁定操作，锁定后内部内容无法选中；
![Feb-22-2022 14-50-03.gif](https://img.alicdn.com/imgextra/i3/O1CN01eBD3WY1rPNsZt8UVL_!!6000000005623-1-tps-1534-790.gif)

在组件树可以解除操作。

## 组件编辑态

低代码引擎允许组件在编辑状态下表现得和渲染时不一样。Demo 中的布局组件就是用对应 API 完成布局的高级操作的。

它背后的实现有两种方法：

- 侵入型：组件编辑态下，会往组件内传入 `__designMode: 'design'`，可以在组件中进行相应处理；

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01Xh3o891gvTrNBMMy2_!!6000000004204-2-tps-3066-1642.png)

- 双入口型：通过配置物料的 editUrls，加载专属于编辑态组件的物料。pro-layout 使用的是这种方式
```json
    {
      "package": "@alifd/pro-layout",
      "version": "1.0.1-beta.6",
      "library": "AlifdProLayout",
      "urls": [
        "https://alifd.alicdn.com/npm/@alifd/pro-layout@1.0.1-beta.6/dist/AlifdProLayout.js",
        "https://alifd.alicdn.com/npm/@alifd/pro-layout@1.0.1-beta.6/dist/AlifdProLayout.css"
      ],
      "editUrls": [
        "https://alifd.alicdn.com/npm/@alifd/pro-layout@1.0.1-beta.6/build/lowcode/view.js",
        "https://alifd.alicdn.com/npm/@alifd/pro-layout@1.0.1-beta.6/build/lowcode/view.css"
      ]
    }
```
