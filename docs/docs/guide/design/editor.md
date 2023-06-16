---
title: 编排模块设计
sidebar_position: 3
---
本篇重点介绍如何从零开始设计编排模块，设计思路是什么？思考编排的本质是什么？围绕着本质，如何设计并实现对应的功能模块。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01fGzyI41bqpl6AavNp_!!6000000003517-2-tps-1920-1080.png)

## 编排是什么

所谓编排，即将设计器中的所有物料，进行布局设置、组件设置、交互设置（JS 编写/逻辑编排）后，形成符合业务诉求的 schema 描述。
## 编排的本质

首先，思考编排的本质是什么？

编排的本质是生产符合《阿里巴巴中后台前端搭建协议规范》的数据**，**在这个场景里，协议是通过 JSON 来承载的。如：

```json
{
  "componentName": "Page",
  "props": {
    "layout": "wide"
  },
  "children": [
    {
      "componentName": "Button",
      "props": {
        "size": "large"
      }
    }
  ]
}
```

可是在真实场景，节点数可能有成百上千，每个节点都具有新增、删除、修改、移动、插入子节点等操作，同时还有若干约束，JSON 结构操作起来不是很便利，于是我们仿 DOM 设计了 **节点模型 & 属性模型，**用更具可编程性的方式来编排，这是**编排系统的基石**。

其次，每次编排动作后（CRUD），都需要实时的渲染出视图。广义的视图应该包括各种平台上的展现，浏览器、Rax、小程序、Flutter 等等，所以使用何种渲染器去渲染 JSON 结构应该可以由用户去扩展，我们定义一种机制去衔接设计态和渲染态。

至此，我们已经完成了**编排模块最基础的功能**，接下来，就是完善细节，逐步丰满功能。比如：
1. 编排面板的整体功能区划分设计；
2. 节点属性设计；节点删除、移动等操作设计；容器节点设计；
3. 节点拖拽功能、拖拽定位设计和实现；
4. 节点在画布上的辅助功能，比如 hover、选中、选中时的操作项、resize、拖拽占位符等；
5. 设计态和渲染态的坐标系转换，滚动监听等；
6. 快捷键机制；
7. 历史功能，撤销和重做；
8. 结构化的插件扩展机制；
9. 原地编辑功能；

有非常多模块，但只要记住一点，这些功能的目的都是辅助用户在画布上有更好的编排体验、扩展能力而逐个增加设计的。

## 编排功能模块
### 模型设计

编排实际上操作 schema，但是实际代码运行的过程中，我们将 schema 分成了很多层，每一层有各自的职责，他们所负责的功能是明确清晰的。这就是低代码引擎中的模型设计。

我们通过将 schema 和常用的操作等结合起来，最终将低代码引擎的模型分为节点模型、属性模型、文档模型和项目模型。

#### 项目模型（`Project`）

项目模型提供项目管理能力。通常一个引擎启动会默认创建一个 `Project` 实例，有且只有一个。项目模型实例下可以持有多个文档模型的实例，而当前处于设计器设计状态的文档模型，我们将其添加 active 标识，也将其称为 `currentDocument`，可以通过 `project.currentDocument` 获得。

一个 `Project` 包含若干个 `DocumentModel` 实例，即项目模型和文档模型的关系是 1 对 n，如下图所示：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01G28BKC1RvHRvhhiDf_!!6000000002173-2-tps-1226-1648.png)

#### 文档模型（`DocumentModel`）

文档模型提供文档管理的能力，每一个页面即一个文档流，对应一个文档模型。文档模型包含了一组 Node 组成的一颗树，类似于 DOM。我们可以通过文档模型来操作 `Node` 树，来达到管理文档模型的能力。每一个文档模型对应多个 `Node`，但是根 `Node` 只有一个，即 `rootNode` 和 `nodes`。

文档模型可以通过 `Node` 树，通过 `doc.schema` 来导出文档的 `schema`，并使用其进行渲染。

