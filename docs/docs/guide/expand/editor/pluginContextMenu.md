---
title: 插件扩展-编排扩展
sidebar_position: 6
---
## 场景一：扩展选中节点操作项
### 增加节点操作项
![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1647693318212-173890bc-b0b5-437b-9802-4b1fd9f74c5a.png#clientId=u2eca2bba-d284-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=254&id=u55228975&margin=%5Bobject%20Object%5D&name=image.png&originHeight=292&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&size=38144&status=done&style=none&taskId=u426cac9f-24ad-4d06-adbe-faca1896eaa&title=&width=1080)
选中节点后，在选中框的右上角有操作按钮，编排模块默认实现了查看组件直系父节点、复制节点和删除节点按钮外，还可以通过相关 API 来扩展更多操作，如下代码：
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { Icon, Message } from '@alifd/next';

const addHelloAction = (ctx: ILowCodePluginContext) => {
  return {
    async init() {
      const { addBuiltinComponentAction } = ctx.material;
      addBuiltinComponentAction({
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
    }
  };
}
addHelloAction.pluginName = 'addHelloAction';
await plugins.register(addHelloAction);
```
**_效果如下：_**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1647694920149-b8d9a534-b943-45d2-b67e-cc42b906f827.png#clientId=u2eca2bba-d284-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=282&id=ua20a09c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=343&originWidth=1315&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35131&status=done&style=none&taskId=u3f47b55d-15ff-495c-8615-31e3ccb0222&title=&width=1080)
具体 API 参考：[https://www.yuque.com/lce/doc/mu7lml#ieJzi](https://www.yuque.com/lce/doc/mu7lml#ieJzi)
### 删除节点操作项
```typescript
import { plugins } from '@alilc/lowcode-engine';

const removeCopyAction = (ctx: ILowCodePluginContext) => {
  return {
    async init() {
      const { removeBuiltinComponentAction } = ctx.material;
      removeBuiltinComponentAction('copy');
    }
  }
}
removeCopyAction.pluginName = 'removeCopyAction';
await plugins.register(removeCopyAction);
```
**_效果如下：_**
![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1647695353667-e22bef51-3c6a-4b6a-87d2-c144ddb68115.png#clientId=u2eca2bba-d284-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=237&id=ufa1f9434&margin=%5Bobject%20Object%5D&name=image.png&originHeight=290&originWidth=1319&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22495&status=done&style=none&taskId=u73e01acc-96e8-45e7-9d42-a31edca193e&title=&width=1080)
具体 API 参考：[https://www.yuque.com/lce/doc/mu7lml#va9mb](https://www.yuque.com/lce/doc/mu7lml#va9mb)
## 实际案例
### 区块管理

- 仓库地址：[https://github.com/alibaba/lowcode-plugins](https://github.com/alibaba/lowcode-plugins)
- 具体代码：[https://github.com/alibaba/lowcode-plugins/tree/main/packages/action-block](https://github.com/alibaba/lowcode-plugins/tree/main/packages/action-block)
- 直播回放：
   - [低代码引擎项目实战(9)-区块管理(1)-保存为区块](https://www.bilibili.com/video/BV1YF411M7RK/)
   - [低代码引擎项目实战(10)-区块管理-区块面板](https://www.bilibili.com/video/BV1FB4y1S7tu/)
   - [阿里巴巴低代码引擎项目实战(11)-区块管理- ICON优化](https://www.bilibili.com/video/BV1zr4y1H7Km/)
   - [阿里巴巴低代码引擎项目实战(11)-区块管理-自动截图](https://www.bilibili.com/video/BV1GZ4y117VH/)
   - [阿里巴巴低代码引擎项目实战(11)-区块管理-样式优化](https://www.bilibili.com/video/BV1Pi4y1S7ZT/)
   - [阿里低代码引擎项目实战(12)-区块管理(完结)-给引擎插件提个 PR](https://www.bilibili.com/video/BV1hB4y1277o/)
