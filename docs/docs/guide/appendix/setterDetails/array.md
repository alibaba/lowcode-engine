---
title: ArraySetter
---

## 简介
用来展示属性类型为数组的 setter
## 展示
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01BXCpnh1OFebSSyeDQ_!!6000000001676-2-tps-584-362.png)
## 配置示例
```json
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
							"setter": "StringSetter"
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
         "callback": null
      }
		}
	}
}
```
## ArraySetter 配置

| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| itemSetter | ObjectSetter | ArraySetter 的子节点内容必须用 ObjectSetter 包裹 |

## itemSetter 配置

| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| componentName | String ||
| props |  |  |
| initialValue | Object | 新增一项的初始值 |

## ObjectSetter 配置
| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| descriptor | String | Item 在列表中展示的 item.key 名，需要和 config.items[] 中key对应 默认为 “项目X” ![image.png](https://img.alicdn.com/imgextra/i4/O1CN01Okz1DY1Q17GGJBPDf_!!6000000001915-2-tps-640-372.png) |
| config | Object | 配置项 |
| config.items | Array | 子属性列表数据 |
| config.items[].name | String | 子属性名称 |
| config.items[].description | String | 子属性描述 |
| config.items[].setter | Object &#124; String | 子属性setter配置 &#124; 子属性setter组件名 |
| config.items[].isRequired | Boolean | 子属性是否开启快捷编辑,最多开启4个 ![image.png](https://img.alicdn.com/imgextra/i1/O1CN01EflYAK1IPpiChvjHz_!!6000000000886-2-tps-614-422.png) |
| config.items[].condition | Boolean &#124; () => Boolean | 是否展示 |
| config.items[].getValue | (target, value) => value | 数据获取的 hook，可修改获取数据 |
| config.items[].setValue | (target, value) => value | 数据获取的 hook，可修改设置数据 |