他们的关系如下图：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01NYVhN61nab6hsw5ZK_!!6000000005106-2-tps-960-1490.png)

#### 节点模型（`Node`）

我们先看一下一个 `Node` 在 `schema` 中对应的示例：

```javascript
{
  componentName: 'Text',
  id: 'node_k1ow3cbf',
  props: {
    showTitle: false,
    behavior: 'NORMAL',
    content: {
      use: 'zh_CN',
      en_US: 'Title',
      zh_CN: '个人信息',
      type: 'i18n',
    },
    fieldId: 'text_k1ow3h1j',
    maxLine: 0,
  },
  condition: true,
}
```

上面的示例是一个 `Text` 的 `Node` 节点，而我们的 `Node` 节点模型就是负责这一层级的 `Schema` 管理。它的功能聚焦于单层级的 schema 相关操作。我们可以看一下节点模型的一些方法，了解其功能。

```typescript
declare class Node<Schema extends NodeSchema = NodeSchema> {
  // Props
  props: Props;
  get propsData(): PropsMap | PropsList | null;
  getProp(path: string, stash?: boolean): Prop | null;
  getPropValue(path: string): any;
  setPropValue(path: string, value: any): void;
  clearPropValue(path: string): void;
  mergeProps(props: PropsMap): void;
  setProps(props?: PropsMap | PropsList | Props | null): void;

  // Node
  get parent(): ParentalNode | null;
  get children(): NodeChildren | null;
  get nextSibling(): Node | null;
  get prevSibling(): Node | null;
  remove(useMutator?: boolean, purge?: boolean): void;
  select(): void;
	hover(flag?: boolean): void;
  replaceChild(node: Node, data: any): Node;
  mergeChildren(remover: () => any, adder: (children: Node[]) => NodeData[] | null, sorter: () => any): void;
  removeChild(node: Node): void;
  insert(node: Node, ref?: Node, useMutator?: boolean): void;
  insertBefore(node: any, ref?: Node, useMutator?: boolean): void;
  insertAfter(node: any, ref?: Node, useMutator?: boolean): void;

  // Schema
  get schema(): Schema;
  set schema(data: Schema);
  export(stage?: TransformStage): Schema;
	replaceWith(schema: Schema, migrate?: boolean): any;
}
```

这里没有展示全部的方法，但是我们可以发现，`Node` 节点模型核心功能点有三个：

1. `Props` 管理：通过 `Props` 实例管理所有的 `Prop`，包括新增、设置、删除等 `Prop` 相关操作。
2. `Node` 管理：管理 `Node` 树的关系，修改当前 `Node` 节点或者 `Node` 子节点等。
3. `Schema` 管理：可以通过 `Node` 获取当前层级的 `Schema` 描述协议内容，并且也可以修改它。

通过 `Node` 这一层级，对 `Props`、`Node` 树和 `Schema` 的管理粒度控制到最低，这样扩展性也就更强。

#### 属性模型（Prop）

一个 `Props` 对应多个 `Prop`，每一个 `Prop` 对应 schema 的 `props` 下的一个字段。

`Props` 管理的是 `Node` 节点模型中的 `props` 字段下的内容。而 `Prop` 管理的是 `props` 下的每一个 `key` 的内容，例如下面的示例中，一个 `Props` 管理至少 6 个 `Prop`，而其中一个 `Prop` 管理的是 `showTitle` 的结果。

```javascript
{
  props: {
    showTitle: false,
    behavior: 'NORMAL',
    content: {
      use: 'zh_CN',
      en_US: 'Title',
      zh_CN: '个人信息',
      type: 'i18n',
    },
    fieldId: 'text_k1ow3h1j',
    maxLine: 0,
  },
}
```
#### 组件描述模型（ComponentMeta）

编排已经等价于直接操作节点 & 属性了，而一个节点和一组对应的属性相当于一个真实的组件，而真实的组件一定是有约束的，比如组件名、组件类型、支持哪些属性以及属性类型、组件能否拖动、支持哪些扩展操作、组件是否是容器型组件、A 组件中能否放入 B 组件等等。

