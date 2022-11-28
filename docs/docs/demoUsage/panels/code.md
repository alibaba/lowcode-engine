---
title: 7. 源码面板详解
sidebar_position: 3
---
在源码面板中，您可以完成低代码中的代码部分编写。

## 面板功能拆解

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644897390779-cefb2c31-82fc-44f4-b824-adc32569ac6f.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=870&id=u23446c19&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1740&originWidth=2502&originalType=binary&ratio=1&rotation=0&showTitle=false&size=865371&status=done&style=none&taskId=u44e2b188-c268-4a30-a628-76a046be9d4&title=&width=1251)

### 代码编辑面板

代码编辑面板允许您书写 JavaScript 代码，并支持 JSX 语法。
由于依赖了 Babel，所以书写的 JSX 和 Chrome 80+ 以后的新语法也会被自动编译：

| 编译前 | 编译后 |
| --- | --- |
| ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644897774925-b54126e0-ff6b-445e-bc68-569731aef8c3.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=95&id=nhuiT&margin=%5Bobject%20Object%5D&name=image.png&originHeight=190&originWidth=670&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25045&status=done&style=none&taskId=u323192f6-7cfa-4d73-a184-2699f648c6f&title=&width=335) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644897840129-83fe9a81-d8b2-4873-8764-904f531ec959.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=55&id=u3ba8300e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=110&originWidth=2094&originalType=binary&ratio=1&rotation=0&showTitle=false&size=44006&status=done&style=none&taskId=uef1552e3-ccdb-45dd-95d5-187a6c6b7df&title=&width=1047) |
| ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644897884917-641b1547-7b90-4f78-86c1-0cc51996623d.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=60&id=u5fa00781&margin=%5Bobject%20Object%5D&name=image.png&originHeight=120&originWidth=434&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17421&status=done&style=none&taskId=uecee8fbf-a786-4f89-ac9c-f2f8d059fe0&title=&width=217) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644897915892-a1784bc2-693b-4cf6-a082-3c8e0368a987.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=60&id=ubcca6a46&margin=%5Bobject%20Object%5D&name=image.png&originHeight=120&originWidth=2536&originalType=binary&ratio=1&rotation=0&showTitle=false&size=50743&status=done&style=none&taskId=ue0f418e0-4192-4bfd-8912-9b64faedb66&title=&width=1268) |


> 注：因为编译结果会被 `@babel/runtime` 干扰，目前面板不支持 `async await`或 `{ ...arr }` 形态的语法编译。如果您需要此类编译，您可以考虑在读取 schema 中的 `originCode` 之后自己手动通过 babel 编译。


#### 全局变量引用

