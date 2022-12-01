---
title: 关于引擎的 issue 说明
sidebar_position: 2
---
> 提交地址：[https://github.com/alibaba/lowcode-engine/issues](https://github.com/alibaba/lowcode-engine/issues)

### 提交前必读
由于引擎项目复杂，很多问题在复现和沟通上无法花费太多时间，需要大家尽力将复现步骤说明白。


![image.png](./img/you-think.png)

**你以为的 issue**


![image.png](./img/i-see.png)

**我们看到的 issue**

为了更好的进行协作，对引擎 issue 的处理定了一些处理的优先级。请大家认真阅读 Orz.

- 【支持快】通过线上 Demo 地址 + 控制台输入 API 可复现。
- 【支持快】通过线上 Demo + 导入 schema 可复现
- 【支持稍慢】通过线上 Demo + 完整操作步骤可复现
- 【支持稍慢】通过线上 Demo + 变更代码可复现，并清楚的说明变更代码的位置和内容
- 【支持慢】有完整的项目地址，下载下来可直接安装依赖并启动复现的
- 【支持慢】需求类型的由于人力有限，欢迎大家 PR，如能讲清楚背景上下文和场景，项目维护团队更容易给出方案建议或方向指引。
- 【不保证提供支持】其他
   - 只有标题没有复现步骤
   - 复现步骤不清晰
   - 和引擎无关的

### 不同优先级的示例
#### 【支持快】通过线上 Demo 地址 + 控制台输入 API 可复现。
**示例**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656387671833-cd44507b-af59-45ec-b0da-f4f0ef61e92e.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=295&id=ub61f0ab8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1862&originWidth=3322&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5033674&status=done&style=none&taskId=u3646a3b6-4b22-48e7-94e3-564a09cfa24&title=&width=527)
复现步骤：

- 打开线上 demo
- 在控制台输入
```json
// 当前 doc
const doc = window.AliLowCodeEngine.project.currentDocument

// 新建 doc 并成功切换
window.AliLowCodeEngine.project.openDocument({
    componentName: 'Page'
});

// 无法切换回来
window.AliLowCodeEngine.project.openDocument('docl4xkca5b')
```

预期效果：

- 使用 openDocument 可以正常的切换回原来的 doc

#### 【支持快】通过线上 demo + 导入 schema 可复现
步骤：

- 使用线上 demo
- 导入下面的 schema
- schema 代码/schema zip 压缩包
- 页面效果如下

期望：

- 页面中的 xxx 部分和预期不符合，期望的效果是 xxx

#### 【支持稍慢】通过线上 demo + 完整操作步骤可复现
**示例**
1.使用 antd 组件
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656387998779-9f621c7f-82cb-48ad-94fc-84c2cd46065c.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=906&id=u0ad0726a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1812&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=838860&status=done&style=none&taskId=u0a0a9e20-f79e-4c8c-8c82-b304f7b7583&title=&width=1792)

2.拖拽这个组件
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656388046560-e07680ee-809a-4ad1-bc47-47c2c00fdd40.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=901&id=u23c8416a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1802&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=890196&status=done&style=none&taskId=u7ac32b55-f32c-4215-ac1d-f81f5e986ac&title=&width=1792)

3.配置该属性值为 100
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656388075312-7c06f15a-464a-49f0-beb5-19320ea0e454.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=900&id=ua91e7f85&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1800&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=882142&status=done&style=none&taskId=u61082c8a-1092-4b5b-a2ea-00486cadb71&title=&width=1792)

期望效果：

- 组件同配置一致

#### 【支持稍慢】通过线上 demo + 变更代码可复现，并清楚的说明变更代码的位置和内容
**示例**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656387894830-6850815f-e2ee-46bf-a2bf-fdda4d166691.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=377&id=u87419dd1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=754&originWidth=1892&originalType=binary&ratio=1&rotation=0&showTitle=false&size=226627&status=done&style=none&taskId=u88b2bbb8-869c-482c-9510-9d513f6e191&title=&width=946)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656387911054-771dd7fc-db90-46ae-b1db-f5f9f7537ed4.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=389&id=u0a370108&margin=%5Bobject%20Object%5D&name=image.png&originHeight=778&originWidth=1917&originalType=binary&ratio=1&rotation=0&showTitle=false&size=229881&status=done&style=none&taskId=ucbc7af71-f0e1-4319-9097-8ad6b936c5e&title=&width=958.5)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656387922644-de3f1d64-0206-407d-82ad-2d1155374e37.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=127&id=u9c5921eb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=253&originWidth=1836&originalType=binary&ratio=1&rotation=0&showTitle=false&size=58615&status=done&style=none&taskId=u5c8af90a-0d20-40c8-a1f2-e387f037d85&title=&width=918)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656387931330-a5453ba1-264b-4325-b3a8-7cb6e22633ee.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=457&id=u687acf85&margin=%5Bobject%20Object%5D&name=image.png&originHeight=914&originWidth=1912&originalType=binary&ratio=1&rotation=0&showTitle=false&size=129980&status=done&style=none&taskId=u3a706b70-0da6-484d-857d-1d086f7a4e5&title=&width=956)

#### 【支持慢】有完整的项目地址，下载下来可直接安装依赖并启动复现的
由于完整的项目中有很多冗余的信息，这部分排查起来十分耗时且困难。不推荐使用改方式。

#### 【不保证提供支持】其他
##### 只有标题没有复现步骤
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656388351815-e086b980-0828-4c49-ba72-142446313d2d.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=510&id=u79a38c3b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1020&originWidth=2520&originalType=binary&ratio=1&rotation=0&showTitle=false&size=529258&status=done&style=none&taskId=u3540b08e-9dff-4c72-8ee5-123912439b0&title=&width=1260)

##### 复现步骤不清晰
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656388451393-2168e5ca-20de-4781-9e51-20e282dbc0ca.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=833&id=ubaf001f6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1666&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1228630&status=done&style=none&taskId=ub26ed4ff-e0cf-4644-9a65-00ddee4b9e5&title=&width=1792)

##### 和引擎无关的
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1656388376995-0ab5d7c0-8ff9-49cf-8854-70e9bb3ff87a.png#clientId=uaa040ac3-dccc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=715&id=uffc59321&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1430&originWidth=2548&originalType=binary&ratio=1&rotation=0&showTitle=false&size=747119&status=done&style=none&taskId=u861d5fa6-f673-4091-8635-ff45adf680e&title=&width=1274)




### 扩展阅读
强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。（此段参考 [antd](https://github.com/ant-design/ant-design)）