于是，我们设计了一份协议专门负责组件描述，即《中后台搭建组件描述协议》，而编排模块中也有负责解析和使用符合描述协议规范的模块。

每一个组件对应一个 `ComponentMeta` 的实例，其属性和方法就是描述协议中的所有字段，所有 `ComponentMeta` 都由设计器器的 `designer` 模块进行创建和管理，其他模块通过 `designer` 来获取指定的 `ComponentMeta` 实例，尤其是每个 `Node` 实例上都会挂载对应的 `ComponentMeta` 实例。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01NSh0LI1b150RUzOUc_!!6000000003404-2-tps-998-756.png)

组件描述模型是后续编排辅助的基础，包括设置面板、拖拽定位机制等。
#### 项目、文档、节点和属性模型关系

整体来看，一个 Project 包含若干个 DocumentModel 实例，每个 DocumentModel 包含一组 Node 构成一颗树（类似 DOM 树），每个 Node 通过 Props 实例管理所有 Prop。整体的关系图如下。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01mufxpY1qCGvDTSdw9_!!6000000005459-2-tps-1694-1356.png)

节点 & 属性模型是引擎基石，几乎贯穿所有模块，相信从上面的类图已经能看出几个基础类的职责以及依赖关系。

节点 & 属性模型等价于 JSON 数据结构，而编排的本质是产出 JSON 数据结构，现在可以重新表述为编排的本质是操作节点 & 属性模型了。

```typescript
// 一段编排的示例代码
rootNode.insertAfter({ componentName: 'Button', props: { size: 'medium' } });
rootNode.insertAfter({ componentName: 'Button', props: { size: 'medium' } });
rootNode.children.get(1).getProp('size').setValue('large');
rootNode.children.get(2).remove();
rootNode.export();
// => 产出 schema
```

### 画布渲染

画布渲染使用了设计态与渲染态的双层架构。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01cZ6Q32260qtiDofwi_!!6000000007600-2-tps-1416-710.png)

如上图，设计器和渲染器其实处在不同的 Frame 下，渲染器以单独的 `iframe` 嵌入。这样做的好处，一是为了给渲染器一个更纯净的运行环境，更贴近生产环境，二是扩展性考虑，让用户基于接口约束自定义自己的渲染器。

#### xxx-renderer

xxx-renderer 是一个纯 renderer，即一个渲染器，通过给定输入 schema、依赖组件和配置参数之后完成渲染。

#### xxx-simulator-renderer

xxx-simulator-renderer 通过和 host 进行通信来和设计器打交道，提供了 `DocumentModel` 获取 schema 和组件。将其传入 xxx-renderer 来完成渲染。

另外其提供了一些必要的接口，来帮助设计器完成交互，比如点击渲染画布任意一个位置，需要能计算出点击的组件实例，继而找到设计器对应的 Node 实例，以及组件实例的位置/尺寸信息，让设计器完成辅助 UI 的绘制，如节点选中。

#### react-simulator-renderer

以官方提供的 react-simulator-renderer 为例，我们看一下点击一个 DOM 节点后编排模块是如何处理的。

首先在初始化的时候，renderer 渲染的时候会给每一个元素添加 ref，通过 ref 机制在组件创建时将其存储起来。在存储的时候我们给实例添加 `Symbol('_LCNodeId')` 的属性。

当点击之后，会去根据 `__reactInternalInstance$` 查找相应的 fiberNode，通过递归查找到对应的 React 组件实例。找到一个挂载着 `Symbol('_LCNodeId')` 的实例，也就是上面我们初始化添加的属性。

通过 `Symbol('_LCNodeId')` 属性，我们可以获取 Node 的 id，这样我们就可以找到 Node 实例。

通过 `getBoundingClientRect` 我们可以获取到 Node 渲染出来的 DOM 的相关信息，包括 `x`、`y`、`width`、`height` 等。

