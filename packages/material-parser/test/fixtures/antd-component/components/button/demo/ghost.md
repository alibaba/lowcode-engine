---
order: 8
title:
  zh-CN: 幽灵按钮
  en-US: Ghost Button
---

## zh-CN

幽灵按钮将按钮的内容反色，背景变为透明，常用在有色背景上。

## en-US

`ghost` property will make button's background transparent, it is commonly used in colored background.

```jsx
import { Button } from 'antd';

ReactDOM.render(
  <div className="site-button-ghost-wrapper">
    <Button type="primary" ghost>
      Primary
    </Button>
    <Button ghost>Default</Button>
    <Button type="dashed" ghost>
      link
    </Button>
    <Button type="link" ghost>
      link
    </Button>
  </div>,
  mountNode,
);
```

```css
.site-button-ghost-wrapper {
  background: rgb(190, 200, 200);
  padding: 26px 16px 16px;
}
```