在代码中，您可以通过 window 来引用全局变量。资产包中的 packages 都是通过 UMD 方式引入的对应内容，如果您引入了 Fusion Next（Demo 中默认引入），那么可以通过此方法直接唤起 Fusion Next 的内容，如弹窗提示：
```typescript
window.Next.Message.success('成功')
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644898647058-9a5d6800-31fd-4c62-a577-850b90fc5d21.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=57&id=ue6231d61&margin=%5Bobject%20Object%5D&name=image.png&originHeight=114&originWidth=238&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11360&status=done&style=none&taskId=u869f3709-a599-4ead-a80f-fa3b49c9836&title=&width=119)

#### 局部变量引用

您可以在成员函数中访问到如下变量：

- `this.state`
- `this.setState`
- `this.context.appHelper.utils`
- `this.context.appHelper.constants`
- `this.context.appHelper.requestHandlerMap`
- `this.context.components`

#### 读、写与异常处理

- 读取：每次打开面板时，都会尝试读取 schema 中的 originCode 字段，如果没有，则从 schema 上的字段还原代码；
- 写入：在关闭代码编辑面板（主动点击叉或者点击非代码编辑区块的被动关闭都算）时，将自动写入到 schema 中；您也可以在编辑过程中点击“保存”按钮手动保存；
| 源码面板中 | schema 中 |
| --- | --- |
| 本地数据初始值设置：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899552013-3de394fd-f530-4b4f-8258-8b9c64f11c11.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=73&id=u291f7733&margin=%5Bobject%20Object%5D&name=image.png&originHeight=146&originWidth=370&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17505&status=done&style=none&taskId=u55496884-bc04-4867-9295-c71f44b77ef&title=&width=185) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899587782-0ceea074-07bb-4260-a580-7f49a82740ed.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=413&id=u01ae12cb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=826&originWidth=2098&originalType=binary&ratio=1&rotation=0&showTitle=false&size=776122&status=done&style=none&taskId=ube04795b-6244-4aac-9ebc-f4624e605db&title=&width=1049) |
| 生命周期方法：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899759963-d198edc4-a8c7-4a3f-90ee-b42244398958.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=130&id=uafcbf72e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=260&originWidth=478&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37208&status=done&style=none&taskId=u19b58f72-7058-4a22-9a8e-334a9a541bd&title=&width=239) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899791416-a7969846-8d7d-4c51-9c55-6b1c65faf07b.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=418&id=uc6edd06d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=836&originWidth=2010&originalType=binary&ratio=1&rotation=0&showTitle=false&size=806116&status=done&style=none&taskId=uacb7cf67-ee4b-45ba-962a-24f43b525bc&title=&width=1005) |
| 自定义函数：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899808831-538e59a7-6d40-4e1a-bd72-bd2332bb9d7c.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=321&id=u2ea3e043&margin=%5Bobject%20Object%5D&name=image.png&originHeight=642&originWidth=660&originalType=binary&ratio=1&rotation=0&showTitle=false&size=72124&status=done&style=none&taskId=uc6ec76e1-89a0-4dad-a0ab-053730e2b4d&title=&width=330) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899830711-e262e41e-8332-4810-9293-bd4ef540c919.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=411&id=ueb7c1ad8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=822&originWidth=1862&originalType=binary&ratio=1&rotation=0&showTitle=false&size=815729&status=done&style=none&taskId=u3aae2a2e-4de4-468a-bd5a-5bec53b908a&title=&width=931) |
| 编译前全量代码：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899850193-0b1990ea-e494-4c5f-94ef-9a1fdbde0a98.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=561&id=u92136fdf&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1122&originWidth=762&originalType=binary&ratio=1&rotation=0&showTitle=false&size=165346&status=done&style=none&taskId=u727c08ae-f56f-4632-acc0-837fa220681&title=&width=381) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899882162-648366a3-5b0b-4cf3-b103-bf3812f6e807.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=398&id=ub882b04a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=796&originWidth=1906&originalType=binary&ratio=1&rotation=0&showTitle=false&size=716114&status=done&style=none&taskId=u94d53b7d-5ea9-471a-b82c-3dec1a532b5&title=&width=953) |


- 异常处理：如果代码解析失败，它将无法被正常保存到 schema 中，此时编辑器会弹层提示：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899252223-57317fcb-0958-4f38-a37b-00eaa5561512.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=819&id=u2d66f54c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1638&originWidth=3068&originalType=binary&ratio=1&rotation=0&showTitle=false&size=473979&status=done&style=none&taskId=u9e4a4c69-dd56-4265-93d7-9b2e4e8971a&title=&width=1534)

### 样式编辑面板

您可以在这里书写 CSS 内容。它对应 schema 中的 css 字段：

| 源码面板中 | Schema 中 |
| --- | --- |
| ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899312003-76f4c95e-221f-4b5f-92ae-c51e664385e0.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=194&id=u30912dec&margin=%5Bobject%20Object%5D&name=image.png&originHeight=388&originWidth=634&originalType=binary&ratio=1&rotation=0&showTitle=false&size=42979&status=done&style=none&taskId=ue2a18106-55f3-4cff-8f95-904317d0419&title=&width=317) | ![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899355488-aa352d2d-a001-434f-9368-021befea52ed.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=291&id=u60b8f9d4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=582&originWidth=1646&originalType=binary&ratio=1&rotation=0&showTitle=false&size=454443&status=done&style=none&taskId=u236b94fb-6c20-4c6c-9fe3-7cd75eef0c4&title=&width=823) |


## 对接代码

### 生命周期对接
如果您书写了视图相关的声明周期方法，那么对应的方法会在视图的特定周期被调用。支持的生命周期函数在《阿里巴巴中后台前端搭建协议规范》中被定义，包含：
```typescript
{
  componentDidMount(): void;
  constructor(props: Record<string, any>, context: any);
  render(): void;
  componentDidUpdate(prevProps: Record<string, any>, prevState: Record<string, any>, snapshot: Record<string, any>): void;
  componentWillUnmount(): void;
  componentDidCatch(error: Error, info: any): void;
}
```

### 设置器面板对接

书写完了函数 / state 后，您可以在右侧的设置器面板中配置对代码的部分。

通常书写代码是为了对接低代码配置中的“变量绑定”、“事件回调”、“条件判断”和“循环”部分的。

#### 变量绑定
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644899977727-f4f44171-52e8-4062-b558-436536b84640.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=732&id=ua42e46e3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1464&originWidth=2738&originalType=binary&ratio=1&rotation=0&showTitle=false&size=957243&status=done&style=stroke&taskId=u56f7f36d-535d-48e9-8a0c-e0cb1f9af1d&title=&width=1369)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900005551-14c356a0-2e51-4b0b-82b5-8a135d1c6c3e.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=583&id=ufcb9db2b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1166&originWidth=1528&originalType=binary&ratio=1&rotation=0&showTitle=false&size=153133&status=done&style=stroke&taskId=u208e369b-f019-4019-8c2e-4c28b6eba91&title=&width=764)
```json
{
  "componentName": "NextBlockCell",
  "id": "node_ockzmje8tf5",
  "props": {
    "bodyPadding": {
      "type": "JSExpression",
      "value": "this.state.text",
      "mock": ""
    }
  }
}
```


#### 事件回调
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900095962-2ec54fb5-e1f8-4d4a-a75e-24e1c685a833.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=726&id=ufed11f2e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1452&originWidth=2734&originalType=binary&ratio=1&rotation=0&showTitle=false&size=749908&status=done&style=stroke&taskId=uc379b8ec-c344-48f8-9b43-8d9be961356&title=&width=1367)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900119673-f9538274-c896-4951-86f2-54d60ac95316.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=581&id=uffdcbbce&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1162&originWidth=1670&originalType=binary&ratio=1&rotation=0&showTitle=false&size=118712&status=done&style=stroke&taskId=u261a9b7f-9f5a-406a-aa55-8a3f33bdd05&title=&width=835)
```json
{
  "componentName": "Filter",
  "id": "node_ockzmj0cl11w",
  "props": {
    "__events": {
      "eventDataList": [
        {
          "type": "componentEvent",
          "name": "onSearch",
          "relatedEventName": "closeDialog"
        }
      ]
    },
    "onSearch": {
      "type": "JSFunction",
      "value": "function(){this.onSearch.apply(this,Array.prototype.slice.call(arguments).concat([])) }"
    }
  }
}
```

#### 条件判断
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900186943-de6b33de-adca-4c1b-8f47-f68cf6ce5f77.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=726&id=u23b46226&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1452&originWidth=2738&originalType=binary&ratio=1&rotation=0&showTitle=false&size=789132&status=done&style=stroke&taskId=u6322e6a8-bea3-47d8-a374-b9ec6558bb9&title=&width=1369)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900005551-14c356a0-2e51-4b0b-82b5-8a135d1c6c3e.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=583&id=G2uKJ&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1166&originWidth=1528&originalType=binary&ratio=1&rotation=0&showTitle=false&size=153133&status=done&style=stroke&taskId=u208e369b-f019-4019-8c2e-4c28b6eba91&title=&width=764)
```json
{
  "componentName": "Filter",
  "id": "node_ockzmj0cl11w",
  "condition": {
    "type": "JSExpression",
    "value": "this.state.text",
    "mock": true
  }
}
```

#### 循环
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900265929-c21c9927-1f34-49b6-9dc6-bcb4357190be.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=730&id=u8f457b1e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1460&originWidth=2746&originalType=binary&ratio=1&rotation=0&showTitle=false&size=781151&status=done&style=stroke&taskId=u92be7d31-2070-4a08-bc1c-6b1a599c682&title=&width=1373)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644900005551-14c356a0-2e51-4b0b-82b5-8a135d1c6c3e.png#clientId=ud3fa1588-e66f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=583&id=ot5cO&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1166&originWidth=1528&originalType=binary&ratio=1&rotation=0&showTitle=false&size=153133&status=done&style=stroke&taskId=u208e369b-f019-4019-8c2e-4c28b6eba91&title=&width=764)
```json
{
  "componentName": "Filter",
  "id": "node_ockzmj0cl11w",
  "loop": {
    "type": "JSExpression",
    "value": "this.state.text",
    "mock": true
  }
}
```
