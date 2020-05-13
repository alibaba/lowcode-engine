---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

简单的徽章展示，当 `count` 为 `0` 时，默认不显示，但是可以使用 `showZero` 修改为显示。

## en-US

Simplest Usage. Badge will be hidden when `count` is `0`, but we can use `showZero` to show it.

```jsx
import { Badge } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

ReactDOM.render(
  <div>
    <Badge count={5}>
      <a href="#" className="head-example" />
    </Badge>
    <Badge count={0} showZero>
      <a href="#" className="head-example" />
    </Badge>
    <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}>
      <a href="#" className="head-example" />
    </Badge>
  </div>,
  mountNode,
);
```

<style>
.ant-badge:not(.ant-badge-not-a-wrapper) {
  margin-right: 20px;
}
.ant-badge.ant-badge-rtl:not(.ant-badge-not-a-wrapper) {
  margin-right: 0;
  margin-left: 20px;
}
.head-example {
  width: 42px;
  height: 42px;
  border-radius: 2px;
  background: #eee;
  display: inline-block;
  vertical-align: middle;
}
[data-theme="dark"] .head-example {
  background: rgba(255,255,255,.12);
}
</style>
