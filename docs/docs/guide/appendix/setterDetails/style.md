---
title: StyleSetter
---
## 简介
通过开启 StyleSetter，我们可以将样式配置面板来配置样式属性。

## 展示

<img src="https://img.alicdn.com/imgextra/i1/O1CN01plhL0t1DH43CZ8hAa_!!6000000000190-2-tps-596-1478.png" width="300"/>

## setter 配置

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| unit | String | 默认值 px <img src="https://img.alicdn.com/imgextra/i4/O1CN014BRbq41TKIhXjQuOf_!!6000000002363-2-tps-576-98.png" width="250"/> |
| placeholderScale | Number | 默认计算尺寸缩放 默认值为 1  <img src="https://img.alicdn.com/imgextra/i4/O1CN01OLWb2g1Yd94uAC6ax_!!6000000003081-2-tps-250-98.png" width="100"/> 在没有设定数值的时候，系统会通过 window.getComputedStyle 来计算展示的数值。在某些场景下，例如手机场景，在编辑器展示的是 375 的实际宽度，但是实际设计尺寸是 750 的宽度，这个时候需要对这个计算尺寸设成 2 |
| showModuleList | String[] | 默认值 ['background', 'border', 'font', 'layout', 'position'] 分别对应背景、边框、文字、布局、位置五个区块，可以针对不同的场景按需进行展示。 例如文字的组件，我不需要修改边框的样式，就可以把边框模块隐藏掉 |
| isShowCssCode | Boolean | 默认值: true, 是否展示css源码编辑  |
| layoutPropsConfig | Object | 布局样式设置 |
| layoutPropsConfig.showDisPlayList | String[] | 默认值 ['inline', 'flex', 'block', 'inline-block', 'none'] <img src="https://img.alicdn.com/imgextra/i3/O1CN01nucfjP1gT5Iu6IMua_!!6000000004142-2-tps-474-72.png" width="250"/> 可按需展示 |
| layoutPropsConfig.isShowPadding | String | 默认值 true <img src="https://img.alicdn.com/imgextra/i4/O1CN01frOzt81uLfVjYIR8I_!!6000000006021-2-tps-548-382.png" width="250"/> 是否展示内边距（四个边） ||
| layoutPropsConfig.isShowMargin | Boolean | 默认值 true <img src="https://img.alicdn.com/imgextra/i3/O1CN01H2qo0N1dVssDYT8EN_!!6000000003742-2-tps-536-482.png" width="250"/> 是否展示外边距（四个边） ||
| layoutPropsConfig.isShowWidthHeight | Boolean | 默认值 true <img src="https://img.alicdn.com/imgextra/i2/O1CN01A0pqoz1CAp2KUv230_!!6000000000041-2-tps-546-102.png" width="250"/> 是否展示宽高 |
| fontPropsConfig | Object | 文字样式设置 |
| fontPropsConfig.fontFamilyList | Array | [ { value: 'Helvetica', label: 'Helvetica' }, { value: 'Arial', label: 'Arial' },] 可以定制文字字体选项 |
| positionPropsConfig | Object | 位置样式设置 |
| positionPropsConfig.isShowFloat | Boolean  | 默认 true 是否展示浮动 |
| positionPropsConfig.isShowClear | Boolean | 默认 true 是否展示清除浮动 |
