---
title:  hotkey - 快捷键 API
sidebar_position: 5
---
## 模块简介
绑定快捷键 API，可以自定义项目快捷键使用。

## 方法签名（functions）
### bind
绑定快捷键

**类型定义**
```typescript
function bind(
	combos: string[] | string,
	callback: (e: KeyboardEvent, combo?: string) => any | false,
	action?: string
): () => void;
```

**示例**
```typescript
hotkey.bind('command+s', (e) => {
  e.preventDefault();
  // command+s 快捷键按下时需要执行的逻辑
});
```

## 使用示例
### 基础示例
```typescript
hotkey.bind('command+s', (e) => {
  e.preventDefault();
  // command+s 快捷键按下时需要执行的逻辑
});
```

### 同时绑定多个快捷键
```typescript
hotkey.bind(['command+s', 'command+c'], (e) => {
  e.preventDefault();
  // command+s 或者 command+c 快捷键按下时需要执行的逻辑
});
```

### 保存快捷键配置
```typescript
import {
  hotkey,
} from '@alilc/lowcode-engine';

function saveSchema(schema) {
  // 保存 schema 相关操作
}

const saveSampleHotKey = (ctx: IPublicModelPluginContext) => {
  return {
    name: 'saveSample',
    async init() {
      hotkey.bind('command+s', (e) => {
        e.preventDefault();
        saveSchema();
      });
    },
  };
}

saveSampleHotKey.pluginName = 'saveSampleHotKey';
plugins.register(saveSampleHotKey);
```
