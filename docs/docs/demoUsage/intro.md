---
title: 1. 试用低代码引擎 Demo
sidebar_position: 0
---
低代码编辑器中的区块主要包含这些功能点：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644562161350-50ae7ccd-2e6f-4f50-af56-30e5cc5624dc.png#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=892&id=udd8e7731&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1784&originWidth=3384&originalType=binary&ratio=1&rotation=0&showTitle=false&size=509888&status=done&style=none&taskId=u1621cea1-8e9d-48d0-9273-bf852ef8e82&title=&width=1692)

## 分区块功能介绍
### 左侧：面板与操作区
#### 物料面板
可以查找组件，并在此拖动组件到编辑器画布中
![Dec-17-2021 19-12-46.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562213143-49b9aff8-b538-43f4-a66d-53fac98ce7ae.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u3a98c25c&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-12-46.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u265abeb3-a0b1-4cdf-9291-c5fa865d06c&title=&width=734)

#### 大纲面板
可以调整页面内的组件树结构：
![Dec-17-2021 19-14-34.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562213701-39f3e2c3-f52c-4be4-bb56-90842daa58ab.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u1d18d088&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-14-34.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2d6ebf59-3cd5-4e80-8599-a4d594a2cbf&title=&width=734)
可以在这里打开或者关闭模态浮层的展现：
![Dec-17-2021 19-19-18.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562213674-44d91956-ac82-4909-98b5-e0bd4fcbe12d.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u7d3beb31&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-19-18.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6adfe95e-0c27-4c03-8e3c-ca62cb37387&title=&width=734)


#### 源码面板
可以编辑页面级别的 JavaScript 代码和 CSS 配置
![Feb-11-2022 14-51-59.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562356337-9e7f7490-396c-4520-b780-4a43a29050ef.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u02b5cb05&margin=%5Bobject%20Object%5D&name=Feb-11-2022%2014-51-59.gif&originHeight=614&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2080513&status=done&style=none&taskId=u2f95447f-b7a6-453d-8a8c-7d1649581d9&title=)

#### Schema 编辑
【开发者专属】可以编辑页面的底层 Schema 数据。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644562411102-a8596fce-fd77-4f20-bd3c-b52e2a0beb52.png#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=824&id=u3488f050&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1648&originWidth=3070&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1082743&status=done&style=none&taskId=u529bf58c-2203-484f-bf9f-19c2a3fe870&title=&width=1535)
搭配顶部操作区的“保存到本地”和“重置页面”功能，可以实验各种 schema 对低代码页面的改变。

它们操作的数据关系是：

- 页面中的 Schema 数据：保存在低代码引擎中的 Schema，点击 Schema 面板中的“保存 Schema”时将修改引擎中的值，此外低代码引擎中的所有操作都可能修改到 Schema
- localStorage 数据：由“保存到本地”保存到 localStorage 中，页面初始化时将读取，预览页面时也会读取
- 默认 Schema：保存在 Demo 项目中的默认 Schema（`public/schema.json`），初始化页面时如果不存在 localStorage 数据即会读取，点击“重置页面”时，也会读取

#### 中英文切换
可以切换编辑器的语言；注：需要组件配置配合。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644562219182-e4233163-b731-4f09-a442-9d5c0e71e7e8.png#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=756&id=ua3adfd78&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1512&originWidth=3018&originalType=binary&ratio=1&rotation=0&showTitle=false&size=384093&status=done&style=none&taskId=uf546934b-ae91-4e3e-9e21-2447de70ed1&title=&width=1509)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644562219666-1baf7da2-6d70-45fa-8805-b6cc9ac99f3f.png#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=755&id=u34aad08e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1510&originWidth=3016&originalType=binary&ratio=1&rotation=0&showTitle=false&size=380190&status=done&style=none&taskId=ud264115a-ae01-4b65-9ccc-4e6efa37b62&title=&width=1508)
## 中部：可视化页面编辑画布区域

点击组件在右侧面板中能够显示出对应组件的属性配置选项
![Dec-17-2021 19-28-28.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562216925-c4bd5f10-2469-452c-8c2d-fe92ba6d03a7.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=uff491710&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-28-28.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2f775208-8b07-4968-9dd4-420c6e4d3c1&title=&width=734)

拖拽修改组件的排列顺序
![Dec-17-2021 19-29-40.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562219867-61a41b16-4513-4827-80bf-f7e4832bcf3a.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=ueda50ec8&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-29-40.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue0ec6bea-81f1-4d04-bf82-acde7c9983a&title=&width=734)

将组件拖拽到容器类型的组件中，注意拖拽时会在右侧提示当前的组件树。
![Dec-17-2021 19-31-30.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562220001-4afae72e-f9fd-4564-a904-c87f61ba79b5.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=ucc719a0e&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-31-30.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c46a827-8702-471c-a8c1-eb4f069d108&title=&width=734)

## 右侧：组件级别配置

### 选中的组件
从页面开始一直到当前选中的组件位置，点击对应的名称可以切换到对应的组件上。
![Dec-17-2021 19-35-25.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562220818-c6532319-51df-4698-a3a4-80f3ab70b209.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u648c740b&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-35-25.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u03dd1651-8139-47f1-9cd1-a5089b64bf9&title=&width=734)

### 选中组件的配置
当前组件的大类目选项，根据组件类型不同，包含如下子类目：

#### 属性
组件的基础属性值设置
![Dec-17-2021 19-37-26.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562222884-191c8433-2386-47f4-bab4-d3d1fe534f12.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u43676a31&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-37-26.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u170b8d2a-c1f9-4acf-a0e2-9825c588dcd&title=&width=734)

#### 样式
组件的样式配置，如文字：
![Dec-17-2021 19-38-55.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562224062-86fcf97b-d229-487f-951d-d2070337c058.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u4a9930ae&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-38-55.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4a81ecb9-5b51-4758-9dd0-eaeb2e1a318&title=&width=734)

#### 事件
绑定组件对外暴露的事件。
![Dec-17-2021 19-41-17.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562224632-a3ee9b18-97e8-4d31-b4fe-b58720dc6bf5.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u534bb1ea&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-41-17.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u50691375-2514-4a6c-8bec-0be44adf141&title=&width=734)

#### 高级
循环、条件渲染与 key 设置。
![Dec-17-2021 19-46-26.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562226094-899cf104-3c60-439f-8b68-83af595ef275.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u9190ed31&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-46-26.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf02555c1-cd82-486d-8561-ca97e0ec1cd&title=&width=734)

## 顶部：操作区

### 撤回和重做
![Dec-17-2021 19-52-23.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644562226083-d7f69bff-42e6-4173-8ac8-6e5a0c0262d6.gif#clientId=u99b5ef7a-7ebb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u81f5d842&margin=%5Bobject%20Object%5D&name=Dec-17-2021%2019-52-23.gif&originHeight=754&originWidth=1468&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubeb556cd-2349-44d8-b1be-ba6e32bea4e&title=&width=734)
