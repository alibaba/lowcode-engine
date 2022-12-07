---
title: 2. 如何制作表格
sidebar_position: 0
---
## 步骤详解
### 拖入组件

一个常见的表格页面会包含查询框、表格和分页按钮。这些都在 Fusion UI 中进行了相应的封装，我们可以在左侧组件面板处找到他们。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01UU8pVT26XN1A0ExVG_!!6000000007671-2-tps-3032-1648.png)

将他们拖到画布之中：
![Feb-16-2022 16-58-59.gif](https://img.alicdn.com/imgextra/i3/O1CN01UAsQ8124HgDptzPrn_!!6000000007366-1-tps-1534-792.gif)
### 配置组件

选中刚拖入的“查询筛选”组件，您可以配置此组件：
![Feb-14-2022 17-59-47.gif](https://img.alicdn.com/imgextra/i2/O1CN01RiDUy31aufSeVk8IN_!!6000000003390-1-tps-1532-792.gif)

对于形如 Array 的配置项目，我们可以增删项目、修改常用项、修改顺序。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01eWOK0d1fOfsF9PZu9_!!6000000003997-2-tps-3060-1476.png)

掌握组件配置功能，我们就可以完成一个常用的查询框的配置：
![Feb-21-2022 18-05-52.gif](https://img.alicdn.com/imgextra/i1/O1CN0138fb0P1CTbHKWDBeo_!!6000000000082-1-tps-1532-790.gif)

### 绑定数据

低代码场景下，我们需要绑定动态的数据。通过左侧的源码编辑面板，我们可以创建动态数据和它的相关处理函数：

![image.png](https://img.alicdn.com/imgextra/i1/O1CN015Bw2aQ1jaMRWoYzv5_!!6000000004564-2-tps-2976-1478.png)

如图，我们配入如下自定义值进 state 里：
```json
    "companies": [
      { company: '测试公司1', id: 1, createTime: +new Date() },
      { company: '测试公司2', id: 2, createTime: +new Date() },
      { company: '测试公司3', id: 3, createTime: +new Date() },
    ]
```
定义动态数据以后，我们需要绑定它到组件的属性中，我们找到相关属性的配置：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN013Cu5OE1CXGRhyEmbJ_!!6000000000090-2-tps-3546-1792.png)

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01iaK15j1bgIeO65svI_!!6000000003494-2-tps-3428-1640.png)

如图，输入表达式：

```javascript
this.state.companies
```

再结合上一节的“配置组件”操作，我们已经可以把表格的主体配置出来了：

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01p8QJ5C1buxKDTS1cU_!!6000000003526-2-tps-3058-1640.png)

### 动态请求

我们进入代码区块，使用生命周期方法来完成动态数据的请求。假设提供数据的接口是：[http://rap2api.taobao.org/app/mock/250089/testCompanies](http://rap2api.taobao.org/app/mock/250089/testCompanies)，那么，我们可以在源码面板进行如下配置：

```typescript
class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false,
    "loading": false,
    "companies": [
      { company: '测试公司 1', id: 1, createTime: +new Date() },
      { company: '测试公司 2', id: 2, createTime: +new Date() },
      { company: '测试公司 3', id: 3, createTime: +new Date() },
    ]
  }
  componentDidMount() {
    this.setState({ loading: true })
    window.fetch('http://rap2api.taobao.org/app/mock/250089/testCompanies')
      .then((res) => res.json())
      .then((companies) => {
        this.setState({
          companies,
        })
      })
      .catch(err => console.error(err))
      .then(() => {
        this.setState({ loading: false })
      })
  }
}
```

在 `componentDidMount` 生命周期，将请求接口并设置 loading 和数据字段。

点击保存或叉关闭源码面板后，我们可以看到代码已经生效了：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01lqjW8e1f39G8Zm7hQ_!!6000000003950-2-tps-3058-1634.png)

### 配置插槽

