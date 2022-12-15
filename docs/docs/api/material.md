---
title: material - 物料 API
sidebar_position: 2
---
# 模块简介
负责物料相关的 API，包括资产包、设计器辅助层、物料元数据和物料元数据管道函数。

# 变量（variables）
## componentsMap
获取组件 map 结构

# 方法签名（functions）
## 资产包
### setAssets
设置「[资产包](/site/docs/specs/lowcode-spec#2-协议结构)」结构

**类型定义**
```typescript
function setAssets(assets: AssetsJson): void;
```

**示例**
直接在项目中引用 npm 包
```javascript
import { material } from '@alilc/lowcode-engine';
import assets from '@alilc/mc-assets-<siteId>/assets.json';

material.setAssets(assets);
```

通过物料中心接口动态引入资产包
```typescript
import { ILowCodePluginContext, material, plugins } from '@alilc/lowcode-engine'

// 动态加载 assets
plugins.register((ctx: ILowCodePluginContext) => {
  return {
    name: 'ext-assets',
    async init() {
      try {
        // 将下述链接替换为您的物料即可。无论是通过 utils 从物料中心引入，还是通过其他途径如直接引入物料描述
        const res = await window.fetch('https://fusion.alicdn.com/assets/default@0.1.95/assets.json')
        const assets = await res.text()
        material.setAssets(assets)
      } catch (err) {
        console.error(err)
      }
    },
  }
}).catch(err => console.error(err))
```

### getAssets
获取「资产包」结构
**类型定义**
```typescript
function getAssets(): AssetsJson;
```


**示例**
```typescript
import { material } from '@alilc/lowcode-engine';

material.getAssets();
```

### loadIncrementalAssets
加载增量的「资产包」结构，该增量包会与原有的合并

**类型定义**
```typescript
function loadIncrementalAssets(incrementalAssets: AssetsJson): void;
```
说明：**该增量包会与原有的合并**

**示例**
```typescript
import { material } from '@alilc/lowcode-engine';
import assets1 from '@alilc/mc-assets-<siteId>/assets.json';
import assets2 from '@alilc/mc-assets-<siteId>/assets.json';

material.setAssets(assets1);
material.loadIncrementalAssets(assets2);
```
## 设计器辅助层
### addBuiltinComponentAction
在设计器辅助层增加一个扩展 action
**类型定义**
```typescript
function addBuiltinComponentAction(action: ComponentAction): void;

export interface ComponentAction {
  /**
   * behaviorName
   */
  name: string;
  /**
   * 菜单名称
   */
  content: string | ReactNode | ActionContentObject;
  /**
   * 子集
   */
  items?: ComponentAction[];
  /**
   * 显示与否
   * always: 无法禁用
   */
  condition?: boolean | ((currentNode: any) => boolean) | 'always';
  /**
   * 显示在工具条上
   */
  important?: boolean;
}

export interface ActionContentObject {
  /**
   * 图标
   */
  icon?: IconType;
  /**
   * 描述
   */
  title?: TipContent;
  /**
   * 执行动作
   */
  action?: (currentNode: any) => void;
}

export type IconType = string | ReactElement | ComponentType<any> | IconConfig;
```


**示例**
新增设计扩展位，并绑定事件
```typescript
import { material } from '@alilc/lowcode-engine';

material.addBuiltinComponentAction({
  name: 'myIconName',
  content: {
      icon: () => 'x',
      title: 'hover title',
      action(node) {
          console.log('myIconName 扩展位被点击');
      }
  },
  important: true,
  condition: true,
});
```
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01jDbN7B1KfWVzJ16tw_!!6000000001191-2-tps-230-198.png)

### removeBuiltinComponentAction
移除设计器辅助层的指定 action
**类型定义**
```typescript
function removeBuiltinComponentAction(name: string): void;
```

**示例**
```typescript
import { material } from '@alilc/lowcode-engine';

material.removeBuiltinComponentAction('myIconName');
```


### modifyBuiltinComponentAction
修改已有的设计器辅助层的指定 action
**类型定义**
```typescript
function modifyBuiltinComponentAction(
  actionName: string,
  handle: (action: ComponentAction) => void
): void;
```
**内置设计器辅助 name**

- remove：删除
- hide：隐藏
- copy：复制
- lock：锁定，不可编辑
- unlock：解锁，可编辑



**示例**
给原始的 remove 扩展时间添加执行前后的日志
```typescript
import { material } from '@alilc/lowcode-engine';

material.modifyBuiltinComponentAction('remove', (action) => {
  const originAction = action.content.action;
  action.content.action = (node) => {
  	console.log('before reomve!');
    originAction(node);
    console.log('after remove!');
  }
});
```
###
## 物料元数据
### getComponentMeta
获取指定名称的物料元数据
**类型定义**
```typescript
function getComponentMeta(componentName: string): ComponentMeta;
```

**示例**
```typescript
import { material } from '@alilc/lowcode-engine';

material.getComponentMeta('Input');
```

### getComponentMetasMap
获取所有已注册的物料元数据
**类型定义**
```typescript
function getComponentMetasMap(): new Map<string, ComponentMeta>;
```

**示例**
```typescript
import { material } from '@alilc/lowcode-engine';

material.getComponentMetasMap();
```


## 物料元数据管道函数
### registerMetadataTransducer
注册物料元数据管道函数，在物料信息初始化时执行。
**类型定义**
```typescript
function registerMetadataTransducer(
  transducer: MetadataTransducer, // 管道函数
  level?: number,                 // 优先级
  id?: string | undefined,        // id
): void;
```

**示例**
给每一个组件的配置添加高级配置面板，其中有一个是否渲染配置项
```typescript
import { material } from '@alilc/lowcode-engine'

function addonCombine(metadata: TransformedComponentMetadata) {
  const { componentName, configure = {} } = metadata;
  const advanceGroup = [];
  const combined: FieldConfig[] = [];

  advanceGroup.push({
    name: getConvertedExtraKey('condition'),
    title: { type: 'i18n', 'zh-CN': '是否渲染', 'en-US': 'Condition' },
    defaultValue: true,
    setter: [
      {
        componentName: 'BoolSetter',
      },
      {
        componentName: 'VariableSetter',
      },
    ],
    extraProps: {
      display: 'block',
    },
  });

  combined.push({
    name: '#advanced',
    title: { type: 'i18n', 'zh-CN': '高级', 'en-US': 'Advanced' },
    items: advanceGroup,
  });

  return {
    ...metadata,
    configure: {
      ...configure,
      combined,
    },
  };
}

material.registerMetadataTransducer(addonCombine, 1, 'parse-func');
```

### getRegisteredMetadataTransducers
获取所有物料元数据管道函数
**类型定义**
```typescript
function getRegisteredMetadataTransducers(): MetadataTransducer[];
```

**示例**
```typescript
import { material } from '@alilc/lowcode-engine'

material.getRegisteredMetadataTransducers('parse-func');
```
##
# 事件（Event）
### onChangeAssets
监听 assets 变化的事件
**类型定义**
```typescript
function onChangeAssets(fn: () => void): void;
```
**示例**
```typescript
import { material } from '@alilc/lowcode-engine';

material.onChangeAssets(() => {
  console.log('asset changed');
});
```
