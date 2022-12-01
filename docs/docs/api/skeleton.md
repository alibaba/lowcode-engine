---
title: skeleton - 面板 API
sidebar_position: 1
---
## 模块简介
面板 API 提供了面板扩展和管理的能力，如下图蓝色内容都是扩展出来的。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1645442085447-d1822e7f-9e5a-4e06-a770-04b1023d5daf.png#clientId=u9aca70b6-1a98-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=498&id=u2dd3deb2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=996&originWidth=1780&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1549904&status=done&style=none&taskId=u28659b69-981c-416e-bed6-b2f06b8e6fc&title=&width=890)

页面上可以扩展的区域共 5 个，具体如下：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1645431386085-2710d33d-0652-450a-a993-c804368da1ce.png#clientId=u1724eb73-4c0c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=487&id=ud138f866&margin=%5Bobject%20Object%5D&name=image.png&originHeight=974&originWidth=1892&originalType=binary&ratio=1&rotation=0&showTitle=false&size=228235&status=done&style=none&taskId=u265d50a5-3700-406e-84b2-0158ebadaae&title=&width=946)
### 基本概念
#### 扩展区域位置 (area)
##### topArea

展示在设计器的顶部区域，常见的相关区域的插件主要是：
1. 注册设计器 Logo；
2. 设计器操作回退和撤销按钮；
3. 全局操作按钮，例如：保存、预览等；
##### leftArea

左侧区域的展示形式大多数是 Icon 和对应的面板，通过点击 Icon 可以展示对应的面板并隐藏其他的面板。

该区域相关插件的主要有：
1. 大纲树展示，展示该设计器设计页面的大纲。
2. 组件库，展示注册到设计器中的组件，点击之后，可以从组件库面板中拖拽到设计器的画布中。
3. 数据源面板
4. JS 等代码面板。

可以发现，这个区域的面板大多数操作时是不需要同时并存的，且交互比较复杂的，需要一个更整块的区域来进行操作。

##### centerArea

画布区域，由于画布大多数是展示作用，所以一般扩展的种类比较少。常见的扩展有：
1. 画布大小修改
2. 物料选中扩展区域修改
##### rightArea

右侧区域，常用于组件的配置。常见的扩展有：统一处理组件的配置项，例如统一删除某一个配置项，统一添加某一个配置项的。
##### toolbar

跟 topArea 类似，按需放置面板插件~
#### 展示类型 (type)

展示类型用于区分插件在设计器内可操作的几种不同界面类型。主要的几种类型为 PanelDock、Widget、Dock，另有 Panel 类型目前不推荐使用。
##### PanelDock

PanelDock 是以面板的形式展示在设计器的左侧区域的。其中主要有两个部分组成，一个是图标，一个是面板。当点击图标时可以控制面板的显示和隐藏。

下图是组件库插件的展示效果。

![Feb-08-2022 19-44-15.gif](https://img.alicdn.com/imgextra/i2/O1CN01i66G5O27bK37nlpxV_!!6000000007815-1-tps-1536-790.gif)

其中右上角可以进行固定，可以对弹出的宽度做设定

接入可以参考代码
```javascript
import { skeleton } from "@alilc/lowcode-engine";

skeleton.add({
  area: "leftArea", // 插件区域
  type: "PanelDock", // 插件类型，弹出面板
  name: "sourceEditor",
  content: SourceEditor, // 插件组件实例
  props: {
    align: "left",
    icon: "wenjian",
    description: "JS 面板",
  },
  panelProps: {
    floatable: true, // 是否可浮动
    height: 300,
    hideTitleBar: false,
    maxHeight: 800,
    maxWidth: 1200,
    title: "JS 面板",
    width: 600,
  },
});
```
##### Widget
Widget 形式是直接渲染在当前编辑器的对应位置上。如 demo 中在设计器顶部的所有组件都是这种展现形式。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01IRQIZp1m5AJPwBKDv_!!6000000004902-2-tps-1988-94.png)

接入可以参考代码：

```javascript
import {skeleton} from "@alilc/lowcode-engine";
// 注册 logo 面板
skeleton.add({
  area: "topArea",
  type: "Widget",
  name: "logo",
  content: Logo,  // Widget 组件实例
  contentProps: { // Widget 插件 props
    logo:
    "https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png",
    href: "/",
  },
  props: {
    align: "left",
    width: 100,
  },
});
```
##### Dock

一个图标的表现形式，可以用于语言切换、跳转到外部链接、打开一个 widget 等场景。

```javascript
import { skeleton } from "@alilc/lowcode-engine";

skeleton.add({
  area: "leftArea",
  type: "Dock",
  name: "opener",
  content: Opener, // Widget 组件实例
  contentProps: {  // Widget 插件 props
    xxx: "1",
  },
  props: {
    align: "bottom",
  },
  onClick: function() {
    // 打开外部链接
    window.open('https://lowcode-engine.cn');
    // 显示 widget
    skeleton.showWidget('xxx');
  }
});
```

## 变量（variables）

无
## 方法签名（functions）

### 1. add

