---
title: 2. 如何制作表格
sidebar_position: 0
---
# 步骤详解
## 拖入组件
一个常见的表格页面会包含查询框、表格和分页按钮。这些都在 Fusion UI 中进行了相应的封装，我们可以在左侧组件面板处找到他们。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645011856718-ed2aa0b1-0c5c-4ec0-a72b-377bc500faf3.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=824&id=ue90ea461&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1648&originWidth=3032&originalType=binary&ratio=1&rotation=0&showTitle=false&size=963971&status=done&style=stroke&taskId=u3b1dfd98-44b7-4a13-be2a-e0124084288&title=&width=1516)

将他们拖到画布之中：
![Feb-16-2022 16-58-59.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645002115004-4f01eb8d-cf68-4a7c-b0db-bc5aaf2604a3.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=uf69dc239&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2016-58-59.gif&originHeight=792&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7510570&status=done&style=stroke&taskId=ua6ea2651-6c6c-4762-98cc-cc3ab5734cd&title=&width=767)
## 配置组件

选中刚拖入的“查询筛选”组件，您可以配置此组件：
![Feb-14-2022 17-59-47.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1644832912542-4b2e66ae-ba15-4e38-ab79-9f83e413a493.gif#clientId=uec0ffd6f-d4e1-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u83c491b2&margin=%5Bobject%20Object%5D&name=Feb-14-2022%2017-59-47.gif&originHeight=792&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2147213&status=done&style=stroke&taskId=uffd7092e-a247-4f48-b831-aaffe3646f7&title=)

对于形如 Array 的配置项目，我们可以增删项目、修改常用项、修改顺序。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645012184644-444d82fa-a226-4784-b0df-92a5a52748bc.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=738&id=uc4ea8ded&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1476&originWidth=3060&originalType=binary&ratio=1&rotation=0&showTitle=false&size=375890&status=done&style=none&taskId=u7a1f43d8-eac4-405e-a3c9-38d3047f452&title=&width=1530)

掌握组件配置功能，我们就可以完成一个常用的查询框的配置：
![Feb-21-2022 18-05-52.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645437973453-1fd1dc10-99ad-4c18-af49-2741bd81c4ae.gif#clientId=u022fc577-71a7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=u964ae52f&margin=%5Bobject%20Object%5D&name=Feb-21-2022%2018-05-52.gif&originHeight=790&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7210902&status=done&style=stroke&taskId=u9e39c54a-7467-4a96-b716-681cf598f09&title=&width=766)

## 绑定数据

低代码场景下，我们需要绑定动态的数据。通过左侧的源码编辑面板，我们可以创建动态数据和它的相关处理函数：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645012532562-596d4a96-908e-4094-836c-974bda61d8a2.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=739&id=ufa7b81f8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1478&originWidth=2976&originalType=binary&ratio=1&rotation=0&showTitle=false&size=816197&status=done&style=none&taskId=u5ab9656e-26b6-427a-a52e-5e11dbc4a7a&title=&width=1488)
如图，我们配入如下自定义值进 state 里：
```json
    "companies": [
      { company: '测试公司1', id: 1, createTime: +new Date() },
      { company: '测试公司2', id: 2, createTime: +new Date() },
      { company: '测试公司3', id: 3, createTime: +new Date() },
    ]
```
定义动态数据以后，我们需要绑定它到组件的属性中，我们找到相关属性的配置：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645012714358-f3f39d5f-1790-4196-9f16-b45f51fa8f28.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=896&id=u1126fd65&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1792&originWidth=3546&originalType=binary&ratio=1&rotation=0&showTitle=false&size=413958&status=done&style=none&taskId=u976689ac-18a1-4f15-9fc2-60681670fc7&title=&width=1773)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645012791356-4fed1bea-bec2-4be9-85ea-b366d0acb4ab.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=820&id=ub81b6dc8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1640&originWidth=3428&originalType=binary&ratio=1&rotation=0&showTitle=false&size=354847&status=done&style=none&taskId=uc645e654-b293-4c18-86da-a6637083e55&title=&width=1714)
如图，输入表达式：
```json
this.state.companies
```
再结合上一节的“配置组件”操作，我们已经可以把表格的主体配置出来了：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645013130950-4219cf27-760c-4749-8d4e-013dd53dbc83.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=820&id=u73c837e3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1640&originWidth=3058&originalType=binary&ratio=1&rotation=0&showTitle=false&size=408420&status=done&style=stroke&taskId=u23f7f045-8077-4e9d-9335-fea3ba54273&title=&width=1529)

