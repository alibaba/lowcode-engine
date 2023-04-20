---
title: 7. 源码面板详解
sidebar_position: 3
---
在源码面板中，您可以完成低代码中的代码部分编写。

## 面板功能拆解

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01pRxmmD1agTBVwCO5x_!!6000000003359-2-tps-2502-1740.png)

### 代码编辑面板

代码编辑面板允许您书写 JavaScript 代码，并支持 JSX 语法。
由于依赖了 Babel，所以书写的 JSX 和 Chrome 80+ 以后的新语法也会被自动编译：

| 编译前 | 编译后 |
| --- | --- |
| ![image.png](https://img.alicdn.com/imgextra/i4/O1CN01xI9RVX1yV46HbW02H_!!6000000006583-2-tps-670-190.png) | ![image.png](https://img.alicdn.com/imgextra/i1/O1CN012exYQL1y37wKM7VFT_!!6000000006522-2-tps-2094-110.png) |
| ![image.png](https://img.alicdn.com/imgextra/i4/O1CN01pK2rPi1lhLij4m3o7_!!6000000004850-2-tps-434-120.png) | ![image.png](https://img.alicdn.com/imgextra/i2/O1CN01ti4n9m1ihOupktQow_!!6000000004444-2-tps-2536-120.png) |


> 注：因为编译结果会被 `@babel/runtime` 干扰，目前面板不支持 `async await`或 `{ ...arr }` 形态的语法编译。如果您需要此类编译，您可以考虑在读取 schema 中的 `originCode` 之后自己手动通过 babel 编译。


#### 全局变量引用

在代码中，您可以通过 window 来引用全局变量。资产包中的 packages 都是通过 UMD 方式引入的对应内容，如果您引入了 Fusion Next（Demo 中默认引入），那么可以通过此方法直接唤起 Fusion Next 的内容，如弹窗提示：
```typescript
window.Next.Message.success('成功')
```
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01Fxjd801p4eigEBpb6_!!6000000005307-2-tps-238-114.png)

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

| 源码面板中 | Schema 中 |
| --- | --- |
| 本地数据初始值设置：![image.png](https://img.alicdn.com/imgextra/i4/O1CN01V6iaTY1gVNHi7gQfK_!!6000000004147-2-tps-370-146.png) | ![image.png](https://img.alicdn.com/imgextra/i2/O1CN010rhIPa268BEfGmzO6_!!6000000007616-2-tps-2098-826.png) |
| 生命周期方法：![image.png](https://img.alicdn.com/imgextra/i4/O1CN010Y1TxV1QOvrVLRUjD_!!6000000001967-2-tps-478-260.png) | ![image.png](https://img.alicdn.com/imgextra/i3/O1CN01pbJzVQ1VSfAL7Lh8G_!!6000000002652-2-tps-2010-836.png) |
| 自定义函数：![image.png](https://img.alicdn.com/imgextra/i4/O1CN01S2gjFk1CU3fm61eiD_!!6000000000083-2-tps-660-642.png) | ![image.png](https://img.alicdn.com/imgextra/i2/O1CN01X35YxU1GUkjj1YWVj_!!6000000000626-2-tps-1862-822.png) |
| 编译前全量代码：![image.png](https://img.alicdn.com/imgextra/i2/O1CN01sbiK9N1kc1Uxp1OHY_!!6000000004703-2-tps-762-1122.png) | ![image.png](https://img.alicdn.com/imgextra/i3/O1CN01adKSg61QXAzRjQ4bm_!!6000000001985-2-tps-1906-796.png) |


- 异常处理：如果代码解析失败，它将无法被正常保存到 schema 中，此时编辑器会弹层提示：

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01aSzh8o26rWRu6zXFE_!!6000000007715-2-tps-3068-1638.png)

### 样式编辑面板

您可以在这里书写 CSS 内容。它对应 schema 中的 css 字段：

| 源码面板中 | Schema 中 |
| --- | --- |
| ![image.png](https://img.alicdn.com/imgextra/i2/O1CN01cuWt4L27fRcW5WIP9_!!6000000007824-2-tps-634-388.png) | ![image.png](https://img.alicdn.com/imgextra/i4/O1CN01Edu7Gy1MzKsb2iss8_!!6000000001505-2-tps-1646-582.png) |


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
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01wcgwOI1wOXDtgfrgD_!!6000000006298-2-tps-2738-1464.png)
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01GYVAw41FlrvEyFcCO_!!6000000000528-2-tps-1528-1166.png)
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
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01B0tvgw1O6x58dbbIb_!!6000000001657-2-tps-2734-1452.png)
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01sD9g2n1tQQ0OjQkcY_!!6000000005896-2-tps-1670-1162.png)
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
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01zXqec823EBaCutOY2_!!6000000007223-2-tps-2738-1452.png)
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01Ze3snL24BGfuRIMCl_!!6000000007352-2-tps-1528-1166.png)
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
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01Kbj6XP297fe0BvhKz_!!6000000008021-2-tps-2746-1460.png)
![image.png](https://img.alicdn.com/imgextra/i1/O1CN018Ogesd1qnN0IOKRDZ_!!6000000005540-2-tps-1528-1166.png)
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
