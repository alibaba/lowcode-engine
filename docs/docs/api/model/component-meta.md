---
title: ComponentMeta
sidebar_position: 15
---

> **@types** [IPublicModelComponentMeta](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/component-meta.ts)<br/>
> **@since** v1.0.0

## 基本介绍

组件元数据信息模型

## 属性

### componentName

组件名

`@type {string}`

### isContainer

是否是「容器型」组件

`@type {boolean}`

### isMinimalRenderUnit
是否是最小渲染单元

当组件需要重新渲染时：
- 若为最小渲染单元，则只渲染当前组件，
- 若不为最小渲染单元，则寻找到上层最近的最小渲染单元进行重新渲染，直至根节点。

`@type {boolean}`

### isModal

是否为「模态框」组件

`@type {boolean}`

### configure

获取用于设置面板显示用的配置

`@type {IPublicTypeFieldConfig[]}`

相关类型：[IPublicTypeFieldConfig](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/field-config.ts)

### title

标题

`@type {string | IPublicTypeI18nData | ReactElement}`

相关类型：[IPublicTypeI18nData](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/i18n-data.ts)

### icon

图标

`@type {IPublicTypeIconType}`

相关类型：[IPublicTypeIconType](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/icon-type.ts)

### npm

组件 npm 信息

`@type {IPublicTypeNpmInfo}`

相关类型：[IPublicTypeNpmInfo](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/npm-info.ts)

### availableActions

获取元数据

`@type {IPublicTypeTransformedComponentMetadata}`

相关类型：[IPublicTypeTransformedComponentMetadata](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/transformed-component-metadata.ts)

### advanced

组件元数据中高级配置部分

`@type {IPublicTypeAdvanced}`

相关类型：[IPublicTypeAdvanced](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/advanced.ts)

## 方法

### setNpm

设置 npm 信息

```typescript
/**
 * 设置 npm 信息
 * set method for npm inforamtion
 * @param npm
 */
setNpm(npm: IPublicTypeNpmInfo): void;
```

相关类型：[IPublicTypeNpmInfo](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/npm-info.ts)

### getMetadata

获取元数据

```typescript
/**
 * 获取元数据
 * get component metadata
 */
getMetadata(): IPublicTypeTransformedComponentMetadata;
```

相关类型：[IPublicTypeTransformedComponentMetadata](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/transformed-component-metadata.ts)

### checkNestingUp

检测当前对应节点是否可被放置在父节点中

```typescript
/**
 * 检测当前对应节点是否可被放置在父节点中
 * check if the current node could be placed in parent node
 * @param my 当前节点
 * @param parent 父节点
 */
checkNestingUp(my: IPublicModelNode | IPublicTypeNodeData, parent: any): boolean;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeNodeData](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-data.ts)


### checkNestingDown

检测目标节点是否可被放置在父节点中

```typescript
/**
 * 检测目标节点是否可被放置在父节点中
 * check if the target node(s) could be placed in current node
 * @param my 当前节点
 * @param parent 父节点
 */
checkNestingDown(
    my: IPublicModelNode | IPublicTypeNodeData,
    target: IPublicTypeNodeSchema | IPublicModelNode | IPublicTypeNodeSchema[],
  ): boolean;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeNodeData](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-data.ts)
- [IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)


### refreshMetadata

刷新元数据，会触发元数据的重新解析和刷新

```typescript
/**
 * 刷新元数据，会触发元数据的重新解析和刷新
 * refresh metadata
 */
refreshMetadata(): void;
```