```tsx
add(config: IWidgetBaseConfig & {
  area?: string;
}, extraConfig?: object): IWidget | Panel;
```

往指定扩展区加入一块面板

IWidgetBaseConfig 定义如下：

| 属性名 | 含义 | 备注 |
| --- | --- | --- |
| name | 面板名称 |  |
| area | 扩展区位置，可选值：'topArea' &#124; 'leftArea' &#124; 'rightArea' &#124; 'toolbar' &#124; 'bottomArea' &#124; 'mainArea' |  |
| type | 面板类型，可选值：'Widget' &#124; 'PanelDock' &#124; 'Panel' | 详见前文中对**展示类型**的描述 |
| content | 面板的实现类/节点，类型是 ReactClass &#124; ReactElement |  |
| props | 面板属性 | align: 'top' &#124; 'bottom' &#124; 'left' &#124; 'center' &#124; 'right'; // 指定面板 icon 位置区域<br />icon: string &#124; ReactElement;  // icon 为字符串时，请确定当前 fusion 主题包中包含该 icon<br />description: string;<br />condition: Function; // 指定当前面板的显影状态 |
| contentProps | 面板的实现类/节点的参数 |  |
| panelProps | 假如 type: 'Panel' &#124; 'PanelDock' 时有效，传给 Panel 类的参数 | keepVisibleWhileDragging: boolean; // 当有元素在当前 panel 拖拽时，是否保持 panel 为展开状态，默认值：false<br />area: 'leftFloatArea' &#124; 'leftFixedArea' // 指定 panel 位于浮动面板还是钉住面板 |
| index | 面板的位置，不传默认按插件注册顺序 |  |


### 2. remove

remove(config: IWidgetBaseConfig)

移除一个面板实例

### 3. showPanel

showPanel(name: string)

展示指定 Panel 实例

### 4. hidePanel

hidePanel(name: string)

### 5. showWidget

showWidget(name: string)

展示指定 Widget 实例

### 6. hideWidget

hideWidget(name: string)

隐藏指定 widget 实例。

### 7. enableWidget

enableWidget(name: string)

将 widget 启用。

注：该函数将会触发全局事件 'skeleton.widget.enable'

### 8. disableWidget

disableWidget(name: string)

将 widget 禁用掉，禁用后，所有鼠标事件都会被禁止掉。

适用场景：在该面板还在进行初始化构造时，可以先禁止掉，防止用户点击报错，待初始化完成，重新启用。

## 事件（events）
### 1. onShowPanel

onShowPanel(listener: (...args: unknown[]) => void)

监听 Panel 实例显示事件

### 2. onHidePanel

onHidePanel(listener: (...args: unknown[]) => void)

监听 Panel 实例隐藏事件

### 3. onShowWidget

onShowWidget(listener: (...args: unknown[]) => void)

监听 Widget 实例显示事件

### 4. onHideWidget

onHideWidget(listener: (...args: unknown[]) => void)

监听 Widget 实例隐藏事件
## 使用示例

```typescript
import { skeleton } from '@alilc/lowcode-engine';

skeleton.add({
	name: 'logo',
  area: 'topArea',
  type: 'Widget',
  contentProps: {},
  content: LogoContent,
});

skeleton.add({
  name: 'sourceEditor',
  type: 'PanelDock',
  area: 'leftArea',
  props: {
    align: 'top',
    icon: 'wenjian',
    description: 'JS 面板',
  },
  panelProps: {
    floatable: true,
    height: 300,
    help: undefined,
    hideTitleBar: false,
    maxHeight: 800,
    maxWidth: 1200,
    title: 'JS 面板',
    width: 600,
  },
  content: SourceEditor,
});

// 显隐 panel
skeleton.showPanel('sourceEditor');
skeleton.hidePanel('sourceEditor');


// 创建一个浮动的 widget
skeleton.add({
  name: 'floatingWidget',
  type: 'Widget',
  area: 'mainArea',
  props: {},
  content: React.createElement('div', {}, 'haha'),
  contentProps: {
    style: {
      position: 'fixed',
      top: '200px',
      bottom: 0,
      width: 'calc(100% - 46px)',
      'background-color': 'lightblue'
    }
  }
});

// 显隐 widget
skeleton.showWidget('floatingWidget');
skeleton.hideWidget('floatingWidget');

// 控制 widget 的可点击态
skeleton.enableWidget('sourceEditor');
skeleton.disableWidget('sourceEditor');
```
### bottomArea 示例
```typescript
import { skeleton } from '@alilc/lowcode-engine';

skeleton.add({
	name: 'bottomAreaPanelName',
  area: 'bottomArea',
  type: 'Panel',
  content: () => 'demoText',
});


skeleton.showPanel('bottomAreaPanelName');
```
### widget 示例
```typescript
// 注册 logo 面板
skeleton.add({
  area: 'topArea',
  type: 'Widget',
  name: 'logo',
  content: Logo,
  contentProps: {
    logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
    href: 'https://lowcode-engine.cn',
  },
  props: {
    align: 'left',
  },
});
```
