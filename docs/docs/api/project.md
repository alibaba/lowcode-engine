---
title: project - 模型 API
sidebar_position: 3
---
## 模块简介

引擎编排模块中包含多种模型，包括：
- [文档模型 DocumentModel](./model/document-model)
- [节点模型 Node](./model/node)
- [节点孩子模型 NodeChildren](./model/node-children)
- [属性模型 Prop](./model/prop)
- [属性集模型 Props](./model/props)

他们的依赖关系如下图：
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01B1bAZi1asNU3KaSUJ_!!6000000003385-2-tps-1650-1352.png)

在文档模型内部，又有一些引申模型，比如：
- [历史操作 History）](./model/history)
- [画布节点选中 Selection）](./model/selection)
- [画布节点悬停 Detecting）](./model/detecting)
- [模态节点管理器 ModalNodesManager](./model/modal-nodes-manager)

整个模型系统，以 project API 为入口，所有模型实例均需要通过 project 来获得，比如 project.currentDocument 来获取当前的文档模型，project.currentDocument.nodesMap 来获取当前文档模型里所有的节点列表。

下面来看看 project API 的具体介绍

## 变量
### currentDocument

获取当前的 document 实例

```typescript
/**
 * 获取当前的 document
 * get current document
 */
get currentDocument(): IPublicModelDocumentModel | null;
```

相关类型：[IPublicModelDocumentModel](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/document-model.ts)

### documents

获取当前 project 下所有 documents

```typescript
/**
 * 获取当前 project 下所有 documents
 * get all documents of this project
 * @returns
 */
get documents(): IPublicModelDocumentModel[];
```

相关类型：[IPublicModelDocumentModel](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/document-model.ts)

### simulatorHost

获取模拟器的 host

```typescript
/**
 * 获取模拟器的 host
 * get simulator host
 */
get simulatorHost(): IPublicApiSimulatorHost | null;
```

相关类型：[IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)


## 方法
### openDocument

打开一个 document

```typescript
/**
 * 打开一个 document
 * @param doc
 * @returns
 */
openDocument(doc?: string | IPublicTypeRootSchema | undefined): IPublicModelDocumentModel | null;
```

相关类型：
- [IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)
- [IPublicTypeRootSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/root-schema.ts)

### createDocument

创建一个 document

```typescript
/**
 * 创建一个 document
 * create a document
 * @param data
 * @returns
 */
createDocument(data?: IPublicTypeRootSchema): IPublicModelDocumentModel | null;
```

相关类型：
- [IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)
- [IPublicTypeRootSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/root-schema.ts)

### removeDocument

删除一个 document

```typescript
/**
 * 删除一个 document
 * remove a document
 * @param doc
 */
removeDocument(doc: IPublicModelDocumentModel): void;
```

相关类型：[IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)

### getDocumentByFileName

根据 fileName 获取 document
```typescript
/**
 * 根据 fileName 获取 document
 * get a document by filename
 * @param fileName
 * @returns
 */
getDocumentByFileName(fileName: string): IPublicModelDocumentModel | null;
```

相关类型：[IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)

### getDocumentById

根据 id 获取 document

```typescript
/**
 * 根据 id 获取 document
 * get a document by id
 * @param id
 * @returns
 */
getDocumentById(id: string): IPublicModelDocumentModel | null;
```

相关类型：[IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)

### exportSchema

导出 project schema

```typescript
/**
 * 导出 project
 * export project to schema
 * @returns
 */
exportSchema(stage: IPublicEnumTransformStage): IPublicTypeProjectSchema;
```

相关类型：
- [IPublicEnumTransformStage](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/enum/transform-stage.ts)
- [IPublicTypeProjectSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/project-schema.ts)

### importSchema

导入 project

```typescript
/**
 * 导入 project schema
 * import schema to project
 * @param schema 待导入的 project 数据
 */
importSchema(schema?: IPublicTypeProjectSchema): void;
```
相关类型：[IPublicTypeProjectSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/project-schema.ts)

### addPropsTransducer
增加一个属性的管道处理函数

```typescript
/**
 * 增加一个属性的管道处理函数
 * add a transducer to process prop
 * @param transducer
 * @param stage
 */
addPropsTransducer(
    transducer: IPublicTypePropsTransducer,
    stage: IPublicEnumTransformStage,
  ): void;
```
相关类型：
- [IPublicTypePropsTransducer](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/props-transducer.ts)
- [IPublicEnumTransformStage](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/enum/transform-stage.ts)

#### 示例
在保存的时候删除每一个组件的 props.hidden
```typescript
import { project } from '@alilc/lowcode-engine';
import { IPublicTypeCompositeObject, IPublicEnumTransformStage, IPublicModelPluginContext } from '@alilc/lowcode-types';

export const DeleteHiddenTransducer = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { project } = ctx;
      project.addPropsTransducer((props: IPublicTypeCompositeObject): IPublicTypeCompositeObject => {
        delete props.hidden;
        return props;
      }, IPublicEnumTransformStage.Save);
    },
  };
}

DeleteHiddenTransducer.pluginName = 'DeleteHiddenTransducer';
```

### setI18n
设置多语言语料

```typescript
/**
 * 设置多语言语料
 * 数据格式参考 https://github.com/alibaba/lowcode-engine/blob/main/specs/lowcode-spec.md#2434%E5%9B%BD%E9%99%85%E5%8C%96%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%B1%BB%E5%9E%8Baa
 *
 * set I18n data for this project
 * @param value object
 * @since v1.0.17
 */
setI18n(value: object): void;
```

**@since v1.0.17**

### setConfig
设置当前项目配置

```typescript
/**
 * 设置当前项目配置
 * set config for this project
 * @param value object
 * @since v1.1.4
 */
  setConfig(value: IPublicTypeAppConfig): void;
  setConfig<T extends keyof IPublicTypeAppConfig>(key: T, value: IPublicTypeAppConfig[T]): void;
```

**@since v1.1.4**

#### 如何扩展项目配置

```typescript
// shims.d.ts
declare module '@alilc/lowcode-types' {
  export interface IPublicTypeAppConfig {
    customProp: CustomPropType
  }
}

export {};
```


## 事件

### onRemoveDocument
绑定删除文档事件

```typescript
/**
 * 绑定删除文档事件
 * set callback for event onDocumentRemoved
 * @param fn
 * @since v1.0.16
 */
onRemoveDocument(fn: (data: { id: string }) => void): IPublicTypeDisposable;
```
相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

**@since v1.0.16**

### onChangeDocument

当前 project 内的 document 变更事件

```typescript
/**
 * 当前 project 内的 document 变更事件
 * set callback for event onDocumentChanged
 */
onChangeDocument(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;
```

相关类型：
- [IPublicModelDocumentModel](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/document-model.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onSimulatorHostReady

当前 project 的模拟器 ready 事件

```typescript
/**
 * 当前 project 的模拟器 ready 事件
 * set callback for event onSimulatorHostReady
 */
onSimulatorHostReady(fn: (host: IPublicApiSimulatorHost) => void): IPublicTypeDisposable;
```
相关类型：
- [IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onSimulatorRendererReady

当前 project 的渲染器 ready 事件

```typescript
/**
 * 当前 project 的渲染器 ready 事件
 * set callback for event onSimulatorRendererReady
 */
onSimulatorRendererReady(fn: () => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)
