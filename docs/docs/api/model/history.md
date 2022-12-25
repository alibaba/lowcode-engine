---
title: History
sidebar_position: 5
---
> **@types** [IPublicModelHistory](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/history.ts)<br/>
> **@since** v1.0.0

## 基本介绍

操作历史记录模型

## 方法签名
### go

go(cursor: number)

历史记录跳转到指定位置

### back

back()

历史记录后退

### forward

forward()

历史记录前进
### savePoint

savePoint()

保存当前状态
### isSavePoint

isSavePoint()

当前是否是「保存点」，即是否有状态变更但未保存

### getState

getState()

获取 state，判断当前是否为「可回退」、「可前进」的状态

## 事件
### onChangeState

onChangeState(func: () => any)

监听 state 变更事件

### onChangeCursor

onChangeCursor(func: () => any)

监听历史记录游标位置变更事件
