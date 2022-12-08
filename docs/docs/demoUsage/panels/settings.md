---
title: 6. 设置面板详解
sidebar_position: 2
---
# 设置器介绍
## 展示区域
设置器，又称为 Setter，主要展示在编辑器的右边区域，如下图：
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01jN0toi1OknXWrPuYt_!!6000000001744-2-tps-3836-1730.png)
其中包含 属性、样式、事件、高级

- 属性：展示该物料常规的属性
- 样式：展示该物料样式的属性
- 事件：如果该物料有声明事件，则会出现事件面板，用于绑定事件。
- 高级：两个逻辑相关的属性，**条件渲染**和**循环**



## 设置器
上述区域中是有多项设置器的，对于一个组件来说，每一项配置都对应一个设置器，比如我们的配置是一个文本，我们需要的是文本设置器，我们需要配置的是数字，我们需要的就是数字设置器。
下图中的标题和按钮类型配置就分别是文本设置器和下拉框设置器。
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01Bl2hgm1GiUcXD3TOO_!!6000000000656-2-tps-2120-1460.png)
我们提供了常用的设置器作为内置设置器，也提供了定制能力帮助大家开发特定需求的设置器。
# 内置设置器
| **预置 Setter** | **用途** |
| --- | --- |
| StringSetter | 短文本型数据设置器，不可换行 |
| NumberSetter | 数值型数据设置器， |
| BoolSetter | 布尔型数据设置器， |
| SelectSetter | 枚举型数据设置器，采用下拉的形式展现 |
| VariableSetter | 变量型数据设置器， |
| RadioGroupSetter | 枚举型数据设置器，采用 tab 选择的形式展现 |
| TextAreaSetter | 长文本型数据设置器，可换行 |
| DateSetter | 日期型数据设置器 |
| TimePicker | 时间型数据设置器 |
| DateYearSetter | 日期型 - 年数据设置器 |
| DateMonthSetter | 日期型 - 月数据设置器 |
| DateRangeSetter | 日期型数据设置器，可选择时间区间 |
| EventsSetter | 事件绑定设置器 |
| ColorSetter | 颜色设置器 |
| JsonSetter | json 型数据设置器 |
| StyleSetter | 样式设置器 |
| ClassNameSetter | 样式名设置器 |
| FunctionSetter | 函数型数据设置器 |
| MixedSetter | 混合型数据设置器 |
| SlotSetter | 节点型数据设置器 |
| ArraySetter | 列表数组行数据设置器 |
| ObjectSetter | 对象数据设置器，一般内嵌在 ArraySetter 中 |


# 设置器定制
## 编写 AltStringSetter
我们编写一个简单的 Setter，这里我们编写的 Setter 是 AltStringSetter。代码如下：
```javascript
import * as React from "react";
import { Input } from "@alifd/next";

import "./index.scss";
interface AltStringSetterProps {
  // 当前值
  value: string;
  // 默认值
  defaultValue: string;
  // setter 唯一输出
  onChange: (val: string) => void;
  // AltStringSetter 特殊配置
  placeholder: string;
}
export default class AltStringSetter extends React.PureComponent<AltStringSetterProps> {
  componentDidMount() {
    const { onChange, value, defaultValue } = this.props;
    if (value == undefined && defaultValue) {
      onChange(defaultValue);
    }
  }

  // 声明 Setter 的 title
 	static displayName = 'AltStringSetter';

  render() {
    const { onChange, value, placeholder } = this.props;
    return (
      <Input
        value={value}
        placeholder={placeholder || ""}
        onChange={(val: any) => onChange(val)}
      ></Input>
    );
  }
}
```

### setter 和 setter/plugin 之间的联动
我们采用 emit 来进行相互之前的通信，首先我们在 A setter 中进行事件注册：
```javascript
import { event } from '@ali/lowcode-engine';

componentDidMount() {
		// 这里由于面板上会有多个 setter，这里我用 field.id 来标记 setter 名
    this.emitEventName = `${SETTER_NAME}-${this.props.field.id}`;
    event.on(`${this.emitEventName}.bindEvent`, this.bindEvent)
}

bindEvent = (eventName) => {
  // do someting
}

componentWillUnmount() {
  // setter 是以实例为单位的，每个 setter 注销的时候需要把事件也注销掉，避免事件池过多
  event.off(`${this.emitEventName}.bindEvent`, this.bindEvent)
}
```
在 B setter 中触发事件，来完成通信：
```javascript
import { event } from '@ali/lowcode-engine';

bindFunction = () => {
  const { field, value } = this.props;
  // 这里展示的和插件进行通信，事件规则是插件名 + 方法
  event.emit('eventBindDialog.openDialog', field.name, this.emitEventName);
}
```
### 修改同级 props 的其他属性值
setter 本身只影响其中一个 props 的值，如果需要影响其他组件的 props 的值，需要使用 field 的 props：
```javascript
bindFunction = () => {
    const { field, value } = this.props;
    const propsField = field.parent;
		// 获取同级其他属性 showJump 的值
    const otherValue = propsField.getPropValue('showJump');
    // set 同级其他属性 showJump 的值
    propsField.setPropValue('showJump', false);
}
```
## 注册 AltStringSetter
我们需要在低代码引擎中注册 Setter，这样就可以通过 AltStringSetter 的名字在物料中使用了。
```javascript
import AltStringSetter from './AltStringSetter';
import { setters } from '@alilc/lowcode-engine';
setters.registerSetter({
	AltStringSetter: {
		component: AltStringSetter,
	}
});
```
## 物料中使用
我们需要将目标组件的属性值类型值配置到物料资源配置文件中，例如 `packages/demo/public/assets.json` 
其中核心配置如下：
```json
{
  "props": {
    "isExtends": true,
    "override": [
      {
        "name": "type",
        "setter": "AltStringSetter"
      }
    ]
  }
}
```
在物料中的完整配置如下：
```json
{
  "componentName": "Message",
  "title": "Message",
  "docUrl": "",
  "screenshot": "",
  "npm": {
    "package": "@alifd/next",
    "version": "1.19.18",
    "exportName": "Message",
    "main": "src/index.js",
    "destructuring": true,
    "subName": ""
  },
  "props": [
    {
      "name": "title",
      "propType": "string",
      "description": "标题",
      "defaultValue": "标题"
    },
    {
      "name": "type",
      "propType": {
        "type": "oneOf",
        "value": [
          "success",
          "warning",
          "error",
          "notice",
          "help",
          "loading"
        ]
      },
      "description": "反馈类型",
      "defaultValue": "success"
    }

  ],

  "configure": {
    "props": {
      "isExtends": true,
      "override": [
        {
          "name": "type",
          "setter": "AltStringSetter"
        }
      ]
    }
  }
}
```
###
# 小结
本章介绍了设置器是什么，我们有哪些内置的设置器。以及当不满足设置器诉求时，我们如何定制一个设置器。
