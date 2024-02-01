---
title:  hotkey - 快捷键 API
sidebar_position: 10
---

> **@types** [IPublicApiHotkey](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/hotkey.ts)<br/>
> **@since** v1.0.0

## 模块简介
绑定快捷键 API，可以自定义项目快捷键使用。

## 方法
### bind
绑定快捷键

```typescript
/**
 * 绑定快捷键
 * bind hotkey/hotkeys,
 * @param combos 快捷键，格式如：['command + s'] 、['ctrl + shift + s'] 等
 * @param callback 回调函数
 * @param action
 * @returns
 */
bind(
    combos: string[] | string,
    callback: IPublicTypeHotkeyCallback,
    action?: string,
  ): IPublicTypeDisposable;
```
相关 types
- [IPublicTypeHotkeyCallback](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/hotkey-callback.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)


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
