
[中文](/docs/中文文档.md)

# split-pane-react
> Resizable split panes for [React.js](http://reactjs.org).Check out the [live demo](https://yyllff.github.io/split-pane-react/). Different [themes](https://codesandbox.io/s/split-pane-themes-xmsqtt).

## Features

- 💪**Simple api** and support for multiple panels.
- 🔥Supports **vertical & horizontal layouts** and **fluid pane**.
- 🎉Use **controlled component** mode, flexible use.
- 😎**React16.8** version at least, and **React18** version at the same time.
- 👷‍♂️Support flexible and convenient **customization of sash**.


## Installing

````sh
# use npm
npm install split-pane-react

# or if you use yarn
yarn add split-pane-react
````

## Example Usage

```jsx
import React, { useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';

function style (color) {
  return {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color
  };
}

function App () {
  const [sizes, setSizes] = useState([100, '30%', 'auto']);

  return (
    <div style={{ height: 500 }}>
      <SplitPane
        split='vertical'
        sizes={sizes}
        onChange={setSizes}
      >
        <Pane minSize={50} maxSize='50%'>
          <div style={style('#ddd')}>
            pane1
          </div>
        </Pane>
        <div style={style('#ccc')}>
          pane2
        </div>
        <div style={style('#eee')}>
          pane3
        </div>
      </SplitPane>
    </div>
  );
};
```

## props

**SplitPane**

|    Property    |    Description   |   Type     |  Default     |
| -------------- | ---------------- | :--------: | :----------: |
| split    | Determine layout of panes. | 'vertical' \|'horizontal' |'vertical' |
| sizes | Collection of different panel sizes,Only support controlled mode, so it's required | (string \| number)[] |[] |
| resizerSize | Specify the size for resizer | number |4 |
| allowResize | Should allowed to resized | boolean |true |
| className | split pane custom class name | string |void |
| sashRender | User defined sliding axis function | (index: number, active: boolean) => void |void |
| performanceMode | High performance mode to avoid excessive pressure on the browser | boolean | false |
| onChange | Callback of size change | (sizes: number[]) => void |void |
| onDragStart | This callback is invoked when a drag starts | () => void |void |
| onDragEnd | This callback is invoked when a drag ends | () => void |void |

**Pane**

|    Property    |    Description   |  Type  | Default |
| ------------------ | ---------------- | :--------: | ------------------ |
| className | pane class name | string | void |
| minSize | Limit the minimum size of the panel | string \| number | void |
| maxSize | Limit the maximum size of this panel | string\|number | void |

## themes

You can use the sashRender parameter to configure the theme you need:

- The default theme style refers to vscode style
- At the same time, we have built in a theme similar to sublime
- Other demo [themes](https://codesandbox.io/s/split-pane-themes-xmsqtt).


## License

**[split-pane-react](https://github.com/yyllff/split-pane-react)** licensed under [MIT](LICENSE).

> PS: I would love to know if you're using split-pane-react. If you have any use problems, you can raise the issue, and I will repair them as soon as possible. The project will always be maintained. If you have a good idea, you can propose a merge. **If this component helps you, please leave your star. Those who need it will be very grateful.**
