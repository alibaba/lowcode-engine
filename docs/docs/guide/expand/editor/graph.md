---
title: 图编排扩展
sidebar_position: 8
---
## 项目运行
### 前置准备
1. 参考 https://lowcode-engine.cn/site/docs/guide/quickStart/start
2. 参考至Demo下载 https://lowcode-engine.cn/site/docs/guide/quickStart/start#%E4%B8%8B%E8%BD%BD-demo
### 选择demo-graph-x6
在根目录下执行：
```bash
cd demo-graph-x6
```
### 安装依赖
在 lowcode-demo/demo-graph-x6目录下执行：
```bash
npm install
```
### 启动Demo
在 lowcode-demo/demo-graph-x6 目录下执行：
```bash
npm run start
```
之后就可以通过 http://localhost:5556/ 来访问我们的 DEMO 了。

## 认识Demo
这里的Demo即通过图编排引擎加入了几个简单的物料而来，已经是可以面向真是用户的产品界面。
![image.png](https://img.alicdn.com/imgextra/i1/O1CN016TbCI31hM2sJy8qkR_!!6000000004262-2-tps-5120-2726.png)
### 区域组成
#### 顶部：操作区​
- 右侧：保存到本地、重置页面、自定义按钮
#### 顶部：工具区
- 左侧：删除、撤销、重做、放大、缩小
#### 左侧：面板与操作区​
- 物料面板：可以查找节点，并在此拖动节点到编辑器画布中
#### 中部：可视化页面编辑画布区域​
- 点击节点/边在右侧面板中能够显示出对应组件的属性配置选项
- 拖拽修改节点的排列顺序
#### 右侧：组件级别配置​
- 选中的组件：从页面开始一直到当前选中的节点/边位置，点击对应的名称可以切换到对应的节点上
- 选中组件的配置：属性：节点的基础属性值设置

> 每个区域的组成都可以被替换和自定义来生成开发者需要的业务产品。

## 目录介绍
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01Luc8gr1tLq5QTbpb9_!!6000000005886-0-tps-832-1522.jpg)

- public：与其他demo保持一致，均是lowcode engine所必要依赖
- src
  - plugins:：自定义插件，完成了x6的切面回调处理功能
  - services：mock数据，真实场景中可能为异步获取数据

## 开发插件
```typescript
function pluginX6DesignerExtension(ctx: IPublicModelPluginContext) {
  return {
    init() {
      // 获取 x6 designer 内置插件的导出 api
      const x6Designer = ctx.plugins['plugin-x6-designer'] as IDesigner;

      x6Designer.onNodeRender((model, node) => {
        // @ts-ignore
        // 自定义 node 渲染逻辑
        const { name, title } = model.propsData;
        node.attr('text/textWrap/text', title || name);
      });

      x6Designer.onEdgeRender((model, edge) => {
        // @ts-ignore
        const { source, target, sourcePortId, targetPortId } = model.propsData;
        console.log(sourcePortId, targetPortId);
        requestAnimationFrame(() => {
          edge.setSource({ cell: source, port: sourcePortId });
          edge.setTarget({ cell: target, port: targetPortId });
        });

        // https://x6.antv.vision/zh/docs/tutorial/intermediate/edge-labels x6 标签模块
        // appendLabel 会触发 onEdgeLabelRender
        edge.appendLabel({
          markup: Markup.getForeignObjectMarkup(),
          attrs: {
            fo: {
              width: 120,
              height: 30,
              x: -60,
              y: -15,
            },
          },
        });
      });

      x6Designer.onEdgeLabelRender((args) => {
        const { selectors } = args
        const content = selectors.foContent as HTMLDivElement
        if (content) {
          ReactDOM.render(<div>自定义 react 标签</div>, content)
        }
      })
    }
  }
}

pluginX6DesignerExtension.pluginName = 'plugin-x6-designer-extension';

export default pluginX6DesignerExtension;
```
x6Designer为图实例暴露出来的一些接口，可基于此进行一些图的必要插件的封装，整个插件的封装完全follow低代码引擎的插件，详情可参考 https://lowcode-engine.cn/site/docs/guide/expand/editor/pluginWidget

## 开发物料
```bash
npm init @alilc/element your-material-demo
```
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01DCCqO82ADuhS8ztCt_!!6000000008170-2-tps-546-208.png)

仓库初始化完成
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01qK2rUe1JNpdqbdhoW_!!6000000001017-0-tps-5120-2830.jpg)

接下来即可编写物料内容了
图物料与低代码的dom场景存在画布的差异，因此暂不支持物料单独调试，须通过项目demo进行物料调试

### 资产描述
```bash
npm run lowcode:build
```
如果物料是个React组件，则在执行上述命令时会自动生成对应的meta.ts，<b>但图物料很多时候并非一个React组件，因此须手动生产meta.ts</b>

可参考：  https://github.com/alibaba/lowcode-materials/blob/main/packages/graph-x6-materials/lowcode/send-email/meta.ts
同时会自动生成物料描述文件

### 物料调试
#### 物料侧
物料想要支持被项目动态inject调试，须在build.lowcode.js中加入
```javascript
[
  '@alilc/build-plugin-alt',
  {
    type: 'component',
    inject: true,
    library
  },
]
```
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01HyXfL12992sDkOmOg_!!6000000008024-0-tps-5120-2824.jpg)

本地启动
```bash
npm run lowcode:dev
```
#### 项目侧
通过@alilc/lce-graph-core加载物料的天然支持了debug，因此无须特殊处理。
若项目中自行加载，则参考 https://lowcode-engine.cn/site/docs/guide/expand/editor/cli
项目访问地址后拼接query "?debug"即可进入物料调试
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01ke58hT1aRoYJzkutk_!!6000000003327-2-tps-5120-2790.png)


