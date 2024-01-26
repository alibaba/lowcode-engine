---
title: 3. 如何通过按钮展示/隐藏弹窗
sidebar_position: 1
---
> 说明：这个方式依赖低代码弹窗组件是否对外保留了相关的 API，不同的物料支持的方式不一样，这里只针对综合场景的弹窗物料。

## 1.拖拽一个按钮

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01kLaWA31D6WwTui9VW_!!6000000000167-2-tps-3584-1812.png)
## 2.拖拽一个弹窗
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01rfRzLa1quEwUyulPc_!!6000000005555-2-tps-3578-1622.png)

## 3.查看弹窗 refId
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01rEgPnW1cSqdWpG0YE_!!6000000003600-2-tps-3574-1588.png)

- 点击弹窗
- 点击右侧面板中的高级
- 找到 refId

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01MXMfqn1rj4uKzlOh2_!!6000000005666-2-tps-3584-1796.png)

这里我们的 refId 是 "pro-dialog-entryl32xgrus"
## 4.隐藏弹窗
点击工具栏的隐藏小图标，将弹窗在画布中隐藏
![image.png](https://img.alicdn.com/imgextra/i3/O1CN017Kamt71HFvWkpeK8j_!!6000000000729-2-tps-3578-1568.png)

## 5.按钮绑定事件
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01SwJ0xx1u3LfX2h8yt_!!6000000005981-2-tps-3584-1814.png)

**通过下面的代码即可打开弹窗**

```typescript
this.$('pro-dialog-entryl32xgrus').open();
```
####
