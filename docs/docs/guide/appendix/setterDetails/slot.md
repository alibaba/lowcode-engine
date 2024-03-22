---
title: SlotSetter
---

## 简介

通过一个开启一个 slot（插槽），可以在物料特定的一个位置渲染一个或者多个节点。slot 比较适合物料的局部自定义渲染。

## 展示

<img src="https://img.alicdn.com/imgextra/i3/O1CN01DwFQ221ks3MDXhk36_!!6000000004738-2-tps-588-454.png" width="300"/>

<br/>
<br/>

<img src="https://img.alicdn.com/imgextra/i1/O1CN01pQC6EE1bWDwIkVq2z_!!6000000003472-2-tps-644-164.png" width="300"/>

## setter 配置

| 属性名        | 类型    | 说明                                                                                                                                                                                                                                        |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialValue  | Object  | 默认值 `{ "type": "JSSlot", "params": [ "module" ], "value": [] }` params:接收函数的入参，可以直接在slot节点中消费，通过this.module (这里module是示例值，可根据实际函数入参更改) value:可以定义一个节点，每次打开插槽的时候默认填充一个节点 |
| hideParams    | boolean | 是否隐藏入参，注意该值只能隐藏入参的输入框，适合单行展示，实际渲染的时候，还是会传入 params 的参数，和 params:[] 不同                                                                                                                       |
| checkedText   | string  | switch 选中文案，默认显示"启用"                                                                                                                                                                                                             |
| unCheckedText | string  | switch 取消文案，默认显示"关闭"                                                                                                                                                                                                             |

## 配置示例

### 配置

```typescript
{
    name: 'propName',
    title: 'propTitle',
    setter: {
      componentName: 'SlotSetter',
      isRequired: true,
      title: '组件坑位',
      initialValue: {
        type: 'JSSlot',
        value: [],
      },
    }
  }
```

### 组件

```typescript
function A(props) {
  return props.propName;
}
```

## 带参数的插槽示例

### 配置

```typescript
{
  name: 'propName',
  title: 'propTitle',
  setter: {
    componentName: 'SlotSetter',
    isRequired: true,
    title: '组件坑位',
    initialValue: {
      type: 'JSSlot',
      params: [ 'module'],
      value: [],
    },
  }
}
```

### 组件

组件需要传参数进行渲染，和普通示例的使用不一样。

```typescript
function A(props) {
  const module = [];
  return props.propName(module);
}
```

### param 使用示例

1.开启插槽

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01RlOXAV1TbFMBZa6xq_!!6000000002400-2-tps-3584-1800.png)

2.拖拽组件到插槽中

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01NNiWLs26961orvk9i_!!6000000007618-2-tps-3584-1806.png)

3.在插槽内组件中使用变量绑定，绑定 this.xxx

xxx 入参的配置

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01cBn2ym1XF2cDZo5Yp_!!6000000002893-2-tps-3584-1806.png)
