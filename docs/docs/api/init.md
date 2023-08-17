---
title: init - 初始化 API
sidebar_position: 10
---

> **@since** v1.0.0


## 模块简介
提供 init 等方法
## 方法
#### init
初始化引擎

**方法定义**
```typescript
function init(container?: Element, options?: IPublicTypeEngineOptions): void
```

[**初始化引擎配置参数列表**](./configOptions)


## 使用示例
```typescript
import { init } from '@alilc/lowcode-engine';

init(document.getElementById('engine'), {
  enableCondition: false,
});
```

### 默认打开移动端画布
```typescript
import { init } from '@alilc/lowcode-engine';

init({
  device: 'mobile',
});
```

### 使用 utils 第三方工具扩展
```json
import { init } from '@alilc/lowcode-engine';

init({
  device: 'mobile',
  appHelper: {
    utils: {
      xxx: () => {console.log('123')},
    }
  }
});
```

在引擎中即可这样使用。
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01FWvu051OxAEYrHBy5_!!6000000001771-2-tps-3584-1796.png)
