# Rax Renderer

Rax 渲染模块。

## 安装

```
$ npm install @alilc/lowcode-rax-renderer --save
```

## 使用

```js
import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import RaxRenderer from '@ali/lowcode-rax-renderer';

const components = {
  View,
  Text
};

const schema = {
  componentName: 'Page',
  fileName: 'home',
  children: [
    {
      componentName: 'View',
      children: [
        {
          componentName: 'Text',
          props: {
            type: 'primary'
          },
          children: ['Welcome to Your Rax App']
        }
      ]
    }
  ]
};

render(
  <RaxRenderer
    schema={schema}
    components={components}
  />,
  document.getElementById('root'), { driver: DriverUniversal }
);
```
