---
title: IconSetter
---
## 简介
用来选择图标
## 展示
<img src="https://img.alicdn.com/imgextra/i1/O1CN01hdJPHx1zwNKa78YgN_!!6000000006778-2-tps-1172-579.png" width="500"/>

## setter 配置

| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| type | String | 选择器返回类型 **可选值**: "string" \| "node" |
| defaultValue | String &#124; ReactNode | 默认值 |
| hasClear | Boolean | 选择器是否显示清除按钮 |
| icons | Array | 自定义 icon 集合；默认值详见[图标可选值](#图标可选值) |
| placeholder | String | 没有值的时候的占位符 |

## 返回类型

String | ReactNode

## 图标可选值

```javascript
[
  'smile',
  'cry',
  'success',
  'warning',
  'prompt',
  'error',
  'help',
  'clock',
  'success-filling',
  'delete-filling',
  'favorites-filling',
  'add',
  'minus',
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-double-left',
  'arrow-double-right',
  'switch',
  'sorting',
  'descending',
  'ascending',
  'select',
  'semi-select',
  'loading',
  'search',
  'close',
  'ellipsis',
  'picture',
  'calendar',
  'ashbin',
  'upload',
  'download',
  'set',
  'edit',
  'refresh',
  'filter',
  'attachment',
  'account',
  'email',
  'atm',
  'copy',
  'exit',
  'eye',
  'eye-close',
  'toggle-left',
  'toggle-right',
  'lock',
  'unlock',
  'chart-pie',
  'chart-bar',
  'form',
  'detail',
  'list',
  'dashboard',
]
```
