---
title: 物料描述详解
sidebar_position: 2
---
## 物料描述概述

中后台前端体系中，存在大量的组件，程序员可以通过阅读文档，知悉组件的用法。可是搭建平台无法理解 README，而且很多时候，README 里并没有属性列表。这时，我们需要一份额外的描述，来告诉低代码搭建平台，组件接受哪些属性，又是该用怎样的方式来配置这些属性，于是，[**《中后台低代码组件描述协议》**](http://lowcode-engine.cn/material)应运而生。协议主要包含三部分：基础信息、属性信息 props、能力配置/体验增强 configure。

物料配置，就是产出一份符合[**《中后台低代码组件描述协议》**](http://lowcode-engine.cn/material)的 JSON Schema。如果需要补充属性描述信息，或需要定制体验增强部分（如修改 Setter、调整展示顺序等），就可以通过修改这份 Schema 来实现。目前有自动生成、手工配置这两种方式生成物料描述配置。

## 可视化生成物料描述

使用Parts造物平台：[https://www.yuque.com/lce/xhk5hf/qa9pbx](https://www.yuque.com/lce/xhk5hf/qa9pbx)

## 自动生成物料描述

可以使用官方提供的 `@alilc/lowcode-material-parser` 解析本地组件，自动生成物料描述。把物料描述放到资产包定义中，就能让低代码引擎理解如何制作物料。详见上一个章节“物料扩展”。

下面以某个组件代码片段为例：
```typescript
// /path/to/component
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class FusionForm extends PureComponent {
  static displayName = 'FusionForm';

  static defaultProps = {
    name: '张三',
    age: 18,
    friends: ['李四','王五','赵六']
  }

  static propTypes = {
    /**
     * 这是用于描述姓名
     */
    name: PropTypes.string.isRequired,
    /**
     * 这是用于描述年龄
     */
    age: PropTypes.number,
    /**
     * 这是用于描述好友列表
     */
    friends: PropTypes.array
  };

  render() {
    return <div>dumb</div>
  }
}
```
引入 parse 工具自动解析
```typescript
import parse from '@alilc/lowcode-material-parser';
(async () => {
  const result = await parse({ entry: '/path/to/component' });
  console.log(JSON.stringify(result, null, 2));
})();
```
因为一个组件可能输出多个子组件，所以解析结果是个数组。
```json
[
  {
    "componentName": "FusionForm",
    "title": "",
    "docUrl": "",
    "screenshot": "",
    "devMode": "proCode",
    "npm": {
      "package": "",
      "version": "",
      "exportName": "default",
      "main": "",
      "destructuring": false,
      "subName": ""
    },
    "props": [
      {
        "name": "name",
        "propType": "string",
        "description": "这是用于描述姓名",
        "defaultValue": "张三"
      },
      {
        "name": "age",
        "propType": "number",
        "description": "这是用于描述年龄",
        "defaultValue": 18
      },
      {
        "name": "friends",
        "propType": "array",
        "description": "这是用于描述好友列表",
        "defaultValue": [
          "李四",
          "王五",
          "赵六"
        ]
      }
    ]
  }
]
```
## 手工配置物料描述

如果自动生成的物料无法满足需求，我们就需要手动配置物料描述。本节将分场景描述物料配置的内容。

### 常见配置

#### 组件的属性只有有限的值

增加一个 size 属性，只能从 'large'、'normal'、'small' 这个候选值中选择。

以上面自动解析的物料为例，在此基础上手工加上 size  属性：
```json
[
  {
    "componentName": "FusionForm",
    "title": "",
    "docUrl": "",
    "screenshot": "",
    "devMode": "proCode",
    "npm": {
      "package": "",
      "version": "",
      "exportName": "default",
      "main": "",
      "destructuring": false,
      "subName": ""
    },
    "props": [
      {
        "name": "name",
        "propType": "string",
        "description": "这是用于描述姓名",
        "defaultValue": "张三"
      },
      {
        "name": "age",
        "propType": "number",
        "description": "这是用于描述年龄",
        "defaultValue": 18
      },
      {
        "name": "friends",
        "propType": "array",
        "description": "这是用于描述好友列表",
        "defaultValue": [
          "李四",
          "王五",
          "赵六"
        ]
      }
    ],
    // 手工增加的 size 属性
    "configure": {
      "isExtend": true,
      "props": [
        {
          "title": "尺寸",
          "name": "size",
          "setter": {
            "componentName": 'RadioGroupSetter',
            "isRequired": true,
            "props": {
              "options": [
                { "title": "大", "value": "large" },
                { "title": "中", "value": "normal" },
                { "title": "小", "value": "small" },
              ]
            },
          }
        }
      ]
    }
  }
]
```

#### 组件的属性既可以设置固定值，也可以绑定到变量
我们知道一种属性形式就需要一种 setter 来设置，如果想要将 value 属性允许输入字符串，那就需要设置为 `StringSetter`，如果允许绑定变量，就需要设置为 `VariableSetter`，具体设置器请参考[预置 Setter 列表](https://www.yuque.com/lce/doc/oc220p)

那如果都想要呢？可以使用 `MixedSetter` 来实现
```json
{
  ...,
  configure: {
    isExtend: true,
    props: [
      {
        title: "输入框的值",
        name: "activeValue",
        setter: {
          componentName: 'MixedSetter',
          isRequired: true,
          props: {
            setters: [
              'StringSetter',
              'NumberSetter',
              'VariableSetter',
            ],
          },
        }
      }
    ]
  }
}
```
设置后，就会出现 “切换设置器” 的操作项了
![image.png](https://cdn.nlark.com/yuque/0/2022/png/189077/1647590065530-b50ed66a-8d24-40fc-91a9-13561663537b.png#clientId=ubd9972cd-765c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=126&id=ub0e036f6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=252&originWidth=598&originalType=binary&ratio=1&rotation=0&showTitle=false&size=62314&status=done&style=none&taskId=u6545c47c-0fed-44eb-bfab-03694941981&title=&width=299)                                 ![image.png](https://cdn.nlark.com/yuque/0/2022/png/189077/1647590197192-cd0071cf-a90c-4882-9b65-4b46bff13ce9.png#clientId=ubd9972cd-765c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=154&id=u67de127d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=308&originWidth=244&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24027&status=done&style=none&taskId=u1a44a2d7-3680-4018-8709-9832cd03ad0&title=&width=122)

#### 开启组件样式设置

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571003600-48ef05cd-dbac-4aad-b7a5-012727fe1c6f.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u467d584c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=772&originWidth=820&originalType=url&ratio=1&rotation=0&showTitle=false&size=128316&status=done&style=none&taskId=ub01cb8bb-e784-485b-b2a6-aead3302c4f&title=)

```tsx
{
  configure: {
    // ...,
    supports: {
      style: true,
    },
    // ...
  }
}
```

#### 设置组件的默认事件

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571003649-c0da562f-220c-415e-83ea-e07b71c07552.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u7b452a11&margin=%5Bobject%20Object%5D&name=image.png&originHeight=800&originWidth=776&originalType=url&ratio=1&rotation=0&showTitle=false&size=120022&status=done&style=none&taskId=u6805e481-897b-4929-86c8-9321791a21a&title=)

```tsx
{
  configure: {
    // ...,
    supports: {
      events: ['onPressEnter', 'onClear', 'onChange', 'onKeyDown', 'onFocus', 'onBlur'],
    },
    // ...
  }
}
```

#### 设置 prop 标题的 tip

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571003618-4a1bb1c4-da39-437b-8510-a121329aa91d.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u7fe57bc7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=176&originWidth=908&originalType=url&ratio=1&rotation=0&showTitle=false&size=39688&status=done&style=none&taskId=u7e9e26eb-a4c3-423c-b7f1-f096d654d4e&title=)

```tsx
{
  name: 'label',
  setter: 'StringSetter',
  title: {
    label: {
      type: 'i18n',
      zh_CN: '标签文本',
      en_US: 'Label',
    },
    tip: {
      type: 'i18n',
      zh_CN: '属性: label | 说明: 标签文本内容',
      en_US: 'prop: label | description: label content',
    },
  },
}
```

#### 配置 prop 对应 setter 在配置面板的展示方式

inline:![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571004529-c879ec4c-18af-46fd-8231-4ab80c937399.png#clientId=uad16fa90-b520-4&crop=0.0174&crop=0.0597&crop=0.9933&crop=0.3909&from=paste&height=260&id=u8cdcc718&margin=%5Bobject%20Object%5D&name=image.png&originHeight=266&originWidth=790&originalType=url&ratio=1&rotation=0&showTitle=false&size=40667&status=done&style=none&taskId=u9390a3bb-0290-46c7-b487-7380f162fd0&title=&width=771)

```tsx
{
  configure: {
    props: [{
      description: '标签文本',
      display: 'inline'
    }]
  }
}
```

block:
![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571004690-22e7dc4f-db0d-43fe-b837-48ed1145bde7.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=0.996&crop=1&from=paste&height=273&id=ua1717366&margin=%5Bobject%20Object%5D&name=image.png&originHeight=274&originWidth=792&originalType=url&ratio=1&rotation=0&showTitle=false&size=31246&status=done&style=none&taskId=u9e678772-1217-4c64-ac75-c5928b48834&title=&width=789)
```tsx
{
  configure: {
    props: [{
      description: '高级',
      display: 'block'
    }]
  }
}
```

accordion

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571005189-552ef14d-6043-48fa-a526-4565d42fa581.png#clientId=uad16fa90-b520-4&crop=0&crop=0.0159&crop=1&crop=1&from=paste&height=740&id=u53a75049&margin=%5Bobject%20Object%5D&name=image.png&originHeight=740&originWidth=798&originalType=url&ratio=1&rotation=0&showTitle=false&size=163685&status=done&style=none&taskId=ub42fca77-545e-435f-bafe-88e2b2ddfd1&title=&width=798)
```tsx
{
  configure: {
    props: [{
      description: '表单项配置',
      display: 'accordion'
    }]
  }
}
```

entry

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571005244-fb508efb-a2d8-4064-8ff3-d6140e4c20a1.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u16645b5c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=424&originWidth=796&originalType=url&ratio=1&rotation=0&showTitle=false&size=91418&status=done&style=none&taskId=u38c7b284-f480-4440-baac-9f7c985104f&title=)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571005468-1c7f4b24-4330-45e2-b6c9-5bf5362874b4.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u2fad6ab5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=632&originWidth=794&originalType=url&ratio=1&rotation=0&showTitle=false&size=158094&status=done&style=none&taskId=u7c356adc-4286-46b8-9a2c-d33b4268ddc&title=)

```tsx
{
  configure: {
    props: [{
      description: '风格与样式',
      display: 'entry'
    }]
  }
}
```

plain

![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571005702-ad979f93-cc47-4c6f-8de7-454cc6305614.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u6aa6d230&margin=%5Bobject%20Object%5D&name=image.png&originHeight=438&originWidth=776&originalType=url&ratio=1&rotation=0&showTitle=false&size=133070&status=done&style=none&taskId=u1db8205a-79ed-4d60-91b4-6e7f5bfaff3&title=)

```tsx
{
  configure: {
    props: [{
      description: '返回上级',
      display: 'plain'
    }]
  }
}
```


### 进阶配置

#### 组件的 children 属性允许传入 ReactNode
例如有一个如下的 Tab 选项卡组件，每个 TabPane 的 children 都是一个组件
![image.png](https://cdn.nlark.com/yuque/0/2022/png/189077/1647588145478-fb8b7296-a8ee-4698-9851-846c78de301e.png#clientId=ubd9972cd-765c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=167&id=bi43p&margin=%5Bobject%20Object%5D&name=image.png&originHeight=334&originWidth=2332&originalType=binary&ratio=1&rotation=0&showTitle=false&size=55470&status=done&style=none&taskId=ub8c8b04a-e2e9-4b5d-9be7-c7ad7154864&title=&width=1166)
只需要增加 `isContainer` 配置即可
```json
{
  ...,
  configure: {
    ...,
    component: {
      // 新增，设置组件为容器组件，可拖入组件
      isContainer: true,
    },
  }
}
```
假设我们希望只允许拖拽 Table、Button 等内容放在 TabPane 里。配置白名单 `childWhitelist` 即可
```json
{
  ...,
  configure: {
    ...,
    component: {
      isContainer: true,
      nestingRule: {
        // 允许拖入的组件白名单
        childWhitelist: ['Table', 'Button'],
        // 同理也可以设置该组件允许被拖入哪些父组件里
        parentWhitelist: ['Tab'],
      },
    },
  },
}
```
#### 组件的非 children 属性允许传入 ReactNode
这就需要使用 `SlotSetter` 开启插槽了，如下面示例，给 Tab 的 title 开启插槽，允许拖拽组件
![image.png](https://cdn.nlark.com/yuque/0/2022/png/189077/1647590398244-479c820e-3b2f-4d7e-8742-37cf896bcafb.png#clientId=ubd9972cd-765c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=290&id=Utp8Y&margin=%5Bobject%20Object%5D&name=image.png&originHeight=580&originWidth=3016&originalType=binary&ratio=1&rotation=0&showTitle=false&size=254405&status=done&style=none&taskId=u0c8f777c-3559-455a-b136-c884312bb67&title=&width=1508)
```json
{
  // ...,
  configure: {
    isExtend: true,
    props: [
      {
        title: "选项卡标题",
        name: "title",
        setter: {
          componentName: 'MixedSetter',
          props: {
            setters: [
              'StringSetter',
              'SlotSetter',
              'VariableSetter',
            ],
          },
        }
      }
    ]
  }
}
```

#### 屏蔽组件在设计器中的操作按钮

正常情况下，组件允许复制：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/231502/1647571003626-06d80381-4d97-4d5b-8621-331674832c82.png#clientId=uad16fa90-b520-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=Sp6IN&margin=%5Bobject%20Object%5D&name=image.png&originHeight=226&originWidth=1158&originalType=url&ratio=1&rotation=0&showTitle=false&size=54949&status=done&style=none&taskId=u7e4b2cbe-5acf-467f-950b-ee48deb9502&title=)
如果希望禁止组件的复制行为，我们可以这样做：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1647673808399-2708ff56-70d1-4c58-b93b-aa65269fb179.png#clientId=ufbfe731c-4217-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=150&id=A304J&margin=%5Bobject%20Object%5D&name=image.png&originHeight=300&originWidth=1176&originalType=binary&ratio=1&rotation=0&showTitle=false&size=90147&status=done&style=none&taskId=uf8da0392-c584-4d27-b664-95b3e908103&title=&width=588)
```tsx
{
  configure: {
    component: {
      disableBehaviors: ['copy'],
    }
  }
}
```

#### 实现一个 BackwardSetter

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1647674621328-6b0a5afc-eafc-43cc-95ce-bbe00981ac20.png#clientId=ufbfe731c-4217-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=219&id=u9c11597c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=438&originWidth=776&originalType=binary&ratio=1&rotation=0&showTitle=false&size=125336&status=done&style=none&taskId=u01853245-46a8-42dd-9c62-6cdbb909afa&title=&width=388)

```tsx
{
  name: 'back',
  title: ' ',
  virtual: () => true,
  display: 'plain',
  setter: BackwardSetter,
}

// BackwardSetter
import { SettingTarget, DynamicSetter } from '@alilc/lowcode-types';
const BackwardSetter: DynamicSetter = (target: SettingTarget) => {
  return {
    componentName: (
      <Button
        onClick={() => {
          target.getNode().parent.select();
        }}
      >
        <Icon type="arrow-left" /> 返回上级
      </Button>
    ),
  };
};
```

### 高级配置

#### 不展现一个 prop 配置

- 始终隐藏当前 prop

```tsx
{
  // 始终隐藏当前 prop 配置
  condition: () => false
}
```

- 根据其它 prop 的值展示/隐藏当前 prop

```tsx
{
  // direction 为 hoz 则展示当前 prop 配置
  condition: (target) => {
    return target.getProps().getPropValue('direction') === 'hoz';
  }
}
```

#### props 联动

```tsx
// 根据当前 prop 的值动态设置其它 prop 的值
{
  name: 'labelAlign',
  // ...
  extraProps: {
    setValue: (target, value) => {
      if (value === 'inset') {
        target.getProps().setPropValue('labelCol', null);
        target.getProps().setPropValue('wrapperCol', null);
      } else if (value === 'left') {
         target.getProps().setPropValue('labelCol', { fixedSpan: 4 });
         target.getProps().setPropValue('wrapperCol', null);
      }
      return target.getProps().setPropValue('labelAlign', value);
    },
  },
}
// 根据其它 prop 的值来设置当前 prop 的值
{
  name: 'status',
  // ...
  extraProps: {
    getValue: (target) => {
      const isPreview = target.getProps().getPropValue('isPreview');
      return isPreview ? 'readonly' : 'editable';
    }
  }
}
```

#### 动态 setter 配置

可以通过 DynamicSetter 传入的 target 获取一些引擎暴露的数据，例如当前有哪些组件被加载到引擎中，将这个数据作为 SelectSetter 的选项，让用户选择:

```tsx
{
  setter: (target) => {
    return {
      componentName: 'SelectSetter',
      props: {
        options: target.designer.props.componentMetadatas.filter(
          (item) => item.isFormItemComponent).map(
            (item) => {
              return {
                title: item.title || item.componentName,
                value: item.componentName,
              };
            }
          ),
        ),
      }
    };
  }
}
```
