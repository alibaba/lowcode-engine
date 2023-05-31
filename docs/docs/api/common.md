---
title: common - 通用 API
sidebar_position: 11
---

> **@types** [IPublicApiCommon](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/common.ts)<br/>
> **@since** v1.0.0


## 模块简介
通用模块里包含除了几大核心模块 API 之外的所有 API，比如通用 utils、面板扩展相关 等。
> 高能预警：之所以叫 skeletonCabin / designerCabin 跟兼容上一个版本的引擎有关系。若有必要，后面将用更有意义的命名空间来组织这些 API。

## 变量
#### utils
通用 utils，详见下方方法签名

相关类型：[IPublicApiCommonUtils](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/common.ts)

#### skeletonCabin
面板扩展相关，详见下方方法签名

## 方法
### utils
#### isNodeSchema
是否为合法的 schema 结构

```typscript
/**
  * 是否为合法的 schema 结构
  * check if data is valid NodeSchema
  *
  * @param {*} data
  * @returns {boolean}
  */
isNodeSchema(data: any): boolean;
```

#### isFormEvent
是否为表单事件类型

```typescript
/**
 * 是否为表单事件类型
 * check if e is a form event
 * @param {(KeyboardEvent | MouseEvent)} e
 * @returns {boolean}
 */
isFormEvent(e: KeyboardEvent | MouseEvent): boolean;
```

#### getNodeSchemaById
从 schema 结构中查找指定 id 节点
```typescript
/**
 * 从 schema 结构中查找指定 id 节点
 * get node schema from a larger schema with node id
 * @param {IPublicTypeNodeSchema} schema
 * @param {string} nodeId
 * @returns {(IPublicTypeNodeSchema | undefined)}
 */
getNodeSchemaById(
    schema: IPublicTypeNodeSchema,
    nodeId: string,
  ): IPublicTypeNodeSchema | undefined;
```
相关类型：[IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

#### executeTransaction
批处理事务，用于优化特定场景的性能

```typescript
/**
 * 批处理事务，用于优化特定场景的性能
 * excute something in a transaction for performence
 *
 * @param {() => void} fn
 * @param {IPublicEnumTransitionType} type
 * @since v1.0.16
 */
executeTransaction(fn: () => void, type: IPublicEnumTransitionType): void;
```
**@since v1.0.16**

##### 示例
```typescript
import { common } from '@alilc/lowcode-engine';
import { IPublicEnumTransitionType } from '@alilc/lowcode-types';

common.utils.startTransaction(() => {
  node1.setProps();
  node2.setProps();
  node3.setProps();
  // ...
}, IPublicEnumTransitionType.repaint);
```

#### getConvertedExtraKey

props key 转化工具

```typescript
getConvertedExtraKey(key: string): string

```

**@since v1.0.17**

#### createIntl
i18n 相关工具
```typescript
/**
 * i18n 相关工具
 * i18n tools
 *
 * @param {(string | object)} instance
 * @returns {{
 *     intlNode(id: string, params?: object): ReactNode;
 *     intl(id: string, params?: object): string;
 *     getLocale(): string;
 *     setLocale(locale: string): void;
 *   }}
 * @since v1.0.17
 */
createIntl(instance: string | object): {
  intlNode(id: string, params?: object): ReactNode;
  intl(id: string, params?: object): string;
  getLocale(): string;
  setLocale(locale: string): void;
};
```

**@since v1.0.17**

##### 示例
```typescript
import { common } from '@alilc/lowcode-engine';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

const { intl, getLocale, setLocale } = common.utils.createIntl({
  'en-US': enUS,
  'zh-CN': zhCN,
});

```

### skeletonCabin
#### Workbench
编辑器框架 View

```typescript
/**
 * 编辑器框架 View
 * get Workbench Component
 */
get Workbench(): Component;
```
