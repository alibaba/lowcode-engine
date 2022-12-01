---
title: 低代码扩展简述
sidebar_position: 0
---
## 扩展点简述

我们可以从 Demo 的项目中看到页面中有很多的区块：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643447049972-e324320a-7f97-4e48-bef3-a4c5d2b06517.png#clientId=udea0fe9a-4e7e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1080&id=rGr7U&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2160&originWidth=3840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=518455&status=done&style=none&taskId=u872d1136-0f18-41b3-900d-710e9fc9eea&title=&width=1920)
这些功能点背后都是可扩展项目，如下图所示：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643447052089-8e340da7-3c2c-4a88-9ed8-c89516dccf75.png#clientId=udea0fe9a-4e7e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=957&id=lL1sN&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1914&originWidth=3838&originalType=binary&ratio=1&rotation=0&showTitle=false&size=538736&status=done&style=none&taskId=u43e8a14e-0d52-4a22-bd19-e5083814daf&title=&width=1919)

- 插件定制：可以配置低代码编辑器的功能和面板
- 物料定制：可以配置能够拖入的物料
- 操作辅助区定制：可以配置编辑器画布中的操作辅助区功能
- 设置器定制：可以配置编辑器中组件的配置表单

我们从可扩展项目的视角，可以把低代码引擎架构理解为下图：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643447051959-7abb91ea-44af-46e0-b73a-dd2127648b32.png#clientId=udea0fe9a-4e7e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1080&id=M07o7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2160&originWidth=3840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=779021&status=done&style=none&taskId=u640e4616-d38d-45fb-a560-e4a98cd1605&title=&width=1920)
（注：引擎内核中大量数据交互的细节被简化，这张图仅仅强调编辑器和外部扩展的交互）

## 配置扩展点

### 配置物料
通过配置注入物料，这里的配置是物料中心根据物料资产包协议生成的，后面“物料扩展”章节会有详细说明。
```typescript
import { material } from '@alilc/lowcode-engine'
// 假设您已把物料配置在本地
import assets from './assets.json'

// 静态加载 assets
material.setAssets(assets)
```

也可以通过异步加载物料中心上的物料。
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

### 配置插件
可以通过 npm 包的方式引入社区插件，配置如下所示：
```typescript
import { ILowCodePluginContext, plugins } from '@alilc/lowcode-engine'
import PluginIssueTracker from '@alilc/lowcode-plugin-issue-tracker'

// 注册一个提 issue 组件到您的编辑器中，方位默认在左栏下侧
plugins.register(PluginIssueTracker)
  .catch(err => console.error(err))
```
后续“插件扩展”章节会详细说明。

### 配置设置器
低代码引擎默认内置了设置器（详见“配置设置器”章节）。您可以通过 npm 包的方式引入自定义的设置器，配置如下所示：
```typescript
import { setters } from '@alilc/lowcode-engine'
// 假设您自定义了一个 setter
import MuxMonacoEditorSetter from './components/setters/MuxMonacoEditorSetter'

// 注册设置器
setters.registerSetter({
  MuxMonacoEditorSetter: {
    component: MuxMonacoEditorSetter,
    title: 'Textarea',
    condition: (field) => {
      const v = field.getValue()
      return typeof v === 'string'
    },
  },
})
```
后续“设置器扩展”章节会详细说明。

> 本章节所有可扩展配置内容在 demo 中均可找到：[https://github.com/alibaba/lowcode-demo/blob/main/src/universal/plugin.tsx](https://github.com/alibaba/lowcode-demo/blob/main/src/universal/plugin.tsx)
