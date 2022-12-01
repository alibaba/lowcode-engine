---
title: 设置器设计
sidebar_position: 6
---
设置器，又称为 Setter，是作为物料属性和用户交互的重要途径，在编辑器日常使用中有着非常重要的作用，本文重点介绍 Setter 的设计原理和使用方式，帮助用户更好的理解 Setter。
在编辑器的右边区域，Setter 的区块就展现在这里，如下图：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644404887956-8ffc8c8c-380c-4843-8bc9-512be77a9b18.png#clientId=u4cc5b992-0df5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=865&id=wNOuZ&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1730&originWidth=3836&originalType=binary&ratio=1&rotation=0&showTitle=false&size=947162&status=done&style=none&taskId=ue623b488-8774-401a-b80c-c102e8aac8f&title=&width=1918)
其中包含 属性、样式、事件、高级：

- 属性：展示该物料常规的属性；
- 样式：展示该物料样式的属性；
- 事件：如果该物料有声明事件，则会出现事件面板，用于绑定事件；
- 高级：两个逻辑相关的属性，**条件渲染**和**循环。**
# npm 包与仓库信息

- npm 包：@alilc/lowcode-engine-ext
- 仓库：[https://github.com/alibaba/lowcode-engine-ext](https://github.com/alibaba/lowcode-engine-ext)

# 设置器模块原理
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644404909143-eede0a27-e990-4333-816a-d2d0cf2594b3.png#clientId=u4cc5b992-0df5-4&crop=0&crop=0&crop=1&crop=1&height=482&id=PyO6v&name=image.png&originHeight=964&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=273494&status=done&style=none&taskId=ufb317b56-de50-4693-8c39-8faa9b38307&title=&width=767)

设置面板依赖于以下三块抽象

- 编辑器上下文 `editor`，主要包含：消息通知、插件引用等
- 设置对象 `settingTarget`，主要包含：选中的节点、是否同一值、值的储存等
- 设置列 `settingField`，主要和当前设置视图相关，包含视图的 `ref`、以及设置对象 `settingTarget`

#### SettingTarget 抽象
如果不是多选，可以直接暴露 `Node` 给到这，但涉及多选编辑的时候，大家的值时通常是不一样的，设置的时候需要批量设置进去，这里主要封装这些逻辑，把多选编辑的复杂性屏蔽掉。

所选节点所构成的**设置对象**抽象如下：

```typescript
interface SettingTarget {
  // 所设置的节点集，至少一个
  readonly nodes: Node[];
  // 所有属性值数据
  readonly props: object;
  // 设置属性值
  setPropValue(propName: string, value: any): void;
  // 获取属性值
  getPropValue(propName: string): any;
  // 设置多个属性值，替换原有值
  setProps(data: object): void;
  // 设置多个属性值，和原有值合并
  mergeProps(data: object): void;
  // 绑定属性值发生变化时
  onPropsChange(fn: () => void): () => void;
}
```

基于设置对象所派生的**设置目标属性**抽象如下:

```typescript
interface SettingTargetProp extends SettingTarget {
  // 当前属性名称
  readonly propName: string;
  // 当前属性值
  value: any;
  // 是否设置对象的值一致
  isSameValue(): boolean;
  // 是否是空值
  isEmpty(): boolean;
  // 设置属性值
  setValue(value: any): void;
  // 移除当前设置
  remove(): void;
}
```

#### SettingField 抽象
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644396933393-779423e2-29a7-4e97-9ef9-e3c7964a5412.png#clientId=u41c9ba96-15b6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=201&id=uc71z&margin=%5Bobject%20Object%5D&name=image.png&originHeight=402&originWidth=2022&originalType=binary&ratio=1&rotation=0&showTitle=false&size=218611&status=done&style=none&taskId=u534089f2-363d-464e-8c69-ac79f268f5a&title=&width=1011)

```typescript
interface SettingField extends SettingTarget {
  // 当前 Field 设置的目标属性，为 group 时此值为空
  readonly prop?: SettingTargetProp;

  // 当前设置项的 ref 引用
  readonly ref?: ReactInstance;

  // 属性配置描述传入的配置
  readonly config: SettingConfig;
  // others....
}
```
