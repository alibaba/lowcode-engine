---
title: 低代码引擎架构综述
sidebar_position: 0
---
## 分层架构描述
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644392855407-44040c3e-f98e-4e93-a7ba-7efc0a7927fb.png#clientId=ue3f00c22-d0cc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u0d1fdc91&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1080&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=177518&status=done&style=none&taskId=u0ac7d0a3-e838-4982-ad41-e830af33545&title=&width=960)
我们设计了这样一套分层架构，自下而上分别是协议 - 引擎 - 生态 - 平台。
底层协议栈定义的是标准，**标准的统一让上层产物的互通成为可能**，
**引擎是对协议的实现，同时通过能力的输出，向上支撑生态开放体系，提供各种生态扩展能力，**
那么生态就好理解了，是基于引擎核心能力上扩展出来的，比如物料、设置器、插件等，还有工具链支撑开发体系，
最后，各个平台基于引擎内核以及生态中的产品组合、衔接形成满足其需求的低代码平台。
**每一层都明确自身的定位，各司其职，协议不会去思考引擎如何实现，引擎也不会实现具体上层平台功能，上层平台的定制化均通过插件来实现，这些理念将会贯穿我们体系设计、实现的过程。**

## 引擎内核简述

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644393521380-2b5dda70-cd35-4cc2-aeae-6d0ba98deccd.png#clientId=ue3f00c22-d0cc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u6b0dd5f3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1080&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=330340&status=done&style=none&taskId=u39127ebd-dbac-4636-9cb5-5c4833146a1&title=&width=960)

低代码引擎分为 4 大模块，入料 - 编排 - 渲染 - 出码。
入料模块就是将外部的物料，比如海量的 npm 组件，按照《物料描述协议》进行描述。
**注意，这里仅是增加描述，而非重写一套，这样我们能最大程度复用ProCode体系已沉淀的组件。**
将描述后的数据通过引擎 API 注册后，在编辑器中使用。
编排，本质上来讲，就是**不断在生成符合《搭建协议》的页面描述，将编辑器中的所有物料，进行布局设置、组件 CRUD 操作、以及 JS/CSS编写/逻辑编排**等，最终转换成页面描述，技术细节待会儿我们再展开讲讲。
渲染，顾名思义，就是**将编排生成的页面描述结构渲染成视图的过程**，视图是面向用户的，所以必须处理好内部数据流、生命周期、事件绑定、国际化等。
出码，就是**将页面描述结构解析和转换成应用代码的机制**。

## 引擎生态简述

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644393489755-b9a6a471-c099-480b-b40b-3094b793394d.png#clientId=ue3f00c22-d0cc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u81ccc9e2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1080&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=504671&status=done&style=none&taskId=u52008ac0-e9c6-407b-a59e-7dbf4c02c0c&title=&width=960)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644397483218-2b58bfca-94b1-474e-8983-afc757f20e59.png#clientId=uafdaa655-f89e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u3aeacdac&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1080&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=394834&status=done&style=none&taskId=udcd28484-1df2-484c-9f98-87175972d65&title=&width=960)

引擎生态主要分为 3 部分，物料、设置器和插件。
### 物料生态
物料是低代码平台的生产资料，没有物料低代码平台则变成了无源之水无本之木。低代码平台的物料即低代码组件。因此低代码物料生态指的是：
1）低代码物料生产能力和规范。
2）对低代码物料进行统一管理的物料中心。
3）基于 Fusion Next 的低代码基础组件库。

### 设置器生态
对于已接入物料的属性配置，需要不同的设置器。
比如配置数值类型的 age，需要一个数值设置器，配置对象类型的 hobby，需要一个对象设置器，依次类推。
每个设置器本质上都是一个 React 组件，接受由引擎传入的参数，比如 value 和 onChange，value 是初始传入的值，onChange 是在设置器的值变化时的回传函数，将值写回到引擎中。
```json
// 一个最简单的文本设置器示例
class TextSetter extends Component {
  render() {
    const { value, onChange } = this.props;
    return <input value={value} onChange={(e) => onChange(e.target.value)} />;
  }
}
```
大多数组件所使用的设置器都是一致或相似的。如同建设低代码基础组件库一样，设置器生态是一组基础的设置器，供大多数组件配置场景使用。
同时提供了设置器的定制功能。

### 插件生态
低代码引擎本身只包含了最小的内核，而我们所能看到的设计器上的按钮、面板等都是插件提供的。插件是组成设计器的必要部分。
因此我们提供了一套官方的插件生态，提供最基础的设计器功能。帮助用户通过使用插件，快速完成自己的设计器。
