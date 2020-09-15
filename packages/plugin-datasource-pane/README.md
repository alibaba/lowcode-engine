TODO
---

* 多语言
* [later]表达式和其他类型的切换
* 现有场景代码的兼容
* class publich method bind issue
* ICON
* 支持变量

## 数据源面板

数据源管理

* 新建
* 编辑
* 导入
* 指定数据源类型
* 定制数据源导入插件

## 数据源类型定义

内置变量，http 和 mtop 类型，支持传入自定义类型。

```
type DataSourceType = {
  type: string;
  optionsSchema: JSONSchema6
};
```

数据源类型需要在集团规范约束下扩展。

目前只允许在 options 下添加扩展字段。

比如 mtop 类型，需要添加 options.v （版本）字段。

## 导入插件

默认支持源码导入，可以传入自定义插件。

```
interface DataSourcePaneImportPlugin {
  name: string;
  title: string;
  component: React.ReactNode;
  componentProps?: DataSourcePaneImportPluginCustomProps;
}

interface DataSourcePaneImportPluginCustomProps {
  [customPropName: string]: any;
}

interface DataSourcePaneImportPluginComponentProps extends DataSourcePaneImportPluginCustomProps {
  onChange: (dataSourceList: DataSourceConfig[]) => void;
}
```

## 问题

* 变量，上下文放数据源里管理是否合适
* mockUrl 和 mockData
* 设计器的设计语言无法统一

## 插件开发

<https://yuque.antfin-inc.com/ali-lowcode/docs/ip4awq>

## node 版本

v14.4.0