我们可以用绑定数据的方法把 loading 绑在加载指示上：

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01K3Pwjo1PKWQcoBl5K_!!6000000001822-2-tps-3170-1904.png)

![Feb-16-2022 20-24-35.gif](https://img.alicdn.com/imgextra/i2/O1CN01VGlZPS1JitoljrFFY_!!6000000001063-1-tps-1532-792.gif)

将 Loading 的“是否显示”字段绑定 `this.state.loading` 后，我们可以看到，这里暴露了一个插槽。插槽是可以任意扩展的预设部分，我们可以把其他的部分拖进插槽：

![Feb-16-2022 20-27-03.gif](https://img.alicdn.com/imgextra/i2/O1CN01HSBncU1XWRfPdwlPK_!!6000000002931-1-tps-1528-792.gif)

点击右上角的预览，我们能够看到完整的动态请求效果了：
![Feb-16-2022 20-28-36.gif](https://img.alicdn.com/imgextra/i3/O1CN01o5THZf1fkesw2nZEC_!!6000000004045-1-tps-1534-792.gif)

### 列挂钩浮层

为了能够让表格里的操作挂钩浮层，我们先拖入一个浮层：
![Feb-16-2022 20-32-09.gif](https://img.alicdn.com/imgextra/i2/O1CN01bX3SHk21Z8T4O6knp_!!6000000006998-1-tps-1532-792.gif)

使用大纲树能够临时显示和隐藏此浮层：
![Feb-16-2022 20-32-39.gif](https://img.alicdn.com/imgextra/i3/O1CN01ZtSp0P1LvNqYPeUHg_!!6000000001361-1-tps-1530-792.gif)

我们给表格增加一个数据列：
![Feb-16-2022 20-39-41.gif](https://img.alicdn.com/imgextra/i2/O1CN012K6qWI1hgCG6KwRF7_!!6000000004306-1-tps-1532-792.gif)

然后配置它的行为为“弹窗”：
![Feb-16-2022 20-40-05.gif](https://img.alicdn.com/imgextra/i2/O1CN016axZh61uc9ln0L3Rz_!!6000000006057-1-tps-1532-792.gif)

实现的效果如下：
![Feb-16-2022 20-42-51.gif](https://img.alicdn.com/imgextra/i4/O1CN018iana91j4l71QTmpE_!!6000000004495-1-tps-1534-792.gif)

### 事件回调

上述功能点中，我们是把操作行为绑定在数据列上的，这一节我们绑定到操作列中。在操作列按钮处，点击下方的“添加一项”：
![Feb-23-2022 11-58-02.gif](https://img.alicdn.com/imgextra/i4/O1CN01DsBoHQ1tyli2rtoFR_!!6000000005971-1-tps-1534-790.gif)

点击左侧的详情按钮，配置它的事件回调：
![Feb-23-2022 12-00-18.gif](https://img.alicdn.com/imgextra/i2/O1CN017BuNLP1LPmW8zH7hx_!!6000000001292-1-tps-1534-790.gif)

代码侧，我们配置这个回调函数：
```javascript
onClick_new(e, { rowKey, rowIndex, rowRecord }){
  window.Next.Message.show(JSON.stringify({ rowKey, rowIndex, rowRecord }))
}
```
保存。预览时我们可以看到效果了：
![Feb-23-2022 12-05-25.gif](https://img.alicdn.com/imgextra/i3/O1CN01CXi1zJ1N302paKUre_!!6000000001513-1-tps-1532-790.gif)
## 研究本例的 schema

我们把本例的 schema 保存在云端，您可以自行下载研究：[https://mo.m.taobao.com/marquex/lowcode-showcase-table](https://mo.m.taobao.com/marquex/lowcode-showcase-table)

您可以通过左下角的 Schema 面板直接导入本例子的 Schema。
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01z2LXgW1iFSklNRzTN_!!6000000004383-2-tps-3054-1620.png)
