---
title: 接入运行时
sidebar_position: 1
---

低代码引擎的编辑器将产出两份数据：

- 资产包数据 assets：包含物料名称、包名及其获取方式，对应协议中的[《低代码引擎资产包协议规范》](https://lowcode-engine.cn/assets)
- 页面数据 schema：包含页面结构信息、生命周期和代码信息，对应协议中的[《低代码引擎搭建协议规范》](https://lowcode-engine.cn/lowcode)

经过上述两份数据，可以直接交由渲染模块或者出码模块来运行，二者的区别在于：

- 渲染模块：使用资产包数据、页面数据和低代码运行时，并且允许维护者在低代码编辑器中用 Low Code 的方式继续维护；
- 出码模块：不依赖低代码运行时和页面数据，直接生成可直接运行的代码，并且允许维护者用 Pro Code 的方式继续维护，但无法再利用用低代码编辑器；

## 渲染模块

[在 Demo 中](https://lowcode-engine.cn/demo)，右上角有渲染模块的示例使用方式：
![Mar-13-2022 16-52-49.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1647161579197-20c72ea4-6d9a-4692-9b23-005182f6387e.gif#clientId=u244806d0-100a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u9b403d3d&margin=%5Bobject%20Object%5D&name=Mar-13-2022%2016-52-49.gif&originHeight=514&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=755539&status=done&style=stroke&taskId=u14f0f4c2-4d6c-4296-b2df-ccda870faff&title=)

基于官方提供的渲染模块 [@alifd/lowcode-react-renderer](https://github.com/alibaba/lowcode-engine/tree/main/packages/react-renderer)，你可以在 React 上下文渲染低代码编辑器产出的页面。

### 构造渲染模块所需数据

渲染模块所需要的数据需要通过编辑器产出的数据进行一定的转换，规则如下：

- schema：从编辑器产出的 projectSchema 中拿到 componentsTree 中的首项，即 `projectSchema.componentsTree[0]`；
- components：需要根据编辑器产出的资产包 assets 中，根据页面 projectSchema 中声明依赖的 componentsMap，来加载所有依赖的资产包，最后获取资产包的实例并生成物料 - 资产包的键值对 components。

这个过程可以参考 demo 项目中的 `src/preview.tsx`：
```typescript
async function getSchemaAndComponents() {
  const packages = JSON.parse(window.localStorage.getItem('packages') || '');
  const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '');
  const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
  const componentsMap: any = {};
  componentsMapArray.forEach((component: any) => {
    componentsMap[component.componentName] = component;
  });
  const schema = componentsTree[0];

  const libraryMap = {};
  const libraryAsset = [];
  packages.forEach(({ package: _package, library, urls, renderUrls }) => {
    libraryMap[_package] = library;
    if (renderUrls) {
      libraryAsset.push(renderUrls);
    } else if (urls) {
      libraryAsset.push(urls);
    }
  });

  const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

  const assetLoader = new AssetLoader();
  await assetLoader.load(libraryAsset);
  const components = await injectComponents(buildComponents(libraryMap, componentsMap));

  return {
    schema,
    components,
  };
}
```

### 进行渲染

拿到 schema 和 components 以后，您可以借由资产包数据和页面数据来完成页面的渲染：
```tsx
import React from 'react';
import ReactRenderer from '@alilc/lowcode-react-renderer';

const SamplePreview = () => {
  return (
    <ReactRenderer
      schema={schema}
      components={components}
    />
  )
}
```

> 注：您可以注意到，此处是依赖了 React 进行渲染的，对于 Vue 形态的渲染或编辑器支持，详见[对应公告](https://github.com/alibaba/lowcode-engine/issues/236)。
> 本节示例可在 Demo 代码里找到：[https://github.com/alibaba/lowcode-demo/blob/main/src/preview.tsx](https://github.com/alibaba/lowcode-demo/blob/main/src/preview.tsx#L54-L58)


## 出码模块

[在 Demo 中](https://lowcode-engine.cn/demo)，右上角有出码模块的示例使用方式：
![Mar-13-2022 16-55-56.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1647161777243-b16045c4-3cac-4920-8e68-ce064a90fe26.gif#clientId=u244806d0-100a-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ud7bfd5a2&margin=%5Bobject%20Object%5D&name=Mar-13-2022%2016-55-56.gif&originHeight=514&originWidth=1536&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1727314&status=done&style=stroke&taskId=u4e079100-d6a0-4ad2-ac0c-938ab8e7759&title=)

> 本节示例可在出码插件里找到：[https://github.com/alibaba/lowcode-code-generator-demo](https://github.com/alibaba/lowcode-code-generator-demo)


## 低代码的生产和消费

经过“接入编辑器” - “接入运行时” 这两节的介绍，我们已经可以了解到低代码所构建的生产和消费流程了，梳理如下图：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644405393410-1c54fa37-74de-4c48-a4a9-1cbce359feeb.png#clientId=ua752ee55-c225-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=u4ceefadb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1786&originWidth=3206&originalType=binary&ratio=1&rotation=0&showTitle=false&size=312489&status=done&style=none&taskId=uae8eacd1-4c05-4689-bb6a-24ceb76327d&title=&width=710)

如上述流程所示，您一般需要一个后端项目来保存页面数据信息，如果资产包信息是动态的，也需要保存资产包信息。
