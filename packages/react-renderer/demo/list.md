---
title: 列表
order: 1
---

````jsx
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import schema from './schemas/list';
import components from './config/components/index';
import utils from './config/utils';
import constants from './config/constants';

class Demo extends PureComponent {
  static displayName = 'renderer-demo';
  render() {
    return (
      <div className="demo">
        <ReactRenderer
          key={schema.fileName}
          schema={schema}
          components={components}
          appHelper={{
            utils,
            constants
          }}
        />
      </div>
    );
  }
}

ReactDOM.render((
  <Demo />
), mountNode);
````
