---
title: commonUI - UI 组件库
sidebar_position: 11
---

## 简介
CommonUI API 是一个专为低代码引擎设计的组件 UI 库，使用它开发的插件，可以保证在不同项目和主题切换中能够保持一致性和兼容性。

## 组件列表

### Tip

提示组件

| 参数      | 说明         | 类型                                  | 默认值 |
|-----------|--------------|---------------------------------------|--------|
| className | className    | string (optional)                     |        |
| children  | tip 的内容   | IPublicTypeI18nData \| ReactNode      |        |
| direction | tip 的方向   | 'top' \| 'bottom' \| 'left' \| 'right' |        |


### Title

标题组件

| 参数      | 说明       | 类型                        | 默认值 |
|-----------|------------|-----------------------------|--------|
| title     | 标题内容   | IPublicTypeTitleContent     |        |
| className | className  | string (optional)           |        |
| onClick   | 点击事件   | () => void (optional)       |        |

### ContextMenu

| 参数   | 说明                                               | 类型                               | 默认值 |
|--------|----------------------------------------------------|------------------------------------|--------|
| menus  | 定义上下文菜单的动作数组                           | IPublicTypeContextMenuAction[]     |        |
| children | 组件的子元素                                      | React.ReactElement[]               |        |

**IPublicTypeContextMenuAction Interface**

| 参数       | 说明                                                         | 类型                                                                                                           | 默认值                                 |
|------------|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------|
| name       | 动作的唯一标识符<br/>Unique identifier for the action         | string                                                                                                         |                                        |
| title      | 显示的标题，可以是字符串或国际化数据<br/>Display title, can be a string or internationalized data | string \| IPublicTypeI18nData (optional)                |                                        |
| type       | 菜单项类型<br/>Menu item type                                 | IPublicEnumContextMenuType (optional)                                                                          | IPublicEnumContextMenuType.MENU_ITEM  |
| action     | 点击时执行的动作，可选<br/>Action to execute on click, optional | (nodes: IPublicModelNode[]) => void (optional)                                                                 |                                        |
| items      | 子菜单项或生成子节点的函数，可选，仅支持两级<br/>Sub-menu items or function to generate child node, optional | Omit<IPublicTypeContextMenuAction, 'items'>[] \| ((nodes: IPublicModelNode[]) => Omit<IPublicTypeContextMenuAction, 'items'>[]) (optional) |                                        |
| condition  | 显示条件函数<br/>Function to determine display condition      | (nodes: IPublicModelNode[]) => boolean (optional)                                                              |                                        |
| disabled   | 禁用条件函数，可选<br/>Function to determine disabled condition, optional | (nodes: IPublicModelNode[]) => boolean (optional)                                                              |                                        |

**ContextMenu 示例**

```typescript
const App = () => {
  const menuItems: IPublicTypeContextMenuAction[] = [
    {
      name: 'a',
      title: '选项 1',
      action: () => console.log('选项 1 被点击'),
    },
    {
      name: 'b',
      title: '选项 2',
      action: () => console.log('选项 2 被点击'),
    },
  ];

  const ContextMenu = ctx.commonUI.ContextMenu;

  return (
    <div>
      <ContextMenu menus={menuItems}>
        <div>右键点击这里</div>
      </ContextMenu>
    </div>
  );
};

export default App;
```

**ContextMenu.create 示例**

```typescript
const App = () => {
  const menuItems: IPublicTypeContextMenuAction[] = [
    {
      name: 'a',
      title: '选项 1',
      action: () => console.log('选项 1 被点击'),
    },
    {
      name: 'b',
      title: '选项 2',
      action: () => console.log('选项 2 被点击'),
    },
  ];

  const ContextMenu = ctx.commonUI.ContextMenu;

  return (
    <div>
      <div onClick={(e) => {
      	ContextMenu.create(menuItems, e);
      }}>点击这里</div>
    </div>
  );
};

export default App;
```

### Balloon

详细文档： [Balloon Documentation](https://fusion.design/pc/component/balloon)

### Breadcrumb
详细文档： [Breadcrumb Documentation](https://fusion.design/pc/component/breadcrumb)

### Button
详细文档： [Button Documentation](https://fusion.design/pc/component/button)

### Card
详细文档：[Card Documentation](https://fusion.design/pc/component/card)

### Checkbox
详细文档：[Checkbox Documentation](https://fusion.design/pc/component/checkbox)

### DatePicker
详细文档：[DatePicker Documentation](https://fusion.design/pc/component/datepicker)

### Dialog
详细文档：[Dialog Documentation](https://fusion.design/pc/component/dialog)

### Dropdown
详细文档：[Dropdown Documentation](https://fusion.design/pc/component/dropdown)

### Form
详细文档：[Form Documentation](https://fusion.design/pc/component/form)

### Icon
详细文档：[Icon Documentation](https://fusion.design/pc/component/icon)

引擎默认主题支持的 icon 列表：https://fusion.design/64063/component/icon?themeid=20133


### Input
详细文档：[Input Documentation](https://fusion.design/pc/component/input)

### Loading
详细文档：[Loading Documentation](https://fusion.design/pc/component/loading)

### Message
详细文档：[Message Documentation](https://fusion.design/pc/component/message)

### Overlay
详细文档：[Overlay Documentation](https://fusion.design/pc/component/overlay)

### Pagination
详细文档：[Pagination Documentation](https://fusion.design/pc/component/pagination)

### Radio
详细文档：[Radio Documentation](https://fusion.design/pc/component/radio)

### Search
详细文档：[Search Documentation](https://fusion.design/pc/component/search)

### Select
详细文档：[Select Documentation](https://fusion.design/pc/component/select)

### SplitButton
详细文档：[SplitButton Documentation](https://fusion.design/pc/component/splitbutton)

### Step
详细文档：[Step Documentation](https://fusion.design/pc/component/step)

### Switch
详细文档：[Switch Documentation](https://fusion.design/pc/component/switch)

### Tab
详细文档：[Tab Documentation](https://fusion.design/pc/component/tab)

### Table
详细文档：[Table Documentation](https://fusion.design/pc/component/table)

### Tree
详细文档：[Tree Documentation](https://fusion.design/pc/component/tree)

### TreeSelect
详细文档：[TreeSelect Documentation](https://fusion.design/pc/component/treeselect)

### Upload
详细文档：[Upload Documentation](https://fusion.design/pc/component/upload)

### Divider
详细文档：[Divider Documentation](https://fusion.design/pc/component/divider)

## 说明

如果需要其他组件，可以提 issue 给我们。
