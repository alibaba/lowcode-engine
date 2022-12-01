---
title: EventSetter
---
## 简介
可以将事件绑定在物料上
## 展示

<img src="https://img.alicdn.com/imgextra/i3/O1CN01mAMfxZ20WYca6KqJb_!!6000000006857-2-tps-1202-1014.png" width="300"/>

## 组件自带事件列表

在物料协议的 configure.supports.events 中声明

```json
{
	"configure ": {
		"supports": {
			"style": true,
			"events": [{
				"name": "onChange"
			}, {
				"name": "onExpand"
			}, {
				"name": "onVisibleChange"
			}]
		}
	}
}
```

## 事件绑定
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01Q5gHFy1uSzqUeEqQK_!!6000000006037-2-tps-2540-1242.png)

可以选择已有的事件 (schema 中的**methods**节点) 进行绑定，也可以选择新建事件，选择新建事件默认会增加_new 的事件后缀命名，点确定以后会跳转到对应代码插件对应区块。

## 参数设置

如果需要额外传参，需要将扩展参数设置打开，在代码面板中，编辑参数内容。

注意：

- 额外参数必须被包装成一个对象，如参数模板中所示
- 可以使用动态变量例如 (this.items，this.state.xxx)
	```javascript
	{
		testKey: this.state.text,
	}
	```

- 该参数是额外参数，会加在原有参数后面，例如在 onClick 中加入扩展传参，最终函数消费的时候应该如下所示
	```javascript
	// e 为 onClick 原有函数传参，extParams 为自定义传参
	onClick(e, extParams) {
		this.setState({
			isShowDialog: extParams.isShowDialog,
		});
	}
	```
## 事件新建函数模板
有时候我们创建的函数会有用到一些通用的函数模板，我们可以在物料协议的 events.template 中创建一个模板，如下

```json
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

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01XUoXnS1XiLxlxXniw_!!6000000002957-2-tps-1292-282.png)