通过 DOM 信息，我们将 focus 节点所需的标志渲染到对应的地方。hover、拖拽占位符、resize handler 等辅助 UI 都是类似逻辑。

#### 通信机制

既然设计器和渲染器处于两个 Frame，它们之间的事件通信、方法调用是通过各自的代理对象进行的，不允许其他方式，避免代码耦合。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01hxtg7X1M3AZsAdt83_!!6000000001378-2-tps-1290-648.png)

##### host
host 可以访问设计器的所有模块，由于 renderer 层不负责与设计器相关的交互。所以增加了一层 host，作为通信的中间层。host 可以访问到设计器中所有模块，并提供相关方法供 simulator-renderer 层调用。例如 schema 的获取、组件获取等。

simulator-renderer 通过调用 host 的方法，将 schema、components 等参数传给 renderer，让 renderer 进行渲染。

##### xxx-simulator-renderer

为了完成双向交互，simulator-renderer 也需要提供一些方法来供 host 层调用，之后当设计器和用户有交互，例如上述提到的节点选中。这里需要提供的方法有：

- getClientRects
- getClosestNodeInstance
- findDOMNodes
- getComponent
- setNativeSelection
- setDraggingState
- setCopyState
- clearState

这样，host 和 simulator-renderer 之间便通过相关方法实现了双向通信，能在隔离设计器的基础上完成设计器到画布和画布到设计器的通信流程。

### 编排辅助的核心
#### 设置面板与设置器
当在渲染画布上点击一个 DOM 节点，我们可以通过 xxx-simulator-renderer 获取 `Node` 节点，我们在 `Node` 上挂载了 `ComponentMeta` 实例。通过 `ComponentMeta` 我们获取到当前组件的描述模型。通过描述模型，我们即可获得组件、即当前 Node 支持的所有属性配置。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01c7nkoo1OXyRhVAFlK_!!6000000001716-2-tps-1500-985.png)

##### 设置面板

设置面板对于配置项的呈现结构是通过 `ComponentMeta.configure` 来确定的。

```json
{
  "component": {
    "isContainer": true
  },
  "props": {
    "isExtends": true,
    "override": [
      {
        "name": "count",
        "title": {
          "label": "展示的数字",
          "tip": "count|大于 overflowCount 时显示为 ${overflowCount}+，为 0 时默认隐藏",
          "docUrl": "https://fusion.alibaba-inc.com/pc/component/basic/badge"
        },
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              "StringSetter",
              "ExpressionSetter"
            ]
          }
        }
      }
    ]
  }
}
```

上述的 `component.isContainer` 描述了这个组件是否是一个容器组件。而 props 下的属性就是我们在设置面板中展示的属性，包含了这个属性的名称、使用的设置器、配置之后影响的是哪个属性等。

而这只是描述，编排模块的 `SettingTopEntry` 便是管理设置面板的实现模块。

`SettingTopEntry` 包含了 n 个 `SettingField`，每一个 `SettingField` 就对应下面要将的设置器。即 `SettingTopEntry` 负责管理多个 `SettingField`。

##### 设置器
选中节点可供配置的属性都有相应的设置器配置，比如文本、数字、颜色、JSON、Choice、I18N、表达式 等等，或者混合多种。

设置器本质上是一个 React 组件，但是设置面板在渲染时会传入当前配置项对应的 `SettingField` 实例，`SettingField` 本质上就是包裹了 `Prop` 实例，设置器内部的行为以及 UI 变化都由设置器自己把控，但当属性值发生变化时需要通过 `SettingField` 下的 `Prop` 来修改值，因为修改 `Prop` 实例就相当于修改了 schema。一方面这样的设置器设置之后，保存的 schema 才是正确的，另外一方面，只有 schema 变化了，才能触发渲染画布重新渲染。

#### 拖拽引擎 & 拖拽定位机制

