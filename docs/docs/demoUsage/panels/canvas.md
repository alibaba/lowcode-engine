---
title: 5. 画布详解
sidebar_position: 1
---
## 组件操作
### 画布操作
点击组件在右侧面板中能够显示出对应组件的属性配置选项
![Dec-17-2021 19-28-28.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562216925-c4bd5f10-2469-452c-8c2d-fe92ba6d03a7.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=uff491710&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-28-28.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2f775208-8b07-4968-9dd4-420c6e4d3c1&title=&width=734)

拖拽修改组件的排列顺序
![Dec-17-2021 19-29-40.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562219867-61a41b16-4513-4827-80bf-f7e4832bcf3a.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=ueda50ec8&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-29-40.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue0ec6bea-81f1-4d04-bf82-acde7c9983a&title=&width=734)

拖拽时会在右侧提示当前的组件树。
![Dec-17-2021 19-31-30.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562220001-4afae72e-f9fd-4564-a904-c87f61ba79b5.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=ucc719a0e&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-31-30.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c46a827-8702-471c-a8c1-eb4f069d108&title=&width=734)

### 组件控制
点击组件右上角的复制按钮，或者按下 `ctrl + c` 再按下 `ctrl + v`，可以将其复制；
点击组件右上角的删除按钮，或者直接使用 `Delete` 键，可以将其删除。
![Dec-17-2021 19-33-20.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562220898-a54f0cfa-26bf-461f-a4aa-9708fc367d7c.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u2bae31a2&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-33-20.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c4c7b00-b316-431a-9c54-949ae4ed766&title=&width=734)

### 选择组件切换

可以用键盘上的按键切换组件选择：

- `↑` 向上选择组件
- `↓` 向下选择组件
- `←` 向左选择组件
- `→` 向右选择组件

可以 hover 到组件操作辅助区的第一项来选中组件的父级节点：
![Feb-22-2022 14-42-30.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645512169966-17f26afa-00fc-47a5-86be-08505ab39a4f.gif#clientId=u5c3042e1-7626-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=uee0cbe0a&margin=%5Bobject%20Object%5D&name=Feb-22-2022%2014-42-30.gif&originHeight=790&originWidth=1536&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2913977&status=done&style=stroke&taskId=ud9314fe0-0943-48e5-9f0c-b9b9b4a6b47&title=&width=768)

### 可扩展项简述

快捷键、操作辅助区均可扩展。

## Slot 区块

React 中，可以定义一个 prop 选项为 `JSXElement` 或 `(...args) => JSXElement` 的形式，这个形式在低代码画布中，被定义为 Slot，允许往其内部拖入组件，进行符合直觉的操作。
![Feb-22-2022 14-46-02.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645512376500-46baf1b5-2335-4fb5-a430-c2f2245c8439.gif#clientId=u5c3042e1-7626-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=u8c429d95&margin=%5Bobject%20Object%5D&name=Feb-22-2022%2014-46-02.gif&originHeight=790&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2389349&status=done&style=stroke&taskId=u7462c2e4-64bf-432a-aa2e-2fef526b4d4&title=&width=767)

### 锁定 Slot

您可以对 Slot 进行锁定操作，锁定后内部内容无法选中；
![Feb-22-2022 14-50-03.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645512638545-ae46bcd2-883b-4229-9f78-d59087d03d28.gif#clientId=u5c3042e1-7626-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=u87ff9fe3&margin=%5Bobject%20Object%5D&name=Feb-22-2022%2014-50-03.gif&originHeight=790&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9318074&status=done&style=none&taskId=ua4e1f652-2e72-4dcf-ad78-19b42e179c3&title=&width=767)

在组件树可以解除操作。

## 组件编辑态

低代码引擎允许组件在编辑状态下表现得和渲染时不一样。Demo 中的布局组件就是用对应 API 完成布局的高级操作的。

它背后的实现有两种方法：

- 侵入型：组件编辑态下，会往组件内传入 `__designMode: 'design'`，可以在组件中进行相应处理；

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645512859914-b51c23b9-50d9-4962-a6f7-96dbdcef6cef.png#clientId=u5c3042e1-7626-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=821&id=uf96a3071&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1642&originWidth=3066&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1024714&status=done&style=none&taskId=u7838e6c7-2349-4224-94ed-4e0e972b2a2&title=&width=1533)

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
