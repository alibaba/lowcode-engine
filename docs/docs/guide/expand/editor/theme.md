---
title: 主题色扩展
sidebar_position: 9
---

## 简介

主题色扩展允许用户定制多样的设计器主题，增加界面的个性化和品牌识别度。

## 设计器主题色定制

在 CSS 的根级别定义主题色变量可以确保这些变量在整个应用中都可用。例如：

```css
:root {
  --color-brand: rgba(0, 108, 255, 1); /* 主品牌色 */
  --color-brand-light: rgba(25, 122, 255, 1); /* 浅色品牌色 */
  --color-brand-dark: rgba(0, 96, 229, 1); /* 深色品牌色 */
}

```

将样式文件引入到你的设计器中，定义的 CSS 变量就可以改变设计器的主题色了。

### 主题色变量

以下是低代码引擎设计器支持的主题色变量列表，以及它们的用途说明：

#### 品牌相关颜色

- `--color-brand`: 主品牌色
- `--color-brand-light`: 浅色品牌色
- `--color-brand-dark`: 深色品牌色

#### Icon 相关颜色

- `--color-icon-normal`: 默认状态
- `--color-icon-hover`: 鼠标悬停状态
- `--color-icon-active`: 激活状态
- `--color-icon-reverse`: 反色状态
- `--color-icon-disabled`: 禁用状态
- `--color-icon-pane`: 面板颜色

#### 线条和文本颜色

- `--color-line-normal`: 线条颜色
- `--color-line-darken`: 线条颜色(darken)
- `--color-title`: 标题颜色
- `--color-text`: 文字颜色
- `--color-text-dark`: 文字颜色(dark)
- `--color-text-light`: 文字颜色(light)
- `--color-text-reverse`: 反色情况下，文字颜色
- `--color-text-disabled`: 禁用态文字颜色

#### 字段和边框颜色

- `--color-field-label`: field 标签颜色
- `--color-field-text`: field 文本颜色
- `--color-field-placeholder`: field placeholder 颜色
- `--color-field-border`: field 边框颜色
- `--color-field-border-hover`: hover 态下，field 边框颜色
- `--color-field-border-active`: active 态下，field 边框颜色
- `--color-field-background`: field 背景色

#### 状态颜色

- `--color-success`: success 颜色
- `--colo-success-dark`: success 颜色(dark)
- `--color-success-light`: success 颜色(light)
- `--color-warning`: warning 颜色
- `--color-warning-dark`: warning 颜色(dark)
- `--color-warning-light`: warning 颜色(light)
- `--color-information`: information 颜色
- `--color-information-dark`: information 颜色(dark)
- `--color-information-light`: information 颜色(light)
- `--color-error`: error 颜色
- `--color-error-dark`: error 颜色(dark)
- `--color-error-light`: error 颜色(light)
- `--color-purple`: purple 颜色
- `--color-brown`: brown 颜色

#### 区块背景色

- `--color-block-background-normal`: 区块背景色
- `--color-block-background-light`: 区块背景色(light), 作用于画布组件 hover 时遮罩背景色。
- `--color-block-background-shallow`: 区块背景色 shallow
- `--color-block-background-dark`: 区块背景色(dark)
- `--color-block-background-disabled`: 区块背景色(disabled)
- `--color-block-background-active`: 区块背景色(active)
- `--color-block-background-warning`: 区块背景色(warning)
- `--color-block-background-error`: 区块背景色(error)
- `--color-block-background-success`: 区块背景色(success)
- `--color-block-background-deep-dark`: 区块背景色(deep-dark)，作用于多个组件同时拖拽的背景色。

#### 其他区域背景色

- `--color-layer-mask-background`: 拖拽元素时，元素原来位置的遮罩背景色
- `--color-layer-tooltip-background`: tooltip 背景色
- `--color-pane-background`: 面板背景色
- `--color-background`: 设计器主要背景色
- `--color-top-area-background`: topArea 背景色，优先级大于 `--color-pane-background`
- `--color-left-area-background`: leftArea 背景色，优先级大于 `--color-pane-background`
- `--color-toolbar-background`: toolbar 背景色，优先级大于 `--color-pane-background`
- `--color-workspace-left-area-background`: 应用级 leftArea 背景色，优先级大于 `--color-pane-background`
- `--color-workspace-top-area-background`: 应用级 topArea 背景色，优先级大于 `--color-pane-background`
- `--color-workspace-sub-top-area-background`: 应用级二级 topArea 背景色，优先级大于 `--color-pane-background`

#### 其他变量

- `--workspace-sub-top-area-height`: 应用级二级 topArea 高度
- `--top-area-height`: 顶部区域的高度
- `--workspace-sub-top-area-margin`: 应用级二级 topArea margin
- `--workspace-sub-top-area-padding`: 应用级二级 topArea padding
- `--workspace-left-area-width`: 应用级 leftArea width
- `--left-area-width`: leftArea width
- `--simulator-top-distance`: simulator 距离容器顶部的距离
- `--simulator-bottom-distance`:  simulator 距离容器底部的距离
- `--simulator-left-distance`: simulator 距离容器左边的距离
- `--simulator-right-distance`: simulator 距离容器右边的距离
- `--toolbar-padding`: toolbar 的 padding
- `--toolbar-height`: toolbar 的高度
- `--pane-title-height`: 面板标题高度
- `--pane-title-font-size`: 面板标题字体大小
- `--pane-title-padding`: 面板标题边距



### 低代码引擎生态主题色定制

插件、物料、设置器等生态为了支持主题色需要对样式进行改造，需要对生态中的样式升级为 css 变量。例如：

```css
/* before */
background: #006cff;

/* after */
background: var(--color-brand, #006cff);

```

这里 `var(--color-brand, #默认色)` 表示使用 `--color-brand` 变量，如果该变量未定义，则使用默认颜色（#默认色）。

### fusion 物料进行主题色扩展

如果使用了 fusion 组件时，可以通过 [fusion 平台](https://fusion.design/) 进行主题色定制。在平台上，您可以选择不同的主题颜色，并直接应用于您的 fusion 组件，这样可以无缝地集成到您的应用设计中。