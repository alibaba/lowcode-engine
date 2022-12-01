---
title: EventSetter
---
#### 简介
可以将事件绑定在物料上
#### 展示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644394906292-0eb3ab0e-0bb0-4c8d-bbc5-7217b33cdcab.png#clientId=ub4e2d6f6-4877-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=507&id=u2a295c86&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1014&originWidth=1202&originalType=binary&ratio=1&rotation=0&showTitle=false&size=293824&status=done&style=none&taskId=u37e95d95-4425-450a-b4aa-9805d9dcf97&title=&width=601)

#### 组件自带事件列表
在物料协议的configure.supports.events 中声明
```json
{
	"configure ": {
		"supports": {
			"style": true,
			"events": [{
				"name": "onChange",
			}, {
				"name": "onExpand"
			}, {
				"name": "onVisibleChange"
			}]
		}
	}
}
```

#### 事件绑定
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643448650540-8b403233-44a5-4b1f-9379-2c55d4694f12.png#clientId=uf9b6db87-aae9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=621&id=u95bb9c9a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1242&originWidth=2540&originalType=binary&ratio=1&rotation=0&showTitle=false&size=356836&status=done&style=none&taskId=u13bc14bd-d85c-46c9-aebd-586dcb32f96&title=&width=1270)
可以选择已有的事件(schema中的**methods**节点)进行绑定，也可以选择新建事件，选择新建事件默认会增加_new的事件后缀命名，点确定以后会跳转到对应代码插件对应区块
####
#### 参数设置
如果需要额外传参，需要将扩展参数设置打开，在代码面板中，编辑参数内容
注意：

- 额外参数必须被包装成一个对象，如参数模板中所示
- 可以使用动态变量例如 (this.items，this.state.xxx)
```json
{
   "testKey":this.state.text
}
```

- 该参数是额外参数，会加在原有参数后面，例如在onClick中加入扩展传参，最终函数消费的时候应该如下所示
```javascript
// e为onClick原有函数传参，extParams为自定义传参
onClick(e, extParams) {
    this.setState({
      isShowDialog: extParams.isShowDialog
    })
}
```
#### 事件新建函数模板
有时候我们创建的函数会有用到一些通用的函数模板，我们可以在物料协议的events.template中创建一个模板，如下
```javascript
{
	"configure ": {
		"supports": {
			"style": true,
			"events": [{
				"name": "onChange",
				"template": "templeteTest(e,${extParams}){this.setState({isShowDialog: false})}"
			}, {
				"name": "onExpand"
			}, {
				"name": "onVisibleChange"
			}]
		}
	}
}
```
其中 ${extParams} 为扩展参数占位符，如果用户没有声明扩展参数，会移除对应的参数声明，定义模板后，每次创建完函数会自动生成模板函数，如下图
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643448650786-62270a89-65d5-42b1-8efd-90b090155c82.png#clientId=uf9b6db87-aae9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=141&id=u4bb4387b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=282&originWidth=1292&originalType=binary&ratio=1&rotation=0&showTitle=false&size=84790&status=done&style=none&taskId=u2b911f77-a018-4f17-a5df-36c2c142d18&title=&width=646)
