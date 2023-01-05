---
title: 设置器扩展
sidebar_position: 5
---
## 设置器简述
设置器主要用于低代码组件属性值的设置，顾名思义叫"设置器"，又称为 Setter。由于组件的属性有各种类型，需要有与之对应的设置器支持，每一个设置器对应一个值的类型。
### 设计器展示位置
设置器展示在编辑器的右边区域，如下图：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644387351052-0be9546e-9e46-41ff-bbb4-a1effe650d7f.png#clientId=u39aebc41-90a1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=487&id=pi5XH&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1730&originWidth=3836&originalType=binary&ratio=1&rotation=0&showTitle=false&size=947162&status=done&style=stroke&taskId=u4d4deed8-40f5-40a6-b20d-d092c90775c&title=&width=1080)
其中包含四类设置器：

- 属性：展示该物料常规的属性
- 样式：展示该物料样式的属性
- 事件：如果该物料有声明事件，则会出现事件面板，用于绑定事件。
- 高级：两个逻辑相关的属性，**条件渲染**和**循环**
### 设置器类型
上述区域中是有多项设置器的，对于一个组件来说，每一项配置都对应一个设置器，比如我们的配置是一个文本，我们需要的是文本设置器，我们需要配置的是数字，我们需要的就是数字设置器。
下图中的标题和按钮类型配置就分别是文本设置器和下拉框设置器。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644387350762-7337e729-53e9-4a6c-8da1-8f17260e1347.png#clientId=u39aebc41-90a1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=744&id=ztLvk&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1460&originWidth=2120&originalType=binary&ratio=1&rotation=0&showTitle=false&size=489840&status=done&style=stroke&taskId=u7375a322-b6c8-43f1-a096-07b204656aa&title=&width=1080)
我们提供了常用的设置器作为内置设置器，也提供了定制能力帮助大家开发特定需求的设置器。
## 为物料配置设置器
我们提供了[常用的设置器](https://www.yuque.com/lce/doc/oc220p?view=doc_embed&from=kb&from=kb&outline=1&title=1)作为内置设置器。
我们可以将目标组件的属性值类型值配置到物料资源配置文件中：
```json
{
  "componentName": "Message",
  "title": "Message",
  "configure": {
    "props": [
      {
        "name": "type",
        "setter": "InputSetter"
      }
    ]
  }
}
```
props 字段是入料模块扫描自动填入的类型，用户可以通过 configure 节点进行配置通过 override 节点对属性的声明重新定义，setter 就是注册在引擎中的 setter。
为物料配置引擎内置的 setter 时，均可以使用对应 setter 的高级功能，对应功能参考“全部内置设置器”章节下的对应 setter 文章。
**_对高级功能的配置如下：_**
例如我们需要在NumberSetter中配置units属性，可以在asset.json中声明
```json
"configure": {
  "component": {
    "isContainer": true,
    "nestingRule": {
      "parentWhitelist": [
        "NextP"
      ]
    }
  },
  "props": [
    {
      "name": "width",
      "title": "宽度",
      "initialValue": "auto",
      "defaultValue": "auto",
      "condition": {
        "type": "JSFunction",
        "value": "() => false"
      },
      "setter": {
        "componentName": "NumberSetter",
        "props": {
          "units": [
            {
              "type": "px",
              "list": true
            },
            {
              "type": "%",
              "list": true
            }
          ]
        }
      }
    },
  ],
  "supports": {
    "style": true
  }
},
```
## 自定义设置器
### 编写 AltStringSetter
我们编写一个简单的 Setter，它的功能如下：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1644764687180-0121f0c0-d113-4907-a86d-e4f3a04ff221.png#clientId=ucb27c83c-48cf-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=45&id=u32dc8cd0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=90&originWidth=720&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17539&status=done&style=stroke&taskId=u0f886bda-a93e-4b10-ad7e-9ba9a38a3fb&title=&width=360)
**_代码如下：_**
```typescript
import * as React from "react";
import { Input } from "@alifd/next";

import "./index.scss";
interface AltStringSetterProps {
  // 当前值
  value: string;
  // 默认值
  defaultValue: string;
  // setter唯一输出
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

  // 声明Setter的title
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
#### setter 和 setter/plugin 之间的联动
我们采用 emit 来进行相互之前的通信，首先我们在 A setter 中进行事件注册：
```javascript
import { event } from '@alilc/lowcode-engine';

componentDidMount() {
		// 这里由于面板上会有多个setter，这里我用field.id来标记setter名
    this.emitEventName = `${SETTER_NAME}-${this.props.field.id}`;
    event.on(`${this.emitEventName}.bindEvent`, this.bindEvent)
}

bindEvent = (eventName) => {
  // do someting
}

componentWillUnmount() {
  // setter是以实例为单位的，每个setter注销的时候需要把事件也注销掉，避免事件池过多
  event.off(`${this.emitEventName}.bindEvent`, this.bindEvent)
}
```
在 B setter 中触发事件，来完成通信：
```javascript
import { event } from '@alilc/lowcode-engine';

bindFunction = () => {
  const { field, value } = this.props;
  // 这里展示的和插件进行通信,事件规则是插件名+方法
  event.emit('eventBindDialog.openDialog', field.name, this.emitEventName);
}
```
#### 修改同级 props 的其他属性值
setter 本身只影响其中一个 props 的值，如果需要影响其他组件的 props 的值，需要使用 field 的 props：
```json
bindFunction = () => {
    const { field, value } = this.props;
    const propsField = field.parent;
		// 获取同级其他属性showJump的值
    const otherValue = propsField.getPropValue('showJump');
    // set同级其他属性showJump的值
    propsField.setPropValue('showJump', false);
}
```
### 注册 AltStringSetter
我们需要在低代码引擎中注册 Setter，这样就可以通过 AltStringSetter 的名字在物料中使用了。
```typescript
import AltStringSetter from './AltStringSetter';
const registerSetter = window.AliLowCodeEngine.setters.registerSetter;
registerSetter('AltStringSetter', AltStringSetter);
```
### 物料中使用
我们需要将目标组件的属性值类型值配置到物料资源配置文件中，其中核心配置如下：
```json
{
  "props": [
    {
      "name": "type",
      "setter": "AltStringSetter"
    }
  ]
}
```
在物料中的相关配置如下：
```json
{
  "componentName": "Message",
  "title": "Message",
  "configure": {
    "props": [
      {
        "name": "type",
        "setter": "AltStringSetter"
      }
    ]
  }
}
```
