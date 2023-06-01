---
title: 插件扩展 - 编排扩展
sidebar_position: 6
---

## 场景一：扩展选中节点操作项

### 增加节点操作项
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01J7PrJc1S86XNDBIFQ_!!6000000002201-2-tps-1240-292.png)

选中节点后，在选中框的右上角有操作按钮，编排模块默认实现了查看组件直系父节点、复制节点和删除节点按钮外，还可以通过相关 API 来扩展更多操作，如下代码：

```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Icon, Message } from '@alifd/next';

const addHelloAction = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      ctx.material.addBuiltinComponentAction({
        name: 'hello',
        content: {
          icon: <Icon type="atm" />,
          title: 'hello',
          action(node: Node) {
            Message.show('Welcome to Low-Code engine');
          },
        },
        condition: (node: Node) => {
          return node.componentMeta.componentName === 'NextTable';
        },
        important: true,
      });
    },
  };
};
addHelloAction.pluginName = 'addHelloAction';
await plugins.register(addHelloAction);
```

**_效果如下：_**

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01O8W2H61ybw2b7K5nV_!!6000000006598-2-tps-1315-343.png)

具体 API 参考：[API 文档](/site/docs/api/material#addbuiltincomponentaction)
### 删除节点操作项

```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const removeCopyAction = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      ctx.material.removeBuiltinComponentAction('copy');
    }
  }
};
removeCopyAction.pluginName = 'removeCopyAction';
await plugins.register(removeCopyAction);
```

**_效果如下：_**

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01Gfnu8J1O7PTRdoFQZ_!!6000000001658-2-tps-1319-290.png)

具体 API 参考：[API 文档](/site/docs/api/material#removebuiltincomponentaction)

## 实际案例

### 区块管理

- 仓库地址：[https://github.com/alibaba/lowcode-plugins](https://github.com/alibaba/lowcode-plugins)
- 具体代码：[https://github.com/alibaba/lowcode-plugins/tree/main/packages/action-block](https://github.com/alibaba/lowcode-plugins/tree/main/packages/action-block)
- 直播回放：
   - [低代码引擎项目实战 (9)-区块管理 (1)-保存为区块](https://www.bilibili.com/video/BV1YF411M7RK/)
   - [低代码引擎项目实战 (10)-区块管理 - 区块面板](https://www.bilibili.com/video/BV1FB4y1S7tu/)
   - [阿里巴巴低代码引擎项目实战 (11)-区块管理 - ICON 优化](https://www.bilibili.com/video/BV1zr4y1H7Km/)
   - [阿里巴巴低代码引擎项目实战 (11)-区块管理 - 自动截图](https://www.bilibili.com/video/BV1GZ4y117VH/)
   - [阿里巴巴低代码引擎项目实战 (11)-区块管理 - 样式优化](https://www.bilibili.com/video/BV1Pi4y1S7ZT/)
   - [阿里低代码引擎项目实战 (12)-区块管理 (完结)-给引擎插件提个 PR](https://www.bilibili.com/video/BV1hB4y1277o/)
