## 低代码引擎 - 数据源面板插件

对页面的数据源进行管理（新建，编辑，导入）。

一个 pluginProps 的例子

```
{
  importPlugins: [
    {
      name: 'code',
      title: '源码',
      content: DataSourceImportPluginCode,
    },
  ],
  dataSourceTypes: [
    {
      type: 'mopen',
      schema: {
        type: 'object',
        properties: {
          options: {
            type: 'object',
            properties: {
              uri: {
                title: 'api',
              },
              v: {
                title: 'v',
                type: 'string',
              },
              appKey: {
                title: 'appKey',
                type: 'string',
              },
            },
          },
        },
      },
    },
  ],
}
```

## 数据源类型定义

内置 fetch，mtop，jsonp 类型，支持传入自定义类型。

```
type DataSourceType = {
  type: string;
  optionsSchema: JSONSchema6
};
```

数据源类型需要在集团规范约束下扩展。目前只允许在 options 下添加扩展字段。

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

interface DataSourcePaneImportPluginComponentProps {
  onImport?: (dataSourceList: DataSourceConfig[]) => void;
  onCancel?: () => void;
  dataSourceTypes?: DataSourceType[];
}

interface DataSourcePaneImportPluginCustomProps extends DataSourcePaneImportPluginComponentProps {
  [customPropName: string]: any;
}
```


