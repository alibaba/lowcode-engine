---
title: common - 通用 API
sidebar_position: 11
---
# 模块简介
通用模块里包含除了 9 大核心模块 API 之外的所有 API，比如通用 utils、面板扩展相关 等。
> 高能预警：之所以叫 skeletonCabin / designerCabin 跟兼容上一个版本的引擎有关系。若有必要，后面将用更有意义的命名空间来组织这些 API。

# 变量（variables）
### utils
通用 utils，详见下方方法签名

### designerCabin
设计器扩展相关，详见下方方法签名

### skeletonCabin
面板扩展相关，详见下方方法签名

# 方法签名（functions）
## utils
### isNodeSchema
是否为合法的 schema 结构

### isFormEvent
是否为表单事件类型

### getNodeSchemaById
从 schema 结构中查找指定 id 节点

### executeTransaction
批处理事务，用于优化特定场景的性能
*引擎版本 >= 1.0.16
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

### createIntl
i18n 相关工具
*引擎版本 >= 1.0.17
```typescript
import { common } from '@alilc/lowcode-engine';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

const { intl, getLocale, setLocale } = common.utils.createIntl({
  'en-US': enUS,
  'zh-CN': zhCN,
});

```
## designerCabin
### isSettingField
是否是 SettingField 实例

### TransformStage
转换类型枚举对象，包含 init / upgrade / render 等类型，参考 [TransformStage](https://github.com/alibaba/lowcode-engine/blob/4f4ac5115d18357a7399632860808f6cffc33fad/packages/types/src/transform-stage.ts#L1)
##
## skeletonCabin
### Workbench
编辑器框架 View

# 事件（events）
无