![](https://img.alicdn.com/imgextra/i4/O1CN01G8zyBw1OkL8m0FG4J_!!6000000001743-1-tps-1425-917.gif)

拖拽引擎（`Dragon`）核心完成的工作是将被拖拽对象拖拽到目标位置，涉及到几个概念：

- 被拖拽对象 - `DragObject`
- 拖拽到的目标位置 - `DropLocation`
- 拖拽感应区 - `IPublicModelSensor`
- 定位事件 - `LocateEvent`

##### Sensor

在引擎初始化的时候，我们监听 `document` 和 iframe `contentDocument` 的 `mouse`、`keyboard`、`drag` 事件来感知拖拽的发生。而这些监听的区域我们又称为拖拽感应区，也就是 `Sensor`。`Sensor` 会有多个，因为感应器有多个，默认设置器和设置面板是没有 `Sensor`，但是他们是可以注册 `Sensor` 来增加感应区域，例如大纲树就注册了自己的 `Sensor`。

`Sensor` 有两个关键职责：
1. 用于事件对象转换，比如坐标系换算。
2. 根据拖拽过程中提供的位置信息，结合每一层 `Node` 也就是组件包含的描述信息，知道其是否能作为容器等限制条件，来进行进一步的定位，最后计算出精准信息来进行视图渲染。

**拖拽流程**
1. 在引擎初始化的时候，初始化多个 `Sensor`。
2. 当拖拽开始的时候，开启 `mousemove`、`mouseleave`、`mouseover` 等事件的监听。
3. 拖拽过程中根据 `mousemove` 的 `MouseEvent` 对象封装出 `LocateEvent` 对象，继而交给相应 `sensor` 做进一步定位处理。
4. 拖拽结束时，根据拖拽的结果进行 schema 变更和视图渲染。
5. 最后关闭拖拽开始时的事件监听。

##### 拖拽方式
根据拖拽的对象不同，我们将拖拽分为几种方式：
1. **画布内拖拽：**此时 sensor 是 simulatorHost，拖拽完成之后，会根据拖拽的位置来完成节点的精确插入。
2. **从组件面板拖拽到画布**：此时的 sensor 还是 simulatorHost，因为拖拽结束的目标还是画布。
3. **大纲树面板拖拽到画布中**：此时有两个 sensor，一个是大纲树，当我们拖拽到画布区域时，画布区域内的 simulatorHost 开始接管。
4. **画布拖拽到大纲树中**：从画布中开始拖拽时，最新生效的是 simulatorHost，当离开画布到大纲树时，大纲树 sensor 开始接管生效。当拖拽到大纲树的某一个节点下时，大纲树会将大纲树中的信息转化为 schema，然后渲染到画布中。
### 其他

引擎的编排能力远远不止上述所描述的功能，这里只描述了其核心和关键的功能。在整个引擎的迭代和设计过程中还有很多细节来使我们的引擎更好用、更容易扩展。

#### schema 处理的管道机制

通过 PropsReducer 的管道机制，用户可以定制自己需要的逻辑，来修改 Schema。

#### 组件 metadata 处理的管道机制

组件的描述信息都收拢在各自的 ComponentMeta 实例内，涉及到的消费方几乎遍及整个编排过程，包括但不限于 组件拖拽、拖拽辅助 UI、设置区、原地编辑、大纲树 等等。

在用户需要自定义的场景，开放 ComponentMeta 的修改能力至关重要，因此我们设计了 metadata 初始化/修改的管道机制。

#### hotkey & builtin-hotkey

快捷键的实现，以及引擎内核默认绑定的快捷键行为。

#### drag resize 引擎

对于布局等类型的组件，支持拖拽改变大小。resize 拖拽引擎根据组件 ComponentMeta 声明来开启，拖拽后，触发组件的钩子函数（`onResizeStart` / `onResize` / `onResizeEnd`），完成 resize 过程。

#### OffsetObserver

设计态的辅助 UI 需要根据渲染态的视图变化而变化，比如渲染容器滚动了，此时通过 OffsetObserver 做一个动态的监听。

#### 插件机制

我们希望保持引擎内核足够小，但拥有足够强的扩展能力，所有扩展功能都通过插件机制来承载。
