---
title: FunctionSetter
---
## 简介
可以将function绑定在物料上

## 设置器返回

设置器返回一个Function对象，调用function()运行Function对象得到运行结果。

如下是一个典型的使用案例：

```javascript
export type TestProps = React.ComponentProps<typeof Test> & {
  testFunction?: Function | undefined;
};
 
const getTestData = () => {
  if(this.props.testFunction === undefined){
    return undefined;
  }else{
    return this.props.testFunction() // 返回testFunction()方法的运行结果;
  }
}
```


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
有时候我们创建的函数会有用到一些通用的函数模板，我们可以在物料协议的 meta.ts 中创建一个模板，如下

```TypeScript
{
    name: 'onChange',
    title: {
        label: 'onChange',
        tip: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    propType: 'func',
    setter: [
        {
            componentName: 'FunctionSetter',
            props: {
                template: 'onTableChange(value,${extParams}){\n\n}',
            },
        },
    ],
}
```

其中 ${extParams} 为扩展参数占位符，如果用户没有声明扩展参数，会移除对应的参数声明。