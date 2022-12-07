---
title: 1. 试用低代码引擎 Demo
sidebar_position: 0
---
低代码编辑器中的区块主要包含这些功能点：
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01aGQull1RVdGs7Pt6x_!!6000000002117-2-tps-3384-1784.png)

## 分区块功能介绍
### 左侧：面板与操作区
#### 物料面板
可以查找组件，并在此拖动组件到编辑器画布中
![Dec-17-2021 19-12-46.gif](https://img.alicdn.com/imgextra/i1/O1CN01pEu7811SlwzxraLHG_!!6000000002288-1-tps-1468-754.gif)

#### 大纲面板
可以调整页面内的组件树结构：
![Dec-17-2021 19-14-34.gif](https://img.alicdn.com/imgextra/i1/O1CN013DDLqt1GH0rAlajqi_!!6000000000596-1-tps-1468-754.gif)
可以在这里打开或者关闭模态浮层的展现：
![Dec-17-2021 19-19-18.gif](https://img.alicdn.com/imgextra/i2/O1CN01bQfS8W1JitokHRinC_!!6000000001063-1-tps-1468-754.gif)


#### 源码面板
可以编辑页面级别的 JavaScript 代码和 CSS 配置
![Feb-11-2022 14-51-59.gif](https://img.alicdn.com/imgextra/i1/O1CN01d11kK71Q223eWvL5F_!!6000000001917-1-tps-1532-614.gif)

#### Schema 编辑
【开发者专属】可以编辑页面的底层 Schema 数据。
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01lcQOER23Q5sjA0Gn5_!!6000000007249-2-tps-3070-1648.png)
搭配顶部操作区的“保存到本地”和“重置页面”功能，可以实验各种 schema 对低代码页面的改变。

它们操作的数据关系是：

- 页面中的 Schema 数据：保存在低代码引擎中的 Schema，点击 Schema 面板中的“保存 Schema”时将修改引擎中的值，此外低代码引擎中的所有操作都可能修改到 Schema
- localStorage 数据：由“保存到本地”保存到 localStorage 中，页面初始化时将读取，预览页面时也会读取
- 默认 Schema：保存在 Demo 项目中的默认 Schema（`public/schema.json`），初始化页面时如果不存在 localStorage 数据即会读取，点击“重置页面”时，也会读取

#### 中英文切换
可以切换编辑器的语言；注：需要组件配置配合。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN019ORknX1M5SYg7eSJ3_!!6000000001383-2-tps-3018-1512.png)
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01R7g7pW21rSJEHd2AI_!!6000000007038-2-tps-3016-1510.png)
## 中部：可视化页面编辑画布区域

点击组件在右侧面板中能够显示出对应组件的属性配置选项
![Dec-17-2021 19-28-28.gif](https://img.alicdn.com/imgextra/i1/O1CN01uBU3lR1CuAFTTq4RS_!!6000000000140-1-tps-1468-754.gif)

拖拽修改组件的排列顺序
![Dec-17-2021 19-29-40.gif](https://img.alicdn.com/imgextra/i3/O1CN01DAAYKd1bycUq1C4JV_!!6000000003534-1-tps-1468-754.gif)

将组件拖拽到容器类型的组件中，注意拖拽时会在右侧提示当前的组件树。
![Dec-17-2021 19-31-30.gif](https://img.alicdn.com/imgextra/i2/O1CN01TzJosP1FIYZe6xIQ5_!!6000000000464-1-tps-1468-754.gif)

## 右侧：组件级别配置

### 选中的组件
从页面开始一直到当前选中的组件位置，点击对应的名称可以切换到对应的组件上。
![Dec-17-2021 19-35-25.gif](https://img.alicdn.com/imgextra/i4/O1CN01EbImy425R80OeblSD_!!6000000007522-1-tps-1468-754.gif)

### 选中组件的配置
当前组件的大类目选项，根据组件类型不同，包含如下子类目：

#### 属性
组件的基础属性值设置
![Dec-17-2021 19-37-26.gif](https://img.alicdn.com/imgextra/i2/O1CN01ziBI9T1nQynFKqCp2_!!6000000005085-1-tps-1468-754.gif)

#### 样式
组件的样式配置，如文字：
![Dec-17-2021 19-38-55.gif](https://img.alicdn.com/imgextra/i4/O1CN017DQv2R1OEjoawXmKJ_!!6000000001674-1-tps-1468-754.gif)

#### 事件
绑定组件对外暴露的事件。
![Dec-17-2021 19-41-17.gif](https://img.alicdn.com/imgextra/i2/O1CN01mhVutF24I8cLde0zy_!!6000000007367-1-tps-1468-754.gif)

#### 高级
循环、条件渲染与 key 设置。
![Dec-17-2021 19-46-26.gif](https://img.alicdn.com/imgextra/i4/O1CN01xTjXQX1jMcYwuTGKZ_!!6000000004534-1-tps-1468-754.gif)

## 顶部：操作区

### 撤回和重做
![Dec-17-2021 19-52-23.gif](https://img.alicdn.com/imgextra/i3/O1CN019VWkbr1jsgHoGKf6g_!!6000000004604-1-tps-1468-754.gif)
