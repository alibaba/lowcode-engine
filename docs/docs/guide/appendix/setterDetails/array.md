---
title: ArraySetter
---

#### 简介
用来展示属性类型为数组的setter
#### 展示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644395220128-b5d948e3-6a5a-420f-9a7a-a29be25c507d.png#clientId=ud56bf956-0414-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=181&id=u27259ecd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=362&originWidth=584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27221&status=done&style=none&taskId=u72065990-9557-4dbc-a0ba-eada448e228&title=&width=292)
#### 配置示例
```javascript
"setter": {
	"componentName": "ArraySetter",
	"props": {
		"itemSetter": {
			"componentName": "ObjectSetter",
			"props": {
				"config": {
					"items": [{
							"name": "title",
							"description": "标题",
							"setter": "StringSetter",
						},
						{
							"name": "callback",
							"description": "callback",
							"setter": {
								"componentName": "FunctionSetter"
							}
						}
					]
				}
			},
      "initialValue": {
       	 "title": "I am title",
         "callback": null,
      }
		}
	}
}
```
#### ArraySetter 配置
| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| itemSetter | ObjectSetter | ArraySetter的子节点内容必须用ObjectSetter包裹 |

#### itemSetter 配置
| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| componentName | String |
 |
| props |  |  |
| initialValue | Object | 新增一项的初始值 |

#### ObjectSetter 配置
| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| descriptor | String | Item在列表中展示的item.key名，需要和 config.items[] 中key对应 默认为 “项目X”
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643448651683-6c44787a-cb6c-4066-9a47-2b22f862cb9c.png#clientId=u05af0495-3e67-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=186&id=ufb6e3681&margin=%5Bobject%20Object%5D&name=image.png&originHeight=372&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=103250&status=done&style=none&taskId=u7a61b6f7-4e26-4d8b-a9e6-a30b5e9e73d&title=&width=320) |
| config | Object | 配置项 |
| config.items | Array | 子属性列表数据 |
| config.items[].name | String | 子属性名称 |
| config.items[].description | String | 子属性描述 |
| config.items[].setter | Object &#124; String | 子属性setter配置 &#124; 子属性setter组件名 |
| config.items[].isRequired | Boolean | 子属性是否开启快捷编辑,最多开启4个
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1643448651860-f4f80e87-4e80-463d-a1e0-99be8bf2a84f.png#clientId=u6ba2ab37-e0fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=211&id=ueea652b0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=422&originWidth=614&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32465&status=done&style=none&taskId=u343405fd-5773-4ebd-b6fc-1367a769fe2&title=&width=307) |
| config.items[].condition | Boolean &#124; () => Boolean | 是否展示 |
| config.items[].getValue | (target, value) => value | 数据获取的 hook，可修改获取数据 |
| config.items[].setValue | (target, value) => value | 数据获取的 hook，可修改设置数据 |
