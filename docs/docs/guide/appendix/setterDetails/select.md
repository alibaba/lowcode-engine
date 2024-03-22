---
title: SelectSetter
---

## 简介

用来选择组件。在限定的可选性内进行选择，核心能力是选择

## 展示

<img src="https://img.alicdn.com/imgextra/i4/O1CN013arqCy1f1JfwdTGQo_!!6000000003946-2-tps-574-602.png" width="300"/>

## setter 配置

| 属性名       | 说明                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| mode         | 选择器模式 可选值: 'single', 'multiple', 'tag'                             |
| defaultValue | 默认值                                                                     |
| options      | 传入的数据源，**参数格式**: `[ {label/title: '文字', value: 'text'}, ...]` |

## 返回类型

String | Number | Boolean
会返回 options 中的 value 值
