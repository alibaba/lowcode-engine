---
title: 基本使用
order: 1
---

````jsx
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import SamplePreview from '@ali/lowcode-plugin-sample-preview';

class Demo extends PureComponent {
  render() {
    return (
      <div>
         <SamplePreview />
      </div>
    )
  }
}

ReactDOM.render((
  <Demo />
), mountNode);
````