## 动态请求

我们进入代码区块，使用生命周期方法来完成动态数据的请求。假设提供数据的接口是：[http://rap2api.taobao.org/app/mock/250089/testCompanies](http://rap2api.taobao.org/app/mock/250089/testCompanies)，那么，我们可以在源码面板进行如下配置：
```typescript
class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false,
    "loading": false,
    "companies": [
      { company: '测试公司1', id: 1, createTime: +new Date() },
      { company: '测试公司2', id: 2, createTime: +new Date() },
      { company: '测试公司3', id: 3, createTime: +new Date() },
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
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645013883960-ca217c38-5c40-4ecc-9e05-277098fef16a.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=817&id=u1a3f852b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1634&originWidth=3058&originalType=binary&ratio=1&rotation=0&showTitle=false&size=427572&status=done&style=stroke&taskId=ubd2291b7-36c3-48c1-b489-9c61f0f6230&title=&width=1529)

## 配置插槽

我们可以用绑定数据的方法把 loading 绑在加载指示上：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645014111323-c45f9b9a-77dd-4724-b6ee-78572863a871.png#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=952&id=u3bdd353b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1904&originWidth=3170&originalType=binary&ratio=1&rotation=0&showTitle=false&size=503197&status=done&style=none&taskId=u1faed9f0-3c68-4385-8d08-e59e2a1600a&title=&width=1585)
![Feb-16-2022 20-24-35.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645014292272-68e07740-47dc-4c94-8437-beded0b07c63.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=u4506fc72&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-24-35.gif&originHeight=792&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=6960677&status=done&style=stroke&taskId=u9fe02184-e6dc-4886-b371-c48ca1e2832&title=&width=766)
将 Loading 的“是否显示”字段绑定 `this.state.loading` 后，我们可以看到，这里暴露了一个插槽。插槽是可以任意扩展的预设部分，我们可以把其他的部分拖进插槽：
![Feb-16-2022 20-27-03.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645014436894-9b975ae6-76cc-412b-829a-fae3605277dc.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=u407467ac&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-27-03.gif&originHeight=792&originWidth=1528&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3443266&status=done&style=stroke&taskId=u0a091444-8b12-49a0-a57a-bfa758d351a&title=&width=764)
点击右上角的预览，我们能够看到完整的动态请求效果了：
![Feb-16-2022 20-28-36.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645014527841-b621f38f-2c03-40f1-aa41-19293f96b08f.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=u6ee6beea&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-28-36.gif&originHeight=792&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1968612&status=done&style=stroke&taskId=u2bdcee3f-91c5-4cb3-8405-f44f995cc78&title=&width=767)

## 列挂钩浮层

为了能够让表格里的操作挂钩浮层，我们先拖入一个浮层：
![Feb-16-2022 20-32-09.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645014772471-0fce9b50-0f70-492e-bb53-5f875c00f5b4.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=u4d33cd05&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-32-09.gif&originHeight=792&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7475148&status=done&style=stroke&taskId=u9dc26cba-41eb-4fe8-b96f-fe391968861&title=&width=766)
使用大纲树能够临时显示和隐藏此浮层：
![Feb-16-2022 20-32-39.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645014828329-b2de4db6-9032-4280-b886-db17070eea21.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=ue27e6676&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-32-39.gif&originHeight=792&originWidth=1530&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7335022&status=done&style=stroke&taskId=u73554a5d-5ebe-48d1-a861-426ba8501b1&title=&width=765)
我们给表格增加一个数据列:
![Feb-16-2022 20-39-41.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645015242447-3e019714-4b86-4c10-9bf7-01e19201bf0c.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=uc2c35de3&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-39-41.gif&originHeight=792&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3415710&status=done&style=stroke&taskId=u5aedc5dd-f361-4e45-88b0-be09af09a6a&title=&width=766)

然后配置它的行为为“弹窗”：
![Feb-16-2022 20-40-05.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645015223838-7f180e28-43e0-442b-a47e-ea5ff69d4900.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=u80f44f38&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-40-05.gif&originHeight=792&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7261162&status=done&style=stroke&taskId=u3828503a-ecac-452a-8d20-02e4a46ad02&title=&width=766)

实现的效果如下：
![Feb-16-2022 20-42-51.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645015379808-7d7852b1-5902-42d0-b951-c9c5d8f4c893.gif#clientId=uf61aba9b-3a69-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=396&id=ua2e7ceda&margin=%5Bobject%20Object%5D&name=Feb-16-2022%2020-42-51.gif&originHeight=792&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=588625&status=done&style=stroke&taskId=uf0466dde-ca4c-41d9-bf42-1ff443d02c5&title=&width=767)

## 事件回调

上述功能点中，我们是把操作行为绑定在数据列上的，这一节我们绑定到操作列中。在操作列按钮处，点击下方的“添加一项”：
![Feb-23-2022 11-58-02.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645588703676-2a36cab4-52f4-4f31-9018-d56b41a55283.gif#clientId=u74bf469f-47f0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=u18d8ea0b&margin=%5Bobject%20Object%5D&name=Feb-23-2022%2011-58-02.gif&originHeight=790&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8440133&status=done&style=stroke&taskId=u73e25800-c0fa-486b-9b68-4df7db9b9f1&title=&width=767)

点击左侧的详情按钮，配置它的事件回调：
![Feb-23-2022 12-00-18.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645588832183-7ed0f06b-731d-4bd8-b934-723de43a8b42.gif#clientId=u74bf469f-47f0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=u59505da7&margin=%5Bobject%20Object%5D&name=Feb-23-2022%2012-00-18.gif&originHeight=790&originWidth=1534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9047220&status=done&style=stroke&taskId=ub8ab1b4e-4195-426f-b792-fc8bf91d142&title=&width=767)

代码侧，我们配置这个回调函数：
```javascript
onClick_new(e, { rowKey, rowIndex, rowRecord }){
  window.Next.Message.show(JSON.stringify({ rowKey, rowIndex, rowRecord }))
}
```
保存。预览时我们可以看到效果了：
![Feb-23-2022 12-05-25.gif](https://cdn.nlark.com/yuque/0/2022/gif/242652/1645589138764-d6514256-2a1f-4127-9591-747b4808848e.gif#clientId=u74bf469f-47f0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=395&id=u9f09d078&margin=%5Bobject%20Object%5D&name=Feb-23-2022%2012-05-25.gif&originHeight=790&originWidth=1532&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2238638&status=done&style=stroke&taskId=u460c90f3-d692-45f9-9028-cf45d4cea98&title=&width=766)
# 研究本例的 schema

我们把本例的 schema 保存在云端，您可以自行下载研究：[https://mo.m.taobao.com/marquex/lowcode-showcase-table](https://mo.m.taobao.com/marquex/lowcode-showcase-table)

您可以通过左下角的 Schema 面板直接导入本例子的 Schema。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645589288482-0ce8ea2f-c4e1-4956-be9c-143c9b71654b.png#clientId=u74bf469f-47f0-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=810&id=u713729c6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1620&originWidth=3054&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1074154&status=done&style=stroke&taskId=u783f33a5-241d-43ec-8b46-8385b733810&title=&width=1527)
