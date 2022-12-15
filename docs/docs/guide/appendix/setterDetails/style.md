---
title: StyleSetter
---
## 简介
通过开启StyleSetter,我们可以将样式配置面板来配置样式属性。

## 展示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658650544358-3d97f6b1-6269-4627-ab4a-62a43219fd08.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=739&id=u3f141635&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1478&originWidth=596&originalType=binary&ratio=1&rotation=0&showTitle=false&size=75996&status=done&style=none&taskId=u16f49c5d-a32e-4cf8-95ab-e0c1059fbef&title=&width=298)

## setter 配置

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| unit | String | 默认值 px
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658650635878-fd920e86-ea28-4e08-8676-238ac367a0ee.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=49&id=u3f243c11&margin=%5Bobject%20Object%5D&name=image.png&originHeight=98&originWidth=576&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9796&status=done&style=none&taskId=ucc541aa4-0765-4da9-820c-cee48ed0635&title=&width=288)
 |
| placeholderScale | Number | 默认计算尺寸缩放 默认值为1
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658650773475-7ecba070-c81e-4a6c-b346-7aad7dd6a897.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=49&id=u27842257&margin=%5Bobject%20Object%5D&name=image.png&originHeight=98&originWidth=250&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7116&status=done&style=none&taskId=u8ac18c79-d14b-49a6-8788-476524e69da&title=&width=125)
在没有设定数值的时候，系统会通过window.getComputedStyle来计算展示的数值。
在某些场景下，例如手机场景，在编辑器展示的是375的实际宽度，但是实际设计尺寸是750的宽度，这个时候需要对这个计算尺寸设成2 |
| showModuleList | String[] | 默认值
['background', 'border', 'font', 'layout', 'position']
分别对应背景、边框、文字、布局、位置五个区块，可以针对不同的场景按需进行展示。
例如文字的组件，我不需要修改边框的样式，就可以把边框模块隐藏掉 |
| isShowCssCode | Boolean | 默认值: true, 是否展示css源码编辑  |
| layoutPropsConfig | Object | 布局样式设置 |
| layoutPropsConfig.showDisPlayList | String[] | 默认值 ['inline', 'flex', 'block', 'inline-block', 'none']
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658651295786-48ca3773-1b4e-4f2e-9521-0ebbfcfe5361.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=36&id=u50dae00c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=72&originWidth=474&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7621&status=done&style=none&taskId=ub5804835-d0b2-45d7-a419-66ac1005afa&title=&width=237)
可按需展示
 |
| layoutPropsConfig.isShowPadding | String | 默认值 true
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658651496157-c84348d4-a47f-44b4-b2c5-74b21e97747a.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=191&id=u70235603&margin=%5Bobject%20Object%5D&name=image.png&originHeight=382&originWidth=548&originalType=binary&ratio=1&rotation=0&showTitle=false&size=20439&status=done&style=none&taskId=udae33336-ce05-41a9-89c5-361a63d061a&title=&width=274)
是否展示内边距 （四个边） |
| layoutPropsConfig.isShowMargin | Boolean | 默认值 true
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658651539776-090de3e1-6293-4660-b74f-9bcf027381c6.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=241&id=uab3771c7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=482&originWidth=536&originalType=binary&ratio=1&rotation=0&showTitle=false&size=29325&status=done&style=none&taskId=uc287d55d-5363-4b37-978b-6e150f36141&title=&width=268)
是否展示外边距 （四个边） |
| layoutPropsConfig.isShowWidthHeight | Boolean | 默认值 true
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2553587/1658651621765-06e81934-9a90-4290-89dd-75ffb56808a5.png#clientId=u5d06f6c0-ba35-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=51&id=u02aa5918&margin=%5Bobject%20Object%5D&name=image.png&originHeight=102&originWidth=546&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9945&status=done&style=none&taskId=u394451ef-266c-440d-a86e-fc1a01320ea&title=&width=273)
是否展示宽高 |
| fontPropsConfig | Object | 文字样式设置 |
| fontPropsConfig.fontFamilyList | Array | [
 { value: 'Helvetica', label: 'Helvetica' },
 { value: 'Arial', label: 'Arial' },
 { value: 'serif', label: 'serif' },
 ]
可以定制文字字体选项 |
| positionPropsConfig | Object | 位置样式设置 |
| positionPropsConfig.isShowFloat | Boolean  | 默认true 是否展示浮动 |
| positionPropsConfig.isShowClear | Boolean | 默认true 是否展示清除浮动 |
