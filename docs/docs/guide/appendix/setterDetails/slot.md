---
title: SlotSetter
---
## 简介
通过一个开启一个slot（插槽），可以在物料特定的一个位置渲染一个或者多个节点。slot比较适合物料的局部自定义渲染。

## 展示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643448654034-6f527cc2-cf65-4e79-b904-21416800b5b8.png#clientId=u091bb73f-2e93-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=227&id=gAVIU&margin=%5Bobject%20Object%5D&name=image.png&originHeight=454&originWidth=588&originalType=binary&ratio=1&rotation=0&showTitle=false&size=103838&status=done&style=none&taskId=u45d2e179-54ea-40d1-a654-66151c337ff&title=&width=294)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644395677385-84c39b6d-2356-4d86-a741-edbb7daffd6c.png#clientId=udcc199c0-6236-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=82&id=u999c2367&margin=%5Bobject%20Object%5D&name=image.png&originHeight=164&originWidth=644&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18486&status=done&style=none&taskId=u6c13f469-173f-4ba0-9bfa-866122ef7a4&title=&width=322)

## setter 配置

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| initialValue | Object | 默认值
{
"type": "JSSlot",
"params": [
"module"
       ],
"value": []
}

params:接收函数的入参，可以直接在slot节点中消费，通过this.module (这里module是示例值，可根据实际函数入参更改)
value:可以定义一个节点，每次打开插槽的时候默认填充一个节点

 |
| hideParams | boolean | 是否隐藏入参，注意该值只能隐藏入参的输入框，适合单行展示，实际渲染的时候，还是会传入params的参数，和params:[]不同 |
| checkedText | string | switch选中文案，默认显示"启用" |
| unCheckedText | string | switch取消文案，默认显示"关闭" |

## 配置示例
### 普通示例
#### 配置
```typescript
{
    name: "propName",
    title: "propTitle",
    setter: {
      componentName: "SlotSetter",
      isRequired: true,
      title: "组件坑位",
      initialValue: {
        type: "JSSlot",
        value: []
      },
    }
  }
```
#### 组件
```typescript
function A(props) {
  return props.propName;
}
```
### 带参数的插槽示例
#### 配置
```typescript
{
    name: "propName",
    title: "propTitle",
    setter: {
      componentName: "SlotSetter",
      isRequired: true,
      title: "组件坑位",
      initialValue: {
        type: "JSSlot",
        params: [
          "module"
        ],
        value: []
      },
    }
  }
```
#### 组件
组件需要传参数进行渲染，和普通示例的使用不一样。
```typescript
function A(props) {
  const module = []
  return props.propName(module);
}
```
#### param 使用示例
1.开启插槽
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652877673290-7a377a36-7da9-40c1-baff-1c7c8ad04a67.png#clientId=udd177887-e136-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=900&id=u9ba2344a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1800&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1291582&status=done&style=none&taskId=u60418282-46e2-46b4-95d2-156288bcbd7&title=&width=1792)
2.拖拽组件到插槽中
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652877759606-6de16048-a5d9-477c-b38b-962690a39254.png#clientId=udd177887-e136-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=903&id=u43b38264&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1806&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1230647&status=done&style=none&taskId=u96d44a1e-033f-4cd0-ac81-df6cac8ea18&title=&width=1792)

3.在插槽内组件中使用变量绑定，绑定 this.xxx
xxx 入参的配置
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652877586491-904d6b18-a41a-4ba2-8664-088cd5feca72.png#clientId=udd177887-e136-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=903&id=u165f1564&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1806&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1278387&status=done&style=none&taskId=uc060e73a-b190-480a-8aad-8c20b27290c&title=&width=1792)
