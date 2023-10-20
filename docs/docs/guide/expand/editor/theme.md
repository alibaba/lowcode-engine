---
title: 主题色扩展
sidebar_position: 9
---

## 主题色扩展简述

通过主题色扩展，可以定制多种设计器主题。

## 主题色扩展说明

### 主题色变量

- `--color-brand`: 品牌色
- `--color-brand-light`: 品牌色（light）
- `--color-brand-dark`: 品牌色（dark）
- `--color-icon-normal`: 正常 icon 颜色
- `--color-icon-hover`: icon hover 态颜色
- `--color-icon-active`: icon active 态颜色
- `--color-icon-reverse`: icon 反色
- `--color-icon-disabled`: icon 禁用态颜色
- `--color-icon-pane`: icon 面板颜色
- `--color-line-normal`: 线条颜色
- `--color-line-darken`: 线条颜色(darken)
- `--color-title`: 标题颜色
- `--color-text`: 文字颜色
- `--color-text-dark`: 文字颜色(dark)
- `--color-text-light`: 文字颜色(light)
- `--color-text-reverse`: 反色情况下，文字颜色
- `--color-text-regular`: 文字颜色(regular)
- `--color-text-disabled`: 禁用态文字颜色
- `--color-field-label`: field 标签颜色
- `--color-field-text`: field 文本颜色
- `--color-field-placeholder`: field placeholder 颜色
- `--color-field-border`: field 边框颜色
- `--color-field-border-hover`: hover 态下，field 边框颜色
- `--color-field-border-active`: active 态下，field 边框颜色
- `--color-field-background`: field 背景色
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
- `--color-pane-background`: 面板背景色
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
- `--color-layer-mask-background`: 拖拽元素时，元素原来位置的遮罩背景色
- `--color-layer-tooltip-background`: tooltip 背景色
- `--color-background`: 设计器主要背景色
- `--color-top-area-background`: topArea 背景色，优先级大于 `--color-pane-background`
- `--color-left-area-background`: leftArea 背景色，优先级大于 `--color-pane-background`
- `--color-workspace-left-area-background`: 应用级 leftArea 背景色，优先级大于 `--color-pane-background`
- `--color-workspace-top-area-background`: 应用级 topArea 背景色，优先级大于 `--color-pane-background`
- `--color-workspace-sub-top-area-background`: 应用级二级 topArea 背景色，优先级大于 `--color-pane-background`
- `--workspace-sub-top-area-height`: 应用级二级 topArea 高度
- `--workspace-sub-top-area-margin`: 应用级二级 topArea margin
- `--workspace-sub-top-area-padding`: 应用级二级 topArea padding

### 生态使用主题色变量

插件、物料、设置器等生态为了支持主题色需要对样式进行改造，需要对生态中的样式升级为 css 变量。例如：

```css
/* before */
background: #006cff;

/* after */
background: var(--color-brand, #006cff);

```

### fusion 物料进行主题色扩展

如果使用了 fusion 组件，可以通过 https://fusion.alibaba-inc.com/ 平台进行主题色定制。